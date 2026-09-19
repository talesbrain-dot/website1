import { NextResponse } from 'next/server';
import { insertSubmission } from '@/lib/db';
import { notifyNewSubmission } from '@/lib/notify';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { name, phone, email, message } = body || {};

  if (!name || !String(name).trim()) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  }
  if (!phone && !email) {
    return NextResponse.json(
      { error: 'Please provide a phone number or an email so we can reply.' },
      { status: 400 }
    );
  }
  if (!message || !String(message).trim()) {
    return NextResponse.json({ error: 'Please enter a message.' }, { status: 400 });
  }

  try {
    const saved = await insertSubmission({
      type: 'contact',
      name: String(name).trim().slice(0, 200),
      phone: phone ? String(phone).trim().slice(0, 40) : null,
      email: email ? String(email).trim().slice(0, 200) : null,
      message: String(message).trim().slice(0, 4000),
    });

    await notifyNewSubmission({
      type: 'contact',
      name: String(name).trim(),
      phone: phone ? String(phone).trim() : null,
      email: email ? String(email).trim() : null,
      category: null,
      quantity: null,
      deadline: null,
      message: String(message).trim(),
    });

    return NextResponse.json({ ok: true, id: saved.id }, { status: 201 });
  } catch (err) {
    console.error('contact insert failed', err);
    return NextResponse.json(
      { error: 'Something went wrong sending your message. Please try again or call us directly.' },
      { status: 500 }
    );
  }
}
