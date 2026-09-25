import { useEffect, useRef, useCallback } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * Atmospheric Haze — Signature visual motif.
 *
 * Multi-layered procedural volumetric blue-cyan haze & water-like currents
 * steadily flowing LEFT → RIGHT across the dark space environment.
 *
 * Characteristics:
 * - Genuine spatial translation from left to right across distinct depth tiers
 * - Asynchronous parallax velocities (back = slow, mid = medium, front = faster)
 * - Volumetric multi-stop radial feathering (soft luminous bodies, no hard edges, no smoke)
 * - Seamless wrapping with zero visual snapping or reset jumps
 * - Spatial composition tailored for 'hero' (atmospheric envelope) or 'connect' (closing bookend)
 * - High performance: lightweight 2D canvas, GPU-friendly, throttled DPR
 * - Full reduced-motion fallback (static atmospheric gradient)
 */
export default function AtmosphericHaze({
  intensity = 0.6,
  speed = 1,
  layers = 3,
  variant = 'hero', // 'hero' | 'connect'
  interactive = false,
  className = '',
  style = {},
}) {
  const canvasRef = useRef(null)
  const prefersReduced = useReducedMotion()
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  // Pointer tracking for desktop interactivity
  const handlePointerMove = useCallback((e) => {
    if (!interactive) return
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    }
  }, [interactive])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || prefersReduced) return

    const ctx = canvas.getContext('2d')
    let rafId
    let time = 0

    // Throttled DPR for high-efficiency rendering
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.max(rect.width * dpr, 300)
      canvas.height = Math.max(rect.height * dpr, 200)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    if (interactive) {
      window.addEventListener('mousemove', handlePointerMove, { passive: true })
    }

    const isMobile = window.innerWidth < 768
    const effectiveLayers = isMobile ? Math.min(layers, 2) : layers
    const blobs = []

    /**
     * Parallax Speed Tiers (Normalized Screen Width per Frame @ 60fps)
     * Values calibrated so left-to-right spatial translation is clearly noticeable
     * within 2-3s of observation, while remaining serene, cinematic, and calm.
     */
    const speedTiers = [
      { min: 0.00075, max: 0.00115 }, // Layer 0 (Back): deep expansive drift (~50–80 px/s on 1440px)
      { min: 0.00135, max: 0.00195 }, // Layer 1 (Mid): volumetric body (~100–145 px/s)
      { min: 0.00220, max: 0.00295 }, // Layer 2 (Front): luminous ethereal wisps (~160–220 px/s)
    ]

    for (let layer = 0; layer < effectiveLayers; layer++) {
      const layerDepth = layer / Math.max(effectiveLayers - 1, 1) // 0 = back, 1 = front
      const tier = speedTiers[Math.min(layer, speedTiers.length - 1)]
      const count = isMobile ? (layer === 0 ? 2 : 2) : (layer === 0 ? 3 : layer === 1 ? 4 : 4)

      for (let i = 0; i < count; i++) {
        // Distribute initial X across the screen width including offscreen left and right
        const initialX = -0.3 + (i / count) * 1.6 + (Math.random() - 0.5) * 0.18

        // Spatial Y positioning tailored to variant
        let baseYRatio
        if (variant === 'connect') {
          // In Connect, frame the content: upper-left diagonal & lower-right diagonal
          // preserving negative space behind the central form inputs
          if (i % 2 === 0) {
            baseYRatio = 0.14 + (i / count) * 0.32 // Upper flow (behind headings)
          } else {
            baseYRatio = 0.62 + (i / count) * 0.28 // Lower flow (framing footer / base)
          }
        } else {
          // In Hero: distributed naturally across vertical atmospheric envelope
          baseYRatio = 0.12 + (i / count) * 0.72 + (Math.random() - 0.5) * 0.12
        }

        // Varied dimensions per layer for volumetric depth
        const radiusX =
          layer === 0
            ? 340 + Math.random() * 200 // Expansive back clouds
            : layer === 1
            ? 240 + Math.random() * 160 // Structured mid body
            : 160 + Math.random() * 120 // Ethereal front wisps

        const radiusY =
          layer === 0
            ? 180 + Math.random() * 110
            : layer === 1
            ? 120 + Math.random() * 80
            : 85 + Math.random() * 60

        // Calibrated color palettes: deep ocean blue → celestial cyan
        const hue =
          layer === 0
            ? 214 + Math.random() * 10 // Deep atmospheric indigo-blue (214–224)
            : layer === 1
            ? 204 + Math.random() * 12 // Electric blue to cyan-blue (204–216)
            : 196 + Math.random() * 12 // Luminous sky cyan (196–208)

        const saturation = 70 + Math.random() * 22
        const lightness =
          layer === 0
            ? 38 + Math.random() * 8
            : layer === 1
            ? 46 + Math.random() * 8
            : 54 + Math.random() * 10

        // Opacity tuning per layer
        const baseOpacity =
          layer === 0
            ? 0.055 + Math.random() * 0.035
            : layer === 1
            ? 0.075 + Math.random() * 0.045
            : 0.065 + Math.random() * 0.040

        blobs.push({
          x: initialX,
          y: baseYRatio,
          baseYRatio,
          speedX: (tier.min + Math.random() * (tier.max - tier.min)) * speed,
          phaseY: Math.random() * Math.PI * 2,
          driftY: 14 + Math.random() * 18, // gentle vertical swell
          radiusX,
          radiusY,
          opacity: baseOpacity * intensity * (variant === 'connect' ? 1.15 : 1.0),
          hue,
          saturation,
          lightness,
          layer,
          layerDepth,
          pointerInfluence: layerDepth * 0.022,
        })
      }
    }

    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height

      ctx.clearRect(0, 0, w, h)
      time += 1

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      for (const blob of blobs) {
        // Continuous, genuine LEFT → RIGHT spatial translation
        blob.x += blob.speedX

        // Seamless wrap: once trailing edge is fully past right viewport boundary,
        // loop cleanly to offscreen left so leading edge enters seamlessly with 0 jumps
        const normalizedRadius = (blob.radiusX + 40) / w
        if (blob.x - normalizedRadius > 1.0) {
          blob.x = -normalizedRadius - 0.04 - Math.random() * 0.08
          // Retain vertical baseline lane to prevent clustering
          blob.y = blob.baseYRatio + (Math.random() - 0.5) * 0.08
        }

        // Gentle undulating vertical swell (like soft volumetric water)
        const baseY = blob.y * h + Math.sin(time * 0.0028 + blob.phaseY) * blob.driftY

        // Pointer influence (subtle physical response on desktop)
        const pointerDx = interactive ? (mx - 0.5) * w * blob.pointerInfluence : 0
        const pointerDy = interactive ? (my - 0.5) * h * blob.pointerInfluence * 0.5 : 0

        const cx = blob.x * w + pointerDx
        const cy = baseY + pointerDy

        // Multi-stop volumetric radial gradient for soft, luminous body without hard edges
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, blob.radiusX)
        gradient.addColorStop(0, `hsla(${blob.hue}, ${blob.saturation}%, ${blob.lightness}%, ${blob.opacity})`)
        gradient.addColorStop(
          0.3,
          `hsla(${blob.hue}, ${blob.saturation - 4}%, ${blob.lightness - 2}%, ${blob.opacity * 0.72})`
        )
        gradient.addColorStop(
          0.6,
          `hsla(${blob.hue}, ${blob.saturation - 12}%, ${blob.lightness - 6}%, ${blob.opacity * 0.28})`
        )
        gradient.addColorStop(
          0.85,
          `hsla(${blob.hue}, ${blob.saturation - 18}%, ${blob.lightness - 10}%, ${blob.opacity * 0.06})`
        )
        gradient.addColorStop(1, `hsla(${blob.hue}, ${blob.saturation - 20}%, ${blob.lightness - 12}%, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.ellipse(cx, cy, blob.radiusX, blob.radiusY, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      if (interactive) {
        window.removeEventListener('mousemove', handlePointerMove)
      }
    }
  }, [prefersReduced, intensity, speed, layers, variant, interactive, handlePointerMove])

  // Reduced motion accessible fallback
  if (prefersReduced) {
    return (
      <div
        className={`absolute inset-0 pointer-events-none ${className}`}
        style={{
          background: `
            radial-gradient(ellipse at 25% 45%, rgba(59,130,246,${intensity * 0.10}), transparent 55%),
            radial-gradient(ellipse at 60% 55%, rgba(34,211,238,${intensity * 0.05}), transparent 50%)
          `,
          zIndex: 0,
          ...style,
        }}
        aria-hidden="true"
      />
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        width: '100%',
        height: '100%',
        zIndex: 0,
        ...style,
      }}
      aria-hidden="true"
    />
  )
}
