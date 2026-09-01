import { NextResponse } from 'next/server';
import { insertSubmission } from '@/lib/db';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { name, phone, email, category, quantity, deadline, message } = body || {};

  if (!name || !String(name).trim()) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  }
  if (!phone && !email) {
    return NextResponse.json(
      { error: 'Please provide a phone number or an email so we can reach you.' },
      { status: 400 }
    );
  }
  if (!message || !String(message).trim()) {
    return NextResponse.json({ error: 'Please describe what you need printed.' }, { status: 400 });
  }

  try {
    const saved = await insertSubmission({
      type: 'enquiry',
      name: String(name).trim().slice(0, 200),
      phone: phone ? String(phone).trim().slice(0, 40) : null,
      email: email ? String(email).trim().slice(0, 200) : null,
      category: category ? String(category).trim().slice(0, 120) : null,
      quantity: quantity ? String(quantity).trim().slice(0, 80) : null,
      deadline: deadline ? String(deadline).trim().slice(0, 80) : null,
      message: String(message).trim().slice(0, 4000),
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
