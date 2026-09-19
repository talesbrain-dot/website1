'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { getSupabasePublic } from '@/lib/supabasePublicClient';
import { ProductIllustration } from '@/components/ProductIcons';
import { STATUS_STYLES, STATUS_LABELS } from '@/lib/statuses';

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/account/login?next=/account');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const supabase = getSupabasePublic();
      if (!supabase) {
        setLoadingSubs(false);
        return;
      }
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) return;

      try {
        const res = await fetch('/api/account/enquiries', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        const data = await res.json();
        if (res.ok) setSubmissions(data.submissions);
      } finally {
        setLoadingSubs(false);
      }
    })();
  }, [user]);

  async function handleLogout() {
    await signOut();
    router.push('/');
  }

  if (loading || !user) {
    return <div className="max-w-content mx-auto px-5 py-24 text-center text-ink/50">Loading…</div>;
  }

  const initial = (user.user_metadata?.full_name?.[0] || user.email[0]).toUpperCase();

  return (
    <div className="max-w-content mx-auto px-5 py-14">
      <div className="card-3d p-7 sm:p-8 mb-10 flex flex-wrap items-center justify-between gap-6 animate-fade-up">
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-full bg-ink text-paper flex items-center justify-center text-xl font-display font-medium shrink-0">
            {initial}
          </span>
          <div>
            <p className="text-xs text-ink/50 mb-0.5">My account</p>
            <h1 className="font-display text-2xl text-ink font-medium">
              {user.user_metadata?.full_name || 'Welcome'}
            </h1>
            <p className="text-sm text-ink/50 mt-0.5">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/enquiry" className="btn-primary !py-2.5 !px-5 text-sm">New enquiry</Link>
          <button onClick={handleLogout} className="btn-outline !py-2.5 !px-5 text-sm">Log out</button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="font-medium text-ink">Your enquiries</h2>
        {!loadingSubs && submissions.length > 0 && (
          <span className="text-sm text-ink/50">{submissions.length} total</span>
        )}
      </div>

      {loadingSubs && (
        <div className="grid gap-3">
          {[0, 1].map((i) => (
            <div key={i} className="border border-ink/10 bg-white/40 h-20 animate-pulse" />
          ))}
        </div>
      )}

      {!loadingSubs && submissions.length === 0 && (
        <div className="border border-ink/12 bg-white/40 p-10 text-center animate-fade-up">
          <p className="text-ink/60 mb-4">You haven&rsquo;t sent an enquiry yet.</p>
          <Link href="/enquiry" className="btn-primary">Start an enquiry</Link>
        </div>
      )}

      {!loadingSubs && submissions.length > 0 && (
        <div className="grid gap-3">
          {submissions.map((s, i) => (
            <div
              key={s.id}
              className="card-lift border border-ink/12 bg-white/50 p-5 flex items-start gap-4 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-10 h-10 text-brass-dark shrink-0 mt-0.5 bg-brass/10 rounded-full p-2">
                <ProductIllustration icon="sheet" className="w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  {s.category && <span className="text-sm font-medium text-ink">{s.category}</span>}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[s.status]}`}>{STATUS_LABELS[s.status] || s.status}</span>
                </div>
                <p className="text-sm text-ink/65 leading-relaxed">{s.message}</p>
                <p className="text-xs text-ink/40 mt-2">
                  {new Date(s.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  {s.quantity ? ` · Qty: ${s.quantity}` : ''}
                  {s.deadline ? ` · By: ${s.deadline}` : ''}
                </p>
                {s.artwork_url && (
                  <a
                    href={s.artwork_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-xs font-medium text-brass-dark border-b border-brass mt-2"
                  >
                    View your uploaded artwork
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
