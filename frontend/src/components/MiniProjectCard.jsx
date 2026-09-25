import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import PointerCard from './PointerCard'
import { useReducedMotion } from '../hooks/useReducedMotion'

const TECH_NAMES = {
  javascript: 'JavaScript',
  html: 'HTML',
  css: 'CSS',
}

const TECH_ACCENTS = {
  javascript: '#eab308',
  html: '#f97316',
  css: '#60a5fa',
}

export default function MiniProjectCard({ project }) {
  const [isHovered, setIsHovered] = useState(false)
  const prefersReduced = useReducedMotion()

  return (
    <PointerCard
      className="p-6 sm:p-7 flex flex-col justify-between group transition-all duration-300"
      glowColor={project.glow || 'rgba(56, 189, 248, 0.12)'}
      borderColor={project.accent || 'rgba(56, 189, 248, 0.2)'}
      tabIndex={0}
      role="article"
      aria-label={`Mini Project: ${project.name}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor="grow"
    >
      <div>
        {/* Header: Index number + Category */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-micro font-mono tracking-widest text-slate-400"
            style={{ fontSize: '10px' }}
          >
            {project.category.toUpperCase()}
          </span>

          <span
            className="font-mono text-slate-500 text-xs px-2 py-0.5 rounded bg-white/5 border border-white/5"
          >
            #{project.number}
          </span>
        </div>

        {/* Project Name (Exact verified names) */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <h4
            className="text-lg font-bold text-white transition-colors duration-200"
            style={{
              letterSpacing: '-0.01em',
              color: isHovered ? '#ffffff' : 'var(--color-text-primary)',
            }}
          >
            {project.name}
          </h4>

          <div
            className="p-1.5 rounded-lg transition-all duration-200 shrink-0"
            style={{
              color: isHovered ? '#60a5fa' : 'var(--color-text-tertiary)',
              transform: isHovered && !prefersReduced ? 'translate(2px, -2px)' : 'none',
            }}
            aria-hidden="true"
          >
            <ArrowUpRight size={15} />
          </div>
        </div>

        {/* Tagline / Purpose */}
        <p
          className="text-xs md:text-sm leading-relaxed mb-6 text-slate-400"
        >
          {project.tagline}
        </p>
      </div>

      {/* Verified Technology Stack Badges */}
      <div className="pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {project.technologies.map((techId) => {
            const techName = TECH_NAMES[techId] || techId
            const techColor = TECH_ACCENTS[techId] || '#38bdf8'

            return (
              <span
                key={techId}
                className="px-2.5 py-1 rounded text-xs font-mono transition-colors"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: isHovered ? '#e2e8f0' : 'var(--color-text-secondary)',
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

        <span
          className="text-[11px] font-mono text-slate-500"
        >
          {project.status}
        </span>
      </div>
    </PointerCard>
  )
}
