'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { categories } from '@/lib/content';
import { useAuth } from '@/components/AuthProvider';
import { getSupabasePublic } from '@/lib/supabasePublicClient';

const MAX_FILE_MB = 15;
const ACCEPTED_TYPES = '.jpg,.jpeg,.png,.pdf,.ai,.eps,.psd,.cdr,.svg';

export default function EnquiryForm() {
  const searchParams = useSearchParams();
  const presetCategory = searchParams.get('category') || '';
  const presetProduct = searchParams.get('product') || '';
  const { user, loading, configError } = useAuth();

  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  // Selected option carries "category" (a whole category, e.g. for a
  // custom/unlisted need) or an exact product name — both are valid,
  // matching what the enquiry is actually about.
  const preset = presetProduct || presetCategory;

  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    setFileError('');
    if (!selected) {
      setFile(null);
      return;
    }
    if (selected.size > MAX_FILE_MB * 1024 * 1024) {
      setFileError(`File is too large — please keep it under ${MAX_FILE_MB}MB.`);
      setFile(null);
      e.target.value = '';
      return;
    }
    setFile(selected);
  }

  function clearFile() {
    setFile(null);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setError('');

    const form = e.target;
    const supabase = getSupabasePublic();
    if (!supabase) {
      setError('Login is not set up on this site yet — please contact the site owner.');
      setStatus('error');
      return;
    }
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    const currentUser = sessionData.session?.user;

    if (!token || !currentUser) {
      setError('Your session has expired — please log in again.');
      setStatus('error');
      return;
    }

    // Upload the artwork file (if any) directly to Supabase Storage first,
    // scoped under the user's own folder — required by the bucket's RLS
    // policy. We only send the resulting path to our API, not the file
    // itself, so the server route stays small and fast.
    let artworkPath = null;
    if (file) {
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const path = `${currentUser.id}/${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from('artwork').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (uploadError) {
        setError(`Could not upload your file: ${uploadError.message}`);
        setStatus('error');
        return;
      }
      artworkPath = path;
    }

    const payload = {
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
      category: form.category.value,
      quantity: form.quantity.value,
      deadline: form.deadline.value,
      message: form.message.value,
      artworkPath,
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
      clearFile();
    } catch {
      setError('Could not reach the server. Please check your connection and try again.');
      setStatus('error');
    }
  }

  if (loading) {
    return <p className="text-sm text-ink/50">Loading…</p>;
  }

  if (configError) {
    return (
      <div className="border border-registration/30 bg-registration/5 p-7">
        <h3 className="font-display text-xl text-ink mb-2">Login is not set up yet</h3>
        <p className="text-ink/70 leading-relaxed">
          This site&rsquo;s login system needs a couple of environment variables configured before
          enquiries can be submitted. If you&rsquo;re the site owner, check the README for
          <code className="mx-1 text-xs bg-ink/5 px-1.5 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code>
          and
          <code className="mx-1 text-xs bg-ink/5 px-1.5 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
          Meanwhile, feel free to <a href="tel:7300760078" className="text-brass-dark font-medium">call us directly</a>.
        </p>
      </div>
    );
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
          <label className="field-label" htmlFor="phone">WhatsApp number</label>
          <input id="phone" name="phone" type="tel" required className="field-input" placeholder="e.g. 9876543210" />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="email">Email <span className="text-ink/40 font-normal">(optional)</span></label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={user.email || ''}
          className="field-input"
          placeholder="you@example.com"
        />
        <p className="text-xs text-ink/45 mt-1.5">We&rsquo;ll reach out on WhatsApp — email is just a backup.</p>
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

      <div>
        <label className="field-label" htmlFor="artwork">
          Attach your design/artwork <span className="text-ink/40 font-normal">(optional)</span>
        </label>
        {!file ? (
          <label
            htmlFor="artwork"
            className="flex flex-col items-center justify-center gap-1.5 border border-dashed border-ink/25 rounded-sm py-6 px-4 text-center cursor-pointer hover:border-brass hover:bg-white/50 transition-colors"
          >
            <span className="text-sm font-medium text-ink/70">Click to upload a file</span>
            <span className="text-xs text-ink/40">JPG, PNG, PDF, AI, EPS, PSD, CDR, SVG — up to {MAX_FILE_MB}MB</span>
          </label>
        ) : (
          <div className="flex items-center justify-between gap-3 border border-brass/40 bg-brass/5 rounded-sm py-3 px-4">
            <span className="text-sm text-ink/80 truncate">{file.name}</span>
            <button type="button" onClick={clearFile} className="text-xs font-medium text-registration shrink-0">
              Remove
            </button>
          </div>
        )}
        <input
          ref={fileInputRef}
          id="artwork"
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={handleFileChange}
          className="sr-only"
        />
        {fileError && <p className="text-xs text-registration mt-1.5">{fileError}</p>}
      </div>

      {status === 'error' && <p className="text-sm text-registration">{error}</p>}

      <button type="submit" disabled={status === 'loading'} className="btn-primary disabled:opacity-60 disabled:translate-y-0 disabled:shadow-none">
        {status === 'loading' ? (file ? 'Uploading & submitting…' : 'Submitting…') : 'Submit enquiry'}
      </button>
    </form>
  );
}
