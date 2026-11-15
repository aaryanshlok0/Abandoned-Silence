export type DiscoveryGroup = 'moon' | 'mars' | 'deep'

export interface DiscoveryMachine {
  name: string
  where: string
  href: string
}

export interface Discovery {
  id: string
  emoji: string
  question: string
  short: string
  group: DiscoveryGroup
  answer: string
  found: string[]
  machines: DiscoveryMachine[]
}

export const GROUP_NAME: Record<DiscoveryGroup, string> = {
  moon: 'The Moon',
  mars: 'Mars',
  deep: 'Deep space'
}

export const discoveries: Discovery[] = [
  {
    id: 'water-on-mars',
    emoji: '💧',
    question: 'Was there ever water on Mars?',
    short: 'Yes — rivers and lakes once flowed there.',
    group: 'mars',
    answer:
      'Long ago, Mars was wet. Rovers found rocks that only form in water, and a lander dug up ice that is still there today.',
    found: [
      'Rounded pebbles and layered rocks that were shaped in water',
      'Minerals that form only when water is present',
      'Frozen water just below the surface near the north pole'
    ],
    machines: [
      { name: 'Spirit', where: 'Mars', href: '/explore?artifact=spirit' },
      { name: 'Opportunity', where: 'Mars', href: '/explore?artifact=opportunity' },
      { name: 'Phoenix', where: 'Mars', href: '/explore?artifact=phoenix' },
      { name: 'Curiosity', where: 'Mars', href: '/explore?artifact=curiosity' },
      { name: 'Perseverance', where: 'Mars', href: '/explore?artifact=perseverance' }
    ]
  },
  {
    id: 'mars-inside',
    emoji: '🥁',
    question: 'What is Mars like inside?',
    short: 'It has a crust, a mantle and a core — and it still shakes.',
    group: 'mars',
    answer:
      'InSight put a super-sensitive seismometer on the ground and listened. Marsquakes let scientists measure the planet’s hidden layers without ever digging.',
    found: [
      'More than 1,300 marsquakes were recorded',
      'Mars has a crust, a mantle and a core, like Earth',
      'The core is smaller than scientists first expected'
    ],
    machines: [{ name: 'InSight', where: 'Mars', href: '/explore?artifact=insight' }]
  },
  {
    id: 'moonquakes',
    emoji: '🌕',
    question: 'Why does the Moon shake?',
    short: 'Moonquakes come from deep inside — and from meteorites hitting it.',
    group: 'moon',
    answer:
      'Apollo astronauts left seismometers behind. For years they listened to the Moon creak, settle and ring after impacts.',
    found: [
      'Thousands of moonquakes, including deep ones from inside the Moon',
      'The Moon has a small core',
      'Some quakes last much longer than earthquakes'
    ],
    machines: [{ name: 'Apollo 12 ALSEP', where: 'The Moon', href: '/explore?artifact=apollo-12-alsep' }]
  },
  {
    id: 'moon-dust',
    emoji: '🌫️',
    question: 'What is Moon dust like?',
    short: 'Sharp, clingy, and strong enough to hold a lander.',
    group: 'moon',
    answer:
      'Before people landed, nobody knew if the surface would swallow a spacecraft. Surveyor tested the ground, and Apollo crews brought pieces of it home.',
    found: [
      'The surface is firm enough to land on',
      'Moon dust is made of tiny, sharp, glassy pieces',
      'It sticks to suits and scratches equipment'
    ],
    machines: [
      { name: 'Surveyor 3', where: 'The Moon', href: '/explore?artifact=surveyor-3' },
      { name: 'Apollo 11 lander', where: 'The Moon', href: '/explore?artifact=apollo-11-descent-stage' }
    ]
  },
  {
    id: 'flying-on-mars',
    emoji: '🚁',
    question: 'Can you fly on another planet?',
    short: 'Yes — where the air is about 1% as thick as Earth’s.',
    group: 'mars',
    answer:
      'Ingenuity’s blades spun extremely fast to push against the thin Martian air. It was meant to fly five times and flew 72.',
    found: [
      'The first powered flight on another world',
      '72 flights in almost three years',
      'Aerial scouting can help future rovers and astronauts'
    ],
    machines: [{ name: 'Ingenuity', where: 'Mars', href: '/explore?artifact=ingenuity' }]
  },
  {
    id: 'asteroids',
    emoji: '🪨',
    question: 'What are asteroids made of?',
    short: 'Rock and metal left over from the young solar system.',
    group: 'deep',
    answer:
      'Asteroids are the building blocks that never became planets. Two spacecraft went to inspect them up close.',
    found: [
      'Eros is a rocky body with a dusty, cratered surface',
      'Vesta has a metal core and a rocky crust',
      'Ceres holds water-rich minerals and bright salt deposits'
    ],
    machines: [
      { name: 'NEAR Shoemaker', where: 'Eros', href: '/resources?record=near-shoemaker' },
      { name: 'Dawn', where: 'Vesta & Ceres', href: '/resources?record=dawn' }
    ]
  },
  {
    id: 'exoplanets',
    emoji: '🔭',
    question: 'Are there planets around other stars?',
    short: 'Yes — thousands. Small rocky worlds are common.',
    group: 'deep',
    answer:
      'Kepler watched one patch of sky for years, looking for tiny dips in starlight. Each dip meant a planet passing in front of its star.',
    found: [
      'More than 2,600 planets confirmed',
      'Small, rocky planets are common',
      'Some planets orbit in the habitable zone of their star'
    ],
    machines: [{ name: 'Kepler', where: 'Deep space', href: '/resources?record=kepler' }]
  }
]
