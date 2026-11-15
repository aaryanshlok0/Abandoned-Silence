'use client'

import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Html, OrbitControls, Stars } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  BookOpen,
  ChevronRight,
  Compass,
  Crosshair,
  X,
  CircleHelp,
  ArrowLeft,
  Volume2,
  VolumeX,
  Orbit,
  Sparkles,
  Rocket,
  Star,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Pause,
  Play,
  Hand
} from 'lucide-react'
import Link from 'next/link'
import { stories, storyById } from '@/src/data/stories'
import PipGuide, { PipNote } from "../PipGuide"
import { spaceAudio } from '@/lib/audio'
import {
  WarpStreakParticles,
  CosmicStarDust,
  SolarWindParticles,
  MarsAtmosphericDust
} from '@/lib/particles'
import { RealisticSun } from '@/lib/RealisticSun'

type Body = 'moon' | 'mars'
type ViewMode = 'solar' | 'planet'
type TransitionState = 'dive-in' | 'ascend-out' | 'cross-warp' | null

type Artifact = {
  id: string
  name: string
  mission: string
  year: string
  type: string
  body: Body
  lat: number
  lon: number
  status: string
  was: string
  did: string
  rests: string
  talking: string
  fact: string
}

type ArtifactHotspot = {
  id: string
  label: string
  position: [number, number, number]
  question: string
  options: [string, string]
  answer: 0 | 1
  success: string
}

const artifacts: Artifact[] = [
  {
    id: 'apollo-11-descent-stage',
    name: 'Apollo 11 Descent Stage',
    mission: 'Apollo 11',
    year: '1969',
    type: 'Lunar lander',
    body: 'moon',
    lat: 1.21,
    lon: 23.71,
    status: 'Still on the surface',
    was: 'The bottom half of the spacecraft that made the first Moon landing.',
    did: 'Carried Neil Armstrong and Buzz Aldrin safely down to the Moon.',
    rests: 'At the first Moon landing site, beside the famous footprints.',
    talking: 'No. Its job was finished when the astronauts flew home.',
    fact: 'The only hardware that carried humans to another world and stayed there.'
  },
  {
    id: 'apollo-11-retroreflector',
    name: 'Apollo 11 Retroreflector',
    mission: 'Apollo 11',
    year: '1969',
    type: 'Science instrument',
    body: 'moon',
    lat: 0.67,
    lon: 23.47,
    status: 'Still returning signals',
    was: 'A panel filled with tiny special mirrors.',
    did: 'Bounces laser light back to Earth so scientists can measure the Moon.',
    rests: 'Beside the landing site in Tranquility Base.',
    talking: 'Yes. Laser pulses still bounce back today.',
    fact: 'It helps measure the Moon drifting away from Earth.'
  },
  {
    id: 'surveyor-3',
    name: 'Surveyor 3',
    mission: 'Surveyor 3',
    year: '1967',
    type: 'Lander',
    body: 'moon',
    lat: -2.99,
    lon: -23.34,
    status: 'Quiet since 1967',
    was: 'A robot Moon lander with no people on board.',
    did: 'Took pictures and touched Moon soil before Apollo astronauts arrived.',
    rests: 'In the Ocean of Storms.',
    talking: 'No. It has been silent for decades.',
    fact: 'Apollo 12 astronauts visited and brought one camera home.'
  },
  {
    id: 'apollo-17-descent',
    name: 'Apollo 17 Descent Stage',
    mission: 'Apollo 17',
    year: '1972',
    type: 'Lunar lander',
    body: 'moon',
    lat: 20.19,
    lon: 30.77,
    status: 'Still on the surface',
    was: 'The landing half of the last Apollo Moon spacecraft.',
    did: 'Delivered the last humans to walk on the Moon.',
    rests: 'In the Taurus–Littrow valley.',
    talking: 'No. Its golden foil is still visible from orbit.',
    fact: 'Apollo 17 spent longer on the Moon than any other crewed mission.'
  },
  {
    id: 'spirit',
    name: 'Spirit Rover',
    mission: 'Mars Exploration Rover',
    year: '2004',
    type: 'Rover',
    body: 'mars',
    lat: -14.57,
    lon: 175.47,
    status: 'Silent since 2010',
    was: 'A six-wheeled robot built to study rocks.',
    did: 'Found clues that ancient Mars once had more water.',
    rests: 'On a low ridge in Gusev Crater.',
    talking: 'No. Dust covered its solar panels.',
    fact: 'Spirit lasted over six years instead of 90 planned days.'
  },
  {
    id: 'ingenuity',
    name: 'Ingenuity Helicopter',
    mission: 'Mars 2020',
    year: '2021',
    type: 'Aircraft',
    body: 'mars',
    lat: -18.44,
    lon: 77.45,
    status: 'Mission complete',
    was: 'A tiny helicopter that could fly by itself.',
    did: 'Made the first powered flights on another planet.',
    rests: 'On a sandy patch in Jezero Crater.',
    talking: 'No. Its final flight was in January 2024.',
    fact: 'Ingenuity flew 72 times, beyond its planned five.'
  },
  {
    id: 'curiosity',
    name: 'Curiosity Rover',
    mission: 'Mars Science Laboratory',
    year: '2012',
    type: 'Rover',
    body: 'mars',
    lat: -4.59,
    lon: 137.44,
    status: 'Still working',
    was: 'A car-sized robot science lab.',
    did: 'Studies whether Mars once had places where tiny life could survive.',
    rests: 'Climbing Mount Sharp inside Gale Crater.',
    talking: 'Yes. It still sends science home.',
    fact: 'Curiosity uses nuclear power through dusty seasons.'
  },
  {
    id: 'perseverance',
    name: 'Perseverance Rover',
    mission: 'Mars 2020',
    year: '2021',
    type: 'Rover',
    body: 'mars',
    lat: 18.44,
    lon: 77.45,
    status: 'Still working',
    was: 'A rover searching for signs of ancient tiny life.',
    did: 'Packs pieces of Martian rock into tubes for future scientists.',
    rests: 'Exploring Jezero Crater.',
    talking: 'Yes. It reports discoveries to Earth.',
    fact: 'Its microphones captured the first sounds on Mars.'
  },
  {
    id: 'phoenix',
    name: 'Phoenix Lander',
    mission: 'Phoenix',
    year: '2008',
    type: 'Lander',
    body: 'mars',
    lat: 68.22,
    lon: 234.25,
    status: 'Silent since 2008',
    was: 'A robot science lab that stayed in one place.',
    did: 'Scooped water ice below Martian soil.',
    rests: 'On the northern plains of Mars.',
    talking: 'No. Winter darkness ended its mission.',
    fact: 'Phoenix watched snow fall through the Martian sky.'
  },
  {
    id: 'viking-1',
    name: 'Viking 1 Lander',
    mission: 'Viking 1',
    year: '1976',
    type: 'Lander',
    body: 'mars',
    lat: 22.48,
    lon: 312.03,
    status: 'Silent since 1982',
    was: 'An early robot lander sent from the United States.',
    did: 'Sent home some of the first clear pictures from the ground on Mars.',
    rests: 'In Chryse Planitia.',
    talking: 'No. Its last signal arrived in 1982.',
    fact: 'Viking 1 operated on Mars for over six years.'
  },
  {
    id: 'opportunity',
    name: 'Opportunity Rover',
    mission: 'Mars Exploration Rover',
    year: '2004',
    type: 'Rover',
    body: 'mars',
    lat: -1.95,
    lon: 354.47,
    status: 'Silent since 2018',
    was: 'A small rover built for a 90-day adventure.',
    did: 'Drove across Mars for nearly 15 years.',
    rests: 'At Perseverance Valley.',
    talking: 'No. A planet-wide dust storm ended its mission.',
    fact: 'Opportunity traveled farther on another world than any rover.'
  },
  {
    id: 'luna-9',
    name: 'Luna 9',
    mission: 'Luna 9',
    year: '1966',
    type: 'Lander',
    body: 'moon',
    lat: 7.08,
    lon: -64.37,
    status: 'Silent since 1966',
    was: 'The first robot to land gently on the Moon.',
    did: 'Sent the first pictures taken from the surface of another world.',
    rests: 'In the Ocean of Storms.',
    talking: 'No. Its batteries ran down after three days.',
    fact: 'Its images proved lunar ground would hold a landing craft.'
  },
  {
    id: 'apollo-15-lrv',
    name: 'Apollo 15 Lunar Roving Vehicle',
    mission: 'Apollo 15',
    year: '1971',
    type: 'Rover',
    body: 'moon',
    lat: 26.13,
    lon: 3.63,
    status: 'Parked on the Moon',
    was: 'An electric buggy with four wire-mesh wheels.',
    did: 'Let astronauts drive across the Moon with tools and samples on board.',
    rests: 'At Hadley–Apennine, beside the Apollo 15 lander.',
    talking: 'No. Its batteries were left behind with it.',
    fact: 'Three Moon buggies were driven, and all three are still parked up there.'
  },
  {
    id: 'apollo-12-alsep',
    name: 'Apollo 12 ALSEP Station',
    mission: 'Apollo 12',
    year: '1969',
    type: 'Science instrument',
    body: 'moon',
    lat: -3.01,
    lon: 336.58,
    status: 'Silent since 1977',
    was: 'A cluster of science instruments left on the Moon.',
    did: 'Listened for moonquakes and measured the lunar surface and interior.',
    rests: 'In the Ocean of Storms, near the Surveyor 3 site.',
    talking: 'No. The station was switched off in 1977.',
    fact: 'Five ALSEP stations listened to the Moon for years after the astronauts left.'
  },
  {
    id: 'sojourner',
    name: 'Sojourner Rover',
    mission: 'Mars Pathfinder',
    year: '1997',
    type: 'Rover',
    body: 'mars',
    lat: 19.17,
    lon: 326.79,
    status: 'Parked since 1997',
    was: 'A microwave-oven-sized rover with six wheels.',
    did: 'Tested driving on Mars and measured rocks at Ares Vallis.',
    rests: 'Beside the Pathfinder lander in Ares Vallis.',
    talking: 'No. The lander stopped relaying its messages in 1997.',
    fact: 'Sojourner was the first rover to drive on Mars.'
  },
  {
    id: 'viking-2',
    name: 'Viking 2 Lander',
    mission: 'Viking 2',
    year: '1976',
    type: 'Lander',
    body: 'mars',
    lat: 47.97,
    lon: 134.26,
    status: 'Silent since 1980',
    was: 'The second U.S. lander to reach Mars.',
    did: 'Studied the soil, weather and atmosphere of Utopia Planitia.',
    rests: 'In Utopia Planitia, where it touched down.',
    talking: 'No. Its last data arrived in 1980.',
    fact: 'Viking 2 landed on the other side of Mars from its twin.'
  },
  {
    id: 'insight',
    name: 'InSight Lander',
    mission: 'InSight',
    year: '2018',
    type: 'Lander',
    body: 'mars',
    lat: 4.5,
    lon: 135.9,
    status: 'Silent since 2022',
    was: 'A lander built to listen to the inside of Mars.',
    did: 'Recorded marsquakes and measured the planet’s core and crust.',
    rests: 'In Elysium Planitia.',
    talking: 'No. Dust covered its solar panels.',
    fact: 'InSight heard more than 1,300 marsquakes.'
  }
]

const byId = Object.fromEntries(artifacts.map((a) => [a.id, a])) as Record<string, Artifact>
const COLLECTION_KEY = 'still-there.story-cards'
const CHALLENGE_KEY = 'still-there.signal-stars'
const PARTS_KEY = 'still-there.parts-found'

