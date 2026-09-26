'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { STATUSES, STATUS_STYLES } from '@/lib/statuses';

export default function AdminDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [counts, setCounts] = useState({ total: 0 });
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

  // Simple admin analytics — which categories/products are being asked
  // about most, computed from whatever's currently loaded (the most
  // recent 300 rows, or fewer if filtered). No separate endpoint needed.
  const topCategories = useMemo(() => {
    const freq = {};
    submissions.forEach((s) => {
      if (!s.category) return;
      freq[s.category] = (freq[s.category] || 0) + 1;
    });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [submissions]);

  const maxCategoryCount = topCategories[0]?.[1] || 1;

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
          <Link href="/admin/chat" className="btn-outline !py-2 !px-4 text-sm">Live chat</Link>
          <button onClick={handleLogout} className="btn-outline !py-2 !px-4 text-sm">Log out</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <StatusPill
          label="All"
          value={counts.total}
          active={statusFilter === 'all'}
          onClick={() => setStatusFilter('all')}
        />
        {STATUSES.map((s) => (
          <StatusPill
            key={s.value}
            label={s.label}
            value={counts[s.value] || 0}
            active={statusFilter === s.value}
            onClick={() => setStatusFilter(s.value)}
            styles={STATUS_STYLES[s.value]}
          />
        ))}
      </div>

      {topCategories.length > 0 && (
        <div className="border border-ink/12 bg-white/40 p-5 mb-8">
          <h2 className="text-sm font-semibold text-ink mb-4">Top requested categories</h2>
          <div className="grid gap-2.5">
            {topCategories.map(([category, count]) => (
              <div key={category} className="flex items-center gap-3">
                <span className="text-xs text-ink/60 w-40 shrink-0 truncate" title={category}>{category}</span>
                <div className="flex-1 h-2 bg-ink/8 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brass rounded-full"
                    style={{ width: `${Math.max(6, (count / maxCategoryCount) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-ink/70 w-6 text-right shrink-0">{count}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink/40 mt-4">Based on the submissions currently loaded below.</p>
        </div>
      )}

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
        <table className="w-full text-sm min-w-[960px]">
          <thead>
            <tr className="border-b border-ink/12 text-left text-ink/55">
              <th className="px-4 py-3 font-medium">Received</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Details</th>
              <th className="px-4 py-3 font-medium">Message</th>
              <th className="px-4 py-3 font-medium">Artwork</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-ink/45">Loading…</td></tr>
            )}
            {!loading && submissions.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-ink/45">No submissions match these filters.</td></tr>
            )}
            {!loading && submissions.map((s) => (
              <tr key={s.id} className="border-b border-ink/8 align-top hover:bg-white/60">
                <td className="px-4 py-3 whitespace-nowrap text-ink/60">
                  {new Date(s.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </td>
                <td className="px-4 py-3 whitespace-nowrap capitalize text-ink/70">{s.type}</td>
                <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">{s.name}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {s.phone && (
                    <div>
                      <a
                        href={`https://wa.me/91${s.phone.replace(/\D/g, '').slice(-10)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-ink/75 hover:text-brass-dark"
                        title="Message on WhatsApp"
                      >
                        {s.phone}
                      </a>
                    </div>
                  )}
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
                <td className="px-4 py-3 whitespace-nowrap">
                  {s.artwork_url ? (
                    <a
                      href={s.artwork_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-brass-dark border-b border-brass pb-0.5"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="text-xs text-ink/30">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={s.status}
                    onChange={(e) => updateStatus(s.id, e.target.value)}
                    className={`text-xs font-medium border border-transparent rounded-sm px-2.5 py-1.5 ${STATUS_STYLES[s.status] || ''}`}
                  >
                    {STATUSES.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
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

function StatusPill({ label, value, active, onClick, styles }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium border transition-colors ${
        active
          ? 'border-brass bg-white text-ink'
          : `border-ink/12 bg-white/40 text-ink/60 hover:bg-white/70 ${styles || ''}`
      }`}
    >
      {label}
      <span className="text-xs font-semibold text-ink/50">{value}</span>
    </button>
  );
}
