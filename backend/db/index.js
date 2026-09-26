import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg

/**
 * PostgreSQL connection pool configuration.
 * Automatically enables SSL for cloud PostgreSQL providers (Neon, Supabase, Vercel Postgres, etc.)
 * Configured with timeouts to prevent hanging connections in serverless environments.
 */
const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL
const requiresSsl =
  isProduction ||
  (process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.includes('localhost') &&
    !process.env.DATABASE_URL.includes('127.0.0.1'))

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: requiresSsl ? { rejectUnauthorized: false } : false,
      max: parseInt(process.env.PG_MAX_POOL || '10', 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    }
  : {
      user: process.env.PGUSER || 'postgres',
      host: process.env.PGHOST || 'localhost',
      database: process.env.PGDATABASE || 'portfolio',
      password: process.env.PGPASSWORD || '',
      port: parseInt(process.env.PGPORT || '5432', 10),
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    }

export const pool = new Pool(poolConfig)

// Handle unexpected idle client errors
pool.on('error', (err) => {
  console.error('[Database Pool Error]:', err.message)
})

let initDbPromise = null

/**
 * Initialize database tables if connected.
 * Non-blocking: will not crash server if database is temporarily unavailable.
 * Safe for serverless: caches execution so schema creation only runs once per instance.
 */
export async function initDb() {
  if (initDbPromise) return initDbPromise

  initDbPromise = (async () => {
    try {
      const client = await pool.connect()
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS contact_messages (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            subject VARCHAR(500) NOT NULL,
            message TEXT NOT NULL,
            intent VARCHAR(100),
            status VARCHAR(50) DEFAULT 'unread',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
          CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
        `)
        console.log('[Database] PostgreSQL initialized. Table "contact_messages" ready.')
      } finally {
        client.release()
      }
    } catch (err) {
      console.warn(`[Database Notice] PostgreSQL not connected (${err.message}). Submissions will be logged safely server-side.`)
      initDbPromise = null // allow retry on next attempt
    }
  })()

  return initDbPromise
}

/**
 * Safe query execution helper with parameterization.
 */
export async function query(text, params) {
  return pool.query(text, params)
}
