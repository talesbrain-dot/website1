import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseClient';

// Called by Vercel Cron (see vercel.json) every few days. Writing a row
// counts as real database activity, which is what resets Supabase's
// free-tier 7-day inactivity timer — visits to the public pages don't,
// since they don't touch the database at all.
export async function GET(request) {
  // Vercel signs cron requests with this header so randoms can't trigger it.
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();

    await supabase.from('keep_alive').insert({});

    // Keep this table tiny — remove anything older than 30 days.
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from('keep_alive').delete().lt('pinged_at', cutoff);

    return NextResponse.json({ ok: true, pinged_at: new Date().toISOString() });
  } catch (err) {
    console.error('keep-alive ping failed', err);
    return NextResponse.json({ error: 'Ping failed' }, { status: 500 });
  }
}
