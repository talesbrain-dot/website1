import { NextResponse } from 'next/server';
import { sendAdminReply } from '@/lib/chat';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { threadId, text } = body || {};
  const trimmed = (text || '').trim();
  if (!threadId || !trimmed) {
    return NextResponse.json({ error: 'Missing thread or message.' }, { status: 400 });
  }

  try {
    const message = await sendAdminReply(threadId, trimmed.slice(0, 2000));
    return NextResponse.json({ message });
  } catch (err) {
    console.error('admin chat reply failed', err);
    return NextResponse.json({ error: 'Could not send your reply.' }, { status: 500 });
  }
}
