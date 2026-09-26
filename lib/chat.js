import { getSupabaseAdmin } from '@/lib/supabaseClient';

export async function listThreads() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('chat_threads')
    .select('*')
    .order('last_message_at', { ascending: false })
    .limit(200);
  if (error) throw error;
  return data;
}

export async function getThreadMessages(threadId) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function markThreadReadByAdmin(threadId) {
  const supabase = getSupabaseAdmin();
  await supabase.from('chat_threads').update({ unread_by_admin: false }).eq('id', threadId);
}

export async function sendAdminReply(threadId, body) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({ thread_id: threadId, sender: 'admin', body })
    .select()
    .single();
  if (error) throw error;

  await supabase
    .from('chat_threads')
    .update({ last_message_at: new Date().toISOString(), unread_by_customer: true })
    .eq('id', threadId);

  return data;
}

export async function updateThreadStatus(threadId, status) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('chat_threads')
    .update({ status })
    .eq('id', threadId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getChatSettings() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('chat_settings').select('*').eq('id', true).single();
  if (error) throw error;
  return data;
}

export async function updateChatSettings(updates) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('chat_settings')
    .update(updates)
    .eq('id', true)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getUnreadThreadCount() {
  const supabase = getSupabaseAdmin();
  const { count, error } = await supabase
    .from('chat_threads')
    .select('id', { count: 'exact', head: true })
    .eq('unread_by_admin', true);
  if (error) throw error;
  return count || 0;
}
