'use client'

import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { useScroll, type MotionValue } from 'framer-motion'
import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'

type Body = 'moon' | 'mars'

type Pointer = { current: { x: number; y: number } }

/**
 * ThreeUI-style orbit system: a pair of thin orbital rings with luminous data
 * nodes. The active chapter's node burns brighter, so the story and the scene
 * stay in sync.
 */
function OrbitRings({
  progress,
  active,
  still
}: {
  progress: MotionValue<number>
  active: number
  still: boolean
}) {
  const ringA = useRef<THREE.Group>(null)
  const ringB = useRef<THREE.Group>(null)
  const nodesA = useRef<Array<THREE.Mesh | null>>([])
  const nodesB = useRef<Array<THREE.Mesh | null>>([])

  useFrame((state, delta) => {
    const p = progress.get()
    const t = still ? 0.6 : state.clock.elapsedTime

    if (ringA.current) {
      ringA.current.rotation.z = p * Math.PI * 0.9 + t * 0.02
    }
    if (ringB.current) {
      ringB.current.rotation.z = -p * Math.PI * 1.2 - t * 0.014
    }

    nodesA.current.forEach((node, i) => {
      if (!node) return
      const angle = t * 0.18 + (i * Math.PI * 2) / 5
      node.position.set(Math.cos(angle) * 1.24, Math.sin(angle) * 1.24, 0)
      const target = i === active ? 1.15 + Math.sin(t * 2.6) * 0.25 : 0.55
      node.scale.setScalar(THREE.MathUtils.damp(node.scale.x, target, 6, delta))
    })

    nodesB.current.forEach((node, i) => {
      if (!node) return
      const angle = -t * 0.12 + i * Math.PI + 0.8
      node.position.set(Math.cos(angle) * 1.4, Math.sin(angle) * 1.4, 0)
    })
  })

  return (
    <group>
      <group ref={ringA} rotation={[1.15, 0.22, 0.12]}>
        <mesh>
          <torusGeometry args={[1.24, 0.0022, 6, 220]} />
          <meshBasicMaterial color="#6ee7f9" transparent opacity={0.34} depthWrite={false} />
        </mesh>

        {Array.from({ length: 5 }).map((_, i) => (
          <mesh
            key={`a-${i}`}
            ref={(el) => {
              nodesA.current[i] = el
            }}
          >
            <sphereGeometry args={[0.013, 10, 10]} />
            <meshBasicMaterial
              color={i === active ? '#f5b544' : '#bdeaf5'}
              transparent
              opacity={i === active ? 1 : 0.58}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      <group ref={ringB} rotation={[-1.02, 0.55, -0.35]}>
        <mesh>
          <torusGeometry args={[1.4, 0.0016, 6, 220]} />
          <meshBasicMaterial color="#f5b544" transparent opacity={0.18} depthWrite={false} />
        </mesh>

        {[0, 1].map((i) => (
          <mesh
            key={`b-${i}`}
            ref={(el) => {
              nodesB.current[i] = el
            }}
          >
            <sphereGeometry args={[0.009, 8, 8]} />
            <meshBasicMaterial color="#f5b544" transparent opacity={0.5} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function Globe({
  progress,
  body,
  side,
  still,
  active,
  pointer
}: {
  progress: MotionValue<number>
  body: Body
  side: 'left' | 'right'
  still: boolean
  active: number
  pointer: Pointer
}) {
  const moonMap = useLoader(THREE.TextureLoader, '/moon-surface.webp')
  const marsMap = useLoader(THREE.TextureLoader, '/mars-surface.webp')

  const root = useRef<THREE.Group>(null)
  const moonRef = useRef<THREE.Mesh>(null)
  const marsRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const mix = useRef(0)

  useEffect(() => {
    for (const map of [moonMap, marsMap]) {
      map.colorSpace = THREE.SRGBColorSpace
      map.anisotropy = 8
      map.needsUpdate = true
    }
  }, [moonMap, marsMap])

  useFrame((state, delta) => {
    const p = progress.get()
    mix.current = THREE.MathUtils.damp(mix.current, body === 'mars' ? 1 : 0, 2.4, delta)

    if (moonRef.current) {
      const material = moonRef.current.material as THREE.MeshStandardMaterial
      material.opacity = 1 - mix.current
      moonRef.current.visible = material.opacity > 0.015
    }

    if (marsRef.current) {
      const material = marsRef.current.material as THREE.MeshStandardMaterial
      material.opacity = mix.current
      marsRef.current.visible = material.opacity > 0.015
    }

    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.17 * mix.current
    }

    if (!root.current) return

    const mobile = state.size.width < 1100
    // Held away from the guide's corner so the planet stays fully visible.
    const targetX = mobile ? -0.16 : side === 'left' ? -1.14 : 1.14
    const targetY = mobile ? 0.3 : 0.5
    const targetScale = mobile ? 0.68 : state.size.width < 1300 ? 0.82 : 0.94
    const targetSpin = p * Math.PI * 3.4
    const bob = still ? 0 : Math.sin(state.clock.elapsedTime * 0.34) * 0.035
    const parallaxX = still ? 0 : pointer.current.x * 0.16
    const parallaxY = still ? 0 : pointer.current.y * 0.09

    root.current.position.x = THREE.MathUtils.damp(root.current.position.x, targetX, 2.6, delta)
    root.current.position.y = THREE.MathUtils.damp(root.current.position.y, targetY + bob, 2.4, delta)
    root.current.position.z = THREE.MathUtils.damp(root.current.position.z, 0, 2, delta)

    const scale = THREE.MathUtils.damp(root.current.scale.x, targetScale, 2.4, delta)
    root.current.scale.setScalar(scale)

    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, targetSpin + parallaxX, 2.2, delta)
    root.current.rotation.x = THREE.MathUtils.damp(
      root.current.rotation.x,
      -0.24 + p * 0.32 + parallaxY,
      2.2,
      delta
    )
    root.current.rotation.z = 0.05
  })

  return (
    <group ref={root}>
      <mesh ref={moonRef}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshStandardMaterial
          map={moonMap}
          roughness={0.96}
          metalness={0.02}
          transparent
          opacity={1}
        />
      </mesh>

      <mesh ref={marsRef} scale={1.0008} visible={false}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshStandardMaterial
          map={marsMap}
          roughness={0.9}
          metalness={0.02}
          transparent
          opacity={0}
        />
      </mesh>

      <mesh ref={glowRef} scale={1.05}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#f0784a"
          transparent
          opacity={0}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <OrbitRings progress={progress} active={active} still={still} />
    </group>
  )
}

export default function LandingScene({
  body,
  side,
  still,
  active
}: {
  body: Body
  side: 'left' | 'right'
  still: boolean
  active: number
}) {
  const { scrollYProgress } = useScroll()
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0, 4.6], fov: 38 }}
      dpr={[1, 1.7]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.16
      }}
    >
      <ambientLight intensity={0.15} />
      <directionalLight position={[4.2, 3.1, 5]} intensity={3.2} color="#fff7ea" />
      <directionalLight position={[-4.5, -1.2, -2.5]} intensity={0.42} color="#3f7fa8" />

      <Stars radius={70} depth={38} count={2200} factor={3.4} fade speed={still ? 0 : 0.12} />

      <Suspense fallback={null}>
        <Globe
          progress={scrollYProgress}
          body={body}
          side={side}
          still={still}
          active={active}
          pointer={pointer}
        />
      </Suspense>
    </Canvas>
  )
}
