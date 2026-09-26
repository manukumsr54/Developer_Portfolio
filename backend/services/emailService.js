import nodemailer from 'nodemailer'

/**
 * Configure email transporter using environment variables.
 * Supports standard SMTP (Host/Port/User/Password) and Gmail App Passwords.
 */
function getTransporter() {
  const isGmail = Boolean(process.env.GMAIL_USER || process.env.GMAIL_APP_PASSWORD)
  const host = process.env.SMTP_HOST || (isGmail ? 'smtp.gmail.com' : null)
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const pass =
    process.env.SMTP_PASSWORD ||
    process.env.SMTP_PASS ||
    process.env.EMAIL_PASS ||
    process.env.GMAIL_APP_PASSWORD ||
    null
  const user =
    process.env.SMTP_USER ||
    process.env.EMAIL_USER ||
    process.env.GMAIL_USER ||
    (isGmail ? (process.env.MAIL_TO || 'manukumsr54@gmail.com') : null)
  const secure = process.env.SMTP_SECURE === 'true' || port === 465

  if (!user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host: host || 'smtp.gmail.com',
    port,
    secure,
    auth: {
      user,
      pass,
    },
    // Useful timeouts to prevent hanging requests
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  })
}

/**
 * Send contact inquiry email to portfolio owner.
 *
 * @param {Object} inquiry
 * @param {string} inquiry.email - Visitor's email address
 * @param {string} inquiry.phone - Visitor's contact phone number
 * @param {string} inquiry.subject - Inquiry subject
 * @param {string} inquiry.message - Full detailed message
 * @param {string} [inquiry.intent] - Optional category / intent
 * @returns {Promise<{ delivered: boolean, messageId?: string, simulated?: boolean }>}
 */
export async function sendContactEmail({ email, phone, subject, message, intent }) {
  const recipient = process.env.MAIL_TO || process.env.EMAIL_TO || 'manukumsr54@gmail.com'
  const senderUser = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER || 'no-reply@portfolio.dev'
  const mailFrom = process.env.MAIL_FROM || process.env.EMAIL_FROM || `"Portfolio Contact" <${senderUser}>`

  const emailSubject = `Portfolio Contact — ${subject}`

  const plainTextBody = `
========================================
NEW PORTFOLIO INQUIRY
========================================

Visitor Email:  ${email}
Contact Number: ${phone}
Subject:        ${subject}
Inquiry Intent: ${intent || 'Not specified'}
Submitted At:   ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)

----------------------------------------
MESSAGE / QUERY:
----------------------------------------
${message}

========================================
Reply directly to this email to contact ${email}.
`

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050810; color: #f0f6fc; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background: #0d1117; border: 1px solid #1f2937; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { border-bottom: 1px solid #1f2937; padding-bottom: 16px; margin-bottom: 24px; }
    .badge { display: inline-block; background: rgba(56, 189, 248, 0.12); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.08em; }
    h2 { color: #ffffff; font-size: 20px; margin: 12px 0 4px 0; }
    .field { margin-bottom: 16px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #8b949e; margin-bottom: 4px; font-weight: 600; }
    .value { font-size: 14px; color: #f0f6fc; word-break: break-word; }
    .value-highlight { color: #38bdf8; font-weight: 600; text-decoration: none; }
    .message-box { background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 18px; margin-top: 16px; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #e6edf3; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #1f2937; font-size: 12px; color: #8b949e; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">Portfolio Contact Notification</span>
      <h2>${subject}</h2>
      <p style="color: #8b949e; font-size: 13px; margin: 4px 0 0 0;">Received through Manu Kumar Portfolio connect form</p>
    </div>

    <div class="field">
      <div class="label">From</div>
      <div class="value"><a href="mailto:${email}" class="value-highlight">${email}</a></div>
    </div>

    <div class="field">
      <div class="label">Contact Number</div>
      <div class="value"><a href="tel:${phone}" class="value-highlight">${phone}</a></div>
    </div>

    ${intent ? `
    <div class="field">
      <div class="label">Inquiry Intent</div>
      <div class="value">${intent}</div>
    </div>
    ` : ''}

    <div class="field">
      <div class="label">Detailed Query</div>
      <div class="message-box">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
    </div>

    <div class="footer">
      <p style="margin: 0;">Click Reply to respond directly to <strong>${email}</strong></p>
    </div>
  </div>
</body>
</html>
`

  const transporter = getTransporter()

  if (!transporter) {
    console.warn('[Email Service Notice] SMTP credentials not set in environment. Simulating email dispatch to:', recipient)
    console.log('[Email Content Preview]:\n', plainTextBody)
    return {
      delivered: false,
      simulated: true,
      messageId: `simulated-${Date.now()}`,
    }
  }

  const mailOptions = {
    from: mailFrom,
    to: recipient,
    replyTo: email,
    subject: emailSubject,
    text: plainTextBody,
    html: htmlBody,
  }

  const info = await transporter.sendMail(mailOptions)
  console.log(`[Email Service] Message sent successfully to ${recipient} (ID: ${info.messageId})`)

  return {
    delivered: true,
    messageId: info.messageId,
  }
}
