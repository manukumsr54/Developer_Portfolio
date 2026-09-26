import { useState, useRef, useEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Code2,
  Server,
  Database,
  Terminal,
  Palette,
  Globe,
  Network,
  HardDrive,
  Boxes,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react'

import SectionLabel from '../components/SectionLabel'
import PointerCard from '../components/PointerCard'
import { technologies } from '../data/technologies'
import { projects } from '../data/projects'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

// Map tech IDs to appropriate Lucide icons and typographic badges
const TECH_VISUALS = {
  react: {
    icon: Boxes,
    badge: 'Re',
    accent: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.22)',
  },
  css: {
    icon: Palette,
    badge: 'CSS',
    accent: '#60a5fa',
    glow: 'rgba(96, 165, 250, 0.2)',
  },
  html: {
    icon: Globe,
    badge: 'HTML',
    accent: '#f97316',
    glow: 'rgba(249, 115, 22, 0.18)',
  },
  nodejs: {
    icon: Server,
    badge: 'Node',
    accent: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.2)',
  },
  express: {
    icon: Network,
    badge: 'Ex',
    accent: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.2)',
  },
  postgresql: {
    icon: Database,
    badge: 'PG',
    accent: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.22)',
  },
  mongodb: {
    icon: HardDrive,
    badge: 'Mongo',
    accent: '#10b981',
    glow: 'rgba(16, 185, 129, 0.2)',
  },
  javascript: {
    icon: Terminal,
    badge: 'JS',
    accent: '#eab308',
    glow: 'rgba(234, 179, 8, 0.2)',
  },
}

