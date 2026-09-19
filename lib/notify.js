import { Resend } from 'resend';

// Best-effort notifications: these run after a submission is already
// safely saved to the database, so a failure here (missing API key,
// network hiccup, etc.) must never fail the actual enquiry/contact
// request. Every call is wrapped so it only ever logs, never throws.

export async function notifyNewSubmission(submission) {
  await Promise.allSettled([sendEmailAlert(submission), sendWhatsAppAlert(submission)]);
}

async function sendEmailAlert(submission) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_ALERT_EMAIL;
  if (!apiKey || !to) return; // not configured — skip silently

  try {
    const resend = new Resend(apiKey);
    const kind = submission.type === 'enquiry' ? 'New enquiry' : 'New contact message';

    const lines = [
      `<p><strong>${kind}</strong> from the Kamboj Press website.</p>`,
      `<p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>`,
      submission.phone ? `<p><strong>WhatsApp:</strong> ${escapeHtml(submission.phone)}</p>` : '',
      submission.email ? `<p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>` : '',
      submission.category ? `<p><strong>Category:</strong> ${escapeHtml(submission.category)}</p>` : '',
      submission.quantity ? `<p><strong>Quantity:</strong> ${escapeHtml(submission.quantity)}</p>` : '',
      submission.deadline ? `<p><strong>Needed by:</strong> ${escapeHtml(submission.deadline)}</p>` : '',
      `<p><strong>Message:</strong><br/>${escapeHtml(submission.message || '').replace(/\n/g, '<br/>')}</p>`,
      `<p style="color:#888;font-size:12px;">View and manage this in the admin panel.</p>`,
    ].filter(Boolean).join('\n');

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Kamboj Press Website <onboarding@resend.dev>',
      to,
      subject: `${kind}: ${submission.name}${submission.category ? ` — ${submission.category}` : ''}`,
      html: lines,
    });
  } catch (err) {
    console.error('email alert failed', err);
  }
}

// Optional: a free personal WhatsApp alert via CallMeBot
// (https://www.callmebot.com/blog/free-api-whatsapp-messages/). This is
// meant for sending yourself notifications, not for messaging customers —
// set it up once by messaging their bot number from your own WhatsApp to
// get an API key, then set WHATSAPP_ALERT_PHONE / WHATSAPP_ALERT_APIKEY.
// If these aren't set, this step is skipped entirely and only the email
// alert (if configured) is sent.
async function sendWhatsAppAlert(submission) {
  const phone = process.env.WHATSAPP_ALERT_PHONE;
  const apikey = process.env.WHATSAPP_ALERT_APIKEY;
  if (!phone || !apikey) return;

  try {
    const kind = submission.type === 'enquiry' ? 'New enquiry' : 'New message';
    const text = [
      `${kind} — Kamboj Press site`,
      `${submission.name}${submission.phone ? ` (${submission.phone})` : ''}`,
      submission.category ? `${submission.category}` : '',
      (submission.message || '').slice(0, 200),
    ].filter(Boolean).join('\n');

    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`;
    await fetch(url);
  } catch (err) {
    console.error('whatsapp alert failed', err);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
