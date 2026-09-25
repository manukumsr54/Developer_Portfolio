import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { handleContact } from '../controllers/contactController.js'

const router = Router()

/**
 * Anti-spam submission rate limiter:
 * Max 5 submissions per 15 minutes per IP address.
 */
const contactSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many submissions from this connection. Please wait a few minutes before trying again.',
  },
})

/**
 * POST /api/contact
 * Accepts validated contact form submissions with PostgreSQL persistence.
 */
router.post('/', contactSubmissionLimiter, handleContact)

export default router
