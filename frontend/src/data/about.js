/**
 * About section data — Centralized source of truth.
 *
 * Strict constraint: No fabricated achievements, fake metrics,
 * imaginary companies, or unverified claims.
 */

export const aboutIdentity = {
  sectionNumber: '01',
  sectionTitle: 'ABOUT',
  name: 'Manu Kumar',
  role: 'Student Coordinator — ABESEC SSC-CCPD',
  education: '2nd-Year B.Tech CSE Student at ABESEC Ghaziabad',
  institution: 'ABESEC Ghaziabad',
  cohort: '2024–2028',
  headline: 'Engineering practical software, learning from the ground up.',
  bio: [
    '2nd-year B.Tech Computer Science and Engineering student at ABESEC. Focused on full-stack architecture, clean engineering principles, and building dependable web applications.',
    'I believe in understanding how systems work under the hood — from asynchronous runtime mechanics in Node.js to reactive component lifecycles in React and relational database schemas.',
    'Currently spending time shipping personal software projects, experimenting with applied AI systems, and expanding capability across modern full-stack workflows.',
  ],
}

export const aboutCards = [
  {
    id: 'currently',
    tag: 'CURRENT STATUS',
    title: 'B.Tech CSE Student · Student Coordinator',
    roleLabel: 'Student Coordinator — ABESEC SSC-CCPD',
    description: 'Pursuing B.Tech Computer Science & Engineering at ABESEC Ghaziabad (2nd Year). Student Coordinator — ABESEC SSC-CCPD. Balancing core CS fundamentals with modern software development.',
    icon: 'GraduationCap',
    accent: 'blue',
  },
  {
    id: 'focus',
    tag: 'TECHNICAL FOCUS',
    title: 'Full-Stack Development',
    description: 'React, Node.js, Express.js, and relational / document databases. Engineering end-to-end architectures from API design to fluid interfaces.',
    icon: 'Layers',
    accent: 'cyan',
  },
  {
    id: 'building',
    tag: 'CURRENTLY BUILDING',
    title: 'Personal & Prototype Projects',
    description: 'Building MANN (semester-scale application), RAKSHA (disaster intelligence), and INTERVISTA AI (interview practice platform).',
    icon: 'Cpu',
    accent: 'blue',
  },
  {
    id: 'direction',
    tag: 'TRAJECTORY',
    title: 'Engineering Capability',
    description: 'Continuously deepening systems knowledge, clean API patterns, database modeling, and integrating applied AI models into production software.',
    icon: 'Compass',
    accent: 'violet',
  },
]
