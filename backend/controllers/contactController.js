import { query } from '../db/index.js'

// Simple in-memory fallback log in case DB is offline during local dev
const fallbackLog = []

/**
 * Validate and handle contact form submissions.
 * 
 * Payload:
 * {
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
    const { email, phone, subject, message, intent, website } = req.body || {}

    // 1. Honeypot check (anti-spam)
    if (website) {
      console.log('[Contact] Honeypot triggered; silently dropping bot submission.')
      return res.status(200).json({
        success: true,
        message: 'Message received. Thanks — I\'ll get back to you.',
      })
    }

    // 2. Input sanitization & validation
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

    // Phone validation (sensible length 7 to 25 chars, 7 to 16 digits, international format support)
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

    // 3. Database persistence (parameterized SQL query)
    try {
      const insertSql = `
        INSERT INTO contact_messages (email, phone, subject, message, intent, status)
        VALUES ($1, $2, $3, $4, $5, 'unread')
        RETURNING id, created_at;
      `
      const params = [trimmedEmail, trimmedPhone, trimmedSubject, trimmedMessage, trimmedIntent]
      const dbResult = await query(insertSql, params)
      const inserted = dbResult.rows[0]

      console.log(`[Contact] Message #${inserted.id} successfully recorded in PostgreSQL from ${trimmedEmail}`)

      return res.status(201).json({
        success: true,
        message: 'Message received. Thanks — I\'ll get back to you.',
        id: inserted.id,
      })
    } catch (dbErr) {
      // Server-side logging only; NEVER leak database error strings or credentials to the client
      console.error('[Contact Database Error]:', dbErr.message)

      // Retain in local memory log so submission is never lost
      fallbackLog.push({
        email: trimmedEmail,
        phone: trimmedPhone,
        subject: trimmedSubject,
        message: trimmedMessage,
        intent: trimmedIntent,
        receivedAt: new Date().toISOString(),
      })
      console.log('[Contact Fallback] Stored in local fallback log. Total entries:', fallbackLog.length)

      // Friendly generic error as specified in Part 15
      return res.status(503).json({
        error: 'Unable to deliver message at this time. Please try again later or reach out directly.',
      })
    }
  } catch (err) {
    next(err)
  }
}
