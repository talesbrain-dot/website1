'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { categories } from '@/lib/content';
import { useAuth } from '@/components/AuthProvider';
import { getSupabasePublic } from '@/lib/supabasePublicClient';

export default function EnquiryForm() {
  const searchParams = useSearchParams();
  const presetCategory = searchParams.get('category') || '';
  const presetProduct = searchParams.get('product') || '';
  const { user, loading } = useAuth();

  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  // Selected option carries "category" (a whole category, e.g. for a
  // custom/unlisted need) or an exact product name — both are valid,
  // matching what the enquiry is actually about.
  const preset = presetProduct || presetCategory;

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setError('');

    const form = e.target;
    const supabase = getSupabasePublic();
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token) {
      setError('Your session has expired — please log in again.');
      setStatus('error');
      return;
    }

    const payload = {
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
      category: form.category.value,
      quantity: form.quantity.value,
      deadline: form.deadline.value,
      message: form.message.value,
    };

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }
      setStatus('success');
      form.reset();
    } catch {
      setError('Could not reach the server. Please check your connection and try again.');
      setStatus('error');
    }
  }

  if (loading) {
    return <p className="text-sm text-ink/50">Loading…</p>;
  }

  if (!user) {
    return (
      <div className="border border-brass/40 bg-brass/10 p-7">
        <h3 className="font-display text-xl text-ink mb-2">Log in to send an enquiry</h3>
        <p className="text-ink/70 leading-relaxed mb-5">
          A free account lets us match your enquiry to you and lets you track its status under
          &ldquo;My Account&rdquo; — it only takes a minute.
        </p>
        <Link
          href={{ pathname: '/account/login', query: { next: '/enquiry', ...(presetCategory && { category: presetCategory }), ...(presetProduct && { product: presetProduct }) } }}
          className="btn-primary"
        >
          Log in / Sign up
        </Link>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="border border-brass/40 bg-brass/10 p-7">
        <h3 className="font-display text-xl text-ink mb-2">Enquiry received.</h3>
        <p className="text-ink/70 leading-relaxed">
          Thanks — we&rsquo;ll review your requirement and get back to you with guidance and a
          quote. You can track it anytime under{' '}
          <Link href="/account" className="text-brass-dark font-medium">My Account</Link>. For
          anything urgent, call us directly at{' '}
          <a href="tel:7300760078" className="text-brass-dark font-medium">7300760078</a>.
        </p>
        <button onClick={() => setStatus('idle')} className="text-sm font-medium text-brass-dark mt-5 border-b border-brass">
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="field-label" htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            required
            defaultValue={user.user_metadata?.full_name || ''}
            className="field-input"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" className="field-input" placeholder="Your phone number" />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={user.email || ''}
          className="field-input"
          placeholder="you@example.com"
        />
        <p className="text-xs text-ink/45 mt-1.5">Provide a phone number or an email so we can reach you.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div className="sm:col-span-1">
          <label className="field-label" htmlFor="category">Product / category</label>
          <select id="category" name="category" defaultValue={preset} className="field-input">
            <option value="">Select what you need</option>
            {categories.map((cat) => (
              <optgroup key={cat.slug} label={cat.label}>
                <option value={cat.label}>{cat.label} (general)</option>
                {cat.items.map((item) => (
                  <option key={item.slug} value={item.name}>{item.name}</option>
                ))}
              </optgroup>
            ))}
            <option value="Not sure / custom">Not sure / custom job</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="quantity">Approx. quantity</label>
          <input id="quantity" name="quantity" className="field-input" placeholder="e.g. 500 pcs" />
        </div>
        <div>
          <label className="field-label" htmlFor="deadline">Needed by</label>
          <input id="deadline" name="deadline" className="field-input" placeholder="e.g. 15 Sept" />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="message">What do you need printed?</label>
        <textarea
          id="message"
          name="message"
          required
          className="field-textarea"
          defaultValue={presetProduct ? `I'm interested in ${presetProduct}. ` : ''}
          placeholder="Describe the product, size, material, finish, and any reference you have."
        />
      </div>

      {status === 'error' && <p className="text-sm text-registration">{error}</p>}

      <button type="submit" disabled={status === 'loading'} className="btn-primary disabled:opacity-60">
        {status === 'loading' ? 'Submitting…' : 'Submit enquiry'}
      </button>
    </form>
  );
}