const apolloHotspots: ArtifactHotspot[] = [
  {
    id: 'landing-legs',
    label: 'Landing legs',
    position: [0.42, 0.04, 0.4],
    question: 'Why did the descent stage need wide landing feet?',
    options: ['To spread its weight on soft dust', 'To bounce back into space'],
    answer: 0,
    success: 'Exactly! Wide feet helped the lander stay steady on loose Moon soil.'
  },
  {
    id: 'descent-engine',
    label: 'Descent engine',
    position: [0, 0.04, 0],
    question: 'What was this engine doing just before touchdown?',
    options: ['Slowing the lander down', 'Sending a radio signal'],
    answer: 0,
    success: 'Right! The throttleable engine slowed the spacecraft for a gentle landing.'
  },
  {
    id: 'ladder',
    label: 'Ladder',
    position: [0.39, 0.27, 0.39],
    question: 'Who used this ladder after landing?',
    options: ['Astronauts climbing to the surface', 'Engineers back on Earth'],
    answer: 0,
    success: 'Yes! The astronauts climbed down from the cabin to the Moon.'
  }
]

const roverHotspots = (toolName: 'Drill' | 'Rock abrasion tool'): ArtifactHotspot[] => [
  {
    id: 'camera',
    label: 'Camera mast',
    position: [0.28, 0.7, -0.08],
    question: 'Why is the rover camera mounted up high?',
    options: ['To see terrain and choose a safe path', 'To make the rover drive faster'],
    answer: 0,
    success: 'You got it! A high viewpoint helps the rover study rocks and plan its route.'
  },
  {
    id: 'wheels',
    label: 'Six wheels',
    position: [0.25, 0.09, 0.29],
    question: 'Why does this rover have six grippy wheels?',
    options: ['To cross rocks and uneven ground', 'To fly over craters'],
    answer: 0,
    success: 'Correct! Six wheels share the load and keep the rover moving over rough ground.'
  },
  {
    id: 'science-tool',
    label: toolName,
    position: [0.52, 0.17, 0.08],
    question: toolName === 'Drill'
      ? 'What does the drill help scientists examine?'
      : 'What did the rock abrasion tool do?',
    options: toolName === 'Drill'
      ? ['Fresh rock hidden below the surface', 'Clouds high above Mars']
      : ['Brushed and ground away weathered rock', 'Pumped up the rover wheels'],
    answer: 0,
    success: toolName === 'Drill'
      ? 'Exactly! Drilling reveals fresh material protected inside Martian rock.'
      : 'Exactly! It exposed a clean patch of rock for the rover’s instruments to study.'
  }
]

const artifactHotspots: Record<string, ArtifactHotspot[]> = {
  'apollo-11-descent-stage': apolloHotspots,
  'apollo-17-descent': apolloHotspots,
  'apollo-11-retroreflector': [
    {
      id: 'prism-panel',
      label: 'Mirror prisms',
      position: [0, 0.34, 0.08],
      question: 'What makes these tiny prisms special?',
      options: ['They send light back toward its source', 'They turn sunlight into electricity'],
      answer: 0,
      success: 'Correct! The corner-cube prisms return laser light toward Earth.'
    },
    {
      id: 'support',
      label: 'Support stand',
      position: [0, 0.1, 0],
      question: 'Why did the reflector need a sturdy stand?',
      options: ['To keep the panel aimed and stable', 'To dig into the Moon'],
      answer: 0,
      success: 'Right! A steady panel gives scientists a reliable laser target.'
    },
    {
      id: 'laser-return',
      label: 'Laser return',
      position: [0, 0.74, 0],
      question: 'What do scientists learn by timing the returning laser pulse?',
      options: ['The exact Earth–Moon distance', 'The temperature inside the Sun'],
      answer: 0,
      success: 'Yes! The travel time reveals the Moon’s distance with amazing precision.'
    }
  ],
  'surveyor-3': [
    {
      id: 'camera',
      label: 'TV camera',
      position: [0.11, 1.13, 0],
      question: 'What did Surveyor’s camera show mission teams?',
      options: ['The landing site and nearby terrain', 'The inside of the Sun'],
      answer: 0,
      success: 'Exactly! Surveyor sent thousands of close-up Moon pictures to Earth.'
    },
    {
      id: 'scoop',
      label: 'Soil scoop',
      position: [0.66, 0.28, 0.04],
      question: 'What did this little scoop test?',
      options: ['How lunar soil moved and felt', 'How windy the Moon was'],
      answer: 0,
      success: 'Correct! The sampler pressed, dug and scraped the lunar surface.'
    },
    {
      id: 'solar-panel',
      label: 'Solar panel',
      position: [-0.31, 0.75, 0],
      question: 'What job did the solar panel do?',
      options: ['Turn sunlight into electrical power', 'Bounce Surveyor back to Earth'],
      answer: 0,
      success: 'Right! Sunlight powered Surveyor’s instruments and communications.'
    }
  ],
  spirit: roverHotspots('Rock abrasion tool'),
  opportunity: roverHotspots('Rock abrasion tool'),
  curiosity: roverHotspots('Drill'),
  perseverance: roverHotspots('Drill'),
  ingenuity: [
    {
      id: 'rotors',
      label: 'Twin rotors',
      position: [0, 0.56, 0],
      question: 'Why did Ingenuity spin two rotors in opposite directions?',
      options: ['To stay stable without a tail rotor', 'To make Martian wind'],
      answer: 0,
      success: 'That’s it! Counter-rotating blades balanced the helicopter’s twisting force.'
    },
    {
      id: 'solar-panel',
      label: 'Solar panel',
      position: [0.17, 0.69, 0.08],
      question: 'What happened here between flights?',
      options: ['Sunlight recharged the battery', 'Mars dust became fuel'],
      answer: 0,
      success: 'Correct! The panel charged Ingenuity’s battery for its next flight.'
    },
    {
      id: 'landing-legs',
      label: 'Landing legs',
      position: [0.18, 0.05, 0.18],
      question: 'Why are Ingenuity’s legs long and springy?',
      options: ['To absorb bumpy landings', 'To dig for buried ice'],
      answer: 0,
      success: 'Yes! The light legs helped it land safely on uneven Martian ground.'
    }
  ],
  phoenix: [
    {
      id: 'scoop',
      label: 'Robotic scoop',
      position: [0, 0.54, 0.41],
      question: 'What did Phoenix uncover with this scoop?',
      options: ['Water ice below the soil', 'A working Martian machine'],
      answer: 0,
      success: 'Correct! Phoenix scraped away soil and found bright water ice underneath.'
    },
    {
      id: 'solar-panels',
      label: 'Solar panels',
      position: [0.43, 0.29, 0],
      question: 'Why did Phoenix spread out two round panels?',
      options: ['To collect sunlight for power', 'To roll across Mars'],
      answer: 0,
      success: 'Right! The two panels supplied electricity during the polar summer.'
    },
    {
      id: 'landing-leg',
      label: 'Landing leg',
      position: [0.34, 0.04, 0],
      question: 'What did the three legs do after touchdown?',
      options: ['Kept the science deck level', 'Launched the lander again'],
      answer: 0,
      success: 'Exactly! Three legs made a stable platform for careful experiments.'
    }
  ],
  'viking-1': [
    {
      id: 'camera',
      label: 'Twin cameras',
      position: [-0.06, 0.78, -0.09],
      question: 'Why did Viking use two camera heads?',
      options: ['To build detailed views of the surface', 'To steer like a pair of wheels'],
      answer: 0,
      success: 'Correct! The cameras scanned the scene and helped reveal surface shape.'
    },
    {
      id: 'dish',
      label: 'Radio dish',
      position: [0.04, 0.67, 0],
      question: 'What travelled through this dish?',
      options: ['Pictures and science data to Earth', 'Martian rocks'],
      answer: 0,
      success: 'Right! Radio signals carried Viking’s discoveries across space.'
    },
    {
      id: 'rtg',
      label: 'Nuclear power unit',
      position: [0.45, 0.39, 0],
      question: 'Why use a nuclear power unit on Viking?',
      options: ['To make electricity day and night', 'To melt the whole landing site'],
      answer: 0,
      success: 'Exactly! Its radioisotope generators supplied steady power for years.'
    }
  ],
  'luna-9': [
    {
      id: 'petals',
      label: 'Landing petals',
      position: [0, 0.17, 0.52],
      question: 'Why did Luna 9 open four petals after landing?',
      options: ['To stand upright and steady', 'To flap through the air'],
      answer: 0,
      success: 'Correct! The petals stabilized the capsule and opened its view of the Moon.'
    },
    {
      id: 'camera',
      label: 'Panoramic camera',
      position: [0, 0.51, 0.23],
      question: 'What historic first did this camera achieve?',
      options: ['First surface pictures from another world', 'First picture of Saturn’s rings'],
      answer: 0,
      success: 'Yes! Luna 9 returned the first pictures from another world’s surface.'
    },
    {
      id: 'antennae',
      label: 'Petal antennae',
      position: [0.16, 0.74, 0.18],
      question: 'What was the antenna’s most important job?',
      options: ['Send camera signals to Earth', 'Measure wheel speed'],
      answer: 0,
      success: 'Right! The antenna carried Luna 9’s pictures and data home.'
    }
  ]
}

function pos(a: Artifact, r = 1.006) {
  const p = ((90 - a.lat) * Math.PI) / 180
  const t = ((a.lon + 180) * Math.PI) / 180
  return [
    -r * Math.sin(p) * Math.cos(t),
    r * Math.cos(p),
    r * Math.sin(p) * Math.sin(t)
  ] as [number, number, number]
}

const mats = {
  gold: new THREE.MeshStandardMaterial({
    color: '#e5b338',
    metalness: 0.88,
    roughness: 0.28,
    emissive: '#2b1b02',
    emissiveIntensity: 0.15
  }),
  white: new THREE.MeshStandardMaterial({
    color: '#e6ebf2',
    roughness: 0.65,
    metalness: 0.12
  }),
  metal: new THREE.MeshStandardMaterial({
    color: '#9aa3af',
    metalness: 0.9,
    roughness: 0.25
  }),
  darkMetal: new THREE.MeshStandardMaterial({
    color: '#22262d',
    metalness: 0.8,
    roughness: 0.4
  }),
  engine: new THREE.MeshStandardMaterial({
    color: '#1a1d22',
    metalness: 0.85,
    roughness: 0.3
  }),
  solar: new THREE.MeshStandardMaterial({
    color: '#102042',
    metalness: 0.85,
    roughness: 0.2,
    emissive: '#051025'
  }),
  lens: new THREE.MeshStandardMaterial({
    color: '#38bdf8',
    roughness: 0.1,
    metalness: 0.9,
    emissive: '#0284c7',
    emissiveIntensity: 0.4
  }),
  reflectorPrism: new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    metalness: 0.95,
    roughness: 0.05,
    emissive: '#bae6fd',
    emissiveIntensity: 0.3
  })
}

