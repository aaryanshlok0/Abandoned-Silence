'use client'

import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

// -------------------------------------------------------------
// Ashima Arts 3D Simplex Noise for dynamic solar plasma convection
// -------------------------------------------------------------
const NOISE_GLSL = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`

// -------------------------------------------------------------
// Photosphere Shaders (Pure Brilliant White Solar Star)
// -------------------------------------------------------------
const sunVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;
  vPosition = position;
  gl_Position = projectionMatrix * mvPosition;
}
`

const sunFragmentShader = /* glsl */ `
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;

${NOISE_GLSL}

void main() {
  vec3 viewDir = normalize(vViewPosition);
  vec3 normal = normalize(vNormal);
  vec3 p = normalize(vPosition);

  // Convective solar plasma granulation (dynamic boiling motion)
  vec3 c1 = p * 4.5 + vec3(uTime * 0.045, uTime * 0.03, uTime * 0.025);
  vec3 c2 = p * 9.0 - vec3(uTime * 0.065, uTime * 0.04, uTime * 0.05);

  float n1 = snoise(c1);
  float n2 = snoise(c2);
  float plasma = clamp((n1 * 0.65 + n2 * 0.35) * 0.5 + 0.5, 0.0, 1.0);

  // Solar Limb Darkening:
  // Center is pure blinding white-hot
  // Limb is soft silvery platinum white with high luminance
  float cosTheta = clamp(dot(normal, viewDir), 0.0, 1.0);
  float limbFactor = pow(cosTheta, 0.6);

  // Pure Brilliant White Star Palette
  vec3 cCoreHot     = vec3(1.0, 1.0, 1.0);       // Pure brilliant blinding white core
  vec3 cWhiteMid    = vec3(0.98, 0.99, 1.0);     // Radiant platinum white
  vec3 cWhiteLimb   = vec3(0.90, 0.93, 0.98);    // Soft pale silver-white limb
  vec3 cGranuleTint = vec3(0.95, 0.97, 1.0);     // Crystalline plasma granule

  // Base photospheric temperature gradient
  vec3 color = mix(cWhiteLimb, cWhiteMid, limbFactor);
  color = mix(color, cCoreHot, pow(limbFactor, 1.8) * 0.95);

  // Plasma granulation modulation
  vec3 granuleColor = mix(cWhiteLimb, cGranuleTint, plasma);
  granuleColor = mix(granuleColor, cCoreHot, pow(plasma, 2.5) * 0.9);

  // Combine surface gradient with plasma convection
  vec3 finalColor = mix(color, granuleColor, 0.45 + 0.25 * (1.0 - limbFactor));

  // Brilliant luminous rim emission boost
  float rim = 1.0 - cosTheta;
  finalColor += vec3(0.95, 0.98, 1.0) * pow(rim, 2.8) * 0.85;

  gl_FragColor = vec4(finalColor, 1.0);
}
`

