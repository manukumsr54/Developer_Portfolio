import { useState } from 'react'
import { ArrowUpRight, Database, Boxes, Cpu } from 'lucide-react'
import PointerCard from './PointerCard'
import { useReducedMotion } from '../hooks/useReducedMotion'

// Map technology IDs to clean display names
const TECH_NAMES = {
  react: 'React',
  postgresql: 'PostgreSQL',
  mongodb: 'MongoDB',
  nodejs: 'Node.js',
  express: 'Express.js',
  javascript: 'JavaScript',
  html: 'HTML',
  css: 'CSS',
}

const TECH_ACCENTS = {
  react: '#38bdf8',
  postgresql: '#38bdf8',
  mongodb: '#10b981',
  nodejs: '#22c55e',
  express: '#a855f7',
  javascript: '#eab308',
  html: '#f97316',
  css: '#60a5fa',
}

export default function FeaturedProjectCard({ project }) {
  const [isHovered, setIsHovered] = useState(false)
  const prefersReduced = useReducedMotion()

  return (
    <PointerCard
      className="p-6 sm:p-8 md:p-10 flex flex-col group transition-all duration-300"
      glowColor={project.glow || 'rgba(56, 189, 248, 0.18)'}
      borderColor={project.accent || 'rgba(56, 189, 248, 0.25)'}
      tabIndex={0}
      role="article"
      aria-label={`Featured Project ${project.number}: ${project.name} — ${project.tagline}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor="grow"
    >
      {/* ============================================================ */}
      {/* 1. LARGE PROMINENT IMAGE AREA                                */}
      {/* ============================================================ */}
      <div
        className="relative w-full aspect-[16/9] md:aspect-[16/8.5] min-h-[200px] sm:min-h-[260px] rounded-xl overflow-hidden mb-8 transition-all duration-500"
        style={{
          background: 'linear-gradient(145deg, #090e17 0%, #0d1524 50%, #060911 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: isHovered
            ? `0 16px 36px -10px rgba(0, 0, 0, 0.6), 0 0 30px ${project.glow}`
            : '0 8px 24px -6px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* If image is supplied by user, render crisp image */}
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.name} Project Showcase`}
            className="w-full h-full object-cover select-none transition-transform duration-700 ease-out"
            style={{
              transform: isHovered && !prefersReduced ? 'scale(1.03)' : 'scale(1)',
            }}
            loading="lazy"
          />
        ) : (
          /* Editorial Engineering Placeholder Canvas (User can drop real image into data later) */
          <div className="w-full h-full relative flex flex-col justify-between p-4 sm:p-6 md:p-7 select-none">
            {/* Ambient inner radial glow */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500"
              style={{
                opacity: isHovered ? 0.9 : 0.6,
                background: `radial-gradient(ellipse at 50% 40%, ${project.glow} 0%, transparent 65%)`,
              }}
              aria-hidden="true"
            />

            {/* Subtle technical grid pattern */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
              aria-hidden="true"
            />

            {/* Top Bar inside image container: Number index + Category Pill */}
            <div className="relative z-10 flex items-center justify-between gap-3">
              <span
                className="font-mono text-[11px] sm:text-xs px-3 py-1 rounded-md shrink-0"
                style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: project.accent,
                  letterSpacing: '0.08em',
                }}
              >
                FEATURED // {project.number}
              </span>

              {/* Status beacon */}
              <div
                className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono shrink-0"
                style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: project.accent }}
                />
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>
                  {project.status}
                </span>
              </div>
            </div>

            {/* Center Spec Canvas Graphic */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto py-2">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-500 ease-out"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${isHovered ? project.accent : 'rgba(255, 255, 255, 0.12)'}`,
                  color: project.accent,
                  transform: isHovered && !prefersReduced ? 'scale(1.08) rotate(1deg)' : 'scale(1)',
                  boxShadow: isHovered ? `0 0 20px ${project.glow}` : 'none',
                }}
              >
                {project.id === 'raksha' ? (
                  <Database size={22} />
                ) : project.id === 'intervista-ai' ? (
                  <Boxes size={22} />
                ) : (
                  <Cpu size={22} />
                )}
              </div>

              <span
                className="font-mono uppercase text-xs tracking-widest text-slate-300 mb-1"
                style={{ fontSize: '11px' }}
              >
                {project.category}
              </span>
              <span
                className="font-mono text-[10px] text-slate-500 tracking-wider"
              >
                ASSET CONTAINER · READY FOR SCREENSHOT
              </span>
            </div>

            {/* Bottom Bar inside image container: Coordinates / Aspect stamp */}
            <div className="relative z-10 hidden sm:flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-white/5 pt-2">
              <span>CANVAS RATIO 16:9</span>
              <span>100% RESPONSIVE</span>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 2. PROJECT METADATA & TITLE (PREMIUM POP-OUT HOVER)         */}
      {/* ============================================================ */}
      <div className="flex flex-col flex-grow justify-between">
        <div>
          {/* Top Row: Category Code & Index with comfortable spacing */}
          <div className="flex items-center justify-between mb-3.5">
            <span
              className="text-micro font-mono tracking-widest text-slate-400"
              style={{ fontSize: '11px' }}
            >
              {project.category.toUpperCase()}
            </span>
            <span
              className="text-micro font-mono text-slate-500"
              style={{ fontSize: '11px' }}
            >
              PHASE // {project.number}
            </span>
          </div>

          {/* Project Name with Polished Pop-Out Hover Interaction */}
          <div className="flex items-center justify-between gap-4 mb-3.5">
            <h3
              className="text-2xl sm:text-3xl font-extrabold tracking-tight transition-all duration-300"
              style={{
                letterSpacing: '-0.02em',
                color: isHovered ? '#ffffff' : 'var(--color-text-primary)',
                textShadow: isHovered ? `0 0 24px ${project.glow}` : 'none',
              }}
            >
              {project.name}
            </h3>

            {/* Subtle interactive arrow indicator with generous breathing room */}
            <div
              className="p-2.5 rounded-xl transition-all duration-300 shrink-0"
              style={{
                background: isHovered ? 'rgba(59, 130, 246, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isHovered ? project.accent : 'var(--color-border-subtle)'}`,
                color: isHovered ? project.accent : 'var(--color-text-tertiary)',
                transform: isHovered && !prefersReduced ? 'translate(2px, -2px)' : 'none',
              }}
              aria-hidden="true"
            >
              <ArrowUpRight size={17} />
            </div>
          </div>

          {/* Tagline */}
          <p
            className="text-sm md:text-base font-medium mb-3.5 text-blue-200/90 leading-snug"
            style={{ letterSpacing: '-0.01em' }}
          >
            {project.tagline}
          </p>

          {/* Description */}
          <p
            className="text-xs md:text-sm leading-relaxed mb-7 text-slate-400"
          >
            {project.description}
          </p>
        </div>

        {/* ============================================================ */}
        {/* 3. VERIFIED TECHNOLOGY RELATIONSHIPS                         */}
        {/* ============================================================ */}
        <div className="pt-4.5 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-micro font-mono uppercase mr-1 text-slate-400"
              style={{ fontSize: '10px' }}
            >
              STACK:
            </span>
            {project.technologies.map((techId) => {
              const techName = TECH_NAMES[techId] || techId
              const techColor = TECH_ACCENTS[techId] || '#38bdf8'

              return (
                <span
                  key={techId}
                  className="px-3 py-1 rounded-md text-xs font-mono transition-all duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    color: isHovered ? '#ffffff' : 'var(--color-text-secondary)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
                    style={{ background: techColor }}
                  />
                  {techName}
                </span>
              )
            })}
          </div>

          {/* Clean status pill */}
          <span
            className="text-xs font-mono text-slate-500"
          >
            {project.status}
          </span>
        </div>
      </div>
    </PointerCard>
  )
}