function ApolloDescentModel() {
  return (
    <group>
      <mesh position={[0, 0.22, 0]} geometry={new THREE.CylinderGeometry(0.36, 0.42, 0.26, 8)} material={mats.gold} />
      <mesh position={[0, 0.37, 0]} geometry={new THREE.CylinderGeometry(0.24, 0.28, 0.06, 8)} material={mats.white} />
      <mesh position={[0, 0.07, 0]} rotation={[Math.PI, 0, 0]} geometry={new THREE.ConeGeometry(0.18, 0.18, 16, 1, true)} material={mats.engine} />
      <mesh position={[0.26, 0.22, 0]} geometry={new THREE.BoxGeometry(0.14, 0.18, 0.22)} material={mats.white} />
      <mesh position={[-0.26, 0.22, 0]} geometry={new THREE.BoxGeometry(0.14, 0.18, 0.22)} material={mats.darkMetal} />

      {[
        [0.32, 0.32],
        [-0.32, 0.32],
        [0.32, -0.32],
        [-0.32, -0.32]
      ].map(([x, z], i) => (
        <group key={i}>
          <mesh position={[x * 0.75, 0.11, z * 0.75]} rotation={[z > 0 ? 0.6 : -0.6, 0, x > 0 ? -0.6 : 0.6]} geometry={new THREE.CylinderGeometry(0.02, 0.02, 0.38, 6)} material={mats.metal} />
          <mesh position={[x * 1.15, 0.015, z * 1.15]} geometry={new THREE.CylinderGeometry(0.11, 0.12, 0.025, 12)} material={mats.gold} />
        </group>
      ))}

      <group position={[0.38, 0.14, 0.38]} rotation={[0.6, -Math.PI / 4, 0]}>
        <mesh position={[-0.035, 0, 0]} geometry={new THREE.CylinderGeometry(0.008, 0.008, 0.32, 4)} material={mats.metal} />
        <mesh position={[0.035, 0, 0]} geometry={new THREE.CylinderGeometry(0.008, 0.008, 0.32, 4)} material={mats.metal} />
        {[-0.1, -0.04, 0.02, 0.08].map((y) => (
          <mesh key={y} position={[0, y, 0]} geometry={new THREE.BoxGeometry(0.07, 0.008, 0.008)} material={mats.metal} />
        ))}
      </group>
    </group>
  )
}

function RetroreflectorModel({ hover }: { hover: boolean }) {
  const pulseRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (pulseRef.current) {
      pulseRef.current.position.y = 0.5 + (Math.sin(clock.elapsedTime * 4) * 0.5 + 0.5) * 0.4
      ;(pulseRef.current.material as THREE.MeshBasicMaterial).opacity = 0.35 + Math.sin(clock.elapsedTime * 4) * 0.25
    }
  })

  return (
    <group>
      <mesh position={[0, 0.08, 0]} geometry={new THREE.CylinderGeometry(0.04, 0.14, 0.16, 6)} material={mats.metal} />
      <group position={[0, 0.22, 0]} rotation={[0.5, 0, 0]}>
        <mesh geometry={new THREE.BoxGeometry(0.52, 0.06, 0.44)} material={mats.white} />
        <mesh position={[0, 0.035, 0]} geometry={new THREE.BoxGeometry(0.44, 0.02, 0.36)} material={mats.reflectorPrism} />
        {[-0.15, -0.05, 0.05, 0.15].map((x) =>
          [-0.1, 0, 0.1].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0.05, z]} geometry={new THREE.CylinderGeometry(0.025, 0.025, 0.015, 6)} material={mats.reflectorPrism} />
          ))
        )}
      </group>
      <mesh ref={pulseRef} position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.008, 0.015, 0.8, 8]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={hover ? 0.8 : 0.45} depthWrite={false} />
      </mesh>
    </group>
  )
}

function RoverModel({ id }: { id: string }) {
  const isBigRover = id === 'curiosity' || id === 'perseverance'
  const isPerseverance = id === 'perseverance'
  const armRef = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (armRef.current) {
      armRef.current.rotation.z = Math.sin(clock.elapsedTime * 1.5) * 0.06
    }
  })

  return (
    <group>
      <mesh position={[0, 0.24, 0]} geometry={new THREE.BoxGeometry(isBigRover ? 0.7 : 0.62, 0.16, isBigRover ? 0.48 : 0.42)} material={isBigRover ? mats.white : mats.gold} />
      <mesh position={[0, 0.15, 0]} geometry={new THREE.BoxGeometry(isBigRover ? 0.58 : 0.5, 0.12, isBigRover ? 0.38 : 0.32)} material={mats.darkMetal} />
      <mesh position={[0.18, 0.48, -0.1]} geometry={new THREE.CylinderGeometry(0.02, 0.025, 0.36, 8)} material={mats.metal} />
      <group position={[0.18, 0.68, -0.1]}>
        <mesh geometry={new THREE.BoxGeometry(isBigRover ? 0.2 : 0.14, 0.11, 0.13)} material={mats.white} />
        <mesh position={[0.075, 0.01, 0.025]} rotation={[0, 0, Math.PI / 2]} geometry={new THREE.CylinderGeometry(0.025, 0.025, 0.02, 10)} material={mats.lens} />
        <mesh position={[0.075, 0.01, -0.025]} rotation={[0, 0, Math.PI / 2]} geometry={new THREE.CylinderGeometry(0.025, 0.025, 0.02, 10)} material={mats.lens} />
      </group>

      <group ref={armRef} position={[0.3, 0.22, 0.08]}>
        <mesh position={[0.1, 0, 0]} rotation={[0, 0, -0.3]} geometry={new THREE.CylinderGeometry(0.018, 0.018, 0.22, 6)} material={mats.metal} />
        <mesh position={[0.2, -0.06, 0]} geometry={new THREE.CylinderGeometry(0.04, 0.04, 0.07, 8)} material={mats.darkMetal} />
      </group>

      {isBigRover ? (
        <group position={[-0.43, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh geometry={new THREE.CylinderGeometry(0.09, 0.09, 0.27, 12)} material={mats.engine} />
          <mesh position={[0, 0.16, 0]} geometry={new THREE.CylinderGeometry(0.075, 0.075, 0.05, 12)} material={mats.metal} />
        </group>
      ) : (
        <group position={[0, 0.33, 0]}>
          <mesh geometry={new THREE.BoxGeometry(0.82, 0.018, 0.62)} material={mats.solar} />
          <mesh position={[-0.38, 0.02, 0]} geometry={new THREE.BoxGeometry(0.18, 0.018, 0.32)} material={mats.solar} />
          {[-0.24, 0, 0.24].map((x) => (
            <mesh key={x} position={[x, 0.012, 0]} geometry={new THREE.BoxGeometry(0.012, 0.025, 0.58)} material={mats.metal} />
          ))}
        </group>
      )}

      <mesh position={[-0.14, 0.38, 0.12]} rotation={[-0.3, 0.2, 0]} geometry={new THREE.CylinderGeometry(0.07, 0.02, 0.04, 12)} material={mats.white} />

      {isPerseverance && (
        <group position={[0.12, 0.38, 0.22]}>
          {[-0.12, -0.04, 0.04, 0.12].map((x) => (
            <mesh key={x} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]} geometry={new THREE.CylinderGeometry(0.018, 0.018, 0.18, 8)} material={mats.gold} />
          ))}
        </group>
      )}

      {[-0.24, 0, 0.24].map((x) =>
        [-0.26, 0.26].map((z) => (
          <group key={`${x}-${z}`} position={[x, 0.08, z]}>
            <mesh position={[0, 0.06, 0]} geometry={new THREE.CylinderGeometry(0.012, 0.012, 0.14, 6)} material={mats.metal} />
            <mesh rotation={[Math.PI / 2, 0, 0]} geometry={new THREE.CylinderGeometry(0.075, 0.075, 0.065, 12)} material={mats.darkMetal} />
            <mesh rotation={[Math.PI / 2, 0, 0]} geometry={new THREE.CylinderGeometry(0.03, 0.03, 0.07, 8)} material={mats.metal} />
          </group>
        ))
      )}
    </group>
  )
}

function IngenuityModel({ hover }: { hover: boolean }) {
  const topRotorRef = useRef<THREE.Mesh>(null)
  const botRotorRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    const speed = hover ? 14 : 3.5
    if (topRotorRef.current) topRotorRef.current.rotation.y += delta * speed
    if (botRotorRef.current) botRotorRef.current.rotation.y -= delta * speed
  })

  return (
    <group>
      {[
        [0.2, 0.2],
        [-0.2, 0.2],
        [0.2, -0.2],
        [-0.2, -0.2]
      ].map(([x, z], i) => (
        <group key={i}>
          <mesh position={[x * 0.6, 0.12, z * 0.6]} rotation={[z > 0 ? 0.5 : -0.5, 0, x > 0 ? -0.5 : 0.5]} geometry={new THREE.CylinderGeometry(0.01, 0.01, 0.3, 6)} material={mats.darkMetal} />
          <mesh position={[x * 0.9, 0.01, z * 0.9]} geometry={new THREE.SphereGeometry(0.02, 6, 6)} material={mats.metal} />
        </group>
      ))}

      <mesh position={[0, 0.26, 0]} geometry={new THREE.BoxGeometry(0.24, 0.2, 0.24)} material={mats.gold} />
      <mesh position={[0, 0.5, 0]} geometry={new THREE.CylinderGeometry(0.016, 0.016, 0.34, 8)} material={mats.metal} />

      <mesh ref={botRotorRef} position={[0, 0.44, 0]}>
        <boxGeometry args={[0.92, 0.015, 0.07]} />
        <meshStandardMaterial color="#1a1c20" roughness={0.4} />
      </mesh>

      <mesh ref={topRotorRef} position={[0, 0.56, 0]}>
        <boxGeometry args={[0.92, 0.015, 0.07]} />
        <meshStandardMaterial color="#1a1c20" roughness={0.4} />
      </mesh>

      <mesh position={[0, 0.68, 0]} geometry={new THREE.BoxGeometry(0.32, 0.015, 0.32)} material={mats.solar} />
      <mesh position={[0, 0.74, 0]} geometry={new THREE.CylinderGeometry(0.005, 0.005, 0.12, 4)} material={mats.metal} />
    </group>
  )
}

function StationaryLanderModel({ id }: { id: string }) {
  return (
    <group>
      <mesh position={[0, 0.24, 0]} geometry={new THREE.CylinderGeometry(0.32, 0.26, 0.22, 6)} material={id === 'luna-9' ? mats.metal : mats.white} />

      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
        <group key={i} rotation={[0, angle, 0]}>
          <mesh position={[0.22, 0.1, 0]} rotation={[0, 0, -0.6]} geometry={new THREE.CylinderGeometry(0.02, 0.02, 0.28, 6)} material={mats.metal} />
          <mesh position={[0.34, 0.015, 0]} geometry={new THREE.CylinderGeometry(0.09, 0.1, 0.02, 10)} material={mats.metal} />
        </group>
      ))}

      {id === 'phoenix' ? (
        <>
          <mesh position={[0.42, 0.26, 0]} rotation={[0, 0, 0.1]} geometry={new THREE.CylinderGeometry(0.24, 0.24, 0.015, 16)} material={mats.solar} />
          <mesh position={[-0.42, 0.26, 0]} rotation={[0, 0, -0.1]} geometry={new THREE.CylinderGeometry(0.24, 0.24, 0.015, 16)} material={mats.solar} />
          <group position={[0, 0.28, 0.22]} rotation={[0.4, 0, 0]}>
            <mesh position={[0, 0.08, 0.1]} geometry={new THREE.CylinderGeometry(0.015, 0.015, 0.24, 6)} material={mats.metal} />
            <mesh position={[0, 0.18, 0.18]} geometry={new THREE.BoxGeometry(0.06, 0.04, 0.08)} material={mats.darkMetal} />
          </group>
        </>
      ) : (
        <>
          <group position={[0, 0.44, 0]}>
            <mesh rotation={[0.3, 0.4, 0]} geometry={new THREE.CylinderGeometry(0.02, 0.02, 0.22, 6)} material={mats.metal} />
            <mesh position={[0.06, 0.12, 0.04]} rotation={[0.4, 0.4, 0]} geometry={new THREE.ConeGeometry(0.16, 0.06, 14, 1, true)} material={mats.white} />
          </group>
          <mesh position={[-0.14, 0.42, -0.08]} geometry={new THREE.CylinderGeometry(0.02, 0.02, 0.26, 6)} material={mats.darkMetal} />
          <mesh position={[-0.14, 0.54, -0.08]} geometry={new THREE.SphereGeometry(0.04, 8, 8)} material={mats.lens} />
        </>
      )}
    </group>
  )
}