// -------------------------------------------------------------
// Atmospheric Corona Halo Shaders (Pure White Volumetric Glow)
// -------------------------------------------------------------
const coronaVertexShader = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`

const coronaFragmentShader = /* glsl */ `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vec3 viewDir = normalize(vViewPosition);
  vec3 normal = normalize(vNormal);

  // Fresnel rim glow
  float fresnel = 1.0 - clamp(dot(normal, viewDir), 0.0, 1.0);
  float intensity = pow(fresnel, 2.4);

  // Subtle coronal wave pulsation
  float pulse = 0.94 + 0.06 * sin(uTime * 1.6);
  intensity *= pulse;

  vec3 coronaColor = mix(vec3(0.88, 0.93, 1.0), vec3(1.0, 1.0, 1.0), pow(fresnel, 1.4));
  gl_FragColor = vec4(coronaColor, intensity * 0.92);
}
`

// -------------------------------------------------------------
// Outer Radiant Diffuse Halo Shaders (White Star)
// -------------------------------------------------------------
const outerHaloFragmentShader = /* glsl */ `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vec3 viewDir = normalize(vViewPosition);
  vec3 normal = normalize(vNormal);

  float fresnel = 1.0 - clamp(dot(normal, viewDir), 0.0, 1.0);
  float intensity = pow(fresnel, 3.8);

  float pulse = 0.92 + 0.08 * sin(uTime * 1.2 + 0.8);
  intensity *= pulse;

  vec3 haloColor = mix(vec3(0.85, 0.92, 1.0), vec3(1.0, 1.0, 1.0), fresnel);
  gl_FragColor = vec4(haloColor, intensity * 0.45);
}
`

interface RealisticSunProps {
  radius?: number
  onClick?: () => void
}

export function RealisticSun({ radius = 0.82, onClick }: RealisticSunProps) {
  const sunMatRef = useRef<THREE.ShaderMaterial>(null)
  const coronaMatRef = useRef<THREE.ShaderMaterial>(null)
  const outerHaloMatRef = useRef<THREE.ShaderMaterial>(null)
  const flareRingRef = useRef<THREE.Mesh>(null)
  const flareRing2Ref = useRef<THREE.Mesh>(null)
  const [hover, setHover] = useState(false)

  // Shader uniforms
  const sunUniforms = useMemo(
    () => ({
      uTime: { value: 0 }
    }),
    []
  )

  const coronaUniforms = useMemo(
    () => ({
      uTime: { value: 0 }
    }),
    []
  )

  const cardRef = useRef<HTMLDivElement>(null)
  const labelPos = useMemo(() => new THREE.Vector3(), [])

  const outerHaloUniforms = useMemo(
    () => ({
      uTime: { value: 0 }
    }),
    []
  )

  useFrame(({ clock, camera }, delta) => {
    const t = clock.elapsedTime
    if (sunMatRef.current) {
      sunMatRef.current.uniforms.uTime.value = t
    }
    if (coronaMatRef.current) {
      coronaMatRef.current.uniforms.uTime.value = t
    }
    if (outerHaloMatRef.current) {
      outerHaloMatRef.current.uniforms.uTime.value = t
    }

    // Slow coronal flare streamer rotations
    if (flareRingRef.current) {
      flareRingRef.current.rotation.z += delta * 0.06
    }
    if (flareRing2Ref.current) {
      flareRing2Ref.current.rotation.z -= delta * 0.04
      flareRing2Ref.current.rotation.x += delta * 0.02
    }

    // Hide the hover card while the Sun is off-frame, so it can never end up
    // half-clipped against an edge (zooming does not fire pointer-out).
    const card = cardRef.current
    if (card) {
      labelPos.set(0, radius * 1.15, 0).project(camera)
      const off = labelPos.z > 1 || Math.abs(labelPos.x) > 0.97 || Math.abs(labelPos.y) > 0.97
      card.style.visibility = off ? 'hidden' : 'visible'
    }
  })

  return (
    <group
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation()
          onClick()
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHover(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHover(false)
        document.body.style.cursor = 'default'
      }}
      onWheel={() => setHover(false)}
    >
      {/* 1. Photosphere Core (Brilliant White Star Shader) */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <shaderMaterial
          ref={sunMatRef}
          vertexShader={sunVertexShader}
          fragmentShader={sunFragmentShader}
          uniforms={sunUniforms}
        />
      </mesh>

      {/* 2. Inner Chromosphere & Coronal Halo (White Radiant Glow) */}
      <mesh scale={1.12}>
        <sphereGeometry args={[radius, 48, 48]} />
        <shaderMaterial
          ref={coronaMatRef}
          vertexShader={coronaVertexShader}
          fragmentShader={coronaFragmentShader}
          uniforms={coronaUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* 3. Outer Radiant Corona Halo (Ethereal White Atmosphere) */}
      <mesh scale={1.46}>
        <sphereGeometry args={[radius, 40, 40]} />
        <shaderMaterial
          ref={outerHaloMatRef}
          vertexShader={coronaVertexShader}
          fragmentShader={outerHaloFragmentShader}
          uniforms={outerHaloUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* 4. Coronal Flare Streamers (Radiant White Plasma Sheets) */}
      <mesh ref={flareRingRef} rotation={[0.4, 0.2, 0]}>
        <ringGeometry args={[radius * 1.04, radius * 1.62, 48]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={flareRing2Ref} rotation={[-0.3, 0.5, 0.4]}>
        <ringGeometry args={[radius * 1.06, radius * 1.82, 48]} />
        <meshBasicMaterial
          color="#f1f5f9"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 5. Authentic Pure White Light Source */}
      <pointLight position={[0, 0, 0]} intensity={5.0} distance={60} decay={1.1} color="#ffffff" />

      {/* 6. Scientific Hover Card */}
      {hover && (
        <Html center position={[0, radius * 1.15, 0]} style={{ pointerEvents: 'none' }}>
          <div className="sun-tooltip white-sun" ref={cardRef}>
            <div className="sun-tooltip-header">
              <span className="sun-pulse-dot white" />
              <span className="sun-name">SOL (THE SUN)</span>
            </div>
            <div className="sun-tooltip-body">
              <span>G-Type Main-Sequence · 5,778 K Photosphere</span>
              <span>Primary Gravitational & Light Anchor</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
