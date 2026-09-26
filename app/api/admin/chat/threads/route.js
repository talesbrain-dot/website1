import { NextResponse } from 'next/server';
import { listThreads } from '@/lib/chat';

export async function GET() {
  try {
    const threads = await listThreads();
    return NextResponse.json({ threads });
  } catch (err) {
    console.error('list chat threads failed', err);
    return NextResponse.json({ error: 'Could not load chats.' }, { status: 500 });
  }
}
