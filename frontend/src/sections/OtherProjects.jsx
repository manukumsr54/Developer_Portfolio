import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import MiniProjectCard from '../components/MiniProjectCard'
import { miniProjects } from '../data/projects'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export default function OtherProjects() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const gridRef = useRef(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        headerRef.current?.children || [],
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Mini projects grid reveal
      gsap.fromTo(
        gridRef.current?.children || [],
        { opacity: 0, y: 26, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.08,
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
      id="mini-projects"
      className="section-full relative py-20 md:py-28 overflow-hidden"
      style={{
        background: 'var(--color-bg-secondary)',
        borderTop: '1px solid var(--color-border-subtle)',
      }}
    >
      <div className="section relative z-10">
        {/* Subsection Header */}
        <div ref={headerRef} className="mb-10 md:mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-micro font-mono tracking-widest text-slate-400"
              style={{ fontSize: '11px' }}
            >
              03.1 / EXPERIMENTS & MINI PROJECTS
            </span>
            <div className="h-px w-12 bg-slate-800" />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h3
                className="text-heading-3 font-bold tracking-tight text-white mb-2"
                style={{ letterSpacing: '-0.02em' }}
              >
                Supporting Builds & Interactive Prototypes
              </h3>
              <p
                className="text-sm md:text-base max-w-xl"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Smaller browser experiments, recursive algorithms, and UI replicas exploring core client-side execution.
              </p>
            </div>

            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono self-start md:self-auto"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-tertiary)',
              }}
            >
              <span>04 EXPERIMENTS</span>
            </div>
          </div>
        </div>

        {/* 4 Mini Project Cards Grid (Responsive 2-column layout) */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {miniProjects.map((project) => (
            <MiniProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
