/**
 * Centralized Constellation Journey Data.
 * 
 * 6 Irregular Constellation Stages representing the evolution of a developer.
 * 
 * RULES:
 * - Completed: First Year (Foundation)
 * - Current: Second Year (Building - MANN, RAKSHA, INTERVISTA AI)
 * - Future / Aspirational: Internships (Experience), Third Year (Engineering),
 *   Final Year (Transition), Software Engineer (Ultimate Aspiration).
 * - Zero fabricated past internships, jobs, or metrics.
 */

export const journeyStages = [
  {
    id: 'foundation',
    stageNumber: '01',
    keyword: 'FOUNDATION',
    timeline: 'FIRST YEAR',
    title: 'Building Core Fundamentals',
    status: 'completed',
    statusLabel: 'COMPLETED',
    summary:
      'Building the fundamentals of programming, web development and core engineering concepts while discovering how I learn and build.',
    focusAreas: [
      'Programming fundamentals & C++ / DSA basics',
      'HTML5, modern CSS & Vanilla JavaScript',
      'React component fundamentals & Node.js basics',
      'Git version control & engineering discipline',
    ],
    // Coords relative to 1000 x 680 viewBox (desktop)
    desktopCoords: { x: 24, y: 14 },
    // Coords relative to 380 x 680 viewBox (mobile)
    mobileCoords: { x: 32, y: 10 },
    accent: '#38bdf8', // Cyan/Sky
    glow: 'rgba(56, 189, 248, 0.35)',
    starSize: 18,
  },
  {
    id: 'building',
    stageNumber: '02',
    keyword: 'BUILDING',
    timeline: 'SECOND YEAR · PRESENT',
    title: 'Turning Theory Into Production',
    status: 'current',
    statusLabel: 'CURRENT FOCUS',
    summary:
      'Moving from learning individual technologies to building complete projects and understanding how systems fit together.',
    focusAreas: [
      'Architecting semester-scale systems: RAKSHA, INTERVISTA AI, MANN',
      'Relational modeling with PostgreSQL & RESTful Express pipelines',
      'Component lifecycle, responsive design systems & GSAP motion',
      'End-to-end full-stack state flows & client-server integration',
    ],
    desktopCoords: { x: 72, y: 28 },
    mobileCoords: { x: 68, y: 26 },
    accent: '#60a5fa', // Electric Blue
    glow: 'rgba(96, 165, 250, 0.45)',
    starSize: 22,
  },
  {
    id: 'experience',
    stageNumber: '03',
    keyword: 'EXPERIENCE',
    timeline: 'INTERNSHIPS · TARGET',
    title: 'Real-World Production Practice',
    status: 'future',
    statusLabel: 'ASPIRATIONAL',
    summary:
      'Applying engineering skills in real-world teams, contributing to production systems and learning how software is built beyond personal projects.',
    focusAreas: [
      'Software engineering internships in collaborative teams',
      'Contributing to distributed production codebases',
      'Understanding agile workflows, code reviews & CI/CD delivery',
      'Writing testable, maintainable, production-ready code',
    ],
    desktopCoords: { x: 28, y: 46 },
    mobileCoords: { x: 30, y: 44 },
    accent: '#818cf8', // Indigo
    glow: 'rgba(129, 140, 248, 0.3)',
    starSize: 19,
  },
  {
    id: 'engineering',
    stageNumber: '04',
    keyword: 'ENGINEERING',
    timeline: 'THIRD YEAR · PLANNED',
    title: 'Architecture & System Depth',
    status: 'future',
    statusLabel: 'PLANNED',
    summary:
      'Diving deeper into advanced data structures, algorithmic efficiency, and building systems designed for reliability and scale.',
    focusAreas: [
      'Advanced DSA mastery & rigorous technical problem solving',
      'System design principles, database indexing & caching strategies',
      'Clean architecture patterns & comprehensive API contracts',
      'Stronger project ownership with measurable performance targets',
    ],
    desktopCoords: { x: 74, y: 64 },
    mobileCoords: { x: 70, y: 62 },
    accent: '#a78bfa', // Violet
    glow: 'rgba(167, 139, 250, 0.35)',
    starSize: 20,
  },
  {
    id: 'transition',
    stageNumber: '05',
    keyword: 'TRANSITION',
    timeline: 'FINAL YEAR · TARGET',
    title: 'Professional Bridge',
    status: 'future',
    statusLabel: 'FUTURE STAGE',
    summary:
      'Consolidating high-impact projects, refining engineering depth, and bridging the transition from academic software engineering to full-time industry practice.',
    focusAreas: [
      'Polished capstone architecture with enterprise practices',
      'Deep industry readiness & technical communication',
      'Comprehensive open-source and team project portfolio',
      'Transitioning into a reliable, product-minded engineer',
    ],
    desktopCoords: { x: 32, y: 82 },
    mobileCoords: { x: 34, y: 80 },
    accent: '#c084fc', // Bright Violet
    glow: 'rgba(192, 132, 252, 0.35)',
    starSize: 19,
  },
  {
    id: 'software-engineer',
    stageNumber: '06',
    keyword: 'SOFTWARE ENGINEER',
    timeline: 'NORTH STAR · ASPIRATION',
    title: 'Full-Fledged Software Engineer',
    status: 'future',
    statusLabel: 'ASPIRATION',
    summary:
      'Aspiring to become a strong software engineer capable of building reliable products and solving meaningful technical problems.',
    focusAreas: [
      'Designing and shipping resilient distributed systems',
      'Solving real-world user challenges with disciplined code',
      'Continuous technical growth across stack boundaries',
      'Long-term impact through thoughtful product engineering',
    ],
    desktopCoords: { x: 66, y: 94 },
    mobileCoords: { x: 66, y: 94 },
    accent: '#38bdf8', // Brilliant Cyan North Star
    glow: 'rgba(56, 189, 248, 0.65)',
    starSize: 26,
    isNorthStar: true,
  },
]
