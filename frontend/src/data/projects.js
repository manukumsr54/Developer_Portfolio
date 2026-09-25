/**
 * Project data — Centralized source of truth for Phase 4.
 *
 * Strict Constraints:
 * - 3 Primary Featured Projects: RAKSHA, INTERVISTA AI, MANN
 * - 4 Mini Projects: Tower of Hanoi, JavaScript Game — add name, Spotify Clone, Twitter Clone
 * - Only verified technology relationships:
 *     RAKSHA: React, PostgreSQL, MongoDB
 *     INTERVISTA AI: React, Node.js, Express.js
 *     MANN: Node.js, Express.js
 *     Tower of Hanoi: JavaScript
 *     JavaScript Game — add name: JavaScript
 *     Spotify Clone: HTML, CSS, JavaScript
 *     Twitter Clone: HTML, CSS, JavaScript
 * - No fake metrics, awards, fabricated URLs, or unverified skills.
 */

export const projects = [
  // ==========================================
  // 3 PRIMARY FEATURED PROJECTS
  // ==========================================
  {
    id: 'raksha',
    number: '01',
    name: 'RAKSHA',
    tagline: 'Disaster management and intelligence platform.',
    description:
      'A full-stack intelligence and coordination system designed to process critical disaster data, coordinate emergency responses, and manage resource distribution.',
    category: 'Full-Stack / Systems',
    technologies: ['react', 'postgresql', 'mongodb'],
    status: 'In Development',
    featured: true,
    accent: '#38bdf8', // Cyan/Blue
    glow: 'rgba(56, 189, 248, 0.2)',
    // User can drop image path here directly:
    image: null, // e.g. '/assets/projects/raksha.png'
    liveUrl: '',
    githubUrl: '',
  },
  {
    id: 'intervista-ai',
    number: '02',
    name: 'INTERVISTA AI',
    tagline: 'AI-assisted technical interview and evaluation platform.',
    description:
      'An interview practice platform that simulates real-time technical assessments, evaluating technical responses with structured algorithmic feedback.',
    category: 'Full-Stack / AI',
    technologies: ['react', 'nodejs', 'express'],
    status: 'In Development',
    featured: true,
    accent: '#818cf8', // Indigo/Blue
    glow: 'rgba(129, 140, 248, 0.2)',
    image: null, // e.g. '/assets/projects/intervista.png'
    liveUrl: '',
    githubUrl: '',
  },
  {
    id: 'mann',
    number: '03',
    name: 'MANN',
    tagline: 'A personal semester-scale project, built brick by brick.',
    description:
      'A deep semester-scale backend and architecture project focused on robust server pipelines, modular middleware, and foundational engineering principles.',
    category: 'Backend / Architecture',
    technologies: ['nodejs', 'express'],
    status: 'In Development',
    featured: true,
    accent: '#34d399', // Emerald/Teal
    glow: 'rgba(52, 211, 153, 0.2)',
    image: null, // e.g. '/assets/projects/mann.png'
    liveUrl: '',
    githubUrl: '',
  },

  // ==========================================
  // 4 MINI PROJECTS (Supporting Experiments)
  // ==========================================
  {
    id: 'tower-of-hanoi',
    number: '04',
    name: 'Tower of Hanoi',
    tagline: 'Interactive recursive puzzle implementation with state visualization.',
    description:
      'A browser-based recursive mathematical puzzle with interactive disk movement, move validation, and algorithmic step visualization.',
    category: 'Interactive Game',
    technologies: ['javascript'],
    status: 'Completed',
    featured: false,
    accent: '#eab308',
    glow: 'rgba(234, 179, 8, 0.18)',
    image: null,
    liveUrl: '',
    githubUrl: '',
  },
  {
    id: 'js-game-placeholder',
    number: '05',
    name: 'JavaScript Game — add name',
    tagline: 'Browser-based interactive game built with vanilla JavaScript.',
    description:
      'An interactive game exploring DOM-based canvas/physics rendering, event loops, and game state management in vanilla JavaScript.',
    category: 'Interactive Game',
    technologies: ['javascript'],
    status: 'Completed',
    featured: false,
    accent: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.18)',
    image: null,
    liveUrl: '',
    githubUrl: '',
  },
  {
    id: 'spotify-clone',
    number: '06',
    name: 'Spotify Clone',
    tagline: 'Web audio streaming interface replica with dynamic audio playback.',
    description:
      'A recreation of the Spotify web player UI featuring playback controls, track playlists, responsive layouts, and audio state handling.',
    category: 'Web Application',
    technologies: ['html', 'css', 'javascript'],
    status: 'Completed',
    featured: false,
    accent: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.18)',
    image: null,
    liveUrl: '',
    githubUrl: '',
  },
  {
    id: 'twitter-clone',
    number: '07',
    name: 'Twitter Clone',
    tagline: 'Responsive social feed interface with dynamic UI interactions.',
    description:
      'A social feed interface replica featuring post composition, feed streaming layout, interactive reaction toggles, and responsive styling.',
    category: 'Web Application',
    technologies: ['html', 'css', 'javascript'],
    status: 'Completed',
    featured: false,
    accent: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.18)',
    image: null,
    liveUrl: '',
    githubUrl: '',
  },

  // Supporting relationship entry for portfolio itself
  {
    id: 'portfolio',
    number: '08',
    name: 'Portfolio',
    tagline: 'Cinematic, interactive developer portfolio and technical showcase.',
    description: 'Bespoke dark aesthetic with GSAP choreography, Canvas 2D atmosphere, and two-way technical architecture mapping.',
    category: 'Frontend Engineering',
    technologies: ['react', 'css'],
    status: 'Active',
    featured: false,
    accent: '#60a5fa',
    glow: 'rgba(96, 165, 250, 0.2)',
    image: null,
    liveUrl: '',
    githubUrl: '',
  },
]

// Primary 3 Featured Projects
export const featuredProjects = projects.filter((p) => p.featured)

// 4 Mini Projects (excluding the portfolio meta item)
export const miniProjects = projects.filter((p) => !p.featured && p.id !== 'portfolio')

// Backwards compatibility alias for other projects
export const otherProjects = miniProjects

/**
 * Helper to get project by ID
 */
export function getProjectById(id) {
  return projects.find((p) => p.id === id) || null
}

/**
 * Helper to get projects that use a specific technology ID
 */
export function getProjectsByTechnology(techId) {
  return projects.filter((p) => p.technologies.includes(techId))
}
