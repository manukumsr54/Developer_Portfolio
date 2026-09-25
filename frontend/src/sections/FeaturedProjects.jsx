import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import SectionLabel from '../components/SectionLabel'
import FeaturedProjectCard from '../components/FeaturedProjectCard'
import { featuredProjects } from '../data/projects'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export default function FeaturedProjects() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const projectsListRef = useRef(null)
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
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Featured projects staggered cinematic reveal
      gsap.fromTo(
        projectsListRef.current?.children || [],
        { opacity: 0, y: 36, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: projectsListRef.current,
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
      id="work"
      className="section-full relative py-28 md:py-36 overflow-hidden"
      style={{
        background: 'var(--color-bg-primary)',
        borderTop: '1px solid var(--color-border-subtle)',
      }}
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/4 right-10 w-[600px] h-[600px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.035) 0%, transparent 70%)',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      <div className="section relative z-10">
        <SectionLabel number="03" title="WORK" />

        {/* Section Header */}
        <div ref={headerRef} className="mt-8 mb-14 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2
                className="text-heading-2 font-bold tracking-tight text-white mb-3"
                style={{
                  fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
                  letterSpacing: '-0.02em',
                }}
              >
                Featured Architecture & Projects
              </h2>
              <p
                className="text-base md:text-lg max-w-2xl leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Primary semester-scale systems and platforms built with full-stack architecture, clean API pipelines, and dependable data models.
              </p>
            </div>

            {/* Visual counter badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono self-start md:self-auto"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>03 PRIMARY SYSTEMS</span>
            </div>
          </div>
        </div>

        {/* The 3 Primary Featured Project Containers in an expansive editorial stack */}
        <div
          ref={projectsListRef}
          className="flex flex-col gap-10 md:gap-14"
        >
          {featuredProjects.map((project, idx) => (
            <FeaturedProjectCard
              key={project.id}
              project={project}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
