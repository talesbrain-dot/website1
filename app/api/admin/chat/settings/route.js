import { NextResponse } from 'next/server';
import { getChatSettings, updateChatSettings } from '@/lib/chat';

export async function GET() {
  try {
    const settings = await getChatSettings();
    return NextResponse.json({ settings });
  } catch (err) {
    console.error('get chat settings failed', err);
    return NextResponse.json({ error: 'Could not load chat settings.' }, { status: 500 });
  }
}

export async function PATCH(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { welcome_enabled, welcome_message, auto_reply_enabled, auto_reply_message } = body || {};
  const updates = {};
  if (typeof welcome_enabled === 'boolean') updates.welcome_enabled = welcome_enabled;
  if (typeof welcome_message === 'string') updates.welcome_message = welcome_message.slice(0, 1000);
  if (typeof auto_reply_enabled === 'boolean') updates.auto_reply_enabled = auto_reply_enabled;
  if (typeof auto_reply_message === 'string') updates.auto_reply_message = auto_reply_message.slice(0, 1000);

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
  }

  try {
    const settings = await updateChatSettings(updates);
    return NextResponse.json({ settings });
  } catch (err) {
    console.error('update chat settings failed', err);
    return NextResponse.json({ error: 'Could not save chat settings.' }, { status: 500 });
  }
}
