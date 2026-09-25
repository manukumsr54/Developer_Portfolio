import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * HeroEnvironment — Background depth layers and subtle environmental details.
 *
 * Layers:
 *   1. Deep radial illumination (large soft blue glow)
 *   2. Secondary depth gradients / orbital forms
 *   3. Very subtle grid/noise texture
 *   4. Sparse environmental particles (tiny distant points of light)
 *   5. Faint orbital ring fragments around portrait area
 *
 * All via CSS + one lightweight Canvas for particles.
 * No Three.js needed.
 */
export default function HeroEnvironment() {
  const canvasRef = useRef(null)
  const prefersReduced = useReducedMotion()
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    if (prefersReduced) return

    const handler = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [prefersReduced])

  // Sparse atmospheric particles canvas (flowing LEFT → RIGHT)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let rafId
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Reduced motion fallback: render a few subtle static points without animation loop
    if (prefersReduced) {
      const w = canvas.width
      const h = canvas.height
      const staticPoints = [
        { x: 0.16, y: 0.28, size: 0.8, alpha: 0.22 },
        { x: 0.28, y: 0.68, size: 1.0, alpha: 0.28 },
        { x: 0.44, y: 0.22, size: 0.7, alpha: 0.18 },
        { x: 0.58, y: 0.78, size: 1.1, alpha: 0.32 },
        { x: 0.74, y: 0.36, size: 0.9, alpha: 0.24 },
        { x: 0.86, y: 0.62, size: 1.0, alpha: 0.26 },
      ]
      ctx.clearRect(0, 0, w, h)
      for (const pt of staticPoints) {
        ctx.beginPath()
        ctx.arc(pt.x * w, pt.y * h, pt.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${pt.alpha})`
        ctx.fill()
      }
      return () => window.removeEventListener('resize', resize)
    }

    const isMobile = window.innerWidth < 768
    const particleCount = isMobile ? 15 : 26

    // Depth tier configurations for subtle atmospheric variation
    // conceptual layers: far (faint, tiny, slower) → mid → near (still small, slightly brighter, slightly faster)
    const tiers = [
      {
        minSize: 0.6,
        maxSize: 0.9,
        minOpacity: 0.15,
        maxOpacity: 0.26,
        minSpeed: 0.00035,
        maxSpeed: 0.00055,
        waveAmp: 3.5,
        waveSpeed: 0.003,
        depth: 0.25,
      },
      {
        minSize: 0.9,
        maxSize: 1.25,
        minOpacity: 0.25,
        maxOpacity: 0.42,
        minSpeed: 0.00065,
        maxSpeed: 0.00095,
        waveAmp: 5.5,
        waveSpeed: 0.0045,
        depth: 0.55,
      },
      {
        minSize: 1.25,
        maxSize: 1.6,
        minOpacity: 0.38,
        maxOpacity: 0.58,
        minSpeed: 0.00105,
        maxSpeed: 0.00135,
        waveAmp: 7.0,
        waveSpeed: 0.006,
        depth: 0.85,
      },
    ]

    // Palettes: white, off-white, very pale blue-white
    const colorOptions = [
      '255, 255, 255', // Pure soft white
      '248, 250, 252', // Slate white
      '240, 249, 255', // Pale sky white
      '224, 242, 254', // Pale cyan-white
    ]

    // Sparse, random, organic particles embedded into flowing haze
    const particles = Array.from({ length: particleCount }, (_, idx) => {
      // Balanced distribution: ~35% far, 40% mid, 25% near
      const tierIndex = idx < particleCount * 0.35 ? 0 : idx < particleCount * 0.75 ? 1 : 2
      const t = tiers[tierIndex]

      return {
        x: Math.random() * 1.1 - 0.05,
        y: 0.08 + Math.random() * 0.84,
        size: t.minSize + Math.random() * (t.maxSize - t.minSize),
        baseOpacity: t.minOpacity + Math.random() * (t.maxOpacity - t.minOpacity),
        speedX: t.minSpeed + Math.random() * (t.maxSpeed - t.minSpeed),
        waveAmp: t.waveAmp + Math.random() * 2,
        waveSpeed: t.waveSpeed + Math.random() * 0.002,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.004 + Math.random() * 0.008,
        depth: t.depth,
        colorRgb: colorOptions[Math.floor(Math.random() * colorOptions.length)],
      }
    })

    // Orbital ring fragments (3–4 faint arcs near center)
    const orbitals = Array.from({ length: 4 }, (_, i) => ({
      radius: 120 + i * 35 + Math.random() * 20,
      startAngle: Math.random() * Math.PI * 2,
      arcLength: 0.3 + Math.random() * 0.5,
      rotationSpeed: (0.0002 + Math.random() * 0.0003) * (i % 2 === 0 ? 1 : -1),
      opacity: 0.04 + Math.random() * 0.06,
      width: 0.5 + Math.random() * 0.5,
    }))

    const animate = () => {
      const w = canvas.width
      const h = canvas.height

      ctx.clearRect(0, 0, w, h)
      time += 1

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Draw subtle flowing particles (LEFT → RIGHT)
      for (const p of particles) {
        // Continuous, genuine left-to-right drift matching atmospheric haze
        p.x += p.speedX

        // Seamless wrap to offscreen left once past right viewport
        if (p.x > 1.05) {
          p.x = -0.05
          p.y = 0.08 + Math.random() * 0.84
        }

        const parallaxX = (mx - 0.5) * p.depth * 0.02
        const parallaxY = (my - 0.5) * p.depth * 0.02

        const px = (p.x + parallaxX) * w
        const py = (p.y + parallaxY) * h + Math.sin(time * p.waveSpeed + p.phase) * p.waveAmp
        const alpha = p.baseOpacity * (0.80 + 0.20 * Math.sin(time * p.pulseSpeed + p.phase))

        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.colorRgb}, ${alpha})`
        ctx.fill()
      }

      // Draw orbital ring fragments around center
      const centerX = w / 2 + (mx - 0.5) * 15
      const centerY = h / 2 + (my - 0.5) * 10

      for (const orb of orbitals) {
        orb.startAngle += orb.rotationSpeed

        ctx.beginPath()
        ctx.arc(centerX, centerY, orb.radius, orb.startAngle, orb.startAngle + orb.arcLength)
        ctx.strokeStyle = `rgba(96, 165, 250, ${orb.opacity})`
        ctx.lineWidth = orb.width
        ctx.stroke()
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [prefersReduced])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Layer 1: Large soft blue radial illumination */}
      <div
        className="absolute"
        style={{
          width: '130%',
          height: '130%',
          top: '-15%',
          left: '-15%',
          background: `
            radial-gradient(ellipse at 35% 45%, rgba(59,130,246,0.07) 0%, transparent 50%),
            radial-gradient(ellipse at 65% 55%, rgba(34,211,238,0.04) 0%, transparent 45%),
            radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.025) 0%, transparent 40%)
          `,
        }}
      />

      {/* Layer 2: Secondary orbital depth gradients */}
      <div
        className="absolute"
        style={{
          width: '80%',
          height: '80%',
          top: '10%',
          left: '10%',
          background: `
            radial-gradient(ellipse at 45% 40%, rgba(59,130,246,0.04) 0%, transparent 55%),
            radial-gradient(ellipse at 55% 60%, rgba(34,211,238,0.02) 0%, transparent 45%)
          `,
          filter: 'blur(40px)',
        }}
      />

      {/* Layer 3: Extremely subtle grid texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)',
        }}
      />

      {/* Layer 4 & 5: Particles + orbital fragments (Canvas) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
