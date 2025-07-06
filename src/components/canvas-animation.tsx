"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

export function CanvasAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      canvas.style.width = rect.width + "px"
      canvas.style.height = rect.height + "px"
    }

    const createParticles = () => {
      const particles: Particle[] = []
      const particleCount = 50

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.2,
        })
      }
      particlesRef.current = particles
    }

    const drawGeometricShapes = () => {
      const time = Date.now() * 0.001

      // Draw floating rectangles
      for (let i = 0; i < 8; i++) {
        ctx.save()
        ctx.globalAlpha = 0.1
        ctx.fillStyle = "white"

        const x = Math.sin(time * 0.5 + i) * 100 + canvas.offsetWidth / 2
        const y = Math.cos(time * 0.3 + i) * 80 + canvas.offsetHeight / 2
        const rotation = time * 0.2 + i

        ctx.translate(x, y)
        ctx.rotate(rotation)
        ctx.fillRect(-20, -20, 40, 40)
        ctx.restore()
      }

      // Draw connecting lines
      ctx.strokeStyle = "white"
      ctx.globalAlpha = 0.15
      ctx.lineWidth = 1

      for (let i = 0; i < 5; i++) {
        const startX = Math.sin(time * 0.4 + i) * 150 + canvas.offsetWidth / 2
        const startY = Math.cos(time * 0.4 + i) * 100 + canvas.offsetHeight / 2
        const endX = Math.sin(time * 0.6 + i + 1) * 150 + canvas.offsetWidth / 2
        const endY = Math.cos(time * 0.6 + i + 1) * 100 + canvas.offsetHeight / 2

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Draw particles
      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.offsetWidth) particle.vx *= -1
        if (particle.y <= 0 || particle.y >= canvas.offsetHeight) particle.vy *= -1

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.offsetWidth, particle.x))
        particle.y = Math.max(0, Math.min(canvas.offsetHeight, particle.y))

        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = "white"
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Draw geometric shapes
      drawGeometricShapes()

      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    createParticles()
    animate()

    const handleResize = () => {
      resizeCanvas()
      createParticles()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ background: "black" }} />
}