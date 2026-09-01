import { NextResponse } from 'next/server';
import { listSubmissions, updateSubmissionStatus, getSubmissionCounts } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'all';
  const type = searchParams.get('type') || 'all';
  const search = searchParams.get('search') || '';

  try {
    const [rows, counts] = await Promise.all([
      listSubmissions({ status, type, search }),
      getSubmissionCounts(),
    ]);
    return NextResponse.json({ submissions: rows, counts });
  } catch (err) {
    console.error('list submissions failed', err);
    return NextResponse.json({ error: 'Could not load submissions.' }, { status: 500 });
  }
}

export async function PATCH(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { id, status } = body || {};
  const allowed = ['new', 'contacted', 'closed'];
  if (!id || !allowed.includes(status)) {
    return NextResponse.json({ error: 'Invalid id or status.' }, { status: 400 });
  }

  try {
    const updated = await updateSubmissionStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Submission not found.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, submission: updated });
  } catch (err) {
    console.error('update submission failed', err);
    return NextResponse.json({ error: 'Could not update submission.' }, { status: 500 });
  }
}
