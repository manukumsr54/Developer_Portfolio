import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Applies a GSAP scroll-triggered animation to the referenced element.
 * 
 * @param {Object} animationProps - GSAP 'from' properties (e.g. { opacity: 0, y: 40 })
 * @param {Object} triggerOptions - ScrollTrigger overrides
 * @returns {React.RefObject} - Attach to the element
 */
export function useScrollAnimation(
  animationProps = { opacity: 0, y: 40 },
  triggerOptions = {}
) {
  const ref = useRef(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced || !ref.current) return

    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        ...animationProps,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
          ...triggerOptions,
        },
      })
    })

    return () => ctx.revert()
  }, [prefersReduced])

  return ref
}
