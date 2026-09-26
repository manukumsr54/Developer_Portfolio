import { useRef, useCallback, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * Magnetic button — subtly attracted toward the cursor on hover.
 * 
 * Props:
 * - children: button content
 * - className, style: passthrough styling
 * - as: render as 'button' or 'a' (default: 'button')
 * - strength: magnetic pull strength (default: 0.3)
 * - withMicroInteraction: trigger focused accent-light pulse + micro-particles on click
 * - All other props forwarded to the element
 */
export default function MagneticButton({
  children,
  className = '',
  style = {},
  as: Tag = 'button',
  strength = 0.3,
  withMicroInteraction = false,
  onClick,
  ...rest
}) {
  const ref = useRef(null)
  const prefersReduced = useReducedMotion()
  const [pulseData, setPulseData] = useState(null)

  const handleMouseMove = useCallback((e) => {
    if (prefersReduced || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`
  }, [prefersReduced, strength])

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transform = 'translate(0px, 0px)'
    ref.current.style.transition = `transform var(--duration-normal) var(--ease-out-expo)`

    setTimeout(() => {
      if (ref.current) ref.current.style.transition = ''
    }, 300)
  }, [])

  const handleClick = useCallback((e) => {
    if (withMicroInteraction && !prefersReduced && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const clickX = e.clientX ? e.clientX - rect.left : rect.width / 2
      const clickY = e.clientY ? e.clientY - rect.top : rect.height / 2

      // Generate 5-7 micro-particles tightly emerging from the button surface / edge
      const particles = Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
        const dist = 11 + Math.random() * 8 // Very small outward movement (11-19px)
        const dx = Math.cos(angle) * dist
        const dy = Math.sin(angle) * dist * 0.7
        return {
          id: i,
          x: clickX,
          y: clickY,
          dx,
          dy,
          size: 1.2 + Math.random() * 0.8,
          color: i % 2 === 0 ? '#38bdf8' : i % 3 === 0 ? '#ffffff' : '#bae6fd',
        }
      })

      setPulseData({ id: Date.now(), particles })
      setTimeout(() => {
        setPulseData(null)
      }, 420)
    }

    // Ensure button action and navigation happen normally and immediately
    onClick?.(e)
  }, [withMicroInteraction, prefersReduced, onClick])

  return (
    <Tag
      ref={ref}
      className={`relative ${className}`}
      style={{
        willChange: 'transform',
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      data-cursor="grow"
      {...rest}
    >
      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>

      {/* Focused CTA micro-interaction overlays */}
      {withMicroInteraction && pulseData && !prefersReduced && (
        <>
          {/* 1. Accent-light sweep across button surface */}
          <span
            className="absolute inset-0 pointer-events-none overflow-hidden z-0"
            style={{ borderRadius: 'inherit' }}
            aria-hidden="true"
          >
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.35) 45%, rgba(56,189,248,0.5) 50%, rgba(255,255,255,0.35) 55%, transparent 80%)',
                animation: 'ctaLightSweep 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            />
          </span>

          {/* 2. Focused temporary glow flare */}
          <span
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              borderRadius: 'inherit',
              boxShadow: '0 0 28px rgba(56,189,248,0.5), inset 0 0 10px rgba(186,230,253,0.35)',
              animation: 'ctaGlowFlare 0.38s ease-out forwards',
            }}
            aria-hidden="true"
          />

          {/* 3. Edge micro-particles */}
          <span
            className="absolute inset-0 pointer-events-none overflow-visible z-20"
            aria-hidden="true"
          >
            {pulseData.particles.map((p) => (
              <span
                key={p.id}
                style={{
                  position: 'absolute',
                  left: `${p.x}px`,
                  top: `${p.y}px`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  borderRadius: '50%',
                  background: p.color,
                  boxShadow: `0 0 6px ${p.color}`,
                  transform: 'translate(-50%, -50%)',
                  '--dx': `${p.dx}px`,
                  '--dy': `${p.dy}px`,
                  animation: 'ctaParticleOut 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}
              />
            ))}
          </span>
        </>
      )}
    </Tag>
  )
}

