import { getSupabaseAdmin } from '@/lib/supabaseClient';
import { STATUS_VALUES } from '@/lib/statuses';

export async function insertSubmission(data) {
  const supabase = getSupabaseAdmin();
  const {
    type, name, phone = null, email = null, category = null,
    quantity = null, deadline = null, message = null, user_id = null,
    artwork_path = null,
  } = data;

  const { data: row, error } = await supabase
    .from('submissions')
    .insert({ type, name, phone, email, category, quantity, deadline, message, user_id, artwork_path })
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

  const counts = { total: 0 };
  STATUS_VALUES.forEach((s) => { counts[s] = 0; });
  for (const row of data) {
    counts[row.status] = (counts[row.status] || 0) + 1;
    counts.total += 1;
  }
  return counts;
}

// Attaches a temporary signed URL to any submission with an uploaded
// artwork file, so the admin panel / customer's account page can offer a
// direct download link without the 'artwork' bucket needing to be public.
export async function attachArtworkUrls(submissions, expiresInSeconds = 3600) {
  const supabase = getSupabaseAdmin();
  const withPaths = submissions.filter((s) => s.artwork_path);
  if (withPaths.length === 0) return submissions;

  const results = await Promise.all(
    withPaths.map((s) =>
      supabase.storage.from('artwork').createSignedUrl(s.artwork_path, expiresInSeconds)
    )
  );

  const urlByPath = {};
  withPaths.forEach((s, i) => {
    const { data } = results[i];
    if (data?.signedUrl) urlByPath[s.artwork_path] = data.signedUrl;
  });

  return submissions.map((s) =>
    s.artwork_path && urlByPath[s.artwork_path]
      ? { ...s, artwork_url: urlByPath[s.artwork_path] }
      : s
  );
}
