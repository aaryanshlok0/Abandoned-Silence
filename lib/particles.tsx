'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

// 1. Warp / Hyperspace Streak Particles during Zoom transitions
export function WarpStreakParticles({ active }: { active: boolean }) {
  const count = 450
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // Cylinder tunnel around z-axis
      const angle = Math.random() * Math.PI * 2
      const radius = 0.8 + Math.random() * 4.5
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.sin(angle) * radius
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18
      spd[i] = 12 + Math.random() * 22
    }
    return [pos, spd]
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array

    const speedMultiplier = active ? 2.8 : 0.15

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 2] += speeds[i] * delta * speedMultiplier
      if (arr[i * 3 + 2] > 10) {
        arr[i * 3 + 2] = -12
      }
    }
    posAttr.needsUpdate = true

    const mat = pointsRef.current.material as THREE.PointsMaterial
    const targetOpacity = active ? 0.85 : 0.12
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1)
    mat.size = active ? 0.08 : 0.035
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#7dd3fc"
        size={0.05}
        transparent
        opacity={0.12}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// 2. Cosmic Ambient Star Dust motes drifting slowly in space
export function CosmicStarDust() {
  const count = 350
  const pointsRef = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22
      pos[i * 3 + 1] = (Math.random() - 0.5) * 22
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22
    }
    return pos
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = clock.elapsedTime * 0.012
    pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.008) * 0.05
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#e0f2fe"
        size={0.035}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// 3. Solar Wind Particles radiating from the Sun
export function SolarWindParticles({ visible }: { visible: boolean }) {
  const count = 280
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, directions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const dir = new Float32Array(count * 3)
    const spd = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = Math.sin(phi)

      const dx = r * Math.cos(theta)
      const dy = (r * Math.sin(theta)) * 0.35 // concentrate near ecliptic plane
      const dz = Math.cos(phi)

      dir[i * 3] = dx
      dir[i * 3 + 1] = dy
      dir[i * 3 + 2] = dz

      const initDist = 0.5 + Math.random() * 7.5
      pos[i * 3] = dx * initDist
      pos[i * 3 + 1] = dy * initDist
      pos[i * 3 + 2] = dz * initDist

      spd[i] = 1.2 + Math.random() * 2.2
    }
    return [pos, dir, spd]
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current || !visible) return
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array

    for (let i = 0; i < count; i++) {
      arr[i * 3] += directions[i * 3] * speeds[i] * delta
      arr[i * 3 + 1] += directions[i * 3 + 1] * speeds[i] * delta
      arr[i * 3 + 2] += directions[i * 3 + 2] * speeds[i] * delta

      const distSq = arr[i * 3] ** 2 + arr[i * 3 + 1] ** 2 + arr[i * 3 + 2] ** 2
      if (distSq > 75) {
        // Reset to sun surface
        arr[i * 3] = directions[i * 3] * 0.55
        arr[i * 3 + 1] = directions[i * 3 + 1] * 0.55
        arr[i * 3 + 2] = directions[i * 3 + 2] * 0.55
      }
    }
    posAttr.needsUpdate = true
  })

  if (!visible) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#fbbf24"
        size={0.045}
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// 4. Martian Atmospheric Sand & Dust particles orbiting Mars
export function MarsAtmosphericDust({ active }: { active: boolean }) {
  const count = 220
  const pointsRef = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = 1.03 + Math.random() * 0.18 // hovering just above surface

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current || !active) return
    pointsRef.current.rotation.y += delta * 0.05
    pointsRef.current.rotation.x += delta * 0.015
  })

  if (!active) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#f97316"
        size={0.022}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
