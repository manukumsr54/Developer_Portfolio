import { useRef, useCallback } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * Magnetic button — subtly attracted toward the cursor on hover.
 * 
 * Props:
 * - children: button content
 * - className, style: passthrough styling
 * - as: render as 'button' or 'a' (default: 'button')
 * - strength: magnetic pull strength (default: 0.3)
 * - All other props forwarded to the element
 */
export default function MagneticButton({
  children,
  className = '',
  style = {},
  as: Tag = 'button',
  strength = 0.3,
  ...rest
}) {
  const ref = useRef(null)
  const prefersReduced = useReducedMotion()

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

    // Remove transition after it completes to avoid conflict with mousemove
    setTimeout(() => {
      if (ref.current) ref.current.style.transition = ''
    }, 300)
  }, [])

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        willChange: 'transform',
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="grow"
      {...rest}
    >
      {children}
    </Tag>
  )
}
