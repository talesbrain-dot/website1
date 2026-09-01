import { NextResponse } from 'next/server';
import { createSessionToken, SESSION_COOKIE, SESSION_TTL_SECONDS } from '@/lib/auth';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { password } = body || {};
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: 'Admin login is not configured yet. Set ADMIN_PASSWORD in your environment.' },
      { status: 500 }
    );
  }

  if (!password || password !== adminPassword) {
    // Same message either way — never reveal whether the password was close.
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
  return response;
}
