import { query, initDb } from '../db/index.js'

// In-memory fallback log in case DB is offline during local development
const fallbackLog = []

/**
 * Validate and handle contact form submissions.
 *
 * Flow:
 * 1. Honeypot anti-spam check
 * 2. Sanitize and validate inputs
 * 3. Persist to PostgreSQL (if database connected) or in-memory fallback log
 * 4. Return clean production-safe response
 *
 * Note: WhatsApp Click-to-Chat is the primary enquiry channel.
 * Database persistence provides an inbox archive without depending on an email server.
 *
 * Payload:
 * {
 *   name?: string (visitor name),
 *   email: string (required),
 *   phone: string (required),
 *   subject: string (required),
 *   message: string (required),
 *   intent?: string (optional),
 *   website?: string (honeypot, must be empty)
 * }
 */
export async function handleContact(req, res, next) {
  try {
    const { name, email, phone, subject, message, intent, website } = req.body || {}

    // 1. Honeypot check (anti-spam)
    if (website) {
      console.log('[Contact] Honeypot triggered; silently dropping bot submission.')
      return res.status(200).json({
        success: true,
        message: 'Enquiry received.',
      })
    }

    // 2. Input sanitization & validation
    const trimmedName = typeof name === 'string' ? name.trim().slice(0, 255) : ''
    const trimmedEmail = typeof email === 'string' ? email.trim() : ''
    const trimmedPhone = typeof phone === 'string' ? phone.trim() : ''
    const trimmedSubject = typeof subject === 'string' ? subject.trim() : ''
    const trimmedMessage = typeof message === 'string' ? message.trim() : ''
    const trimmedIntent = typeof intent === 'string' ? intent.trim().slice(0, 100) : null

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!trimmedEmail || !emailRegex.test(trimmedEmail) || trimmedEmail.length > 255) {
      return res.status(400).json({
        error: 'Please provide a valid email address.',
      })
    }

    // Phone validation (7 to 25 chars, 7 to 16 digits, international format support)
    const phoneCharsRegex = /^[+]?[\d\s()./-]{7,25}$/
    const phoneDigits = trimmedPhone.replace(/\D/g, '')
    if (!trimmedPhone || !phoneCharsRegex.test(trimmedPhone) || phoneDigits.length < 7 || phoneDigits.length > 16) {
      return res.status(400).json({
        error: 'Please provide a valid contact number (7–16 digits with optional country code).',
      })
    }

    // Subject validation
    if (!trimmedSubject || trimmedSubject.length < 2 || trimmedSubject.length > 300) {
      return res.status(400).json({
        error: 'Subject is required (between 2 and 300 characters).',
      })
    }

    // Detailed query / message validation
    if (!trimmedMessage || trimmedMessage.length < 10 || trimmedMessage.length > 5000) {
      return res.status(400).json({
        error: 'Detailed query must be between 10 and 5,000 characters.',
      })
    }

    // 3. Database persistence (parameterized SQL query, non-blocking)
    let recordId = null
    try {
      await initDb()
      const insertSql = `
        INSERT INTO contact_messages (name, email, phone, subject, message, intent, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'unread')
        RETURNING id, created_at;
      `
      const params = [trimmedName || null, trimmedEmail, trimmedPhone, trimmedSubject, trimmedMessage, trimmedIntent]
      const dbResult = await query(insertSql, params)
      if (dbResult?.rows?.[0]) {
        recordId = dbResult.rows[0].id
        console.log(`[Contact] Message #${recordId} successfully recorded in PostgreSQL from ${trimmedName ? `${trimmedName} <${trimmedEmail}>` : trimmedEmail}`)
      }
    } catch (dbErr) {
      console.warn('[Contact Database Notice]: Database write skipped (' + dbErr.message + ')')

      // Retain in local memory log so submission is never lost
      fallbackLog.push({
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        subject: trimmedSubject,
        message: trimmedMessage,
        intent: trimmedIntent,
        receivedAt: new Date().toISOString(),
      })
      console.log('[Contact Fallback] Stored in local fallback log. Total entries:', fallbackLog.length)
    }

    return res.status(200).json({
      success: true,
      message: 'Enquiry successfully recorded.',
      id: recordId || null,
    })
  } catch (err) {
    next(err)
  }
}