function SurveyorModel() {
  return (
    <group>
      <mesh position={[0, 0.3, 0]} geometry={new THREE.CylinderGeometry(0.27, 0.32, 0.3, 6)} material={mats.gold} />
      <mesh position={[0, 0.47, 0]} geometry={new THREE.CylinderGeometry(0.2, 0.22, 0.08, 8)} material={mats.white} />

      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, index) => (
        <group key={angle} rotation={[0, angle, 0]}>
          <mesh position={[0.28, 0.15, 0]} rotation={[0, 0, -0.72]} geometry={new THREE.CylinderGeometry(0.018, 0.022, 0.5, 6)} material={mats.metal} />
          <mesh position={[0.48, 0.015, 0]} geometry={new THREE.CylinderGeometry(0.1, 0.12, 0.025, 12)} material={mats.white} />
          {index === 0 && (
            <group position={[0.37, 0.34, 0.04]} rotation={[0, 0, -0.38]}>
              <mesh position={[0.16, 0, 0]} geometry={new THREE.CylinderGeometry(0.016, 0.016, 0.34, 6)} material={mats.metal} />
              <mesh position={[0.31, -0.04, 0]} rotation={[0, 0, 0.5]} geometry={new THREE.BoxGeometry(0.12, 0.07, 0.13)} material={mats.darkMetal} />
            </group>
          )}
        </group>
      ))}

      <mesh position={[0, 0.72, 0]} geometry={new THREE.CylinderGeometry(0.025, 0.035, 0.48, 8)} material={mats.metal} />
      <group position={[0, 0.98, 0]}>
        <mesh geometry={new THREE.BoxGeometry(0.16, 0.15, 0.16)} material={mats.white} />
        <mesh position={[0.09, 0, 0]} rotation={[0, 0, Math.PI / 2]} geometry={new THREE.CylinderGeometry(0.035, 0.035, 0.04, 12)} material={mats.lens} />
      </group>
      <mesh position={[-0.22, 0.78, 0]} rotation={[0.1, 0, -0.38]} geometry={new THREE.BoxGeometry(0.32, 0.025, 0.24)} material={mats.solar} />
      <group position={[0.2, 0.7, 0.04]} rotation={[0, 0, -0.35]}>
        <mesh geometry={new THREE.ConeGeometry(0.16, 0.07, 18, 1, true)} material={mats.white} />
        <mesh position={[0, -0.05, 0]} geometry={new THREE.CylinderGeometry(0.012, 0.012, 0.18, 6)} material={mats.metal} />
      </group>
    </group>
  )
}

function Luna9Model() {
  return (
    <group>
      <mesh position={[0, 0.34, 0]} geometry={new THREE.SphereGeometry(0.28, 18, 14)} material={mats.white} />
      <mesh position={[0, 0.34, 0]} geometry={new THREE.SphereGeometry(0.22, 14, 10)} material={mats.metal} />

      {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle) => (
        <group key={angle} rotation={[0, angle, 0]}>
          <mesh position={[0, 0.15, 0.34]} rotation={[-0.32, 0, 0]} geometry={new THREE.BoxGeometry(0.42, 0.035, 0.34)} material={mats.white} />
          <mesh position={[0, 0.18, 0.35]} rotation={[-0.32, 0, 0]} geometry={new THREE.BoxGeometry(0.28, 0.02, 0.2)} material={mats.gold} />
        </group>
      ))}

      {[[-0.15, 0.18], [0.15, -0.18], [0.15, 0.18], [-0.15, -0.18]].map(([x, z], index) => (
        <mesh key={index} position={[x, 0.65, z]} rotation={[z > 0 ? -0.22 : 0.22, 0, x > 0 ? 0.22 : -0.22]} geometry={new THREE.CylinderGeometry(0.009, 0.009, 0.62, 5)} material={mats.metal} />
      ))}
      <mesh position={[0, 0.68, 0]} geometry={new THREE.CylinderGeometry(0.05, 0.07, 0.08, 10)} material={mats.darkMetal} />
    </group>
  )
}

function VikingModel() {
  return (
    <group>
      <mesh position={[0, 0.3, 0]} geometry={new THREE.CylinderGeometry(0.36, 0.33, 0.2, 8)} material={mats.white} />
      <mesh position={[0, 0.41, 0]} geometry={new THREE.CylinderGeometry(0.3, 0.34, 0.05, 8)} material={mats.gold} />

      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle) => (
        <group key={angle} rotation={[0, angle, 0]}>
          <mesh position={[0.31, 0.14, 0]} rotation={[0, 0, -0.7]} geometry={new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6)} material={mats.metal} />
          <mesh position={[0.5, 0.018, 0]} geometry={new THREE.CylinderGeometry(0.1, 0.12, 0.025, 12)} material={mats.metal} />
        </group>
      ))}

      <group position={[0.02, 0.62, 0]} rotation={[0.1, 0, 0.18]}>
        <mesh geometry={new THREE.ConeGeometry(0.25, 0.08, 22, 1, true)} material={mats.white} />
        <mesh position={[0, -0.09, 0]} geometry={new THREE.CylinderGeometry(0.014, 0.014, 0.25, 6)} material={mats.metal} />
      </group>

      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.43, 0.38, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh geometry={new THREE.CylinderGeometry(0.07, 0.07, 0.26, 12)} material={mats.darkMetal} />
          {[-0.08, 0, 0.08].map((y) => (
            <mesh key={y} position={[0, y, 0]} geometry={new THREE.TorusGeometry(0.073, 0.008, 6, 14)} material={mats.metal} />
          ))}
        </group>
      ))}

      <group position={[-0.13, 0.72, -0.09]}>
        <mesh geometry={new THREE.BoxGeometry(0.12, 0.25, 0.1)} material={mats.white} />
        <mesh position={[0.065, 0.07, 0]} rotation={[0, 0, Math.PI / 2]} geometry={new THREE.CylinderGeometry(0.022, 0.022, 0.025, 10)} material={mats.lens} />
        <mesh position={[0.065, -0.06, 0]} rotation={[0, 0, Math.PI / 2]} geometry={new THREE.CylinderGeometry(0.022, 0.022, 0.025, 10)} material={mats.lens} />
      </group>
    </group>
  )
}

function ArtifactShape({ a, active = false }: { a: Artifact; active?: boolean }) {
  if (a.id.includes('apollo') && a.id.includes('descent')) return <ApolloDescentModel />
  if (a.id === 'apollo-11-retroreflector') return <RetroreflectorModel hover={active} />
  if (a.id === 'surveyor-3') return <SurveyorModel />
  if (a.id === 'luna-9') return <Luna9Model />
  if (a.id === 'viking-1' || a.id === 'viking-2') return <VikingModel />
  if (a.type === 'Aircraft') return <IngenuityModel hover={active} />
  if (a.type === 'Rover') return <RoverModel id={a.id} />
  return <StationaryLanderModel id={a.id} />
}

