import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import PointerCard from './PointerCard'
import { useReducedMotion } from '../hooks/useReducedMotion'

function GitHubIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

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

  const primaryDestination = project.liveUrl || project.githubUrl || null

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
      data-cursor={primaryDestination ? 'grow' : undefined}
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
          {primaryDestination ? (
            <a
              href={primaryDestination}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group-hover:text-blue-300 transition-colors"
              aria-label={`Open ${project.name}`}
            >
              <h4
                className="text-lg font-bold text-white transition-colors duration-200"
                style={{
                  letterSpacing: '-0.01em',
                  color: isHovered ? '#ffffff' : 'var(--color-text-primary)',
                }}
              >
                {project.name}
              </h4>
            </a>
          ) : (
            <h4
              className="text-lg font-bold text-white transition-colors duration-200"
              style={{
                letterSpacing: '-0.01em',
                color: isHovered ? '#ffffff' : 'var(--color-text-primary)',
              }}
            >
              {project.name}
            </h4>
          )}

          {primaryDestination && (
            <a
              href={primaryDestination}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg transition-all duration-200 shrink-0 inline-flex items-center justify-center cursor-pointer"
              style={{
                color: isHovered ? '#60a5fa' : 'var(--color-text-tertiary)',
                transform: isHovered && !prefersReduced ? 'translate(2px, -2px)' : 'none',
              }}
              aria-label={`Open ${project.name}`}
            >
              <ArrowUpRight size={15} />
            </a>
          )}
        </div>

        {/* Tagline / Purpose */}
        <p className="text-xs md:text-sm leading-relaxed mb-4 text-slate-400">
          {project.tagline}
        </p>

        {/* Conditional Action Links */}
        {(project.liveUrl || project.githubUrl) && (
          <div className="flex items-center gap-2.5 mb-5 flex-wrap">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer"
                style={{
                  background: 'var(--color-accent-blue)',
                  color: '#ffffff',
                }}
                aria-label={`Live Demo for ${project.name}`}
              >
                <span>Live Demo</span>
                <ArrowUpRight size={12} />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--color-border-subtle)',
                  color: 'var(--color-text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)'
                  e.currentTarget.style.color = '#ffffff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-subtle)'
                  e.currentTarget.style.color = 'var(--color-text-secondary)'
                }}
                aria-label={`GitHub source for ${project.name}`}
              >
                <GitHubIcon size={12} />
                <span>Source</span>
              </a>
            )}
          </div>
        )}
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

        <span className="text-[11px] font-mono text-slate-500">
          {project.status}
        </span>
      </div>
    </PointerCard>
  )
}
