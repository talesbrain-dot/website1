// Lightweight signed-session auth for the admin panel.
// No external auth library — just an HMAC-signed cookie so we don't
// need a sessions table. Uses Web Crypto (SubtleCrypto) so the same
// code verifies a session in both a normal API route and in
// middleware, which runs on the Edge runtime.

const SESSION_COOKIE = 'kp_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      'ADMIN_SESSION_SECRET is not set. Add it to your environment variables.'
    );
  }
  return secret;
}

function toBase64Url(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(str.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey() {
  const secret = getSecret();
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function createSessionToken() {
  const payload = { exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS };
  const payloadStr = JSON.stringify(payload);
  const payloadB64 = toBase64Url(new TextEncoder().encode(payloadStr));

  const key = await hmacKey();
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadB64));
  const sigB64 = toBase64Url(new Uint8Array(signature));

  return `${payloadB64}.${sigB64}`;
}

export async function verifySessionToken(token) {
  if (!token || !token.includes('.')) return false;
  const [payloadB64, sigB64] = token.split('.');

  try {
    const key = await hmacKey();
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      fromBase64Url(sigB64),
      new TextEncoder().encode(payloadB64)
    );
    if (!valid) return false;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadB64)));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return false;

    return true;
  } catch {
    return false;
  }
}

export { SESSION_COOKIE, SESSION_TTL_SECONDS };
