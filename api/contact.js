const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(input) {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return res.status(501).json({ ok: false, configured: false });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const fullName = String(body.fullName || '').trim();
    const email = String(body.email || '').trim();
    const subject = String(body.subject || '').trim();
    const message = String(body.message || '').trim();
    const honeypot = String(body._honey || '').trim();

    if (honeypot) {
      return res.status(200).json({ ok: true });
    }

    if (fullName.length < 2 || !EMAIL_PATTERN.test(email) || subject.length < 3 || message.length < 15) {
      return res.status(400).json({ ok: false, error: 'Invalid form fields' });
    }

    const toEmail = process.env.CONTACT_TO_EMAIL || 'info@selmanutku.com';
    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Selman Utku Website <onboarding@resend.dev>';

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0A192F; max-width: 600px; margin: 0 auto;">
        <h2 style="margin: 0 0 16px; font-size: 20px; color: #0C2340;">Yeni İletişim Formu Mesajı</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #5B7086; width: 110px;"><strong>Ad Soyad:</strong></td>
            <td style="padding: 8px 0;">${escapeHtml(fullName)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #5B7086;"><strong>E-posta:</strong></td>
            <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #145DA0;">${escapeHtml(email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #5B7086;"><strong>Konu:</strong></td>
            <td style="padding: 8px 0;">${escapeHtml(subject)}</td>
          </tr>
        </table>
        <div style="padding: 16px; background: #F3F8FC; border: 1px solid #DCE7F2; border-radius: 6px; white-space: pre-wrap; line-height: 1.65;">${escapeHtml(message)}</div>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `[selmanutku.com] ${subject}`,
        text: `Ad Soyad: ${fullName}\nE-posta: ${email}\nKonu: ${subject}\n\nMesaj:\n${message}`,
        html: htmlBody,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ ok: false, error: 'Email provider error', details: errText });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false, error: 'Unexpected server error' });
  }
}