function StoryArtifactViewer({ a }: { a: Artifact }) {
  const [spinning, setSpinning] = useState(true)
  const [viewerKey, setViewerKey] = useState(0)
  const [solvedParts, setSolvedParts] = useState<string[]>([])
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [taskFeedback, setTaskFeedback] = useState<'correct' | 'wrong' | null>(null)
  const hotspots = artifactHotspots[a.id] ?? []
  const activeHotspot = hotspots.find((hotspot) => hotspot.id === activeHotspotId)
  const viewerScale = a.id === 'surveyor-3' ? 1.12 : a.id === 'apollo-11-retroreflector' ? 1.24 : a.id === 'luna-9' || a.id === 'viking-1' ? 1.25 : 1.42

  useEffect(() => {
    setActiveHotspotId(null)
    setSelectedAnswer(null)
    setTaskFeedback(null)
    setSpinning(true)

    try {
      const stored = JSON.parse(window.localStorage.getItem(PARTS_KEY) ?? '{}')
      const artifactParts = stored && typeof stored === 'object' && !Array.isArray(stored)
        ? (stored as Record<string, unknown>)[a.id]
        : []
      const allowedParts = new Set(hotspots.map((hotspot) => hotspot.id))
      setSolvedParts(
        Array.isArray(artifactParts)
          ? artifactParts.filter((part): part is string => typeof part === 'string' && allowedParts.has(part))
          : []
      )
    } catch {
      setSolvedParts([])
    }
  }, [a.id, hotspots])

  const openHotspot = (hotspot: ArtifactHotspot) => {
    const alreadySolved = solvedParts.includes(hotspot.id)
    setSpinning(false)
    setActiveHotspotId(hotspot.id)
    setSelectedAnswer(alreadySolved ? hotspot.answer : null)
    setTaskFeedback(alreadySolved ? 'correct' : null)
  }

  const closeHotspot = () => {
    setActiveHotspotId(null)
    setSelectedAnswer(null)
    setTaskFeedback(null)
  }

  const saveSolvedPart = (hotspotId: string) => {
    setSolvedParts((current) => {
      if (current.includes(hotspotId)) return current
      const next = [...current, hotspotId]

      try {
        const stored = JSON.parse(window.localStorage.getItem(PARTS_KEY) ?? '{}')
        const allProgress = stored && typeof stored === 'object' && !Array.isArray(stored)
          ? { ...(stored as Record<string, unknown>) }
          : {}
        allProgress[a.id] = next
        window.localStorage.setItem(PARTS_KEY, JSON.stringify(allProgress))
      } catch {
        window.localStorage.setItem(PARTS_KEY, JSON.stringify({ [a.id]: next }))
      }

      return next
    })
  }

  const chooseTaskAnswer = (option: number) => {
    if (!activeHotspot) return
    setSelectedAnswer(option)

    if (option === activeHotspot.answer) {
      setTaskFeedback('correct')
      saveSolvedPart(activeHotspot.id)
      spaceAudio.playChirp()
    } else {
      setTaskFeedback('wrong')
    }
  }

  return (
    <div className="artifact-viewer">
      <div className={`artifact-canvas ${activeHotspot ? 'task-open' : ''}`} role="group" aria-label={`Interactive 3D model of ${a.name}`}>
        <Canvas
          key={viewerKey}
          camera={{ position: [2.2, 1.7, 2.8], fov: 34 }}
          dpr={[1, 1.6]}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.25 }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[3, 5, 4]} intensity={3.1} color="#fff6dd" />
          <directionalLight position={[-3, 1, -2]} intensity={1.2} color={a.body === 'moon' ? '#6ee7f9' : '#ff8d6d'} />
          <pointLight position={[0, 2.5, 1]} intensity={1.3} color="#f5b544" />
          <group scale={viewerScale} position={[0, -0.42, 0]}>
            <ArtifactShape a={a} active={spinning} />
            {hotspots.map((hotspot, index) => {
              const solved = solvedParts.includes(hotspot.id)
              const active = activeHotspotId === hotspot.id
              return (
                <Html key={hotspot.id} position={hotspot.position} center distanceFactor={2.35} zIndexRange={[20, 1]}>
                  <button
                    type="button"
                    className={`artifact-hotspot ${active ? 'active' : ''} ${solved ? 'solved' : ''}`}
                    onPointerEnter={() => setSpinning(false)}
                    onFocus={() => setSpinning(false)}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation()
                      openHotspot(hotspot)
                    }}
                    aria-label={`${solved ? 'Completed: ' : 'Explore '}${hotspot.label}`}
                    aria-pressed={active}
                  >
                    <span className="artifact-hotspot-number">{solved ? <CheckCircle2 size={13} /> : index + 1}</span>
                    <span className="artifact-hotspot-label">{hotspot.label}</span>
                  </button>
                </Html>
              )
            })}
          </group>
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[1.05, 1.16, 0.13, 48]} />
            <meshStandardMaterial color="#07111f" metalness={0.55} roughness={0.42} />
          </mesh>
          <mesh position={[0, -0.425, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.78, 1.02, 48]} />
            <meshBasicMaterial color={a.body === 'moon' ? '#6ee7f9' : '#ed7958'} transparent opacity={0.72} />
          </mesh>
          <OrbitControls
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            autoRotate={spinning}
            autoRotateSpeed={1.35}
            minDistance={2.1}
            maxDistance={4.8}
            target={[0, 0.1, 0]}
          />
        </Canvas>
        <AnimatePresence>
          {activeHotspot && (
            <motion.div
              className={`artifact-task-card ${taskFeedback === 'correct' ? 'complete' : ''}`}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              role="dialog"
              aria-modal="false"
              aria-labelledby={`artifact-task-${activeHotspot.id}`}
            >
              <div className="artifact-task-heading">
                <span><Crosshair size={12} /> Part found: {activeHotspot.label}</span>
                <button type="button" onClick={closeHotspot} aria-label="Close part activity"><X size={14} /></button>
              </div>
              <strong id={`artifact-task-${activeHotspot.id}`}>{activeHotspot.question}</strong>
              <div className="artifact-task-options">
                {activeHotspot.options.map((option, index) => {
                  const chosen = selectedAnswer === index
                  const correct = index === activeHotspot.answer
                  const optionState = chosen ? (correct ? 'correct' : 'wrong') : ''
                  return (
                    <button
                      type="button"
                      key={option}
                      className={optionState}
                      onClick={() => chooseTaskAnswer(index)}
                      disabled={taskFeedback === 'correct'}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>{option}
                    </button>
                  )
                })}
              </div>
              <div className={`artifact-task-feedback ${taskFeedback ?? ''}`} aria-live="polite">
                {taskFeedback === 'correct' && <><CheckCircle2 size={14} /> {activeHotspot.success}</>}
                {taskFeedback === 'wrong' && <><Lightbulb size={14} /> Almost! Try the other idea.</>}
                {!taskFeedback && <><Sparkles size={14} /> Pick the job this real part performed.</>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="artifact-viewer-help">
        <Hand size={13} /> {solvedParts.length}/{hotspots.length} parts found · tap a number · drag to rotate
      </div>
      <div className="artifact-viewer-controls">
        <button type="button" onClick={() => setSpinning((value) => !value)} aria-pressed={spinning}>
          {spinning ? <Pause size={13} /> : <Play size={13} />}
          {spinning ? 'Pause spin' : 'Auto spin'}
        </button>
        <button type="button" onClick={() => {
          closeHotspot()
          setViewerKey((value) => value + 1)
        }}>
          <RotateCcw size={13} /> Reset view
        </button>
      </div>
    </div>
  )
}

function GroundBeacon({
  isActive,
  hover,
  selected
}: {
  isActive: boolean
  hover: boolean
  selected: boolean
}) {
  const pingRingRef = useRef<THREE.Mesh>(null)
  const beaconLightRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (pingRingRef.current) {
      const t = (clock.elapsedTime * 0.75) % 1
      const s = 0.5 + t * 1.9
      pingRingRef.current.scale.set(s, s, s)
      const mat = pingRingRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = (1 - t) * (hover ? 0.8 : 0.5)
    }
    if (beaconLightRef.current) {
      beaconLightRef.current.rotation.y = clock.elapsedTime * 1.8
      beaconLightRef.current.position.y = 1.35 + Math.sin(clock.elapsedTime * 3) * 0.07
    }
  })

  const color = isActive ? '#38bdf8' : '#fbbf24'
  const emissiveColor = isActive ? '#0284c7' : '#d97706'

  return (
    <group>
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.34, 0.44, 36]} />
        <meshBasicMaterial color={color} transparent opacity={hover || selected ? 0.95 : 0.6} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.32, 24]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.65} depthWrite={false} />
      </mesh>

      <mesh ref={pingRingRef} position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.36, 0.44, 36]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.014, 0.038, 1.3, 8]} />
        <meshBasicMaterial color={color} transparent opacity={hover || selected ? 0.65 : 0.3} depthWrite={false} />
      </mesh>

      <mesh ref={beaconLightRef} position={[0, 1.35, 0]}>
        <octahedronGeometry args={[0.13]} />
        <meshStandardMaterial
          color={color}
          emissive={emissiveColor}
          emissiveIntensity={hover || selected ? 2.6 : 1.4}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  )
}

function ArtifactModel({
  a,
  selected,
  collected,
  onSelect,
  onHoverChange
}: {
  a: Artifact
  selected: boolean
  collected: boolean
  onSelect: (a: Artifact) => void
  onHoverChange?: (hovering: boolean) => void
}) {
  const g = useRef<THREE.Group>(null)
  const [hover, setHover] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isFacingCam = useRef(true)
  const p = useMemo(() => pos(a, 1.006), [a])
  const up = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(...p).normalize()
      ),
    [p]
  )

  const isActive =
    a.talking.toLowerCase().startsWith('yes') ||
    a.status.toLowerCase().includes('working') ||
    a.status.toLowerCase().includes('returning')

  const handlePointerOver = (e: any) => {
    e.stopPropagation()
    if (!isFacingCam.current) return
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setHover(true)
    onHoverChange?.(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = setTimeout(() => {
      setHover(false)
      onHoverChange?.(false)
      document.body.style.cursor = 'default'
    }, 280)
  }

  const handleInspect = (e: any) => {
    e.stopPropagation()
    if (!isFacingCam.current) return
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setHover(false)
    onHoverChange?.(false)
    spaceAudio.playChirp()
    onSelect(a)
  }

  useFrame(({ camera }) => {
    if (!g.current) return
    const targetScale = selected ? 0.2 : hover ? 0.165 : 0.125
    g.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15)

    // Check if pin is on the camera-facing hemisphere of the globe
    const worldPos = new THREE.Vector3()
    g.current.getWorldPosition(worldPos)
    const pinNorm = worldPos.clone().normalize()
    const camDir = camera.position.clone().sub(worldPos).normalize()
    isFacingCam.current = pinNorm.dot(camDir) > 0.08

    if (!isFacingCam.current && hover) {
      setHover(false)
      onHoverChange?.(false)
    }
  })

  return (
    <group
      ref={g}
      position={p}
      quaternion={up}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleInspect}
    >
      <GroundBeacon isActive={isActive} hover={hover} selected={selected} />

      <ArtifactShape a={a} active={hover} />

      {collected && (
        <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.58, 36]} />
          <meshBasicMaterial color="#6ee7f9" transparent opacity={0.85} />
        </mesh>
      )}

      {/* Enlarged invisible hit volume ensuring effortless hover and clicking */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[1.5, 1.8, 2.6, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {hover && (
        <Html center position={[0, 2.1, 0]} style={{ pointerEvents: 'auto' }} zIndexRange={[100, 0]}>
          <div
            className={`pin-telemetry-card ${a.body}`}
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
              setHover(true)
              onHoverChange?.(true)
            }}
            onMouseLeave={handlePointerOut}
            onClick={handleInspect}
          >
            <div className="pin-card-header">
              <span className="pin-type-pill">{a.type}</span>
              <span className={`pin-status-pill ${isActive ? 'active' : 'historic'}`}>
                <span className="pin-status-pulse" />
                {isActive ? 'STILL EXPLORING' : 'STORY TO FIND'}
              </span>
            </div>

            <div className="pin-card-name">{a.name}</div>

            <div className="pin-card-sub">
              <span className="pin-sub-item">{a.mission}</span>
              <span className="pin-sub-dot">/</span>
              <span className="pin-sub-item">{a.year}</span>
              <span className="pin-sub-dot">/</span>
              <span className="pin-sub-body">{a.body === 'moon' ? 'LUNAR' : 'MARTIAN'}</span>
            </div>

            <button
              className="pin-action-button"
              type="button"
              onClick={handleInspect}
              aria-label={`Open the story of ${a.name}`}
            >
              <span className="pin-action-label">Open this space story</span>
              <span className="pin-action-icon">→</span>
            </button>

            <div className="pin-card-pointer" />
          </div>
        </Html>
      )}
    </group>
  )
}

