import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'

import AtmosphericHaze from '../components/AtmosphericHaze'
import HeroEnvironment from '../components/HeroEnvironment'
import HeroPortrait from '../components/HeroPortrait'
import MagneticButton from '../components/MagneticButton'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Hero — Phase 2: Cinematic immersive experience.
 *
 * Composition:
 *   1. HeroEnvironment (radial lights, grid, particles, orbital fragments)
 *   2. AtmosphericHaze (multi-layer L→R blue drift, pointer-reactive)
 *   3. Central glow behind portrait
 *   4. HeroPortrait (interactive tilt, lighting, luminous ring)
 *   5. MANU KUMAR heading (gradient, cinematic entrance)
 *   6. Subtitle
 *   7. CTA buttons (magnetic)
 *   8. Scroll indicator
 *
 * GSAP timeline orchestrates the cinematic entrance.
 * ScrollTrigger drives the scroll-exit transition.
 */
export default function Hero() {
  const sectionRef = useRef(null)
  const glowRef = useRef(null)
  const portraitRef = useRef(null)
  const headingRef = useRef(null)
  const subtitleRef = useRef(null)
  const ctaRef = useRef(null)
  const scrollRef = useRef(null)
  const environmentRef = useRef(null)

  const prefersReduced = useReducedMotion()

  // === GSAP Choreography (Entrance + Scroll Exit) ===
  useEffect(() => {
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.2,
      })

      // Step 1: Environment fades in
      tl.fromTo(environmentRef.current, { opacity: 0 }, { opacity: 1, duration: 1.0 })

        // Step 2: Central glow expands
        .fromTo(
          glowRef.current,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' },
          '-=0.7'
        )

        // Step 3: Portrait rises into position (clean finish with no lingering filters)
        .fromTo(
          portraitRef.current,
          { y: 30, opacity: 0, scale: 0.92 },
          { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out', clearProps: 'filter' },
          '-=0.6'
        )

        // Step 4: Heading reveals cleanly (blur strictly removed after entrance)
        .fromTo(
          headingRef.current,
          { y: 25, opacity: 0, filter: 'blur(6px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out', clearProps: 'filter' },
          '-=0.4'
        )

        // Step 5: Subtitle appears
        .fromTo(
          subtitleRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
          '-=0.3'
        )

        // Step 6: CTAs become active
        .fromTo(
          ctaRef.current?.children || [],
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out' },
          '-=0.2'
        )

        // Step 7: Scroll indicator settles
        .fromTo(
          scrollRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.1'
        )

      // === Scroll-exit transition (only triggers as user scrolls down) ===
      gsap.to(portraitRef.current, {
        y: -50,
        opacity: 0.3,
        scale: 0.95,
        immediateRender: false,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      })

      gsap.to(headingRef.current, {
        y: -30,
        opacity: 0,
        immediateRender: false,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '60% top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.to(subtitleRef.current, {
        y: -20,
        opacity: 0,
        immediateRender: false,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '55% top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.to(ctaRef.current, {
        y: -15,
        opacity: 0,
        immediateRender: false,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '50% top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.to(scrollRef.current, {
        opacity: 0,
        immediateRender: false,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '15% top',
          end: '30% top',
          scrub: true,
        },
      })

      // Atmosphere slowly fades on scroll
      gsap.to(glowRef.current, {
        opacity: 0.2,
        scale: 1.1,
        immediateRender: false,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
      }}
    >
      {/* === Signature Atmospheric Haze (L→R, multi-layer, pointer-reactive) === */}
      <AtmosphericHaze
        intensity={0.62}
        speed={1.05}
        layers={3}
        variant="hero"
        interactive
      />

      {/* === Background Environment & Flowing Particles === */}
      <div ref={environmentRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <HeroEnvironment />
      </div>

      {/* === Central radial glow behind portrait === */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none"
        style={{
          width: 'min(700px, 90vw)',
          height: 'min(700px, 90vw)',
          borderRadius: '50%',
          background: `
            radial-gradient(circle,
              rgba(59,130,246,0.10) 0%,
              rgba(34,211,238,0.04) 35%,
              transparent 65%
            )
          `,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -55%)',
          filter: 'blur(30px)',
        }}
        aria-hidden="true"
      />

      {/* === Hero Content === */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">

        {/* Portrait */}
        <div ref={portraitRef} className="mb-10">
          <HeroPortrait size={190} />
        </div>

        {/* Heading */}
        <h1
          ref={headingRef}
          className="mb-5 select-none"
          style={{
            fontSize: 'var(--text-hero)',
            fontWeight: 'var(--weight-extrabold)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tight)',
            background: `linear-gradient(
              135deg,
              var(--color-accent-blue-bright) 0%,
              var(--color-accent-blue) 30%,
              var(--color-accent-cyan) 70%,
              var(--color-accent-blue-bright) 100%
            )`,
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 2px 20px rgba(59,130,246,0.15))',
          }}
        >
          MANU KUMAR
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mb-12"
          style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--weight-normal)',
            lineHeight: 'var(--leading-relaxed)',
            color: 'var(--color-text-secondary)',
            maxWidth: '500px',
            letterSpacing: 'var(--tracking-wide)',
          }}
        >
          B.Tech CSE Student
          <span style={{ color: 'var(--color-text-tertiary)', margin: '0 0.6em' }}>·</span>
          Developer
          <span style={{ color: 'var(--color-text-tertiary)', margin: '0 0.6em' }}>·</span>
          Builder
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex items-center gap-5 flex-wrap justify-center">
          <MagneticButton
            as="a"
            href="#work"
            withMicroInteraction
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="group flex items-center gap-2 px-7 py-3.5 rounded-full"
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)',
              background: 'var(--color-accent-blue)',
              color: '#fff',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(96,165,250,0.3)',
              boxShadow: '0 0 20px rgba(59,130,246,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-accent-blue-bright)'
              e.currentTarget.style.boxShadow = '0 0 35px rgba(59,130,246,0.25), inset 0 1px 0 rgba(255,255,255,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-accent-blue)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(59,130,246,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
            Explore My Work
            <ArrowUpRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </MagneticButton>

          <MagneticButton
            as="a"
            href="#contact"
            withMicroInteraction
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="group flex items-center gap-2 px-7 py-3.5 rounded-full"
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)',
              background: 'rgba(255,255,255,0.03)',
              color: 'var(--color-text-primary)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-border-medium)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'
              e.currentTarget.style.background = 'rgba(59,130,246,0.06)'
              e.currentTarget.style.boxShadow = '0 0 25px rgba(59,130,246,0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-medium)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Let's Build Together
          </MagneticButton>
        </div>
      </div>

      {/* === Scroll Indicator === */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 flex flex-col items-center gap-3"
        style={{ transform: 'translateX(-50%)' }}
      >
        <span
          className="text-micro"
          style={{
            fontSize: '10px',
            color: 'var(--color-text-tertiary)',
            letterSpacing: 'var(--tracking-widest)',
          }}
        >
          SCROLL
        </span>
        {/* Animated scroll line */}
        <div
          style={{
            width: '1px',
            height: '32px',
            background: 'var(--color-border-subtle)',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '1px',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '40%',
              background: 'var(--color-accent-blue)',
              borderRadius: '1px',
              animation: prefersReduced ? 'none' : 'scrollLine 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* Keyframe for scroll line */}
      <style>{`
        @keyframes scrollLine {
          0% { transform: translateY(-100%); opacity: 0; }
          30% { opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateY(200%); opacity: 0; }
        }
      `}</style>
    </section>
  )
}
