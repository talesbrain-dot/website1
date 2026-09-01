'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const STATUS_OPTIONS = ['new', 'contacted', 'closed'];

const STATUS_STYLES = {
  new: 'bg-registration/10 text-registration border-registration/30',
  contacted: 'bg-brass/10 text-brass-dark border-brass/30',
  closed: 'bg-ink/8 text-ink/60 border-ink/15',
};

export default function AdminDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [counts, setCounts] = useState({ new: 0, contacted: 0, closed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    const params = new URLSearchParams({ status: statusFilter, type: typeFilter, search });
    try {
      const res = await fetch(`/api/admin/submissions?${params.toString()}`, { cache: 'no-store' });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not load submissions.');
        setLoading(false);
        return;
      }
      setSubmissions(data.submissions);
      setCounts(data.counts);
    } catch {
      setErrorMsg('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter, search, router]);

  useEffect(() => {
    const timeout = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [load, search]);

  async function updateStatus(id, status) {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    try {
      await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      load();
    } catch {
      setErrorMsg('Could not update status — please retry.');
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="max-w-content mx-auto px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl text-ink font-medium">Enquiries &amp; messages</h1>
          <p className="text-sm text-ink/55 mt-1">Everything submitted through the website.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/" className="btn-outline !py-2 !px-4 text-sm">View site</Link>
          <button onClick={handleLogout} className="btn-outline !py-2 !px-4 text-sm">Log out</button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <CountCard label="Total" value={counts.total} active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} />
        <CountCard label="New" value={counts.new} active={statusFilter === 'new'} onClick={() => setStatusFilter('new')} accent="registration" />
        <CountCard label="Contacted" value={counts.contacted} active={statusFilter === 'contacted'} onClick={() => setStatusFilter('contacted')} accent="brass" />
        <CountCard label="Closed" value={counts.closed} active={statusFilter === 'closed'} onClick={() => setStatusFilter('closed')} />
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="field-input !w-auto text-sm">
          <option value="all">All types</option>
          <option value="enquiry">Enquiries</option>
          <option value="contact">Contact messages</option>
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, phone, email, message…"
          className="field-input flex-1 min-w-[220px] text-sm"
        />
      </div>

      {errorMsg && <p className="text-sm text-registration mb-4">{errorMsg}</p>}

      <div className="border border-ink/12 bg-white/40 overflow-x-auto">
        <table className="w-full text-sm min-w-[820px]">
          <thead>
            <tr className="border-b border-ink/12 text-left text-ink/55">
              <th className="px-4 py-3 font-medium">Received</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Details</th>
              <th className="px-4 py-3 font-medium">Message</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-ink/45">Loading…</td></tr>
            )}
            {!loading && submissions.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-ink/45">No submissions match these filters.</td></tr>
            )}
            {!loading && submissions.map((s) => (
              <tr key={s.id} className="border-b border-ink/8 align-top hover:bg-white/60">
                <td className="px-4 py-3 whitespace-nowrap text-ink/60">
                  {new Date(s.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </td>
                <td className="px-4 py-3 whitespace-nowrap capitalize text-ink/70">{s.type}</td>
                <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">{s.name}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {s.phone && <div><a href={`tel:${s.phone}`} className="text-ink/75 hover:text-brass-dark">{s.phone}</a></div>}
                  {s.email && <div><a href={`mailto:${s.email}`} className="text-ink/75 hover:text-brass-dark">{s.email}</a></div>}
                </td>
                <td className="px-4 py-3 text-ink/60 whitespace-nowrap">
                  {s.category && <div>{s.category}</div>}
                  {s.quantity && <div>Qty: {s.quantity}</div>}
                  {s.deadline && <div>By: {s.deadline}</div>}
                </td>
                <td className="px-4 py-3 text-ink/70 max-w-[260px]">
                  <p className="line-clamp-3">{s.message}</p>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={s.status}
                    onChange={(e) => updateStatus(s.id, e.target.value)}
                    className={`text-xs font-medium border rounded-sm px-2.5 py-1.5 ${STATUS_STYLES[s.status]}`}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CountCard({ label, value, active, onClick, accent }) {
  const accentColor = accent === 'registration' ? 'text-registration' : accent === 'brass' ? 'text-brass-dark' : 'text-ink';
  return (
    <button
      onClick={onClick}
      className={`text-left border p-4 transition-colors ${active ? 'border-brass bg-white' : 'border-ink/12 bg-white/40 hover:bg-white/70'}`}
    >
      <div className={`font-display text-2xl font-medium ${accentColor}`}>{value}</div>
      <div className="text-xs text-ink/55 mt-1">{label}</div>
    </button>
  );
}
