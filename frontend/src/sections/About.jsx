import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GraduationCap, Layers, Cpu, Compass, ArrowUpRight } from 'lucide-react'

import SectionLabel from '../components/SectionLabel'
import PointerCard from '../components/PointerCard'
import { aboutIdentity, aboutCards } from '../data/about'
import { LINKEDIN_URL, GITHUB_URL } from '../data/socialLinks'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const ICONS = {
  GraduationCap,
  Layers,
  Cpu,
  Compass,
}

export default function About() {
  const sectionRef = useRef(null)
  const leftColRef = useRef(null)
  const cardsContainerRef = useRef(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      // Editorial content entrance
      gsap.fromTo(
        leftColRef.current?.children || [],
        { opacity: 0, y: 28 },
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

      // Information cards staggered reveal
      gsap.fromTo(
        cardsContainerRef.current?.children || [],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsContainerRef.current,
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
      id="about"
      className="section-full relative py-28 md:py-36 overflow-hidden"
      style={{
        background: 'var(--color-bg-primary)',
        borderTop: '1px solid var(--color-border-subtle)',
      }}
    >
      {/* Subtle ambient light gradient behind About section */}
      <div
        className="absolute top-0 right-1/4 w-96 h-96 pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      <div className="section relative z-10">
        <SectionLabel number={aboutIdentity.sectionNumber} title={aboutIdentity.sectionTitle} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mt-8">
          {/* Left Column — Editorial Identity */}
          <div ref={leftColRef} className="lg:col-span-5 flex flex-col gap-6">
            <h2
              className="text-heading-2 font-bold tracking-tight text-white leading-tight"
              style={{
                fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
                letterSpacing: '-0.02em',
              }}
            >
              {aboutIdentity.headline}
            </h2>

            <div className="flex flex-col gap-4 text-secondary leading-relaxed text-base md:text-lg">
              {aboutIdentity.bio.map((paragraph, index) => (
                <p key={index} style={{ color: 'var(--color-text-secondary)' }}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Student & College Credential Badge linking to LinkedIn */}
            <div className="flex flex-col gap-2.5 mt-3 self-start">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${aboutIdentity.name} on LinkedIn — ${aboutIdentity.institution}`}
                className="inline-flex flex-wrap items-center gap-2 px-4.5 py-3 rounded-xl transition-all duration-200 hover:border-cyan-400/40 hover:bg-blue-500/10 group cursor-pointer text-decoration-none"
                style={{
                  background: 'rgba(59, 130, 246, 0.05)',
                  border: '1px solid rgba(59, 130, 246, 0.15)',
                }}
              >
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
                <span className="text-xs md:text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {aboutIdentity.name}
                </span>
                <span className="text-xs md:text-sm text-slate-500">·</span>
                <span className="text-xs md:text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                  {aboutIdentity.institution}
                </span>
                <span className="text-xs md:text-sm text-slate-500 hidden sm:inline">·</span>
                <span className="text-xs md:text-sm font-mono text-cyan-400/90 font-medium">
                  2nd-Year B.Tech CSE ({aboutIdentity.cohort})
                </span>
                <ArrowUpRight
                  size={14}
                  className="text-slate-500 transition-transform duration-200 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ml-1"
                />
              </a>
            </div>
          </div>

          {/* Right Column — 4 Interactive Information Cards */}
          <div
            ref={cardsContainerRef}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {aboutCards.map((card) => {
              const IconComponent = ICONS[card.icon] || Layers
              const isCyan = card.accent === 'cyan'
              const isViolet = card.accent === 'violet'

              const accentColor = isCyan
                ? 'var(--color-accent-cyan)'
                : isViolet
                  ? 'var(--color-accent-violet)'
                  : 'var(--color-accent-blue)'

              const glowColor = isCyan
                ? 'rgba(34, 211, 238, 0.14)'
                : isViolet
                  ? 'rgba(139, 92, 246, 0.14)'
                  : 'rgba(59, 130, 246, 0.16)'

              // Card 2 "Full-Stack Development" navigates to GitHub; others navigate to LinkedIn as requested
              const isFullStack = card.id === 'focus' || card.title.toLowerCase().includes('full-stack')
              const cardUrl = isFullStack ? GITHUB_URL : LINKEDIN_URL
              const ctaText = isFullStack ? 'EXPLORE CODE' : 'EXPLORE DETAILS'

              return (
                <PointerCard
                  key={card.id}
                  as="a"
                  href={cardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-7 sm:px-8 sm:py-8 flex flex-col justify-between group no-underline text-inherit cursor-pointer"
                  glowColor={glowColor}
                  borderColor="rgba(59, 130, 246, 0.25)"
                  tabIndex={0}
                  role="link"
                  aria-label={`${card.tag}: ${card.title} (Opens in new tab)`}
                >
                  <div>
                    {/* Top Row: Tag & Icon */}
                    <div className="flex items-center justify-between mb-4.5">
                      <span
                        className="text-micro font-semibold"
                        style={{
                          color: 'var(--color-text-tertiary)',
                          fontSize: '11px',
                          letterSpacing: '0.12em',
                        }}
                      >
                        {card.tag}
                      </span>
                      <div
                        className="p-2 rounded-lg transition-transform duration-300 group-hover:scale-110"
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--color-border-subtle)',
                          color: accentColor,
                        }}
                        aria-hidden="true"
                      >
                        <IconComponent size={16} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-base md:text-lg font-semibold text-white mb-2.5 group-hover:text-blue-200 transition-colors"
                      style={{ letterSpacing: '-0.01em' }}
                    >
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-xs md:text-sm leading-relaxed"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {card.description}
                    </p>
                  </div>

                  {/* Bottom accent indicator */}
                  <div className="mt-6 pt-3.5 border-t border-slate-800/60 flex items-center justify-between">
                    <span
                      className="text-micro font-medium group-hover:text-cyan-300 transition-colors"
                      style={{ color: 'var(--color-text-tertiary)', fontSize: '10px' }}
                    >
                      {ctaText}
                    </span>
                    <ArrowUpRight
                      size={13}
                      className="text-slate-500 transition-all duration-200 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </PointerCard>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
