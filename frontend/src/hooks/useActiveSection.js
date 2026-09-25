import { useEffect, useState } from 'react'

/**
 * Tracks the currently active section based on scroll position.
 * Uses IntersectionObserver for performance.
 * 
 * @param {string[]} sectionIds - Array of section IDs to observe
 * @returns {string} - The ID of the currently active section
 */
export function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const observers = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        },
        {
          rootMargin: '-20% 0px -60% 0px',
          threshold: 0,
        }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [sectionIds])

  return activeSection
}
