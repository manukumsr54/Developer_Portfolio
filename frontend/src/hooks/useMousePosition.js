import { useEffect, useState } from 'react'

/**
 * Tracks mouse position (clientX, clientY) and normalized (0-1) values.
 * Returns { x, y, normalizedX, normalizedY }.
 * 
 * Only active on non-touch devices.
 */
export function useMousePosition() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    normalizedX: 0.5,
    normalizedY: 0.5,
  })

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const handler = (e) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
        normalizedX: e.clientX / window.innerWidth,
        normalizedY: e.clientY / window.innerHeight,
      })
    }

    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return position
}