// ---------------------------------------------------------
// ENHANCED SOLAR SYSTEM (ALL PLANETS OF OUR SYSTEM)
// ---------------------------------------------------------
function FullSolarSystem({
  visible,
  onTargetSelect,
  activePlanet
}: {
  visible: boolean
  onTargetSelect: (b: Body) => void
  activePlanet?: Body
}) {
  const coronaRef = useRef<THREE.Mesh>(null)
  const earthRef = useRef<THREE.Group>(null)
  const marsRef = useRef<THREE.Group>(null)
  const moonGroupRef = useRef<THREE.Group>(null)
  const moonBeaconPulseRef = useRef<THREE.Mesh>(null)
  const marsBeaconPulseRef = useRef<THREE.Mesh>(null)

  const mercuryRef = useRef<THREE.Mesh>(null)
  const venusRef = useRef<THREE.Mesh>(null)
  const jupiterRef = useRef<THREE.Group>(null)
  const saturnRef = useRef<THREE.Group>(null)
  const uranusRef = useRef<THREE.Mesh>(null)
  const neptuneRef = useRef<THREE.Mesh>(null)
  const plutoRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime

    if (coronaRef.current) {
      const pulse = 1 + Math.sin(t * 2) * 0.05
      coronaRef.current.scale.set(pulse, pulse, pulse)
    }

    // 1. Mercury (r = 1.5, speed = 0.8)
    if (mercuryRef.current) {
      const a = t * 0.8
      mercuryRef.current.position.set(Math.cos(a) * 1.5, 0, Math.sin(a) * 1.5)
    }

    // 2. Venus (r = 2.3, speed = 0.55)
    if (venusRef.current) {
      const a = t * 0.55 + 0.8
      venusRef.current.position.set(Math.cos(a) * 2.3, 0, Math.sin(a) * 2.3)
    }

    // 3. Earth & Moon (r = 3.5, speed = 0.35)
    if (earthRef.current) {
      const a = t * 0.35
      earthRef.current.position.set(Math.cos(a) * 3.5, 0, Math.sin(a) * 3.5)
      earthRef.current.rotation.y += delta * 0.5
    }
    if (moonGroupRef.current) {
      const mAngle = t * 2.2
      moonGroupRef.current.position.set(Math.cos(mAngle) * 0.72, 0, Math.sin(mAngle) * 0.72)
    }
    if (moonBeaconPulseRef.current) {
      const p = 1.32 + Math.sin(t * 3.0) * 0.12
      moonBeaconPulseRef.current.scale.set(p, p, p)
    }

    // 4. Mars (r = 5.2, speed = 0.22)
    if (marsRef.current) {
      const a = t * 0.22 + 1.2
      marsRef.current.position.set(Math.cos(a) * 5.2, 0, Math.sin(a) * 5.2)
      marsRef.current.rotation.y += delta * 0.4
    }
    if (marsBeaconPulseRef.current) {
      const p = 1.24 + Math.sin(t * 2.8 + 1.2) * 0.1
      marsBeaconPulseRef.current.scale.set(p, p, p)
    }

    // 5. Jupiter (r = 8.5, speed = 0.12)
    if (jupiterRef.current) {
      const a = t * 0.12 + 2.5
      jupiterRef.current.position.set(Math.cos(a) * 8.5, 0, Math.sin(a) * 8.5)
      jupiterRef.current.rotation.y += delta * 0.3
    }

    // 6. Saturn (r = 11.6, speed = 0.08)
    if (saturnRef.current) {
      const a = t * 0.08 + 4.1
      saturnRef.current.position.set(Math.cos(a) * 11.6, 0, Math.sin(a) * 11.6)
      saturnRef.current.rotation.y += delta * 0.2
    }

    // 7. Uranus (r = 14.5, speed = 0.05)
    if (uranusRef.current) {
      const a = t * 0.05 + 1.7
      uranusRef.current.position.set(Math.cos(a) * 14.5, 0, Math.sin(a) * 14.5)
    }

    // 8. Neptune (r = 17.2, speed = 0.035)
    if (neptuneRef.current) {
      const a = t * 0.035 + 3.2
      neptuneRef.current.position.set(Math.cos(a) * 17.2, 0, Math.sin(a) * 17.2)
    }

    // 9. Pluto (r = 19.5, speed = 0.02)
    if (plutoRef.current) {
      const a = t * 0.02 + 0.5
      plutoRef.current.position.set(Math.cos(a) * 19.5, Math.sin(a) * 0.75, Math.sin(a) * 19.5)
    }
  })

  // Asteroid belt points
  const asteroids = useMemo(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i < 300; i++) {
      const a = (i / 300) * Math.PI * 2 + (Math.random() - 0.5) * 0.04
      const r = 6.2 + Math.random() * 0.9
      const y = (Math.random() - 0.5) * 0.16
      pts.push([Math.cos(a) * r, y, Math.sin(a) * r])
    }
    return pts
  }, [])

  return (
    <group visible={visible}>
      {/* 1. THE SUN (Realistic Photosphere, Limb Darkening & Coronal Atmosphere) */}
      <RealisticSun radius={0.82} />

      <SolarWindParticles visible={visible} />

      {/* 2. CELESTIAL ORBIT TRACKS (With Earth & Mars highlighted) */}
      {[1.5, 2.3, 3.5, 5.2, 8.5, 11.6, 14.5, 17.2, 19.5].map((rad, idx) => (
        <mesh key={rad} rotation={[Math.PI / 2, idx === 8 ? 0.16 : 0, 0]}>
          <ringGeometry args={[rad, rad + 0.005, 128]} />
          <meshBasicMaterial
            color={idx === 2 ? '#38bdf8' : idx === 3 ? '#fb923c' : '#475569'}
            transparent
            opacity={idx === 2 || idx === 3 ? 0.3 : 0.09}
          />
        </mesh>
      ))}

      {/* 3. MERCURY (Enlarged) */}
      <mesh ref={mercuryRef}>
        <sphereGeometry args={[0.11, 20, 20]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.88} />
      </mesh>

      {/* 4. VENUS (Enlarged) */}
      <mesh ref={venusRef}>
        <sphereGeometry args={[0.18, 22, 22]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.65} />
      </mesh>

      {/* 5. EARTH & MOON SYSTEM (Enlarged & Prominently Highlighted) */}
      <group ref={earthRef}>
        {/* Earth Globe */}
        <mesh
          onClick={(e) => {
            e.stopPropagation()
            onTargetSelect('moon')
          }}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default'
          }}
        >
          <sphereGeometry args={[0.24, 28, 28]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>
        {/* Earth Atmospheric Halo */}
        <mesh scale={1.1}>
          <sphereGeometry args={[0.24, 20, 20]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.28} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* Orbit track of Moon around Earth */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.715, 0.725, 64]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>

        {/* Moon Object with Prominent Tactical Highlight */}
        <group ref={moonGroupRef}>
          {/* Moon Sphere */}
          <mesh
            onClick={(e) => {
              e.stopPropagation()
              onTargetSelect('moon')
            }}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'default'
            }}
          >
            <sphereGeometry args={[0.09, 20, 20]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.92} />
          </mesh>

          {/* Moon Natural Spherical Atmosphere / Luminous Aura (No Saturn rings) */}
          <mesh scale={1.22}>
            <sphereGeometry args={[0.09, 20, 20]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>

          {/* Moon Subtle Pulsing Beacon Spherical Halo */}
          <mesh ref={moonBeaconPulseRef} scale={1.38}>
            <sphereGeometry args={[0.09, 20, 20]} />
            <meshBasicMaterial color="#7dd3fc" transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>

          {/* Tactical Target Waypoint Marker above Moon */}
          <mesh position={[0, 0.22, 0]}>
            <octahedronGeometry args={[0.022]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>

          {/* Generous Click Hitbox */}
          <mesh
            onClick={(e) => {
              e.stopPropagation()
              onTargetSelect('moon')
            }}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'default'
            }}
          >
            <sphereGeometry args={[0.35, 12, 12]} />
            <meshBasicMaterial visible={false} />
          </mesh>
        </group>
      </group>

      {/* 6. MARS (Enlarged & Prominently Highlighted) */}
      <group
        ref={marsRef}
        onClick={(e) => {
          e.stopPropagation()
          onTargetSelect('mars')
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
        }}
      >
        <mesh>
          <sphereGeometry args={[0.20, 28, 28]} />
          <meshStandardMaterial color="#c2410c" roughness={0.8} />
        </mesh>
        <mesh scale={1.12}>
          <sphereGeometry args={[0.20, 20, 20]} />
          <meshBasicMaterial color="#ea580c" transparent opacity={0.32} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* Mars Subtle Pulsing Spherical Beacon Aura (No Saturn rings) */}
        <mesh ref={marsBeaconPulseRef} scale={1.28}>
          <sphereGeometry args={[0.20, 20, 20]} />
          <meshBasicMaterial color="#f97316" transparent opacity={0.14} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>

        {/* Tactical Target Waypoint Marker above Mars */}
        <mesh position={[0, 0.42, 0]}>
          <octahedronGeometry args={[0.038]} />
          <meshBasicMaterial color="#f97316" />
        </mesh>

        {/* Generous Click Hitbox */}
        <mesh>
          <sphereGeometry args={[0.48, 16, 16]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </group>

      {/* 7. ASTEROID BELT */}
      {asteroids.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.015 + (i % 3) * 0.007, 6, 6]} />
          <meshStandardMaterial color="#64748b" roughness={0.9} />
        </mesh>
      ))}

      {/* 8. JUPITER (Enlarged) */}
      <group ref={jupiterRef}>
        <mesh>
          <sphereGeometry args={[0.54, 28, 28]} />
          <meshStandardMaterial color="#d97706" roughness={0.65} />
        </mesh>
        <mesh scale={[1.002, 0.36, 1.002]}>
          <sphereGeometry args={[0.54, 24, 12]} />
          <meshStandardMaterial color="#92400e" roughness={0.7} />
        </mesh>
        {[-0.82, -0.68, 0.74, 0.92].map((mx, idx) => (
          <mesh key={idx} position={[mx, 0, idx % 2 === 0 ? 0.06 : -0.06]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshStandardMaterial color="#fde68a" />
          </mesh>
        ))}
      </group>

      {/* 9. SATURN & RINGS (Enlarged) */}
      <group ref={saturnRef}>
        <mesh>
          <sphereGeometry args={[0.42, 28, 28]} />
          <meshStandardMaterial color="#fef08a" roughness={0.7} />
        </mesh>
        <mesh rotation={[Math.PI / 2.3, 0, 0]}>
          <ringGeometry args={[0.54, 1.02, 64]} />
          <meshStandardMaterial color="#ca8a04" transparent opacity={0.78} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 10. URANUS (Enlarged) */}
      <mesh ref={uranusRef}>
        <sphereGeometry args={[0.28, 20, 20]} />
        <meshStandardMaterial color="#67e8f9" roughness={0.6} />
      </mesh>

      {/* 11. NEPTUNE (Enlarged) */}
      <mesh ref={neptuneRef}>
        <sphereGeometry args={[0.26, 20, 20]} />
        <meshStandardMaterial color="#2563eb" roughness={0.6} />
      </mesh>

      {/* 12. PLUTO */}
      <mesh ref={plutoRef}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#d4d4d8" roughness={0.9} />
      </mesh>
    </group>
  )
}

function PlanetSurface({ body }: { body: Body }) {
  const map = useLoader(THREE.TextureLoader, body === 'moon' ? '/moon-surface.webp' : '/mars-surface.webp')

  useEffect(() => {
    map.colorSpace = THREE.SRGBColorSpace
    map.generateMipmaps = true
    map.minFilter = THREE.LinearMipmapLinearFilter
    map.magFilter = THREE.LinearFilter
    map.needsUpdate = true
  }, [map])

  const isMoon = body === 'moon'

  return (
    <meshStandardMaterial
      map={map}
      bumpMap={map}
      bumpScale={isMoon ? 0.042 : 0.028}
      roughness={isMoon ? 0.94 : 0.88}
      metalness={isMoon ? 0.04 : 0.02}
    />
  )
}

function MarsAtmosphere() {
  const shader = useMemo(
    () => ({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
          float alpha = pow(rim, 3.4) * 0.85;
          vec3 col = mix(vec3(0.92, 0.46, 0.28), vec3(0.48, 0.72, 0.94), pow(rim, 1.8));
          gl_FragColor = vec4(col, alpha);
        }
      `
    }),
    []
  )

  return (
    <mesh scale={1.026}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        args={[shader]}
        transparent
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  )
}

function MoonLimbGlow() {
  const shader = useMemo(
    () => ({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
          float alpha = pow(rim, 5.0) * 0.4;
          gl_FragColor = vec4(vec3(0.72, 0.86, 0.96), alpha);
        }
      `
    }),
    []
  )

  return (
    <mesh scale={1.012}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        args={[shader]}
        transparent
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  )
}

// ---------------------------------------------------------
// CINEMATIC CAMERA CONTROLLER (SOLAR -> PLANET ZOOM)
// ---------------------------------------------------------
function CameraRig({
  viewMode,
  transitionState,
  controlsRef,
  isTransitioning
}: {
  viewMode: ViewMode
  transitionState?: TransitionState
  controlsRef?: React.RefObject<any>
  isTransitioning?: boolean
}) {
  const { camera } = useThree()

  useFrame((_, delta) => {
    if (transitionState === 'dive-in') {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, 0, 3.4, delta)
      camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.35, 3.4, delta)
      camera.position.z = THREE.MathUtils.damp(camera.position.z, 2.75, 3.4, delta)
      camera.lookAt(0, 0, 0)
      if (controlsRef?.current) {
        controlsRef.current.target.set(0, 0, 0)
        controlsRef.current.update()
      }
    } else if (transitionState === 'ascend-out') {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, 0, 3.0, delta)
      camera.position.y = THREE.MathUtils.damp(camera.position.y, 10.5, 3.0, delta)
      camera.position.z = THREE.MathUtils.damp(camera.position.z, 18.0, 3.0, delta)
      camera.lookAt(0, 0, 0)
      if (controlsRef?.current) {
        controlsRef.current.target.set(0, 0, 0)
        controlsRef.current.update()
      }
    } else if (transitionState === 'cross-warp') {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, 0, 4.0, delta)
      camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.35, 4.0, delta)
      camera.position.z = THREE.MathUtils.damp(camera.position.z, 3.2, 4.0, delta)
      camera.lookAt(0, 0, 0)
    } else if (viewMode === 'solar') {
      camera.position.y = THREE.MathUtils.damp(camera.position.y, 10.5, 2.0, delta)
      camera.position.z = THREE.MathUtils.damp(camera.position.z, 18.0, 2.0, delta)
      camera.lookAt(0, 0, 0)
    }
  })

  return null
}

