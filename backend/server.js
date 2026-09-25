import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import contactRouter from './routes/contact.js'
import { errorHandler } from './middleware/errorHandler.js'
import { initDb } from './db/index.js'

const app = express()
const PORT = process.env.PORT || 3001

// ---------------------
// Middleware
// ---------------------
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}))
app.use(express.json({ limit: '10kb' }))

// Global rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})
app.use('/api', limiter)

// ---------------------
// Routes
// ---------------------
app.use('/api/contact', contactRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ---------------------
// Error handling
// ---------------------
app.use(errorHandler)

// ---------------------
// Start
// ---------------------
app.listen(PORT, async () => {
  console.log(`[Server] Running on port ${PORT}`)
  await initDb()
})
