'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
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
      message: form.message.value,
    };

    try {
      const res = await fetch('/api/contact', {
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
      <div className="border border-brass/40 bg-brass/10 p-6">
        <h3 className="font-medium text-ink mb-1.5">Message sent.</h3>
        <p className="text-sm text-ink/70">
          Thanks for reaching out — we&rsquo;ll get back to you shortly. For anything urgent, call
          us directly.
        </p>
        <button onClick={() => setStatus('idle')} className="text-sm font-medium text-brass-dark mt-4 border-b border-brass">
          Send another message
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
        <p className="text-xs text-ink/45 mt-1.5">Provide a phone number or an email so we can reply.</p>
      </div>
      <div>
        <label className="field-label" htmlFor="message">Message</label>
        <textarea id="message" name="message" required className="field-textarea" placeholder="How can we help?" />
      </div>

      {status === 'error' && (
        <p className="text-sm text-registration">{error}</p>
      )}

      <button type="submit" disabled={status === 'loading'} className="btn-primary disabled:opacity-60">
        {status === 'loading' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
