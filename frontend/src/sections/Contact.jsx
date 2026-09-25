import { useState, useRef, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Mail,
  RefreshCw,
} from 'lucide-react'

import SectionLabel from '../components/SectionLabel'
import AtmosphericHaze from '../components/AtmosphericHaze'
import PointerCard from '../components/PointerCard'
import MagneticButton from '../components/MagneticButton'
import { aboutIdentity } from '../data/about'
import { socialLinks } from '../data/socialLinks'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Inline brand SVG icons matching Footer.jsx
 */
function GitHubIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedInIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const SOCIAL_ICONS = {
  Github: GitHubIcon,
  Linkedin: LinkedInIcon,
  Mail: Mail,
}

const INTENT_OPTIONS = [
  { id: 'PROJECT', label: 'PROJECT', hint: 'Build a specific system or app' },
  { id: 'COLLABORATION', label: 'COLLABORATION', hint: 'Pair build or open source' },
  { id: 'HACKATHON / TEAM', label: 'HACKATHON / TEAM', hint: 'Compete in hackathons' },
  { id: 'GENERAL', label: 'GENERAL', hint: 'Technical questions or conversation' },
]

/**
 * Phase 6: Contact Section — "Have something worth building? Let's work together."
 * Fully functional database-backed contact interface connected to Express & PostgreSQL.
 */
