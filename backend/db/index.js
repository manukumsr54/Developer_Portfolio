import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg

/**
 * PostgreSQL connection pool configuration.
 * Reads DATABASE_URL or individual PG* environment variables.
 */
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }
  : {
      user: process.env.PGUSER || 'postgres',
      host: process.env.PGHOST || 'localhost',
      database: process.env.PGDATABASE || 'portfolio',
      password: process.env.PGPASSWORD || '',
      port: parseInt(process.env.PGPORT || '5432', 10),
    }

export const pool = new Pool(poolConfig)

// Handle unexpected idle client errors
pool.on('error', (err) => {
  console.error('[Database Pool Error]:', err.message)
})

/**
 * Initialize database tables if connected.
 * Non-blocking: will not crash server if database is temporarily unavailable.
 */
export async function initDb() {
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
  }
}

/**
 * Safe query execution helper with parameterization.
 */
export async function query(text, params) {
  return pool.query(text, params)
}
