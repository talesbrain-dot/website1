import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { insertSubmission } from '@/lib/db';
import { notifyNewSubmission } from '@/lib/notify';

async function requireUser(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return null;

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const verifier = createClient(url, anonKey);
  const { data, error } = await verifier.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

export async function POST(request) {
  // Enquiries require a logged-in customer account — verified here, not
  // just hidden in the UI, so the check can't be bypassed by calling the
  // API directly.
  const user = await requireUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Please log in to send an enquiry.' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { name, phone, email, category, quantity, deadline, message, artworkPath } = body || {};

  if (!name || !String(name).trim()) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  }
  if (!phone || !String(phone).trim()) {
    return NextResponse.json(
      { error: 'Please provide your WhatsApp number so we can reach you.' },
      { status: 400 }
    );
  }
  if (!message || !String(message).trim()) {
    return NextResponse.json({ error: 'Please describe what you need printed.' }, { status: 400 });
  }

  // If an artwork file was uploaded, it must belong to this user's own
  // storage folder — server-side check so the path can't be spoofed to
  // point at someone else's file.
  let safeArtworkPath = null;
  if (artworkPath && typeof artworkPath === 'string') {
    if (artworkPath.startsWith(`${user.id}/`)) {
      safeArtworkPath = artworkPath.slice(0, 300);
    } else {
      return NextResponse.json({ error: 'Invalid artwork file reference.' }, { status: 400 });
    }
  }

  try {
    const saved = await insertSubmission({
      type: 'enquiry',
      user_id: user.id,
      name: String(name).trim().slice(0, 200),
      phone: String(phone).trim().slice(0, 40),
      email: email ? String(email).trim().slice(0, 200) : (user.email || null),
      category: category ? String(category).trim().slice(0, 120) : null,
      quantity: quantity ? String(quantity).trim().slice(0, 80) : null,
      deadline: deadline ? String(deadline).trim().slice(0, 80) : null,
      message: String(message).trim().slice(0, 4000),
      artwork_path: safeArtworkPath,
    });

    // Awaited (not fire-and-forget) because serverless functions can be
    // frozen the instant a response is returned — an un-awaited alert
    // might never actually send. Wrapped internally so a failure here
    // never affects the response below.
    await notifyNewSubmission({
      type: 'enquiry',
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim() : (user.email || null),
      category: category || null,
      quantity: quantity || null,
      deadline: deadline || null,
      message: String(message).trim(),
    });

    return NextResponse.json({ ok: true, id: saved.id }, { status: 201 });
  } catch (err) {
    console.error('enquiry insert failed', err);
    return NextResponse.json(
      { error: 'Something went wrong saving your enquiry. Please try again or call us directly.' },
      { status: 500 }
    );
  }
}
