import { getSupabaseAdmin } from '@/lib/supabaseClient';

export async function insertSubmission(data) {
  const supabase = getSupabaseAdmin();
  const {
    type, name, phone = null, email = null, category = null,
    quantity = null, deadline = null, message = null,
  } = data;

  const { data: row, error } = await supabase
    .from('submissions')
    .insert({ type, name, phone, email, category, quantity, deadline, message })
    .select('id, created_at')
    .single();

  if (error) throw error;
  return row;
}

export async function listSubmissions({ status, type, search } = {}) {
  const supabase = getSupabaseAdmin();

  let query = supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(300);

  if (status && status !== 'all') query = query.eq('status', status);
  if (type && type !== 'all') query = query.eq('type', type);
  if (search) {
    const term = `%${search}%`;
    query = query.or(
      `name.ilike.${term},phone.ilike.${term},email.ilike.${term},message.ilike.${term}`
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateSubmissionStatus(id, status) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('submissions')
    .update({ status })
    .eq('id', id)
    .select('id, status')
    .single();

  if (error) throw error;
  return data;
}

export async function getSubmissionCounts() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('submissions').select('status');
  if (error) throw error;

  const counts = { new: 0, contacted: 0, closed: 0, total: 0 };
  for (const row of data) {
    counts[row.status] = (counts[row.status] || 0) + 1;
    counts.total += 1;
  }
  return counts;
}
