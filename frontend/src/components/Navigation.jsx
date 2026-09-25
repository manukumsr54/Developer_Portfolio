import { useState, useEffect, useCallback, useMemo } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { navItems } from '../data/navigation'
import { useActiveSection } from '../hooks/useActiveSection'

/**
 * Premium floating navigation.
 * Desktop: glass sticky bar with active section indicator.
 * Mobile: full-screen overlay menu.
 */
export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const sectionIds = useMemo(() => navItems.map((item) => item.id), [])
  const activeSection = useActiveSection(sectionIds)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleNavClick = useCallback((e, href) => {
    e.preventDefault()
    setMobileOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[var(--z-sticky)] transition-all ${scrolled
          ? 'py-3'
          : 'py-5'
          }`}
        style={{
          height: 'var(--nav-height)',
          background: scrolled ? 'var(--color-glass-bg-strong)' : 'transparent',
          backdropFilter: scrolled ? 'blur(var(--blur-md))' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(var(--blur-md))' : 'none',
          borderBottom: scrolled ? '1px solid var(--color-glass-border)' : '1px solid transparent',
          transitionDuration: 'var(--duration-normal)',
          transitionTimingFunction: 'var(--ease-out-quart)',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div
          className="flex items-center justify-between h-full"
          style={{
            maxWidth: 'var(--section-max-width)',
            margin: '0 auto',
            padding: '0 var(--section-padding-x)',
          }}
        >
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="relative group inline-flex items-center"
            aria-label="Scroll to top"
          >
            <span
              className="text-label"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--weight-semibold)',
                letterSpacing: 'var(--tracking-wider)',
                color: 'var(--color-text-primary)',
              }}
            >
              MANU
            </span>
            <span
              className="ml-1"
              style={{
                color: 'var(--color-accent-blue)',
                fontWeight: 'var(--weight-bold)',
              }}
            >
              /
            </span>
            <span
              className="ml-1.5 font-mono text-[11px] sm:text-xs transition-all duration-300 group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.45)]"
              style={{
                color: 'var(--color-accent-cyan)',
                opacity: 0.85,
                letterSpacing: '0.04em',
                fontWeight: 'var(--weight-medium)',
              }}
              aria-hidden="true"
            >
              &lt;&gt;
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="relative group py-1"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--weight-medium)',
                  color: activeSection === item.id
                    ? 'var(--color-text-primary)'
                    : 'var(--color-text-secondary)',
                  transition: `color var(--duration-fast) var(--ease-out-quart)`,
                }}
              >
                {item.label}
                {/* Active indicator */}
                <span
                  className="absolute -bottom-1 left-0 h-px transition-all"
                  style={{
                    width: activeSection === item.id ? '100%' : '0%',
                    background: 'var(--gradient-blue-cyan)',
                    transitionDuration: 'var(--duration-normal)',
                    transitionTimingFunction: 'var(--ease-out-expo)',
                  }}
                />
              </a>
            ))}

            {/* CTA */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full transition-all group"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--weight-medium)',
                background: 'var(--color-accent-blue)',
                color: '#fff',
                borderRadius: 'var(--radius-full)',
                transitionDuration: 'var(--duration-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-accent-blue-bright)'
                e.currentTarget.style.boxShadow = 'var(--shadow-glow-blue)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-accent-blue)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Let's Build
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden relative z-50 p-2 rounded-lg"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            style={{
              color: 'var(--color-text-primary)',
              background: 'transparent',
              border: 'none',
            }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center transition-all ${mobileOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
          }`}
        style={{
          background: 'var(--color-bg-primary)',
          transitionDuration: 'var(--duration-slow)',
          transitionTimingFunction: 'var(--ease-out-expo)',
        }}
      >
        <div className="flex flex-col items-center gap-8">
          {navItems.map((item, i) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-heading-3 transition-all"
              style={{
                color: activeSection === item.id
                  ? 'var(--color-text-primary)'
                  : 'var(--color-text-secondary)',
                transform: mobileOpen
                  ? 'translateY(0)'
                  : `translateY(${20 + i * 10}px)`,
                opacity: mobileOpen ? 1 : 0,
                transitionDelay: mobileOpen ? `${i * 60}ms` : '0ms',
                transitionDuration: 'var(--duration-slow)',
                transitionTimingFunction: 'var(--ease-out-expo)',
              }}
            >
              <span className="text-micro mr-3" style={{ color: 'var(--color-accent-blue)' }}>
                {item.number}
              </span>
              {item.label}
            </a>
          ))}

          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="mt-4 flex items-center gap-2 px-6 py-3 rounded-full"
            style={{
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--weight-medium)',
              background: 'var(--color-accent-blue)',
              color: '#fff',
              borderRadius: 'var(--radius-full)',
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: mobileOpen ? `${navItems.length * 60}ms` : '0ms',
              transitionDuration: 'var(--duration-slow)',
              transitionTimingFunction: 'var(--ease-out-expo)',
            }}
          >
            Let's Build
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </>
  )
}