export default function Contact() {
  const sectionRef = useRef(null)
  const leftColRef = useRef(null)
  const formCardRef = useRef(null)
  const hazeContainerRef = useRef(null)
  const prefersReduced = useReducedMotion()

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    subject: '',
    message: '',
    website: '', // honeypot
  })
  const [selectedIntent, setSelectedIntent] = useState(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // 'idle' | 'submitting' | 'success' | 'error'
  const [serverFeedback, setServerFeedback] = useState('')
  const [submittedId, setSubmittedId] = useState(null)

  // Scroll animations
  useEffect(() => {
    if (prefersReduced) return

    const ctx = gsap.context(() => {
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

      gsap.fromTo(
        formCardRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Cinematic atmospheric haze emergence as Connect section enters viewport
      if (hazeContainerRef.current) {
        gsap.fromTo(
          hazeContainerRef.current,
          {
            opacity: 0.12,
            scale: 0.94,
            y: 40,
            filter: 'blur(8px)',
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              end: 'top 30%',
              scrub: 1.2,
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [prefersReduced])

  // Field change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear individual error as user types
    setErrors((prev) => {
      if (!prev[name]) return prev
      const updated = { ...prev }
      delete updated[name]
      return updated
    })
  }, [])

  // Toggle optional intent chip
  const handleIntentToggle = useCallback((intentId) => {
    setSelectedIntent((prev) => (prev === intentId ? null : intentId))
  }, [])

  // Frontend validation
  const validateForm = () => {
    const newErrors = {}
    const trimmedEmail = formData.email.trim()
    const trimmedPhone = formData.phone.trim()
    const trimmedSubject = formData.subject.trim()
    const trimmedMessage = formData.message.trim()

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!trimmedEmail) {
      newErrors.email = 'Email address is required.'
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please provide a valid email (e.g. name@domain.com).'
    }

    // Phone (7 to 16 digits, standard characters allowed)
    const phoneCharsRegex = /^[+]?[\d\s()./-]{7,25}$/
    const phoneDigits = trimmedPhone.replace(/\D/g, '')
    if (!trimmedPhone) {
      newErrors.phone = 'Contact number is required.'
    } else if (!phoneCharsRegex.test(trimmedPhone) || phoneDigits.length < 7 || phoneDigits.length > 16) {
      newErrors.phone = 'Please provide a valid contact number (7–16 digits with optional country code).'
    }

    // Subject
    if (!trimmedSubject) {
      newErrors.subject = 'Subject is required.'
    } else if (trimmedSubject.length < 2) {
      newErrors.subject = 'Subject must be at least 2 characters.'
    }

    // Detailed query
    if (!trimmedMessage) {
      newErrors.message = 'Detailed query is required.'
    } else if (trimmedMessage.length < 10) {
      newErrors.message = 'Detailed query must be at least 10 characters so I can understand your requirements.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submission handler
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setStatus('submitting')
    setServerFeedback('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          intent: selectedIntent || undefined,
          website: formData.website || undefined, // honeypot
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStatus('success')
        setSubmittedId(data.id || null)
        setServerFeedback(data.message || "Message received. Thanks — I'll get back to you.")
        setFormData({
          email: '',
          phone: '',
          subject: '',
          message: '',
          website: '',
        })
        setSelectedIntent(null)
        setErrors({})
      } else {
        setStatus('error')
        setServerFeedback(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setServerFeedback('Network connection error. Please verify your connection or try again.')
    }
  }

  // Reset after success to send another message
  const handleReset = () => {
    setStatus('idle')
    setServerFeedback('')
    setSubmittedId(null)
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-full relative py-28 md:py-36 overflow-hidden scroll-mt-16 md:scroll-mt-20"
      style={{
        background: 'var(--color-bg-secondary)',
        borderTop: '1px solid var(--color-border-subtle)',
      }}
    >
      {/* Signature Atmospheric Haze — Visual closure returning from Hero */}
      <div
        ref={hazeContainerRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <AtmosphericHaze
          intensity={0.68}
          speed={1.18}
          layers={3}
          variant="connect"
        />
      </div>

      {/* Subtle background technical grid markings */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      <div className="section relative z-10">
        <SectionLabel number="06" title="CONNECT" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mt-8">
          {/* ============================================================ */}
          {/* LEFT COLUMN: Editorial Culmination & Supporting Identity      */}
          {/* ============================================================ */}
          <div ref={leftColRef} className="lg:col-span-5 flex flex-col">
            {/* Supporting Subheading */}
            <span
              className="font-mono text-xs sm:text-sm tracking-widest text-cyan-400 uppercase font-semibold mb-2"
            >
              Have something worth building?
            </span>

            {/* Major Visual Statement */}
            <h2
              className="text-white font-bold tracking-tight leading-tight mb-4"
              style={{
                fontSize: 'clamp(2.25rem, 3.8vw, 3.25rem)',
                letterSpacing: '-0.02em',
              }}
            >
              Let's work together.
            </h2>

            {/* Editorial Narrative */}
            <p
              className="text-base md:text-lg leading-relaxed mb-8"
              style={{ color: 'var(--color-text-secondary)', maxWidth: '520px' }}
            >
              Whether it's a project, an idea, an experiment, or a technical problem worth solving,
              start the conversation.
            </p>

            {/* Verified Identity & Student Coordinator Role Integration */}
            <div
              className="p-5 sm:p-6 rounded-2xl mb-8 transition-all"
              style={{
                background: 'rgba(13, 17, 23, 0.65)',
                border: '1px solid var(--color-border-subtle)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                <span
                  className="font-mono text-[10px] tracking-wider uppercase font-semibold"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  IDENTITY & VERIFIED AFFILIATION
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white mb-1 tracking-tight">
                {aboutIdentity.name}
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 mb-3">
                {aboutIdentity.education}
              </p>

              {/* Natural Student Coordinator badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium"
                style={{
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  color: 'var(--color-accent-cyan)',
                }}
              >
                <ShieldCheck size={14} className="shrink-0 text-cyan-400" />
                <span>{aboutIdentity.role}</span>
              </div>
            </div>

            {/* Supporting Direct Channels */}
            <div className="flex flex-col gap-3.5 mb-8">
              <span
                className="font-mono text-[10px] tracking-wider uppercase font-semibold"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                DIRECT PROFESSIONAL CHANNELS
              </span>

              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map((link) => {
                  const Icon = SOCIAL_ICONS[link.icon] || Mail
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all duration-200"
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--color-border-subtle)',
                        color: 'var(--color-text-secondary)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)'
                        e.currentTarget.style.color = 'var(--color-text-primary)'
                        e.currentTarget.style.background = 'rgba(56, 189, 248, 0.06)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-border-subtle)'
                        e.currentTarget.style.color = 'var(--color-text-secondary)'
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                      }}
                      data-cursor="grow"
                    >
                      <Icon size={14} />
                      <span>{link.label}</span>
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Architecture / Integrity Note */}
            <div className="flex items-center gap-2.5 text-xs font-mono text-slate-500">
              <Sparkles size={13} className="text-cyan-400/80 shrink-0" />
              <span>Direct PostgreSQL inbox storage · Parameterized security</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: Interactive Form Interface                      */}
          {/* ============================================================ */}
          <div ref={formCardRef} className="lg:col-span-7">
            <PointerCard
              className="p-6 sm:p-8 md:p-10"
              glowColor="rgba(56, 189, 248, 0.12)"
              borderColor="rgba(56, 189, 248, 0.22)"
              tabIndex={-1}
            >
              {status === 'success' ? (
                /* ============================================================ */
                /* SUCCESS CONFIRMATION STATE                                   */
                /* ============================================================ */
                <div
                  className="py-10 px-4 sm:px-6 flex flex-col items-center text-center animate-fadeIn"
                  role="status"
                  aria-live="polite"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                    style={{
                      background: 'rgba(52, 211, 153, 0.12)',
                      border: '1px solid rgba(52, 211, 153, 0.35)',
                      boxShadow: '0 0 24px rgba(52, 211, 153, 0.25)',
                    }}
                  >
                    <CheckCircle2 size={32} className="text-emerald-400" />
                  </div>

                  <h3
                    className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight"
                    style={{ letterSpacing: '-0.01em' }}
                  >
                    Message received.
                  </h3>

                  <p
                    className="text-base sm:text-lg mb-4 font-medium"
                    style={{ color: 'var(--color-accent-cyan)' }}
                  >
                    Thanks — I'll get back to you.
                  </p>

                  <p
                    className="text-xs sm:text-sm max-w-md leading-relaxed mb-6"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Your query has been recorded into the portfolio's database. I typically review
                    new project and collaboration inquiries within 24–48 hours.
                  </p>

                  {submittedId && (
                    <div
                      className="px-3.5 py-1.5 rounded-lg font-mono text-[11px] mb-8"
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--color-border-subtle)',
                        color: 'var(--color-text-tertiary)',
                      }}
                    >
                      RECORD ID: #{submittedId} · STATUS: UNREAD
                    </div>
                  )}

                  <MagneticButton
                    as="button"
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer"
                    style={{
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    <RefreshCw size={14} className="text-cyan-400" />
                    <span>SEND ANOTHER MESSAGE</span>
                  </MagneticButton>
                </div>
              ) : (
                /* ============================================================ */
                /* ACTIVE CONTACT FORM                                          */
                /* ============================================================ */
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
                  {/* Top Bar: Optional Intent Selector Chips */}
                  <div className="flex flex-col gap-2.5 pb-2 border-b border-slate-800/80">
                    <span
                      className="font-mono text-[11px] tracking-wider uppercase font-semibold flex items-center justify-between"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      <span>WHAT ARE YOU REACHING OUT ABOUT?</span>
                      <span className="text-[10px] text-slate-500 font-normal">OPTIONAL</span>
                    </span>

                    <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Inquiry Intent">
                      {INTENT_OPTIONS.map((intent) => {
                        const isSelected = selectedIntent === intent.id
                        return (
                          <button
                            key={intent.id}
                            type="button"
                            onClick={() => handleIntentToggle(intent.id)}
                            aria-pressed={isSelected}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                            style={{
                              background: isSelected
                                ? 'rgba(56, 189, 248, 0.16)'
                                : 'rgba(255, 255, 255, 0.03)',
                              border: `1px solid ${
                                isSelected ? 'rgba(56, 189, 248, 0.5)' : 'var(--color-border-subtle)'
                              }`,
                              color: isSelected
                                ? 'var(--color-accent-cyan)'
                                : 'var(--color-text-secondary)',
                              boxShadow: isSelected
                                ? '0 0 14px rgba(56, 189, 248, 0.2)'
                                : 'none',
                            }}
                            title={intent.hint}
                            data-cursor="grow"
                          >
                            {intent.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Honeypot field (anti-spam, invisible to real visitors) */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <label htmlFor="contact-website">Website</label>
                    <input
                      id="contact-website"
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* FIELD 1: EMAIL */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="contact-email"
                      className="font-mono text-xs tracking-wider font-semibold uppercase mb-2 flex items-center justify-between"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      <span>
                        EMAIL <span className="text-cyan-400">*</span>
                      </span>
                      {errors.email && (
                        <span className="text-[11px] text-rose-400 normal-case font-sans">
                          Invalid address
                        </span>
                      )}
                    </label>

                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@domain.com"
                      autoComplete="email"
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      className="w-full px-4.5 py-3.5 rounded-xl text-sm md:text-base text-slate-100 placeholder-slate-500 bg-slate-950/70 border transition-all duration-200 outline-none"
                      style={{
                        borderColor: errors.email
                          ? 'rgba(244, 63, 94, 0.8)'
                          : 'var(--color-border-subtle)',
                        boxShadow: errors.email
                          ? '0 0 12px rgba(244, 63, 94, 0.15)'
                          : 'none',
                      }}
                      onFocus={(e) => {
                        if (!errors.email) {
                          e.target.style.borderColor = 'rgba(56, 189, 248, 0.6)'
                          e.target.style.boxShadow = '0 0 16px rgba(56, 189, 248, 0.15)'
                          e.target.style.backgroundColor = 'rgba(13, 17, 23, 0.95)'
                        }
                      }}
                      onBlur={(e) => {
                        if (!errors.email) {
                          e.target.style.borderColor = 'var(--color-border-subtle)'
                          e.target.style.boxShadow = 'none'
                          e.target.style.backgroundColor = 'rgba(13, 17, 23, 0.7)'
                        }
                      }}
                    />

                    {errors.email && (
                      <div
                        id="contact-email-error"
                        role="alert"
                        className="flex items-center gap-1.5 mt-2 text-xs text-rose-400"
                      >
                        <AlertCircle size={13} className="shrink-0" />
                        <span>{errors.email}</span>
                      </div>
                    )}
                  </div>

                  {/* FIELD 2: CONTACT NUMBER */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="contact-phone"
                      className="font-mono text-xs tracking-wider font-semibold uppercase mb-2 flex items-center justify-between"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      <span>
                        CONTACT NUMBER <span className="text-cyan-400">*</span>
                      </span>
                      {errors.phone && (
                        <span className="text-[11px] text-rose-400 normal-case font-sans">
                          Phone required
                        </span>
                      )}
                    </label>

                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      aria-required="true"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
                      className="w-full px-4.5 py-3.5 rounded-xl text-sm md:text-base text-slate-100 placeholder-slate-500 bg-slate-950/70 border transition-all duration-200 outline-none"
                      style={{
                        borderColor: errors.phone
                          ? 'rgba(244, 63, 94, 0.8)'
                          : 'var(--color-border-subtle)',
                        boxShadow: errors.phone
                          ? '0 0 12px rgba(244, 63, 94, 0.15)'
                          : 'none',
                      }}
                      onFocus={(e) => {
                        if (!errors.phone) {
                          e.target.style.borderColor = 'rgba(56, 189, 248, 0.6)'
                          e.target.style.boxShadow = '0 0 16px rgba(56, 189, 248, 0.15)'
                          e.target.style.backgroundColor = 'rgba(13, 17, 23, 0.95)'
                        }
                      }}
                      onBlur={(e) => {
                        if (!errors.phone) {
                          e.target.style.borderColor = 'var(--color-border-subtle)'
                          e.target.style.boxShadow = 'none'
                          e.target.style.backgroundColor = 'rgba(13, 17, 23, 0.7)'
                        }
                      }}
                    />

                    {errors.phone && (
                      <div
                        id="contact-phone-error"
                        role="alert"
                        className="flex items-center gap-1.5 mt-2 text-xs text-rose-400"
                      >
                        <AlertCircle size={13} className="shrink-0" />
                        <span>{errors.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* FIELD 3: SUBJECT */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="contact-subject"
                      className="font-mono text-xs tracking-wider font-semibold uppercase mb-2 flex items-center justify-between"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      <span>
                        SUBJECT <span className="text-cyan-400">*</span>
                      </span>
                      {errors.subject && (
                        <span className="text-[11px] text-rose-400 normal-case font-sans">
                          Subject required
                        </span>
                      )}
                    </label>

                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Project topic or inquiry title"
                      aria-required="true"
                      aria-invalid={!!errors.subject}
                      aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                      className="w-full px-4.5 py-3.5 rounded-xl text-sm md:text-base text-slate-100 placeholder-slate-500 bg-slate-950/70 border transition-all duration-200 outline-none"
                      style={{
                        borderColor: errors.subject
                          ? 'rgba(244, 63, 94, 0.8)'
                          : 'var(--color-border-subtle)',
                        boxShadow: errors.subject
                          ? '0 0 12px rgba(244, 63, 94, 0.15)'
                          : 'none',
                      }}
                      onFocus={(e) => {
                        if (!errors.subject) {
                          e.target.style.borderColor = 'rgba(56, 189, 248, 0.6)'
                          e.target.style.boxShadow = '0 0 16px rgba(56, 189, 248, 0.15)'
                          e.target.style.backgroundColor = 'rgba(13, 17, 23, 0.95)'
                        }
                      }}
                      onBlur={(e) => {
                        if (!errors.subject) {
                          e.target.style.borderColor = 'var(--color-border-subtle)'
                          e.target.style.boxShadow = 'none'
                          e.target.style.backgroundColor = 'rgba(13, 17, 23, 0.7)'
                        }
                      }}
                    />

                    {errors.subject && (
                      <div
                        id="contact-subject-error"
                        role="alert"
                        className="flex items-center gap-1.5 mt-2 text-xs text-rose-400"
                      >
                        <AlertCircle size={13} className="shrink-0" />
                        <span>{errors.subject}</span>
                      </div>
                    )}
                  </div>

                  {/* FIELD 4: DETAILED QUERY */}
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="contact-message"
                        className="font-mono text-xs tracking-wider font-semibold uppercase"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        DETAILED QUERY <span className="text-cyan-400">*</span>
                      </label>
                      <span
                        className="font-mono text-[11px]"
                        style={{
                          color:
                            formData.message.length > 4500
                              ? '#f43f5e'
                              : 'var(--color-text-tertiary)',
                        }}
                      >
                        {formData.message.length} / 5,000
                      </span>
                    </div>

                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe what you want to build, the technical scope, timeline, stack, or questions in detail..."
                      aria-required="true"
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                      className="w-full px-4.5 py-3.5 rounded-xl text-sm md:text-base text-slate-100 placeholder-slate-500 bg-slate-950/70 border transition-all duration-200 outline-none leading-relaxed resize-y"
                      style={{
                        minHeight: '160px',
                        borderColor: errors.message
                          ? 'rgba(244, 63, 94, 0.8)'
                          : 'var(--color-border-subtle)',
                        boxShadow: errors.message
                          ? '0 0 12px rgba(244, 63, 94, 0.15)'
                          : 'none',
                      }}
                      onFocus={(e) => {
                        if (!errors.message) {
                          e.target.style.borderColor = 'rgba(56, 189, 248, 0.6)'
                          e.target.style.boxShadow = '0 0 16px rgba(56, 189, 248, 0.15)'
                          e.target.style.backgroundColor = 'rgba(13, 17, 23, 0.95)'
                        }
                      }}
                      onBlur={(e) => {
                        if (!errors.message) {
                          e.target.style.borderColor = 'var(--color-border-subtle)'
                          e.target.style.boxShadow = 'none'
                          e.target.style.backgroundColor = 'rgba(13, 17, 23, 0.7)'
                        }
                      }}
                    />

                    {errors.message && (
                      <div
                        id="contact-message-error"
                        role="alert"
                        className="flex items-center gap-1.5 mt-2 text-xs text-rose-400"
                      >
                        <AlertCircle size={13} className="shrink-0" />
                        <span>{errors.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Server error feedback if any */}
                  {status === 'error' && (
                    <div
                      role="alert"
                      className="p-4 rounded-xl flex items-start gap-3 text-xs md:text-sm"
                      style={{
                        background: 'rgba(244, 63, 94, 0.1)',
                        border: '1px solid rgba(244, 63, 94, 0.3)',
                        color: '#fca5a5',
                      }}
                    >
                      <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-semibold block mb-0.5">Submission Notice</span>
                        <span>{serverFeedback || 'Something went wrong. Please try again.'}</span>
                      </div>
                    </div>
                  )}

                  {/* Submission CTA Button */}
                  <div className="pt-2">
                    <MagneticButton
                      as="button"
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase text-white transition-all cursor-pointer group shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #0284c7 100%)',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        boxShadow: '0 8px 24px -4px rgba(37, 99, 235, 0.4), 0 0 16px rgba(56, 189, 248, 0.2)',
                        opacity: status === 'submitting' ? 0.75 : 1,
                        cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                      }}
                      data-cursor="grow"
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-white" />
                          <span>SENDING INQUIRY...</span>
                        </>
                      ) : (
                        <>
                          <span>SEND MESSAGE</span>
                          <Send
                            size={15}
                            className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                          />
                        </>
                      )}
                    </MagneticButton>
                  </div>
                </form>
              )}
            </PointerCard>
          </div>
        </div>
      </div>
    </section>
  )
}
