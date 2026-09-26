import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseClient';
import { verifyUser } from '@/lib/verifyUser';

export async function POST(request) {
  const user = await verifyUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Please log in.' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const text = (body?.text || '').trim();
  if (!text) {
    return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
  }
  if (text.length > 2000) {
    return NextResponse.json({ error: 'Message is too long.' }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();

    // The thread must already exist (created on first GET /api/chat/thread)
    // and must belong to this user.
    const { data: thread, error: threadError } = await supabase
      .from('chat_threads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (threadError) throw threadError;
    if (!thread) {
      return NextResponse.json({ error: 'Chat not started yet.' }, { status: 400 });
    }

    const { error: insertError } = await supabase
      .from('chat_messages')
      .insert({ thread_id: thread.id, sender: 'customer', body: text.slice(0, 2000) });
    if (insertError) throw insertError;

    await supabase
      .from('chat_threads')
      .update({ last_message_at: new Date().toISOString(), unread_by_admin: true, status: 'open' })
      .eq('id', thread.id);

    // Auto-reply: only fires when no admin has ever replied in this thread
    // yet, so it reads as "we're away, hang tight" rather than talking
    // over an admin who is actively responding.
    const { data: settings } = await supabase.from('chat_settings').select('*').eq('id', true).single();
    if (settings?.auto_reply_enabled && settings.auto_reply_message) {
      const { count } = await supabase
        .from('chat_messages')
        .select('id', { count: 'exact', head: true })
        .eq('thread_id', thread.id)
        .eq('sender', 'admin');

      if (!count) {
        await supabase.from('chat_messages').insert({
          thread_id: thread.id,
          sender: 'system',
          body: settings.auto_reply_message,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('send chat message failed', err);
    return NextResponse.json({ error: 'Could not send your message. Please try again.' }, { status: 500 });
  }
}