function Globe({
  body,
  selected,
  collected,
  onSelect,
  visible
}: {
  body: Body
  selected?: Artifact
  collected: string[]
  onSelect: (a: Artifact) => void
  visible: boolean
}) {
  const root = useRef<THREE.Group>(null)
  const spinGroup = useRef<THREE.Group>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useFrame((_, d) => {
    if (!root.current) return
    const target = visible ? 1 : 0.0001
    root.current.scale.lerp(new THREE.Vector3(target, target, target), visible ? 0.08 : 0.16)

    // Pause auto-rotation when an artifact is hovered or selected so card stays stable!
    if (spinGroup.current && !selected && !hoveredId) {
      spinGroup.current.rotation.y += d * 0.035
    }
  })

  const tiltZ = body === 'mars' ? 0.4396 : 0.0268

  return (
    <group ref={root} scale={visible ? 1 : 0.0001} visible={visible} position={[0, 0, 0]}>
      <group rotation={[0, 0, tiltZ]}>
        <group ref={spinGroup}>
          <mesh>
            <sphereGeometry args={[1, 128, 128]} />
            <PlanetSurface body={body} />
          </mesh>

          {body === 'mars' ? <MarsAtmosphere /> : <MoonLimbGlow />}

          <MarsAtmosphericDust active={body === 'mars' && visible} />

          {artifacts
            .filter((a) => a.body === body)
            .map((a) => (
              <ArtifactModel
                key={a.id}
                a={a}
                selected={selected?.id === a.id}
                collected={collected.includes(a.id)}
                onSelect={onSelect}
                onHoverChange={(isHov) => setHoveredId(isHov ? a.id : null)}
              />
            ))}
        </group>
      </group>
    </group>
  )
}

// ---------------------------------------------------------
// CONTINUOUS SOLAR-TO-PLANET WORLD SCENE
// ---------------------------------------------------------
function WorldScene({
  viewMode,
  body,
  selected,
  collected,
  onSelect,
  onPlanetClick,
  transitionState,
  isTransitioning
}: {
  viewMode: ViewMode
  body: Body
  selected?: Artifact
  collected: string[]
  onSelect: (a: Artifact) => void
  onPlanetClick: (b: Body) => void
  transitionState?: TransitionState
  isTransitioning?: boolean
}) {
  const solarGroup = useRef<THREE.Group>(null)
  const targetOffset = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(({ clock }) => {
    const t = clock.elapsedTime

    if (transitionState === 'dive-in') {
      if (body === 'mars') {
        const marsAngle = t * 0.22 + 1.2
        targetOffset.current.set(-Math.cos(marsAngle) * 5.2, 0, -Math.sin(marsAngle) * 5.2)
      } else {
        const earthAngle = t * 0.35
        const earthX = Math.cos(earthAngle) * 3.5
        const earthZ = Math.sin(earthAngle) * 3.5
        const moonAngle = t * 2.2
        const moonX = earthX + Math.cos(moonAngle) * 0.72
        const moonZ = earthZ + Math.sin(moonAngle) * 0.72
        targetOffset.current.set(-moonX, 0, -moonZ)
      }
    } else {
      targetOffset.current.set(0, 0, 0)
    }

    if (solarGroup.current) {
      solarGroup.current.position.lerp(targetOffset.current, 0.08)
    }
  })

  // Full solar system is visible in solar view or during dive-in / ascend-out
  const showSolar = viewMode === 'solar' || transitionState === 'dive-in' || transitionState === 'ascend-out'
  const showGlobe = viewMode === 'planet' || transitionState === 'dive-in'

  return (
    <>
      <group ref={solarGroup} visible={showSolar}>
        <FullSolarSystem
          visible={showSolar}
          onTargetSelect={onPlanetClick}
          activePlanet={viewMode === 'planet' ? body : undefined}
        />
      </group>

      <Globe
        body={body}
        selected={selected}
        collected={collected}
        onSelect={onSelect}
        visible={showGlobe}
      />
    </>
  )
}

