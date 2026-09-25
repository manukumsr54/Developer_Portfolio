import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * Custom cursor / lens system for desktop.
 * 
 * - Soft circular glow that follows the mouse
 * - Grows on hoverable elements
 * - Disappears on touch devices / reduced motion
 */
export default function CustomCursor() {
  const cursorRef = useRef(null)
  const dotRef = useRef(null)
  const prefersReduced = useReducedMotion()
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true)
      return
    }

    document.body.classList.add('custom-cursor-active')

    let mouseX = 0
    let mouseY = 0
    let cursorX = 0
    let cursorY = 0
    let rafId

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!isVisible) setIsVisible(true)
    }

    const onMouseEnter = () => setIsVisible(true)
    const onMouseLeave = () => setIsVisible(false)

    // Detect hoverable elements
    const onMouseOver = (e) => {
      const target = e.target.closest('a, button, [role="button"], [data-cursor="grow"]')
      setIsHovering(!!target)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseover', onMouseOver, { passive: true })

    // Smooth follow animation
    const lerp = (start, end, factor) => start + (end - start) * factor

    const animate = () => {
      cursorX = lerp(cursorX, mouseX, 0.15)
      cursorY = lerp(cursorY, mouseY, 0.15)

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      document.body.classList.remove('custom-cursor-active')
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseover', onMouseOver)
      cancelAnimationFrame(rafId)
    }
  }, [isVisible])

  // Don't render on touch devices or reduced motion
  if (isTouch || prefersReduced) return null

  return (
    <>
      {/* Outer glow ring */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? '56px' : '36px',
          height: isHovering ? '56px' : '36px',
          borderRadius: '50%',
          border: `1px solid ${isHovering ? 'var(--color-accent-blue)' : 'rgba(255,255,255,0.15)'}`,
          background: isHovering
            ? 'radial-gradient(circle, rgba(59,130,246,0.08), transparent 70%)'
            : 'transparent',
          pointerEvents: 'none',
          zIndex: 'var(--z-cursor)',
          opacity: isVisible ? 1 : 0,
          transition: `width var(--duration-normal) var(--ease-out-expo),
                       height var(--duration-normal) var(--ease-out-expo),
                       border-color var(--duration-fast) ease,
                       background var(--duration-fast) ease,
                       opacity var(--duration-fast) ease`,
          willChange: 'transform',
        }}
      />

      {/* Inner dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: 'var(--color-accent-blue-bright)',
          pointerEvents: 'none',
          zIndex: 'var(--z-cursor)',
          opacity: isVisible ? 1 : 0,
          transition: `opacity var(--duration-fast) ease`,
          willChange: 'transform',
        }}
      />
    </>
  )
}
