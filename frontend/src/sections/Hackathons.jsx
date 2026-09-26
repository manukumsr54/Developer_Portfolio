import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  MapPin,
  Calendar,
  CheckCircle2,
  Code2,
  ArrowUpRight,
} from 'lucide-react'

import SectionLabel from '../components/SectionLabel'
import PointerCard from '../components/PointerCard'
import { hackathons } from '../data/hackathons'
import { useReducedMotion } from '../hooks/useReducedMotion'

function GitHubIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

gsap.registerPlugin(ScrollTrigger)

export default function Hackathons() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const timelineRef = useRef(null)
  const lineRef = useRef(null)
  const [activeNode, setActiveNode] = useState(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        headerRef.current?.children || [],
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Vertical line progress reveal linked to section scroll
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 75%',
              end: 'bottom 85%',
              scrub: 0.8,
            },
          }
        )
      }

      // Mission nodes staggered entrance
      const nodes = timelineRef.current?.querySelectorAll('.timeline-node-item') || []
      nodes.forEach((node) => {
        gsap.fromTo(
          node,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: node,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section
      ref={sectionRef}
      id="hackathons"
      className="section-full relative py-28 md:py-36 overflow-hidden"
      style={{
        background: 'var(--color-bg-secondary)',
        borderTop: '1px solid var(--color-border-subtle)',
      }}
    >
      {/* Background ambient glow */}
      <div
        className="absolute top-1/3 left-0 w-[550px] h-[550px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.035) 0%, transparent 70%)',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      <div className="section relative z-10">
        <SectionLabel number="04" title="HACKATHONS" />

        {/* Section Header */}
        <div ref={headerRef} className="mt-8 mb-16 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2
                className="text-heading-2 font-bold tracking-tight text-white mb-3"
                style={{
                  fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
                  letterSpacing: '-0.02em',
                }}
              >
                Competitive Hackathons & Sprints
              </h2>
              <p
                className="text-base md:text-lg max-w-2xl leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Technical mission logs from collegiate competitions and rapid prototyping sprints.
                Focusing on architectural defense, system resilience, and high-velocity iteration.
              </p>
            </div>

            {/* Visual counter badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono self-start md:self-auto shrink-0"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>03 VERIFIED MISSIONS</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TECHNICAL TIMELINE / MISSION LOG CONTAINER                   */}
        {/* ============================================================ */}
        <div ref={timelineRef} className="relative max-w-4xl mx-auto pl-6 sm:pl-10 md:pl-12">
          {/* Vertical Technical Backbone Line */}
          <div
            className="absolute left-2 sm:left-3.5 md:left-4 top-4 bottom-8 w-px bg-slate-800"
            aria-hidden="true"
          />
          {/* Progressive Active Glowing Line (Scroll-triggered) */}
          <div
            ref={lineRef}
            className="absolute left-2 sm:left-3.5 md:left-4 top-4 bottom-8 w-[2px] -translate-x-[0.5px] origin-top pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, #38bdf8 0%, #3b82f6 50%, #818cf8 100%)',
              boxShadow: '0 0 12px rgba(56, 189, 248, 0.4)',
            }}
            aria-hidden="true"
          />

          {/* Timeline Nodes List */}
          <div className="flex flex-col gap-12 sm:gap-16">
            {hackathons.map((item, _index) => {
              const isHovered = activeNode === item.id

              // Clean result badge coloring based strictly on verified outcome
              const isSemifinalist = item.statusTag === 'SEMIFINALIST'
              const isParticipant = item.statusTag === 'PARTICIPANT'

              const statusColor = isSemifinalist
                ? '#10b981' // Emerald
                : isParticipant
                  ? '#94a3b8' // Slate / Gray
                  : '#38bdf8' // Cyan (Submission)

              const statusBg = isSemifinalist
                ? 'rgba(16, 185, 129, 0.12)'
                : isParticipant
                  ? 'rgba(148, 163, 184, 0.1)'
                  : 'rgba(56, 189, 248, 0.12)'

              const statusBorder = isSemifinalist
                ? 'rgba(16, 185, 129, 0.3)'
                : isParticipant
                  ? 'rgba(148, 163, 184, 0.25)'
                  : 'rgba(56, 189, 248, 0.3)'

              return (
                <div
                  key={item.id}
                  className="timeline-node-item relative group"
                  onMouseEnter={() => setActiveNode(item.id)}
                  onMouseLeave={() => setActiveNode(null)}
                >
                  {/* Timeline Glowing Node Beacon */}
                  <div
                    className="absolute -left-6 sm:-left-10 md:-left-12 top-7 -translate-x-1/2 flex items-center justify-center transition-all duration-300 z-10"
                    aria-hidden="true"
                  >
                    <div
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-transform duration-300"
                      style={{
                        background: '#0a0e1a',
                        border: `2px solid ${isHovered ? '#38bdf8' : statusColor}`,
                        boxShadow: isHovered
                          ? '0 0 16px rgba(56, 189, 248, 0.6)'
                          : '0 0 8px rgba(0, 0, 0, 0.5)',
                        transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-300"
                        style={{
                          background: isHovered ? '#ffffff' : statusColor,
                        }}
                      />
                    </div>

                    {/* Horizontal connecting branch wire to card */}
                    <div
                      className="hidden sm:block absolute left-full w-4 sm:w-5 h-px transition-colors duration-300"
                      style={{
                        background: isHovered
                          ? 'linear-gradient(90deg, #38bdf8, rgba(56, 189, 248, 0.2))'
                          : 'rgba(255, 255, 255, 0.08)',
                      }}
                    />
                  </div>

                  {/* Mission Log Card */}
                  <PointerCard
                    className="p-6 sm:p-7 md:p-8 flex flex-col justify-between transition-all duration-300"
                    glowColor="rgba(56, 189, 248, 0.16)"
                    borderColor={isHovered ? 'rgba(56, 189, 248, 0.35)' : 'var(--color-border-subtle)'}
                    tabIndex={0}
                    role="article"
                    aria-label={`${item.event} — ${item.result}`}
                  >
                    <div>
                      {/* Top Bar: Mission Code, Year & Verified Result Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="font-mono text-xs px-2.5 py-1 rounded-md text-slate-400 bg-white/5 border border-white/5"
                            style={{ letterSpacing: '0.08em' }}
                          >
                            LOG // {item.number}
                          </span>
                          <span className="font-mono text-xs text-slate-400 flex items-center gap-1.5">
                            <Calendar size={13} className="text-slate-500" />
                            {item.year}
                          </span>
                        </div>

                        {/* Verified Result Badge */}
                        <div
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide"
                          style={{
                            background: statusBg,
                            color: statusColor,
                            border: `1px solid ${statusBorder}`,
                          }}
                        >
                          <CheckCircle2 size={13} />
                          <span>{item.statusTag}</span>
                        </div>
                      </div>

                      {/* Event Name & Context */}
                      <div className="mb-4">
                        <h3
                          className="text-xl sm:text-2xl font-bold text-white mb-1.5 tracking-tight group-hover:text-blue-200 transition-colors"
                          style={{ letterSpacing: '-0.02em' }}
                        >
                          {item.event}
                        </h3>

                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                          <MapPin size={13} className="text-slate-500 shrink-0" />
                          <span>{item.context}</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-blue-400/90 font-mono text-xs">{item.type}</span>
                        </div>
                      </div>

                      {/* Project Highlight Callout */}
                      {item.project && (
                        <div
                          className="mb-4.5 p-3.5 sm:p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                          style={{
                            background: 'rgba(59, 130, 246, 0.05)',
                            border: '1px solid rgba(59, 130, 246, 0.15)',
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="p-1.5 rounded-lg shrink-0 mt-0.5"
                              style={{
                                background: 'rgba(59, 130, 246, 0.12)',
                                color: '#60a5fa',
                              }}
                            >
                              <Code2 size={16} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-semibold text-white tracking-wide">
                                  PROJECT: {item.project}
                                </span>
                              </div>
                              {item.tagline && (
                                <p className="text-xs text-blue-200/80 mt-0.5">
                                  {item.tagline}
                                </p>
                              )}
                            </div>
                          </div>

                          {(item.liveUrl || item.githubUrl) && (
                            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 pt-1 sm:pt-0">
                              {item.liveUrl && (
                                <a
                                  href={item.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all"
                                  style={{
                                    background: 'var(--color-accent-blue)',
                                    color: '#ffffff',
                                  }}
                                  aria-label={`Live Demo for ${item.project}`}
                                  data-cursor="grow"
                                >
                                  <span>Live Demo</span>
                                  <ArrowUpRight size={12} />
                                </a>
                              )}
                              {item.githubUrl && (
                                <a
                                  href={item.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all"
                                  style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid var(--color-border-subtle)',
                                    color: 'var(--color-text-secondary)',
                                  }}
                                  aria-label={`GitHub Source for ${item.project}`}
                                  data-cursor="grow"
                                >
                                  <GitHubIcon size={12} />
                                  <span>GitHub</span>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Detailed Description */}
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-300 mb-6">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom Metadata & Verified Technologies */}
                    <div className="pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {item.technologies.length > 0 ? (
                          <>
                            <span
                              className="text-micro font-mono uppercase text-slate-500 mr-1"
                              style={{ fontSize: '10px' }}
                            >
                              STACK:
                            </span>
                            {item.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="px-2.5 py-0.5 rounded text-xs font-mono"
                                style={{
                                  background: 'rgba(255, 255, 255, 0.04)',
                                  color: 'var(--color-text-secondary)',
                                  border: '1px solid rgba(255, 255, 255, 0.08)',
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </>
                        ) : (
                          <span className="text-xs font-mono text-slate-500">
                            ROLE // {item.role}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>VERIFIED RECORD</span>
                      </div>
                    </div>
                  </PointerCard>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
