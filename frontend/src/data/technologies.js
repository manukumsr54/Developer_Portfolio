/**
 * Technology stack data — Central source of truth for Phase 3.
 *
 * Each technology specifies:
 * - id: unique identifier
 * - name: official technology name
 * - category: grouping category (Frontend, Backend, Database, Core)
 * - categoryCode: numeric order code
 * - role: concise technical role/description
 * - relatedProjects: project IDs where this technology is demonstrably used
 *
 * NOTE: Project relationships are strictly constrained to documented experience.
 * React → RAKSHA, INTERVISTA AI, Portfolio
 * JavaScript → Tower of Hanoi, another game, Spotify Clone, Twitter Clone
 * Node.js → MANN, INTERVISTA AI
 * Express.js → MANN, INTERVISTA AI
 * PostgreSQL → RAKSHA
 * MongoDB → RAKSHA
 * HTML → Spotify Clone, Twitter Clone
 * CSS → Spotify Clone, Twitter Clone, Portfolio
 */

export const categories = [
  { id: 'frontend', code: '01', name: 'FRONTEND', label: '01 / FRONTEND' },
  { id: 'backend', code: '02', name: 'BACKEND', label: '02 / BACKEND' },
  { id: 'database', code: '03', name: 'DATABASE', label: '03 / DATABASE' },
  { id: 'core', code: '04', name: 'CORE', label: '04 / CORE' },
]

export const technologies = [
  // 01 / FRONTEND
  {
    id: 'react',
    name: 'React',
    category: 'Frontend',
    categoryCode: '01',
    role: 'Component architecture, reactive state, and declarative UI composition.',
    relatedProjects: ['raksha', 'intervista-ai', 'portfolio'],
    learningStatus: 'Active Production',
  },
  {
    id: 'css',
    name: 'CSS',
    category: 'Frontend',
    categoryCode: '01',
    role: 'Layout systems, responsive grids, custom properties, and fluid typography.',
    relatedProjects: ['portfolio', 'spotify-clone', 'twitter-clone'],
    learningStatus: 'Active Production',
  },
  {
    id: 'html',
    name: 'HTML',
    category: 'Frontend',
    categoryCode: '01',
    role: 'Semantic structure, accessibility primitives, and DOM hierarchy.',
    relatedProjects: ['spotify-clone', 'twitter-clone'],
    learningStatus: 'Core Standard',
  },

  // 02 / BACKEND
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Backend',
    categoryCode: '02',
    role: 'Asynchronous event-driven runtime for server logic and API services.',
    relatedProjects: ['mann', 'intervista-ai'],
    learningStatus: 'Active Production',
  },
  {
    id: 'express',
    name: 'Express.js',
    category: 'Backend',
    categoryCode: '02',
    role: 'Server routing, middleware pipelines, and RESTful service endpoints.',
    relatedProjects: ['mann', 'intervista-ai'],
    learningStatus: 'Active Production',
  },

  // 03 / DATABASE
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'Database',
    categoryCode: '03',
    role: 'Relational data modeling, ACID transactions, and structured query optimization.',
    relatedProjects: ['raksha'],
    learningStatus: 'Active Learning',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'Database',
    categoryCode: '03',
    role: 'Document-oriented database, flexible BSON schemas, and aggregation pipelines.',
    relatedProjects: ['raksha'],
    learningStatus: 'Active Learning',
  },

  // 04 / CORE
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Core',
    categoryCode: '04',
    role: 'Modern ES6+ syntax, asynchronous programming, DOM manipulation, and algorithms.',
    relatedProjects: ['tower-of-hanoi', 'js-game-placeholder', 'spotify-clone', 'twitter-clone'],
    learningStatus: 'Core Foundation',
  },
]

/**
 * Helper to look up a technology by ID
 */
export function getTechnologyById(id) {
  return technologies.find((t) => t.id === id) || null
}

/**
 * Helper to get technologies for a specific category
 */
export function getTechnologiesByCategory(categoryName) {
  return technologies.filter((t) => t.category.toLowerCase() === categoryName.toLowerCase())
}
