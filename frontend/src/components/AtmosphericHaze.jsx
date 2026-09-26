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
    const glitterParticles = []

    // Interactive atmospheric click & hold glitter state
    let isPressed = false
    let lastHoldTime = 0
    let pointerCanvas = { x: 0, y: 0 }

    const glitterPalettes = [
      '255, 255, 255', // Pure soft white
      '248, 250, 252', // Slate white
      '224, 242, 254', // Pale cyan-white
      '186, 230, 253', // Soft celestial cyan
      '147, 197, 253', // Subtle electric blue-white
    ]

    const emitGlitter = (originX, originY, count = 8, isHold = false) => {
      for (let i = 0; i < count; i++) {
        if (glitterParticles.length >= 45) {
          glitterParticles.shift()
        }

        const angle = Math.random() * Math.PI * 2
        // Gentle, short-lived outward velocity with a subtle bias rightward (+0.25)
        // to blend organically into the existing left → right atmospheric drift
        const speed = isHold ? (0.25 + Math.random() * 0.45) : (0.35 + Math.random() * 0.75)
        const vx = Math.cos(angle) * speed + 0.25
        const vy = Math.sin(angle) * speed * 0.85

        glitterParticles.push({
          x: originX + (Math.random() - 0.5) * (isHold ? 5 : 3),
          y: originY + (Math.random() - 0.5) * (isHold ? 5 : 3),
          vx,
          vy,
          size: 1.0 + Math.random() * 0.9, // 1–2px
          birth: performance.now(),
          lifetime: isHold ? (520 + Math.random() * 420) : (680 + Math.random() * 520),
          baseAlpha: 0.55 + Math.random() * 0.40,
          color: glitterPalettes[Math.floor(Math.random() * glitterPalettes.length)],
          sparkleBoost: Math.random() > 0.4 ? (0.3 + Math.random() * 0.5) : 0, // A few particles briefly sparkle brighter
          sparkleSpeed: 0.012 + Math.random() * 0.02,
          sparklePhase: Math.random() * Math.PI * 2,
        })
      }
    }

    const handlePointerDown = (e) => {
      if (prefersReduced) return
      if (e.pointerType === 'mouse' && e.button !== 0) return
      if (e.target && e.target.closest) {
        const isInteractive = e.target.closest(
          'button, a, input, textarea, select, nav, [role="button"], [role="img"], [data-cursor="grow"], [data-no-ripple]'
        )
        if (isInteractive) return
      }
      if (window.getSelection && window.getSelection().toString().trim().length > 0) {
        return
      }

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (x < 0 || x > rect.width || y < 0 || y > rect.height) return

      isPressed = true
      pointerCanvas = { x, y }
      lastHoldTime = performance.now()

      // Initial cluster of 6–10 tiny luminous glitter particles directly at interaction point
      emitGlitter(x, y, isMobile ? 6 : 9, false)
    }

    const handlePointerMoveCoords = (e) => {
      if (!isPressed) return
      const rect = canvas.getBoundingClientRect()
      pointerCanvas = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handlePointerUp = () => {
      isPressed = false
    }

    const handlePointerCancel = () => {
      isPressed = false
    }

    const container = canvas.parentElement || canvas
    if (interactive) {
      container.addEventListener('pointerdown', handlePointerDown, { passive: true })
      window.addEventListener('pointermove', handlePointerMoveCoords, { passive: true })
      window.addEventListener('pointerup', handlePointerUp, { passive: true })
      window.addEventListener('pointercancel', handlePointerCancel, { passive: true })
    }

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
      const now = performance.now()

      // Continuous low-frequency glitter emission while pointer/touch is held
      if (isPressed && (now - lastHoldTime) >= 105) {
        emitGlitter(pointerCanvas.x, pointerCanvas.y, Math.random() > 0.4 ? 2 : 1, true)
        lastHoldTime = now
      }

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

      // Update and render interactive atmospheric glitter dust particles
      for (let i = glitterParticles.length - 1; i >= 0; i--) {
        const p = glitterParticles[i]
        const age = now - p.birth
        if (age >= p.lifetime) {
          glitterParticles.splice(i, 1)
          continue
        }

        const progress = age / p.lifetime
        // Gentle friction + left-to-right drift matching atmospheric haze
        p.vx *= 0.985
        p.vy *= 0.985
        p.x += p.vx + 0.18
        p.y += p.vy

        // Quick fade-in, smooth organic fade-out
        const fadeIn = Math.min(progress / 0.15, 1)
        const fadeOut = Math.pow(1 - progress, 1.4)
        const sparkle = 1 + p.sparkleBoost * Math.sin(age * p.sparkleSpeed + p.sparklePhase)
        const alpha = Math.max(0, Math.min(1, p.baseAlpha * fadeIn * fadeOut * sparkle))

        // Delicate luminous core
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`
        ctx.fill()

        // Subtle sparkle aura for selected particles
        if (p.sparkleBoost > 0 && sparkle > 1.25 && alpha > 0.25) {
          const auraRadius = p.size * 2.8
          const auraGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, auraRadius)
          auraGrad.addColorStop(0, `rgba(${p.color}, ${alpha * 0.45})`)
          auraGrad.addColorStop(1, `rgba(${p.color}, 0)`)
          ctx.fillStyle = auraGrad
          ctx.beginPath()
          ctx.arc(p.x, p.y, auraRadius, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      if (interactive) {
        window.removeEventListener('mousemove', handlePointerMove)
        container.removeEventListener('pointerdown', handlePointerDown)
        window.removeEventListener('pointermove', handlePointerMoveCoords)
        window.removeEventListener('pointerup', handlePointerUp)
        window.removeEventListener('pointercancel', handlePointerCancel)
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
