import { useRef, useEffect, useState, useCallback } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import profileImage from '../assets/profile.jpg'

/**
 * HeroPortrait — Premium interactive profile object.
 *
 * Structure:
 *   outer atmospheric glow (behind)
 *   → luminous ring
 *   → glass/dark circular frame
 *   → profile image (sharp, crisp, unblurred)
 *   → cursor-reactive lighting overlay
 *
 * Props:
 * - imageSrc: URL to profile image (defaults to imported profile.jpg)
 * - size: diameter in px (default 190)
 * - onReady: callback when fully mounted
 */

// === Configuration: centralized profile image source ===
const PROFILE_IMAGE = profileImage

export default function HeroPortrait({ imageSrc = PROFILE_IMAGE, size = 180, onReady }) {
  const containerRef = useRef(null)
  const lightRef = useRef(null)
  const prefersReduced = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const isTouch = useRef(false)

  useEffect(() => {
    isTouch.current = window.matchMedia('(pointer: coarse)').matches
    onReady?.()
  }, [onReady])

  // Cursor-reactive lighting + subtle tilt
  const handleMouseMove = useCallback((e) => {
    if (prefersReduced || isTouch.current || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width   // 0–1
    const y = (e.clientY - rect.top) / rect.height    // 0–1
    const cx = x - 0.5  // -0.5 to 0.5
    const cy = y - 0.5

    // Subtle 3D tilt (max ±6deg)
    const rotateY = cx * 12
    const rotateX = -cy * 12
    containerRef.current.style.transform =
      `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.03 : 1})`

    // Lighting follows cursor
    if (lightRef.current) {
      lightRef.current.style.background =
        `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(96,165,250,0.18), transparent 60%)`
    }
  }, [prefersReduced, isHovered])

  const handleMouseLeave = useCallback(() => {
    if (!containerRef.current) return
    setIsHovered(false)
    containerRef.current.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)'
    containerRef.current.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
    if (lightRef.current) {
      lightRef.current.style.background = 'transparent'
    }
    setTimeout(() => {
      if (containerRef.current) containerRef.current.style.transition = ''
    }, 600)
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    if (containerRef.current) containerRef.current.style.transition = ''
  }, [])

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      data-cursor="grow"
    >
      {/* Outer atmospheric glow (strictly behind) */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: '-35%',
          borderRadius: '50%',
          background: `
            radial-gradient(circle, rgba(59,130,246,${isHovered ? 0.10 : 0.05}) 0%, transparent 65%)
          `,
          transition: 'background 0.8s ease',
          filter: 'blur(20px)',
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Luminous ring */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `conic-gradient(
            from 0deg,
            rgba(59,130,246,${isHovered ? 0.4 : 0.18}),
            rgba(34,211,238,${isHovered ? 0.25 : 0.10}),
            rgba(124,58,237,${isHovered ? 0.18 : 0.06}),
            rgba(59,130,246,${isHovered ? 0.4 : 0.18})
          )`,
          padding: '2px',
          borderRadius: '50%',
          transition: 'all 0.6s ease',
          zIndex: 1,
        }}
        aria-hidden="true"
      >
        {/* Inner mask to create ring effect */}
        <div
          className="w-full h-full rounded-full"
          style={{ background: 'var(--color-bg-primary)' }}
        />
      </div>

      {/* Main portrait container — crisp rasterization */}
      <div
        ref={containerRef}
        className="absolute inset-[3px] rounded-full overflow-hidden"
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid rgba(59, 130, 246, 0.14)',
          boxShadow: `
            0 0 ${isHovered ? 60 : 30}px rgba(59, 130, 246, ${isHovered ? 0.10 : 0.05}),
            inset 0 1px 0 rgba(255,255,255,0.05),
            inset 0 -1px 0 rgba(0,0,0,0.3)
          `,
          zIndex: 2,
          willChange: 'transform',
          transition: 'box-shadow 0.6s ease',
          transform: 'translateZ(0)',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="img"
        aria-label="Manu Kumar — Profile"
      >
        {/* Profile image or placeholder — crisp, sharp, unblurred */}
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Manu Kumar"
            className="w-full h-full object-cover object-top select-none pointer-events-none"
            style={{
              imageRendering: 'auto',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
            }}
          />
        ) : (
          /* Premium placeholder */
          <div
            className="w-full h-full flex items-center justify-center relative"
            style={{
              background: `
                radial-gradient(circle at 40% 35%, rgba(59,130,246,0.08), transparent 60%),
                linear-gradient(160deg, var(--color-bg-elevated) 0%, #0d1117 100%)
              `,
            }}
          >
            {/* Subtle inner texture ring */}
            <div
              className="absolute inset-[15%] rounded-full pointer-events-none"
              style={{
                border: '1px solid rgba(59, 130, 246, 0.06)',
              }}
              aria-hidden="true"
            />

            <span
              style={{
                fontSize: `${size * 0.22}px`,
                fontWeight: 'var(--weight-bold)',
                letterSpacing: 'var(--tracking-wide)',
                background: 'linear-gradient(135deg, var(--color-accent-blue-bright), var(--color-accent-cyan))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: `drop-shadow(0 0 12px rgba(59,130,246,${isHovered ? 0.3 : 0.15}))`,
                transition: 'filter 0.6s ease',
                userSelect: 'none',
              }}
            >
              MK
            </span>
          </div>
        )}

        {/* Cursor-reactive lighting overlay */}
        <div
          ref={lightRef}
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            mixBlendMode: 'soft-light',
            transition: 'background 0.15s ease',
          }}
          aria-hidden="true"
        />

        {/* Top highlight (glass reflection) */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            background: 'linear-gradient(170deg, rgba(255,255,255,0.04) 0%, transparent 40%)',
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