export default function Stack() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const gridRef = useRef(null)
  const prefersReduced = useReducedMotion()

  // Active hover/focus states
  const [activeTechId, setActiveTechId] = useState(null)
  const [hoveredProjectId, setHoveredProjectId] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  // Filtered technologies based on selected category pill
  const filteredTechs = useMemo(() => {
    if (selectedCategory === 'ALL') return technologies
    return technologies.filter((t) => t.category.toUpperCase() === selectedCategory)
  }, [selectedCategory])

  // Get active tech object
  const activeTech = useMemo(() => {
    return technologies.find((t) => t.id === activeTechId) || null
  }, [activeTechId])

  // Look up project objects for active tech
  const connectedProjects = useMemo(() => {
    if (!activeTech) return []
    return activeTech.relatedProjects
      .map((projId) => projects.find((p) => p.id === projId))
      .filter(Boolean)
  }, [activeTech])

  // If a project is hovered in the project strip, find its connected tech IDs
  const projectConnectedTechIds = useMemo(() => {
    if (!hoveredProjectId) return []
    const proj = projects.find((p) => p.id === hoveredProjectId)
    return proj ? proj.technologies : []
  }, [hoveredProjectId])

  // GSAP Scroll Entrance
  useEffect(() => {
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        headerRef.current?.children || [],
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Tech grid reveal
      gsap.fromTo(
        gridRef.current?.children || [],
        { opacity: 0, y: 30, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section
      ref={sectionRef}
      id="stack"
      className="section-full relative py-28 md:py-36 overflow-hidden"
      style={{
        background: 'var(--color-bg-secondary)',
        borderTop: '1px solid var(--color-border-subtle)',
      }}
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.04) 0%, transparent 70%)',
          filter: 'blur(70px)',
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      <div className="section relative z-10">
        <SectionLabel number="02" title="STACK" />

        {/* Section Header */}
        <div ref={headerRef} className="mt-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2
                className="text-heading-2 font-bold tracking-tight text-white mb-3"
                style={{
                  fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
                  letterSpacing: '-0.02em',
                }}
              >
                Technical Stack & Architecture
              </h2>
              <p
                className="text-base md:text-lg max-w-2xl"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Interactive system map demonstrating technology-to-project relationships. Hover or focus any technology to explore where and how it is applied.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div
              className="flex items-center gap-2 p-1.5 rounded-xl self-start md:self-auto overflow-x-auto max-w-full"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--color-border-subtle)',
              }}
              role="tablist"
              aria-label="Filter technologies by category"
            >
              {['ALL', 'FRONTEND', 'BACKEND', 'DATABASE', 'CORE'].map((cat) => {
                const isSelected = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    role="tab"
                    aria-selected={isSelected}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap cursor-pointer"
                    style={{
                      background: isSelected ? 'var(--color-accent-blue)' : 'transparent',
                      color: isSelected ? '#ffffff' : 'var(--color-text-secondary)',
                      boxShadow: isSelected ? '0 0 16px rgba(59, 130, 246, 0.35)' : 'none',
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Dual Layout: Interactive Constellation Grid (Left) + Contextual Relationship Inspector (Right) */}
        {/* Generous visual gap separating technology side and relationship inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          
          {/* Left: Interactive Tech Cards Grid (8 cols) */}
          <div
            ref={gridRef}
            className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {filteredTechs.map((tech) => {
              const visual = TECH_VISUALS[tech.id] || {
                icon: Code2,
                badge: tech.name.substring(0, 2),
                accent: '#38bdf8',
                glow: 'rgba(56, 189, 248, 0.2)',
              }
              const IconComp = visual.icon

              const isDirectlyActive = activeTechId === tech.id
              const isProjectConnected = projectConnectedTechIds.includes(tech.id)
              const isHighlighted = isDirectlyActive || isProjectConnected
              const isDimmed =
                (activeTechId && !isDirectlyActive) ||
                (hoveredProjectId && !isProjectConnected)

              return (
                <PointerCard
                  key={tech.id}
                  className="p-6 sm:p-6.5 flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  active={isHighlighted}
                  dimmed={isDimmed}
                  glowColor={visual.glow}
                  borderColor={visual.accent}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isHighlighted}
                  aria-label={`${tech.name}, category ${tech.category}. Used in ${tech.relatedProjects.length} projects.`}
                  onMouseEnter={() => setActiveTechId(tech.id)}
                  onMouseLeave={() => setActiveTechId(null)}
                  onFocus={() => setActiveTechId(tech.id)}
                  onBlur={() => setActiveTechId(null)}
                  onClick={() => setActiveTechId(activeTechId === tech.id ? null : tech.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setActiveTechId(activeTechId === tech.id ? null : tech.id)
                    }
                  }}
                >
                  <div>
                    {/* Header: Badge/Icon + Category Code */}
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                          style={{
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: `1px solid ${isHighlighted ? visual.accent : 'var(--color-border-subtle)'}`,
                            color: visual.accent,
                            transition: 'all 0.25s ease',
                          }}
                        >
                          <IconComp size={15} />
                        </div>
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            color: 'var(--color-text-secondary)',
                            fontSize: '11px',
                          }}
                        >
                          {tech.category}
                        </span>
                      </div>

                      <span
                        className="text-micro font-mono"
                        style={{ color: 'var(--color-text-tertiary)', fontSize: '11px' }}
                      >
                        {tech.categoryCode}
                      </span>
                    </div>

                    {/* Tech Name */}
                    <h3
                      className="text-lg font-bold text-white mb-1.5 transition-colors"
                      style={{
                        color: isHighlighted ? visual.accent : '#ffffff',
                      }}
                    >
                      {tech.name}
                    </h3>

                    {/* Tech Role */}
                    <p
                      className="text-xs leading-relaxed mb-4 line-clamp-2"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {tech.role}
                    </p>
                  </div>

                  {/* Connected Projects Teaser Tags */}
                  <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className="text-micro uppercase font-mono mr-1"
                        style={{ color: 'var(--color-text-tertiary)', fontSize: '9px' }}
                      >
                        USED IN:
                      </span>
                      {tech.relatedProjects.slice(0, 3).map((projId) => {
                        const proj = projects.find((p) => p.id === projId)
                        if (!proj) return null
                        return (
                          <span
                            key={projId}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono transition-colors"
                            style={{
                              background: isHighlighted
                                ? 'rgba(59, 130, 246, 0.18)'
                                : 'rgba(255, 255, 255, 0.04)',
                              color: isHighlighted ? '#93c5fd' : 'var(--color-text-secondary)',
                              border: `1px solid ${isHighlighted ? 'rgba(96, 165, 250, 0.3)' : 'transparent'}`,
                            }}
                          >
                            {proj.name}
                          </span>
                        )
                      })}
                      {tech.relatedProjects.length > 3 && (
                        <span
                          className="text-[10px] font-mono"
                          style={{ color: 'var(--color-text-tertiary)' }}
                        >
                          +{tech.relatedProjects.length - 3}
                        </span>
                      )}
                    </div>

                    <ArrowRight
                      size={13}
                      className="transition-transform duration-200"
                      style={{
                        color: isHighlighted ? visual.accent : 'var(--color-text-tertiary)',
                        transform: isHighlighted ? 'translateX(3px)' : 'none',
                      }}
                    />
                  </div>
                </PointerCard>
              )
            })}
          </div>

          {/* Right: Contextual Relationship Inspector Panel (4 cols) */}
          <div className="lg:col-span-4 sticky top-28">
            <PointerCard
              className="p-7 md:p-8 backdrop-blur-md"
              glowColor="rgba(59, 130, 246, 0.18)"
              borderColor="rgba(59, 130, 246, 0.3)"
              style={{
                background: 'linear-gradient(165deg, rgba(17, 24, 39, 0.75) 0%, rgba(10, 15, 29, 0.85) 100%)',
              }}
            >
              {activeTech ? (
                /* Detail View for Focused Technology */
                <div className="flex flex-col gap-6 animate-fadeIn">
                  {/* Active Header */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span
                        className="text-micro font-mono px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        style={{ fontSize: '10px' }}
                      >
                        {activeTech.categoryCode} / {activeTech.category.toUpperCase()}
                      </span>
                      <span
                        className="text-micro font-mono text-slate-400"
                        style={{ fontSize: '11px' }}
                      >
                        {activeTech.learningStatus}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                      {activeTech.name}
                    </h3>
                    <p
                      className="text-xs md:text-sm leading-relaxed text-slate-400"
                    >
                      {activeTech.role}
                    </p>
                  </div>

                  {/* Connected Projects Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3.5">
                      <Sparkles size={14} className="text-blue-400" />
                      <span
                        className="text-micro font-mono uppercase tracking-wider text-slate-300"
                        style={{ fontSize: '11px' }}
                      >
                        DEMONSTRATED IN PROJECTS
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {connectedProjects.map((proj) => (
                        <div
                          key={proj.id}
                          className="p-4 rounded-xl transition-all duration-200"
                          style={{
                            background: 'rgba(59, 130, 246, 0.08)',
                            border: '1px solid rgba(96, 165, 250, 0.25)',
                          }}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-semibold text-sm text-white">
                              {proj.name}
                            </span>
                            <span
                              className="text-[10px] font-mono px-2 py-0.5 rounded"
                              style={{
                                background: 'rgba(255, 255, 255, 0.06)',
                                color: 'var(--color-text-secondary)',
                              }}
                            >
                              {proj.category}
                            </span>
                          </div>
                          <p
                            className="text-xs leading-relaxed text-slate-400"
                          >
                            {proj.tagline}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Context Note */}
                  <div
                    className="p-3 rounded-lg text-xs flex items-start gap-2.5"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--color-border-subtle)',
                      color: 'var(--color-text-tertiary)',
                    }}
                  >
                    <CheckCircle2 size={14} className="text-blue-400 shrink-0 mt-0.5" />
                    <span>
                      Full project architecture, live demos, and code repositories are explored in the Featured Projects section below.
                    </span>
                  </div>
                </div>
              ) : (
                /* Default Interactive Prompt State */
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{
                      background: 'rgba(59, 130, 246, 0.08)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      color: 'var(--color-accent-blue-bright)',
                    }}
                  >
                    <Layers size={22} />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    Explore Technical Relationships
                  </h3>
                  <p
                    className="text-xs leading-relaxed mb-6 max-w-xs"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Hover or keyboard-focus any technology node on the left to reveal where it is used across personal and prototype projects.
                  </p>

                  {/* Quick-filter project chips below prompt with generous breathing room */}
                  <div className="w-full text-left mt-6 pt-5 border-t border-slate-800/80">
                    <span
                      className="text-micro font-mono uppercase block mb-3.5"
                      style={{ color: 'var(--color-text-tertiary)', fontSize: '10px', letterSpacing: '0.08em' }}
                    >
                      HOVER A PROJECT TO HIGHLIGHT TECH:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {projects.map((proj) => {
                        const isHovered = hoveredProjectId === proj.id
                        return (
                          <button
                            key={proj.id}
                            className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer"
                            style={{
                              background: isHovered
                                ? 'var(--color-accent-blue)'
                                : 'rgba(255, 255, 255, 0.04)',
                              color: isHovered ? '#ffffff' : 'var(--color-text-secondary)',
                              border: `1px solid ${isHovered ? 'rgba(96, 165, 250, 0.4)' : 'var(--color-border-subtle)'}`,
                              boxShadow: isHovered
                                ? '0 0 14px rgba(59, 130, 246, 0.3)'
                                : 'none',
                            }}
                            onMouseEnter={() => setHoveredProjectId(proj.id)}
                            onMouseLeave={() => setHoveredProjectId(null)}
                            onFocus={() => setHoveredProjectId(proj.id)}
                            onBlur={() => setHoveredProjectId(null)}
                          >
                            {proj.name}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </PointerCard>
          </div>
        </div>

        {/* Two-Way System Summary Bar at bottom of Stack section with deliberate breathing room */}
        <div
          className="mt-16 md:mt-20 px-7 py-5.5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-5"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          <div className="flex items-center gap-3 text-xs md:text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>
              <strong>Two-Way Architecture:</strong> Technologies dynamically reference demonstrated projects, and projects map back to their core engineering foundation.
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
            <span>8 Technologies</span>
            <span>·</span>
            <span>8 Projects</span>
            <span>·</span>
            <span>Zero Fabricated Skills</span>
          </div>
        </div>

      </div>
    </section>
  )
}
