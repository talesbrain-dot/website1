'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { categories } from '@/lib/content';

export default function EnquiryForm() {
  const searchParams = useSearchParams();
  const presetCategory = searchParams.get('category') || '';

  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setError('');

    const form = e.target;
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
        headers: { 'Content-Type': 'application/json' },
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

  if (status === 'success') {
    return (
      <div className="border border-brass/40 bg-brass/10 p-7">
        <h3 className="font-display text-xl text-ink mb-2">Enquiry received.</h3>
        <p className="text-ink/70 leading-relaxed">
          Thanks — we&rsquo;ll review your requirement and get back to you with guidance and a
          quote. For anything urgent, call us directly at{' '}
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
          <input id="name" name="name" required className="field-input" placeholder="Your full name" />
        </div>
        <div>
          <label className="field-label" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" className="field-input" placeholder="Your phone number" />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="field-input" placeholder="you@example.com" />
        <p className="text-xs text-ink/45 mt-1.5">Provide a phone number or an email so we can reach you.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div className="sm:col-span-1">
          <label className="field-label" htmlFor="category">Category</label>
          <select id="category" name="category" defaultValue={presetCategory} className="field-input">
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.label}>{c.label}</option>
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
