import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseClient';
import { verifyUser } from '@/lib/verifyUser';

export async function GET(request) {
  const user = await verifyUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Please log in.' }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();

    let { data: thread } = await supabase
      .from('chat_threads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!thread) {
      const { data: settings } = await supabase.from('chat_settings').select('*').eq('id', true).single();

      const { data: newThread, error: createError } = await supabase
        .from('chat_threads')
        .insert({
          user_id: user.id,
          customer_name: user.user_metadata?.full_name || null,
          customer_email: user.email || null,
          unread_by_admin: false, // no customer message yet
        })
        .select()
        .single();
      if (createError) throw createError;
      thread = newThread;

      // Auto-send the welcome message right away, so the chat never opens
      // to a blank, silent window.
      if (settings?.welcome_enabled && settings.welcome_message) {
        await supabase.from('chat_messages').insert({
          thread_id: thread.id,
          sender: 'system',
          body: settings.welcome_message,
        });
      }
    } else {
      // Customer opened the chat — clear their unread flag.
      if (thread.unread_by_customer) {
        await supabase.from('chat_threads').update({ unread_by_customer: false }).eq('id', thread.id);
      }
    }

    const { data: messages, error: msgError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('thread_id', thread.id)
      .order('created_at', { ascending: true });
    if (msgError) throw msgError;

    return NextResponse.json({ thread, messages });
  } catch (err) {
    console.error('get/create chat thread failed', err);
    return NextResponse.json({ error: 'Could not load chat.' }, { status: 500 });
  }
}
