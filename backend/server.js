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

// Configure allowed frontend origins for CORS (supports FRONTEND_URL or CORS_ORIGIN)
const allowedOrigins = Array.from(
  new Set([
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGIN,
    'http://localhost:5173',
    'http://localhost:3000',
  ].filter(Boolean))
)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (server-to-server, curl, health checks)
      if (!origin) return callback(null, true)

      // Match exact allowed origin
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      // In non-production, allow all localhost and 127.0.0.1 ports
      if (process.env.NODE_ENV !== 'production') {
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
          return callback(null, true)
        }
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

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
// Root endpoint (clean service status for browser inspection)
app.get('/', (req, res) => {
  res.json({
    service: 'Developer Portfolio API',
    status: 'online',
    health: '/api/health',
    contact: '/api/contact',
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Contact route
app.use('/api/contact', contactRouter)

// ---------------------
// Error handling
// ---------------------
app.use(errorHandler)

// ---------------------
// Server Lifecycle / Export for Vercel
// ---------------------
// Only listen on port when running directly (local dev); Vercel serverless executes via export default app
if (!process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`[Server] Running on port ${PORT}`)
    await initDb()
  })
}

export default app
