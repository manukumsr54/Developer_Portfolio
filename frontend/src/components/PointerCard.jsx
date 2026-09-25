import { useRef, useCallback, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * PointerCard — Premium interactive surface with localized cursor lighting.
 *
 * Features:
 * - Local radial spotlight following pointer within component bounds
 * - Subtle border illumination on hover and focus
 * - Controlled depth elevation
 * - Zero React re-renders on mousemove (direct CSS variable updates)
 * - Accessible keyboard focus indicators
 * - Reduced-motion friendly
 */
export default function PointerCard({
  children,
  className = '',
  style = {},
  glowColor = 'rgba(59, 130, 246, 0.16)',
  borderColor = 'rgba(59, 130, 246, 0.22)',
  active = false,
  dimmed = false,
  onClick,
  onFocus,
  onBlur,
  as: Component = 'div',
  ...rest
}) {
  const cardRef = useRef(null)
  const prefersReduced = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e) => {
    if (prefersReduced || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cardRef.current.style.setProperty('--mouse-x', `${x}px`)
    cardRef.current.style.setProperty('--mouse-y', `${y}px`)
  }, [prefersReduced])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  return (
    <Component
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${className}`}
      style={{
        background: 'var(--color-bg-elevated)',
        border: `1px solid ${active ? borderColor : isHovered ? borderColor : 'var(--color-border-subtle)'}`,
        boxShadow: active
          ? `0 12px 32px -8px rgba(0, 0, 0, 0.5), 0 0 24px ${glowColor}`
          : isHovered
          ? `0 12px 28px -6px rgba(0, 0, 0, 0.4), 0 0 20px ${glowColor}`
          : 'var(--shadow-card)',
        transform: active
          ? 'translateY(-3px)'
          : isHovered && !prefersReduced
          ? 'translateY(-2px)'
          : 'translateY(0)',
        opacity: dimmed ? 0.45 : 1,
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease, opacity 0.25s ease',
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      {...rest}
    >
      {/* Local pointer spotlight (travels only within this card) */}
      {!prefersReduced && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered || active ? 1 : 0,
            background: `radial-gradient(320px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 70%)`,
            zIndex: 1,
          }}
          aria-hidden="true"
        />
      )}

      {/* Subtle top edge specular highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08) 50%, transparent)',
          zIndex: 2,
        }}
        aria-hidden="true"
      />

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </Component>
  )
}
