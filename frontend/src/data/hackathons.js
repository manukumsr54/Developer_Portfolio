/**
 * Centralized Hackathon & Technical Experience Data.
 * 
 * STRICT VERIFICATION RULES:
 * - Only verified entries and roles are listed.
 * - Zero fabricated outcomes, awards, rankings, or prizes.
 * - Structured with stable IDs and clean fields for future Express/PostgreSQL API migration.
 */

export const hackathons = [
  {
    id: 'sih-2026-raksha',
    number: '01',
    year: '2025–2026',
    event: 'Smart India Hackathon (SIH) 2026',
    context: 'ABESEC Internal Hackathon',
    type: 'National Innovation Hackathon',
    role: 'Core Full-Stack & Systems Developer',
    result: 'Institutional Evaluation & Submission',
    statusTag: 'INTERNAL SUBMISSION',
    project: 'RAKSHA',
    tagline: 'Bridging the gap between data and action.',
    description:
      'RAKSHA — a service that bridges the gap between data and action. Developed as an AI and geospatial disaster intelligence system designed to process satellite telemetry, prioritize high-risk zones, and streamline disaster response.',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'AI/ML'],
    verified: true,
    highlight: true,
  },
  {
    id: 'eit-faridabad-semifinalist',
    number: '02',
    year: '2024–2025',
    event: 'Echelon Institute of Technology (EIT), Faridabad',
    context: 'EIT Faridabad Campus',
    type: 'Offline Hackathon',
    role: 'Hackathon Competitor',
    result: 'Semifinalist',
    statusTag: 'SEMIFINALIST',
    project: 'Offline Rapid Engineering Prototype',
    tagline: 'Intensive on-site software engineering and architectural defense.',
    description:
      'Competed on-site at Echelon Institute of Technology in Faridabad in an intensive offline hackathon against engineering cohorts, successfully passing technical rounds to qualify as a Semifinalist.',
    technologies: [],
    verified: true,
    highlight: false,
  },
  {
    id: 'ab-talks-consistency-tracker',
    number: '03',
    year: '2024',
    event: 'AB Talks',
    context: 'Vibe-coding Sprint',
    type: 'Vibe-coding Hackathon',
    role: 'Participant',
    result: 'Participant',
    statusTag: 'PARTICIPANT',
    project: 'Consistency Tracker App',
    tagline: 'Iterative accountability and habit visualization application.',
    description:
      'Participated in the AB Talks vibe-coding hackathon, rapidly drafting and deploying the Consistency Tracker App focused on daily routine tracking and streak visualization under time constraints.',
    technologies: ['React', 'JavaScript', 'CSS'],
    verified: true,
    highlight: false,
  },
]
