import { NextResponse } from 'next/server';
import { getThreadMessages, markThreadReadByAdmin, updateThreadStatus } from '@/lib/chat';

export async function GET(request, { params }) {
  const threadId = params.id;
  try {
    const messages = await getThreadMessages(threadId);
    await markThreadReadByAdmin(threadId);
    return NextResponse.json({ messages });
  } catch (err) {
    console.error('get chat thread messages failed', err);
    return NextResponse.json({ error: 'Could not load this chat.' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const threadId = params.id;
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { status } = body || {};
  if (!['open', 'closed'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
  }

  try {
    const updated = await updateThreadStatus(threadId, status);
    return NextResponse.json({ thread: updated });
  } catch (err) {
    console.error('update chat thread status failed', err);
    return NextResponse.json({ error: 'Could not update this chat.' }, { status: 500 });
  }
}