function StoryOverlay({
  a,
  collected,
  completedChallenges,
  onCollect,
  onCompleteChallenge,
  onClose,
  onNext,
  onFacts
}: {
  a: Artifact
  collected: string[]
  completedChallenges: string[]
  onCollect: () => void
  onCompleteChallenge: (artifactId: string) => void
  onClose: () => void
  onNext: () => void
  onFacts: () => void
}) {
  const story = storyById[a.id]
  const [step, setStep] = useState(0)
  const [answer, setAnswer] = useState<number | null>(() =>
    completedChallenges.includes(a.id) ? story.challenge.answer : null
  )
  const [showHint, setShowHint] = useState(false)
  const stepLabels = ['Meet', 'Adventure', 'Now', 'Why it stayed']
  const challengeComplete = completedChallenges.includes(a.id) || answer === story.challenge.answer

  const chooseAnswer = (option: number) => {
    setAnswer(option)
    setShowHint(false)
    if (option === story.challenge.answer) {
      onCompleteChallenge(a.id)
      spaceAudio.playChirp()
    }
  }

  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && step < 3) setStep((s) => s + 1)
      if (e.key === 'ArrowLeft' && step > 0) setStep((s) => s - 1)
    }
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [step, onClose])

  return (
    <motion.div className="story-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="story-header">
        <div className="story-header-copy">
          <span>SPACE STORY {String(story.letterNumber).padStart(2, '0')} / {stories.length}</span>
          <small>{a.name}</small>
        </div>
        <div className="story-header-actions">
          <span className="story-star-count" aria-label={`${completedChallenges.length} of ${stories.length} signal stars earned`}>
            <Star size={13} fill="currentColor" /> {completedChallenges.length}/{stories.length} signal stars
          </span>
          <button onClick={onClose} aria-label="Close story">
            <X />
          </button>
        </div>
      </div>
      <div className="story-layout">
        <div className={`story-art ${a.body}`}>
          <StoryArtifactViewer a={a} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', position: 'relative', zIndex: 1 }}>
            <span className="story-type-pill">
              {a.type}
            </span>
            <span>
              {a.mission} · {a.year}
            </span>
          </div>
        </div>
        <div className="story-copy">
          <span className="story-step"><Sparkles size={13} /> Story page {step + 1} of 4</span>
          <div className="story-map" aria-label="Story pages">
            {stepLabels.map((label, index) => (
              <button
                type="button"
                key={label}
                className={index === step ? 'active' : index < step ? 'done' : ''}
                onClick={() => setStep(index)}
                aria-current={index === step ? 'step' : undefined}
              >
                <span>{index < step ? <CheckCircle2 size={12} /> : index + 1}</span>
                {label}
              </button>
            ))}
          </div>
          <span className="story-kicker">{story.kicker}</span>
          <PipNote artifact={a} />
          {step === 0 && (
            <>
              <h1>{story.opening}</h1>
              <p className="beat-label">{story.beats[0].label}</p>
              <p>{story.beats[0].text}</p>
            </>
          )}
          {step > 0 && step < 3 && (
            <>
              <h2>{story.beats[step].label}</h2>
              <p>{story.beats[step].text}</p>
              {step === 2 && (
                <div className={`story-challenge ${challengeComplete ? 'complete' : ''}`}>
                  <div className="challenge-heading">
                    <span><Star size={13} /> Pip’s signal check</span>
                    <strong>{story.challenge.question}</strong>
                  </div>
                  <div className="challenge-options">
                    {story.challenge.options.map((option, index) => {
                      const selectedAnswer = answer === index
                      const isCorrect = index === story.challenge.answer
                      const state = selectedAnswer ? (isCorrect ? 'correct' : 'wrong') : ''
                      return (
                        <button
                          type="button"
                          key={option}
                          className={state}
                          onClick={() => chooseAnswer(index)}
                          aria-pressed={selectedAnswer}
                        >
                          <span>{String.fromCharCode(65 + index)}</span>
                          {option}
                        </button>
                      )
                    })}
                  </div>
                  {answer !== null && (
                    <div className={`challenge-feedback ${challengeComplete ? 'success' : 'retry'}`} role="status">
                      {challengeComplete ? (
                        <><CheckCircle2 size={17} /> <span>{story.challenge.success}</span></>
                      ) : (
                        <>
                          <Lightbulb size={17} />
                          <span>Good try! Look back at the story, then choose again.</span>
                          <button type="button" onClick={() => setShowHint((value) => !value)}>
                            {showHint ? 'Hide clue' : 'Show a clue'}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  {showHint && !challengeComplete && <p className="challenge-hint">Clue: {story.challenge.hint}</p>}
                </div>
              )}
            </>
          )}
          {step === 3 && (
            <>
              <div className="thread">
                <strong>{story.humanThread.title}</strong>
                <p>{story.humanThread.text}</p>
              </div>
              <p className="why">
                <strong>Why is it still there?</strong>
                {story.whyItStayed}
              </p>
              <div className="science-payoff">
                <span><Sparkles size={14} /> Science unlocked</span>
                <strong>{a.did}</strong>
                <p>{a.fact}</p>
              </div>
              <h2 className="closing">{story.closing}</h2>
              {challengeComplete ? (
                <div className="signal-earned"><Star size={16} fill="currentColor" /> Signal star earned for this story!</div>
              ) : (
                <button type="button" className="signal-missing" onClick={() => setStep(2)}>
                  <Star size={15} /> Try Pip’s signal check to earn a star
                </button>
              )}
              <div className="story-actions">
                <button onClick={onCollect}>{collected.includes(a.id) ? 'Story card saved ✓' : 'Save this story card'}</button>
                <button onClick={onFacts}>See quick facts</button>
              </div>
            </>
          )}
          <div className="story-nav">
            <button disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft /> Back
            </button>
            {step < 3 ? (
              <button onClick={() => setStep((s) => s + 1)}>
                Next page <ChevronRight />
              </button>
            ) : (
              <button onClick={onNext}>
                Next space story <ChevronRight />
              </button>
            )}
          </div>
          <div className="story-dots">
            {[0, 1, 2, 3].map((i) => (
              <button key={i} className={i === step ? 'on' : ''} onClick={() => setStep(i)} aria-label={`Step ${i + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Page() {
  const [viewMode, setViewMode] = useState<ViewMode>('solar')
  const [body, setBody] = useState<Body>('moon')
  const [selected, setSelected] = useState<Artifact>()
  const [collected, setCollected] = useState<string[]>([])
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])
  const [progressReady, setProgressReady] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [audioOn, setAudioOn] = useState(false)

  const [journal, setJournal] = useState(false)
  const [facts, setFacts] = useState(false)

  // Escape closes the journal and quick-facts panel. The story overlay keeps
  // its own handler (which also drives the arrow-key page turns).
  useEffect(() => {
    if (!journal && !facts) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setJournal(false)
      setFacts(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [journal, facts])
  const [view, setView] = useState<'globe' | 'list'>('globe')
  const [story, setStory] = useState(false)

  useEffect(() => {
    const readProgress = (key: string) => {
      try {
        const saved = JSON.parse(window.localStorage.getItem(key) ?? '[]')
        return Array.isArray(saved)
          ? saved.filter((id): id is string => typeof id === 'string' && Boolean(byId[id]))
          : []
      } catch {
        return []
      }
    }

    setCollected(readProgress(COLLECTION_KEY))
    setCompletedChallenges(readProgress(CHALLENGE_KEY))
    setProgressReady(true)
  }, [])

  useEffect(() => {
    if (!progressReady) return
    try {
      window.localStorage.setItem(COLLECTION_KEY, JSON.stringify(collected))
      window.localStorage.setItem(CHALLENGE_KEY, JSON.stringify(completedChallenges))
    } catch {
      // Progress still works for this visit when browser storage is unavailable.
    }
  }, [collected, completedChallenges, progressReady])

  // Landing cards can open a world or jump straight to the exact featured machine.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const world = params.get('world')
    const artifact = params.get('artifact')

    if (artifact && byId[artifact]) {
      const featured = byId[artifact]
      setBody(featured.body)
      setSelected(featured)
      setViewMode('planet')
      setStory(true)
      return
    }

    if (world === 'moon' || world === 'mars') {
      setBody(world)
      setViewMode('planet')
    }
  }, [])

  const zoomToPlanet = (targetBody: Body) => {
    setBody(targetBody)
    setIsTransitioning(true)
    spaceAudio.playWarp()

    setTimeout(() => {
      setViewMode('planet')
      setIsTransitioning(false)
    }, 950)
  }

  const zoomToSolar = () => {
    setIsTransitioning(true)
    spaceAudio.playWarp()

    setTimeout(() => {
      setViewMode('solar')
      setSelected(undefined)
      setStory(false)
      setIsTransitioning(false)
    }, 850)
  }

  const switchPlanet = (targetBody: Body) => {
    if (targetBody === body && viewMode === 'planet') return
    setBody(targetBody)
    if (viewMode === 'solar') {
      zoomToPlanet(targetBody)
    } else {
      setIsTransitioning(true)
      spaceAudio.playWarp()
      setTimeout(() => {
        setIsTransitioning(false)
      }, 700)
    }
  }

  const select = (a: Artifact) => {
    setSelected(a)
    setBody(a.body)
    setViewMode('planet')
    setStory(true)
  }

  const collect = () =>
    selected && setCollected((c) => (c.includes(selected.id) ? c.filter((x) => x !== selected.id) : [...c, selected.id]))

  const completeChallenge = (artifactId: string) =>
    setCompletedChallenges((current) =>
      current.includes(artifactId) ? current : [...current, artifactId]
    )

  const next = () => {
    if (!selected) return
    const n = byId[storyById[selected.id].nextId]
    setStory(false)
    setTimeout(() => select(n), 280)
  }

  const toggleSound = () => {
    const newState = spaceAudio.toggle()
    setAudioOn(newState)
  }

  return (
    <main className="still-there">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Back to home" title="Back to home">
          <span className="brand-mark">
            <Crosshair size={16} />
          </span>{' '}
          ABANDONED SILENCE!
        </Link>

        {/* Central Planet / Solar System Switch */}
        <div className="world-switch">
          <button
            className={`solar-toggle-btn ${viewMode === 'solar' ? 'active' : ''}`}
            onClick={zoomToSolar}
            title="View Full Solar System"
          >
            <Orbit size={13} /> Space map
          </button>
          <button
            className={viewMode === 'planet' && body === 'moon' ? 'active' : ''}
            onClick={() => switchPlanet('moon')}
          >
            🌕 Moon
          </button>
          <button
            className={viewMode === 'planet' && body === 'mars' ? 'active mars' : ''}
            onClick={() => switchPlanet('mars')}
          >
            🔴 Mars
          </button>
        </div>

        <div className="top-actions">
          <button
            className={`audio-toggle-btn ${audioOn ? 'on' : ''}`}
            onClick={toggleSound}
            aria-label="Toggle Sound"
            title={audioOn ? 'Audio On (Synthesizer active)' : 'Audio Muted'}
          >
            {audioOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button className="view-toggle" onClick={() => setView(view === 'globe' ? 'list' : 'globe')}>
            <Compass size={15} /> {view === 'globe' ? 'Story cards' : '3D world'}
          </button>
          <button className="journal-button" onClick={() => setJournal(true)}>
            <BookOpen size={16} /> My cards <b>{collected.length}</b>
            <span>/{stories.length}</span>
          </button>
          <button className="star-counter" onClick={() => setJournal(true)} aria-label={`${completedChallenges.length} of ${stories.length} signal stars earned`}>
            <Star size={15} fill="currentColor" /> <b>{completedChallenges.length}</b><span>/{stories.length}</span>
          </button>
        </div>
      </header>

      <section className="scene">
        <div className="scene-glow" />
        <div className={`warp-vignette ${isTransitioning ? 'active' : ''}`} />

        {view === 'globe' && !story && !facts && !journal && (
          <div className={`comic-mission-banner ${body} ${viewMode}`}>
            <span><Rocket size={13} /> Pip’s mission</span>
            <strong>
              {viewMode === 'solar'
                ? 'Pick a world and begin the adventure!'
                : body === 'moon'
                  ? 'Spin the Moon. Find a glowing story pin!'
                  : 'Explore Mars. Meet a brave robot!'}
            </strong>
            <small>{viewMode === 'solar' ? 'Moon mystery or Mars adventure?' : 'Tap a pin to hear the machine tell its story.'}</small>
          </div>
        )}

        <Canvas
          camera={{ position: [0, 9.5, 16.5], fov: 42 }}
          dpr={[1, 1.8]}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2
          }}
        >
          <color attach="background" args={['#030509']} />
          <CameraRig viewMode={viewMode} isTransitioning={isTransitioning} />

          {/* Primary Sunlight */}
          <directionalLight position={[5, 4.5, 5.5]} intensity={2.8} color="#fffcf2" />

          {/* Secondary Planetary fill on dark side */}
          {body === 'moon' && viewMode === 'planet' ? (
            <directionalLight position={[-5, -1.8, -3]} intensity={0.42} color="#527d9a" />
          ) : (
            <directionalLight position={[-4, -2, -3]} intensity={0.3} color="#2b1e2a" />
          )}

          <ambientLight intensity={0.18} />

          {/* Deep Space Stars */}
          <Stars radius={60} depth={45} count={2600} factor={4} fade speed={0.4} />

          {/* Floating Cosmic Star Dust Motes */}
          <CosmicStarDust />

          {/* Warp Streak Particles during Zoom transitions */}
          <WarpStreakParticles active={isTransitioning} />

          {/* Unified Scene: Solar System with Planets, smoothly zooming into Mars or Moon */}
          <WorldScene
            viewMode={viewMode}
            body={body}
            selected={selected}
            collected={collected}
            onSelect={select}
            onPlanetClick={zoomToPlanet}
            isTransitioning={isTransitioning}
          />

          <OrbitControls
            enablePan={false}
            enableZoom
            minDistance={viewMode === 'solar' ? 5.5 : 1.38}
            maxDistance={viewMode === 'solar' ? 26 : 4.5}
            autoRotate={viewMode === 'solar' && !isTransitioning}
            autoRotateSpeed={0.18}
          />
        </Canvas>

        {/* Telemetry Card (When zoomed into planet) */}
        {viewMode === 'planet' && (
          <div className="telemetry-card">
            <div className="telemetry-header">
              <span>{body === 'moon' ? '🌕 MOON WOWS' : '🔴 MARS WOWS'}</span>
              <span>PIP’S NOTES</span>
            </div>
            <div className="telemetry-grid">
              <div className="telemetry-item">
                <span className="telemetry-label">How far from home?</span>
                <span className="telemetry-val">{body === 'moon' ? '384,400 km' : 'About 225 million km'}</span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">How high could you jump?</span>
                <span className="telemetry-val">{body === 'moon' ? 'About 6× higher!' : 'About 2.5× higher!'}</span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">One day lasts</span>
                <span className="telemetry-val">{body === 'moon' ? '29.5 Earth days' : '24 hours 39 minutes'}</span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">Stories to find</span>
                <span className="telemetry-val">{artifacts.filter((a) => a.body === body).length} machine stories</span>
              </div>
            </div>
          </div>
        )}

        {/* Solar Navigation HUD (At first glance in Solar System view) */}
        {viewMode === 'solar' && (
          <div className="solar-hud">
            <span className="solar-hud-label">Pick a chapter:</span>
            <button className="solar-hud-btn moon" onClick={() => zoomToPlanet('moon')}>
              <span className="dot" /> Moon mystery
            </button>
            <button className="solar-hud-btn mars" onClick={() => zoomToPlanet('mars')}>
              <span className="dot" /> Mars adventure
            </button>
          </div>
        )}

        {/* List View */}
        {view === 'list' && (
          <div className="list-view">
            <div className="list-heading">
              <span>{body === 'moon' ? '🌕 Moon' : '🔴 Mars'} Story Cards</span>
              <small>{artifacts.filter((a) => a.body === body).length} stories waiting for you</small>
            </div>
            <div className="artifact-grid">
              {artifacts
                .filter((a) => a.body === body)
                .map((a) => (
                  <button className="artifact-card" key={a.id} onClick={() => select(a)}>
                    <span className={`card-orb ${body}`}>{a.type === 'Rover' ? '◈' : a.type === 'Aircraft' ? '✦' : '◇'}</span>
                    <span>
                      <strong>{a.name}</strong>
                      <small>
                        {a.type} · {a.year}
                      </small>
                      <em>{a.fact}</em>
                    </span>
                    <ChevronRight />
                  </button>
                ))}
            </div>
          </div>
        )}
      </section>

      {/* Commander Pip stays with you in the globe view, and steps aside for
          letters, the facts sheet, the journal and the list. */}
      {view === 'globe' && !story && !facts && !journal && (
        <PipGuide side="right" variant="explore" compact />
      )}

      <AnimatePresence>
        {story && selected && !facts && (
          <StoryOverlay
            a={selected}
            collected={collected}
            completedChallenges={completedChallenges}
            onCollect={collect}
            onCompleteChallenge={completeChallenge}
            onClose={() => {
              setStory(false)
              setSelected(undefined)
            }}
            onNext={next}
            onFacts={() => setFacts(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {facts && selected && (
          <motion.div
            className="facts-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.name} quick facts`}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <button onClick={() => setFacts(false)} aria-label="Close facts">
              <X />
            </button>
            <span className="story-kicker">QUICK FACTS · {selected.mission}</span>
            <h2>{selected.name}</h2>
            {[
              ['Meet the machine', selected.was],
              ['Its big job', selected.did],
              ['Where it is now', selected.rests],
              ['Can it still say hello?', selected.talking]
            ].map(([l, t]) => (
              <div className="fact-section" key={l}>
                <label>{l}</label>
                <p>{t}</p>
              </div>
            ))}
            <div className="fun-fact">
              <CircleHelp size={16} />
              <p><strong>Pip’s space wow:</strong> {selected.fact}</p>
            </div>
            <small>SOURCE · NASA / JPL ARCHIVES</small>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {journal && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="journal-modal" role="dialog" aria-modal="true" aria-label="Your space story cards">
              <button onClick={() => setJournal(false)} aria-label="Close journal">
                <X />
              </button>
              <div className="eyebrow">
                <span /> YOUR SPACE COLLECTION
              </div>
              <h2>My Space Story Cards</h2>
              <div className="collection-summary">
                <p><BookOpen size={15} /> <strong>{collected.length}</strong> of {artifacts.length} story cards saved</p>
                <p><Star size={15} fill="currentColor" /> <strong>{completedChallenges.length}</strong> of {stories.length} signal stars earned</p>
              </div>
              <div className="progress-track">
                <div style={{ width: `${(collected.length / artifacts.length) * 100}%` }} />
              </div>
              <div className="journal-grid">
                {artifacts.map((a) => (
                  <button
                    className={`journal-card ${collected.includes(a.id) ? 'found' : ''}`}
                    key={a.id}
                    onClick={() => collected.includes(a.id) && select(a)}
                  >
                    {completedChallenges.includes(a.id) && (
                      <span className="journal-star" aria-label="Signal star earned"><Star size={13} fill="currentColor" /></span>
                    )}
                    <strong>{collected.includes(a.id) ? a.name : 'Mystery story'}</strong>
                    <small>{collected.includes(a.id) ? a.mission : 'Find its glowing pin'}</small>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
