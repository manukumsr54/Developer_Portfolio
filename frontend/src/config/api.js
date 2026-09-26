/**
 * Centralized API configuration for production and development.
 *
 * In production (Vercel):
 * Set VITE_API_BASE_URL to your backend Vercel deployment URL
 * (e.g. https://manu-developer-portfolio-api.vercel.app).
 *
 * In local development:
 * If VITE_API_BASE_URL is empty or unset, it defaults to an empty string,
 * which routes relative paths like /api/contact through Vite's dev proxy
 * (configured in vite.config.js to target http://localhost:3001).
 */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')

export const CONTACT_ENDPOINT = `${API_BASE_URL}/api/contact`
