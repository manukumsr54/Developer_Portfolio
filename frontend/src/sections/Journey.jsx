import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Compass, CheckCircle2, CircleDot, ArrowRight, X, Star } from 'lucide-react'

import SectionLabel from '../components/SectionLabel'
import { journeyStages } from '../data/journey'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export default function Journey() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const constellationRef = useRef(null)
  const svgPathRef = useRef(null)
  const [activeStageId, setActiveStageId] = useState(null)
  const [pinnedStageId, setPinnedStageId] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const prefersReduced = useReducedMotion()

  // Track viewport size for mobile constellation layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close popup on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveStageId(null)
        setPinnedStageId(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Calculate coordinates array for SVG constellation lines
  const points = useMemo(() => {
    return journeyStages.map((stage) => {
      const coord = isMobile ? stage.mobileCoords : stage.desktopCoords
      return { x: coord.x, y: coord.y, id: stage.id }
    })
  }, [isMobile])

  // Construct SVG Polyline path string: "M x1 y1 L x2 y2 L x3 y3..."
  const pathD = useMemo(() => {
    if (points.length === 0) return ''
    return points.reduce((acc, pt, index) => {
      return index === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`
    }, '')
  }, [points])

  // GSAP Choreography: Scroll-triggered progressive constellation drawing
  useEffect(() => {
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      // Header entrance
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

      // Progressive constellation line drawing
      const pathEl = svgPathRef.current
      if (pathEl) {
        const length = pathEl.getTotalLength ? pathEl.getTotalLength() : 300
        gsap.set(pathEl, {
          strokeDasharray: length,
          strokeDashoffset: length,
        })

        gsap.to(pathEl, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: constellationRef.current,
            start: 'top 75%',
            end: 'bottom 80%',
            scrub: 1.2,
          },
        })
      }

      // Stars entrance sequence
      const stars = constellationRef.current?.querySelectorAll('.constellation-star-node') || []
      gsap.fromTo(
        stars,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          stagger: 0.14,
          ease: 'back.out(1.6)',
          scrollTrigger: {
            trigger: constellationRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [prefersReduced, pathD])

  // Toggle stage selection for keyboard / click (pin/unpin)
  const handleStageClick = useCallback((id) => {
    setPinnedStageId((prev) => (prev === id ? null : id))
    setActiveStageId((prev) => (prev === id ? null : id))
  }, [])

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="section-full relative py-28 md:py-36 overflow-hidden"
      style={{
        background: 'var(--color-bg-primary)',
        borderTop: '1px solid var(--color-border-subtle)',
      }}
    >
      {/* Deep celestial atmospheric gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 80%, rgba(139, 92, 246, 0.07) 0%, transparent 65%),
            radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.04) 0%, transparent 70%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Micro-stars stellar dust field (subtle background specks) */}
      <div className="absolute inset-0 pointer-events-none opacity-30" aria-hidden="true">
        {[
          { x: 12, y: 18, s: 1.5, o: 0.4 },
          { x: 45, y: 12, s: 2, o: 0.6 },
          { x: 88, y: 15, s: 1.5, o: 0.3 },
          { x: 18, y: 62, s: 2, o: 0.5 },
          { x: 82, y: 48, s: 1.5, o: 0.4 },
          { x: 50, y: 88, s: 2, o: 0.6 },
          { x: 92, y: 78, s: 1.5, o: 0.35 },
          { x: 10, y: 85, s: 1.5, o: 0.4 },
        ].map((star, idx) => (
          <div
            key={idx}
            className="absolute rounded-full bg-blue-100"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.s}px`,
              height: `${star.s}px`,
              opacity: star.o,
            }}
          />
        ))}
      </div>

      <div className="section relative z-10">
        <SectionLabel number="05" title="JOURNEY" />

        {/* Section Header */}
        <div ref={headerRef} className="mt-8 mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2
                className="text-heading-2 font-bold tracking-tight text-white mb-3"
                style={{
                  fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
                  letterSpacing: '-0.02em',
                }}
              >
                The Developer's Constellation
              </h2>
              <p
                className="text-base md:text-lg max-w-2xl leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                A constellation mapping foundational mastery, current system builds, and aspirational
                milestones. Hover, focus, or tap any star to inspect its trajectory.
              </p>
            </div>

            {/* Guiding hint badge */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono self-start md:self-auto shrink-0"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <Compass size={14} className="text-cyan-400" />
              <span>INTERACTIVE STAR MAP</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CONSTELLATION SKY VIEWPORT                                   */}
        {/* ============================================================ */}
        <div
          ref={constellationRef}
          className="relative w-full rounded-2xl overflow-visible select-none"
          style={{
            minHeight: isMobile ? '700px' : '620px',
            background: 'linear-gradient(180deg, rgba(8, 12, 22, 0.7) 0%, rgba(5, 8, 16, 0.9) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.6)',
          }}
          onClick={(e) => {
            // Dismiss active popup when clicking dark sky
            if (e.target === e.currentTarget) {
              setActiveStageId(null)
              setPinnedStageId(null)
            }
          }}
        >
          {/* Subtle celestial coordinate grid marks */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none rounded-2xl"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.12) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
            }}
            aria-hidden="true"
          />

          {/* SVG Constellation Connection Lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="constellationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.75" />
                <stop offset="35%" stopColor="#60a5fa" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#a78bfa" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
              </linearGradient>

              {/* Faint static ghost line */}
              <linearGradient id="faintLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.12" />
              </linearGradient>
            </defs>

            {/* Static faint baseline path */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#faintLineGradient)"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
              strokeDasharray="4 4"
            />

            {/* Animated drawing constellation path */}
            <path
              ref={svgPathRef}
              d={pathD}
              fill="none"
              stroke="url(#constellationGradient)"
              strokeWidth="1.8"
              vectorEffect="non-scaling-stroke"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.45))',
              }}
            />
          </svg>

          {/* ============================================================ */}
          {/* THE 6 CONSTELLATION STARS & KEYWORDS                         */}
          {/* ============================================================ */}
          {journeyStages.map((stage, idx) => {
            const coord = isMobile ? stage.mobileCoords : stage.desktopCoords
            const isCurrentlyActive = activeStageId === stage.id || pinnedStageId === stage.id
            const isAnyActive = activeStageId !== null || pinnedStageId !== null
            const isDimmed = isAnyActive && !isCurrentlyActive

            // Dynamic organic animation class (different pulse rhythm per star)
            const animationClass = `animate-star-${idx + 1}`

            // Intelligent popup placement relative to star coordinates to avoid clipping
            const isRightSide = coord.x > 50
            const isBottomHalf = coord.y > 65

            return (
              <div
                key={stage.id}
                className={`constellation-star-node absolute transition-opacity duration-300 ${
                  isDimmed ? 'opacity-35' : 'opacity-100'
                }`}
                style={{
                  left: `${coord.x}%`,
                  top: `${coord.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isCurrentlyActive ? 40 : 20,
                }}
                onMouseEnter={() => {
                  if (!isMobile && !pinnedStageId) {
                    setActiveStageId(stage.id)
                  }
                }}
                onMouseLeave={() => {
                  if (!isMobile && !pinnedStageId) {
                    setActiveStageId(null)
                  }
                }}
              >
                {/* Interactive Star Button */}
                <button
                  type="button"
                  onClick={() => handleStageClick(stage.id)}
                  onFocus={() => setActiveStageId(stage.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleStageClick(stage.id)
                    }
                  }}
                  className="relative group p-3 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-full"
                  aria-label={`Journey Stage ${stage.stageNumber}: ${stage.keyword} (${stage.timeline}). Status: ${stage.statusLabel}`}
                  aria-expanded={isCurrentlyActive}
                  data-cursor="grow"
                >
                  {/* Outer breathing aura */}
                  <div
                    className={`absolute -inset-1.5 rounded-full transition-all duration-300 ${
                      isCurrentlyActive ? 'scale-150' : prefersReduced ? '' : animationClass
                    }`}
                    style={{
                      background: `radial-gradient(circle, ${stage.glow} 0%, transparent 70%)`,
                      transformOrigin: 'center center',
                    }}
                    aria-hidden="true"
                  />

                  {/* Star Glyph Core */}
                  <div
                    className="relative rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      width: `${stage.starSize}px`,
                      height: `${stage.starSize}px`,
                      background: isCurrentlyActive
                        ? '#ffffff'
                        : stage.isNorthStar
                        ? '#38bdf8'
                        : stage.status === 'completed'
                        ? '#60a5fa'
                        : stage.status === 'current'
                        ? '#93c5fd'
                        : '#cbd5e1',
                      boxShadow: isCurrentlyActive
                        ? `0 0 24px ${stage.accent}, 0 0 10px #ffffff`
                        : `0 0 14px ${stage.glow}`,
                      border: `2px solid ${isCurrentlyActive ? '#ffffff' : stage.accent}`,
                      transform: isCurrentlyActive ? 'scale(1.25)' : 'scale(1)',
                    }}
                  >
                    {/* North Star Central Sparkle for final destination */}
                    {stage.isNorthStar && (
                      <Star
                        size={12}
                        className="text-white fill-white animate-spin"
                        style={{ animationDuration: '14s' }}
                      />
                    )}
                  </div>
                </button>

                {/* ============================================================ */}
                {/* ALWAYS-VISIBLE KEYWORD LABEL (CRITICAL REQUIREMENT)          */}
                {/* Backed by translucent pill so constellation lines don't cut   */}
                {/* ============================================================ */}
                <div
                  className={`absolute pointer-events-none transition-all duration-300 whitespace-nowrap ${
                    isRightSide
                      ? 'right-full mr-3.5 text-right'
                      : 'left-full ml-3.5 text-left'
                  } top-1/2 -translate-y-1/2`}
                >
                  <div
                    className="flex flex-col px-2.5 py-1 rounded-lg backdrop-blur-md transition-all duration-200"
                    style={{
                      background: isCurrentlyActive
                        ? 'rgba(10, 15, 29, 0.95)'
                        : 'rgba(5, 8, 16, 0.8)',
                      border: `1px solid ${
                        isCurrentlyActive ? stage.accent : 'rgba(255, 255, 255, 0.08)'
                      }`,
                      boxShadow: isCurrentlyActive
                        ? `0 0 16px ${stage.glow}`
                        : '0 4px 12px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    <span
                      className="font-mono text-[9px] sm:text-[10px] tracking-widest text-slate-400 font-semibold"
                    >
                      {stage.stageNumber} // {stage.timeline.split('·')[0].trim()}
                    </span>
                    <span
                      className="font-mono text-xs sm:text-sm font-bold tracking-wider transition-colors duration-200"
                      style={{
                        color: isCurrentlyActive
                          ? '#ffffff'
                          : stage.isNorthStar
                          ? '#38bdf8'
                          : stage.status === 'current'
                          ? '#93c5fd'
                          : '#e2e8f0',
                        textShadow: isCurrentlyActive ? `0 0 12px ${stage.glow}` : 'none',
                      }}
                    >
                      {stage.keyword}
                    </span>
                  </div>
                </div>

                {/* ============================================================ */}
                {/* HOVER / FOCUS POPUP DIALOG                                   */}
                {/* Intelligently positioned to guarantee zero viewport clipping */}
                {/* ============================================================ */}
                {isCurrentlyActive && (
                  <div
                    className={`z-50 pointer-events-auto transition-all duration-300 animate-fadeIn ${
                      isMobile
                        ? 'fixed inset-x-3 sm:inset-x-6 bottom-6 max-w-sm mx-auto'
                        : isRightSide
                        ? isBottomHalf
                          ? 'absolute right-full mr-4 bottom-0 w-[320px]'
                          : 'absolute right-full mr-4 top-0 w-[320px]'
                        : isBottomHalf
                        ? 'absolute left-full ml-4 bottom-0 w-[320px]'
                        : 'absolute left-full ml-4 top-0 w-[320px]'
                    }`}
                    style={{
                      maxHeight: isMobile ? '75vh' : '85vh',
                    }}
                    role="dialog"
                    aria-label={`${stage.keyword} stage details`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="p-5 sm:p-6 rounded-2xl relative shadow-2xl overflow-y-auto max-h-[75vh]"
                      style={{
                        background: 'linear-gradient(165deg, rgba(13, 20, 36, 0.96) 0%, rgba(8, 12, 24, 0.98) 100%)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        border: `1px solid ${stage.accent}50`,
                        boxShadow: `0 16px 36px -10px rgba(0, 0, 0, 0.8), 0 0 24px ${stage.glow}`,
                      }}
                    >
                      {/* Close button for quick dismiss */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveStageId(null)
                          setPinnedStageId(null)
                        }}
                        className="absolute top-3.5 right-3.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        aria-label="Close stage details"
                      >
                        <X size={15} />
                      </button>

                      {/* Header: Stage Code & Status Badge */}
                      <div className="flex items-center gap-2 mb-2 pr-6">
                        <span
                          className="font-mono text-[10px] uppercase tracking-wider text-slate-400"
                        >
                          STAGE {stage.stageNumber} // {stage.timeline}
                        </span>
                      </div>

                      {/* Status pill with verified status label */}
                      <div className="mb-3">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-medium"
                          style={{
                            background:
                              stage.status === 'completed'
                                ? 'rgba(56, 189, 248, 0.15)'
                                : stage.status === 'current'
                                ? 'rgba(96, 165, 250, 0.18)'
                                : 'rgba(167, 139, 250, 0.15)',
                            color: stage.accent,
                            border: `1px solid ${stage.accent}40`,
                          }}
                        >
                          {stage.status === 'completed' ? (
                            <CheckCircle2 size={11} />
                          ) : (
                            <CircleDot size={11} />
                          )}
                          <span>{stage.statusLabel}</span>
                        </span>
                      </div>

                      {/* Stage Title */}
                      <h4
                        className="text-base sm:text-lg font-bold text-white mb-2 tracking-tight"
                      >
                        {stage.title}
                      </h4>

                      {/* Summary Narrative */}
                      <p
                        className="text-xs sm:text-sm leading-relaxed text-slate-300 mb-4"
                      >
                        {stage.summary}
                      </p>

                      {/* Focus Areas Bullets */}
                      <div className="pt-3 border-t border-slate-800/80">
                        <span
                          className="text-micro font-mono uppercase text-slate-400 block mb-2"
                          style={{ fontSize: '9px' }}
                        >
                          CORE OBJECTIVES:
                        </span>
                        <ul className="flex flex-col gap-1.5">
                          {stage.focusAreas.map((area, fIdx) => (
                            <li
                              key={fIdx}
                              className="text-[11px] sm:text-xs text-slate-400 flex items-start gap-1.5 leading-snug"
                            >
                              <ArrowRight
                                size={12}
                                className="shrink-0 mt-0.5 text-blue-400/80"
                              />
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Constellation bottom footer bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500 px-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>COMPLETED: 1</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>CURRENT: 1</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              <span>ASPIRATIONAL: 4</span>
            </span>
          </div>

          <span className="text-[11px]">
            DESTINATION: SOFTWARE ENGINEER · NORTH STAR
          </span>
        </div>
      </div>
    </section>
  )
}
