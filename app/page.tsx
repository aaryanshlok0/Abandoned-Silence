'use client'

import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { animate, utils } from 'animejs'
import { ArrowUpRight, Bot, Crosshair, Footprints, Rocket, Sparkles } from 'lucide-react'
import LandingScene from './LandingScene'
import PipGuide from './PipGuide'
import { PipBadge } from './PipAstronaut'
import s from './landing.module.css'

type Body = 'moon' | 'mars'

type Chapter = {
  id: string
  artifactId: string
  body: Body
  kicker: string
  title: string
  lede: string
  paragraphs: string[]
  plate: { label: string; value: string }[]
}

const chapters: Chapter[] = [
  {
    id: 'descent-stage',
    artifactId: 'apollo-11-descent-stage',
    body: 'moon',
    kicker: 'Tranquility Base · 20 July 1969',
    title: 'The launch pad that stayed',
    lede:
      'Apollo 11’s descent stage is not a relic. It is the platform the first Moonwalkers launched from.',
    paragraphs: [
      'Eagle was a two-part machine. The descent stage — four legs, a gold-foil octagon, a bell-shaped engine — did the landing. The ascent stage on top was the cabin.',
      'When Armstrong and Aldrin left, they left the descent stage behind. That is the only way the ascent engine could lift off: the lower half of the lander became the launch pad.',
      'Under the foil sat a seismometer and a solar-wind collector. The seismometer listened to the Moon for about five weeks, until the first lunar night cut its power — the first seismic station on another world.'
    ],
    plate: [
      { label: 'Mission', value: 'Apollo 11' },
      { label: 'Landed', value: '20 July 1969' },
      { label: 'Site', value: '0.67° N, 23.47° E' },
      { label: 'Status', value: 'Still on the surface' }
    ]
  },
  {
    id: 'retroreflectors',
    artifactId: 'apollo-11-retroreflector',
    body: 'moon',
    kicker: 'Laser ranging arrays · 1969–1971',
    title: 'Mirrors that answer back',
    lede:
      'Three small arrays are still measuring the distance to the Moon, one laser pulse at a time.',
    paragraphs: [
      'Apollo 11, 14 and 15 each left a panel of corner cubes: three-sided prisms that bounce light straight back to wherever it came from. No batteries, no moving parts, no software.',
      'Observatories on Earth fire a laser at the array and time the return. The round trip is a little over 2.5 seconds, and the measurement is good to the millimetre. That precision revealed a slow drift in the data: the Moon is moving away from us by about 3.8 centimetres a year.',
      'The astronauts were not the only ones. The Soviet Lunokhods carried French-built arrays too. Lunokhod 1 went silent in 1971 and was lost for decades — until Lunar Reconnaissance Orbiter found it in 2010, and the little mirror answered the next laser pulse.'
    ],
    plate: [
      { label: 'Missions', value: 'Apollo 11, 14, 15' },
      { label: 'First return', value: '1969' },
      { label: 'Power needed', value: 'None' },
      { label: 'Status', value: 'Still ranging' }
    ]
  },
  {
    id: 'rovers',
    artifactId: 'opportunity',
    body: 'mars',
    kicker: 'Gusev Crater & Meridiani Planum · 2004',
    title: 'Ninety days became fifteen years',
    lede:
      'Two rovers built for one season of Martian summer ended up exploring for a decade and a half.',
    paragraphs: [
      'Spirit and Opportunity landed three weeks apart in January 2004 with a 90-sol warranty. Spirit found rocks altered by ancient water, then got its wheels stuck in soft sand in 2009 and worked as a stationary observatory until it fell silent in 2010.',
      'Opportunity found hematite spheres nicknamed “blueberries” — a signature of water — and kept rolling. By the time a planet-wide dust storm darkened its solar panels in June 2018, it had driven 45.16 kilometres, farther than any rover on another world.',
      'Its last downlink was a battery reading, not a sentence. Engineers and reporters rendered the data as “My battery is low and it’s getting dark.” The rover never said it. We did.'
    ],
    plate: [
      { label: 'Missions', value: 'Spirit & Opportunity' },
      { label: 'Landed', value: 'January 2004' },
      { label: 'Designed for', value: '90 sols' },
      { label: 'Status', value: 'Both silent' }
    ]
  },
  {
    id: 'ingenuity',
    artifactId: 'ingenuity',
    body: 'mars',
    kicker: 'Jezero Crater · 19 April 2021',
    title: 'The first flight on another world',
    lede:
      'A 1.8-kilogram helicopter, packed as a demo, flew 72 times in air one percent as thick as Earth’s.',
    paragraphs: [
      'Ingenuity travelled to Mars folded under Perseverance’s belly. Its mission was simple and terrifying: prove that powered flight is possible in an atmosphere so thin the blades must spin far faster than any helicopter on Earth.',
      'On 19 April 2021 it lifted three metres, hovered, turned, and landed. Thirty-nine point one seconds. The plan allowed five flights. It flew 72, scouting terrain and setting speed and altitude records.',
      'On its final flight, in January 2024, a rotor blade was damaged on touchdown. Ingenuity sits on a dune in Jezero Crater now — the first aircraft on another planet, done flying, still the first.',
      'Perseverance is still at work: drilling rock cores, sealing them in titanium tubes, and recording the first sounds heard on Mars — wind, wheels, and the zap of a laser.'
    ],
    plate: [
      { label: 'Craft', value: 'Ingenuity' },
      { label: 'First flight', value: '19 April 2021' },
      { label: 'Flights', value: '72 (5 planned)' },
      { label: 'Status', value: 'Mission complete' }
    ]
  },
  {
    id: 'perseverance',
    artifactId: 'perseverance',
    body: 'mars',
    kicker: 'Jezero Crater · Since 18 February 2021',
    title: 'A rock library for the future',
    lede:
      'Perseverance is packing tiny pieces of Mars into tubes for future explorers to study.',
    paragraphs: [
      'Perseverance landed in Jezero Crater, a place that once held a lake. It drills small cores from rocks that may preserve clues about ancient Mars.',
      'Each core is sealed inside a clean titanium tube. Some tubes are stored inside the rover, while a backup group waits together on the ground at Three Forks.',
      'The rover also carried MOXIE, a toaster-sized experiment that made oxygen from the Martian air. It showed how future astronauts might make some of what they need after they arrive.'
    ],
    plate: [
      { label: 'Mission', value: 'Mars 2020' },
      { label: 'Landed', value: '18 February 2021' },
      { label: 'Job', value: 'Collecting rock samples' },
      { label: 'Status', value: 'Still exploring' }
    ]
  }
]

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const MOTION_KEY = 'still-there.motion'

function ChapterScene({ chapter, index }: { chapter: Chapter; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const side = index % 2 === 0 ? 'right' : 'left'
  const stickers = ['🌙', '✨', '🤖', '🚁', '📡']
  const pipPrompts = [
    'That gold landing stage became the launch pad for the first Moonwalkers. Wild, right?',
    'These tiny mirrors still bounce laser light back to Earth. It is like the Moon saying “ping!”',
    'Spirit and Opportunity were built for 90 days. One explored for almost 15 years!',
    'Ingenuity was a tiny helicopter with a giant first: flight on another planet.',
    'Perseverance is building a tiny rock library on Mars for scientists in the future!'
  ]

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 85, damping: 28, mass: 0.4 })

  const rotateY = useTransform(
    smooth,
    [0, 0.5, 1],
    side === 'right' ? [-13, 0, 11] : [13, 0, -11]
  )
  const z = useTransform(smooth, [0, 0.5, 1], [-300, 0, 220])
  const y = useTransform(smooth, [0, 0.5, 1], ['7%', '0%', '-7%'])
  const scale = useTransform(smooth, [0, 0.5, 1], [0.96, 1, 1.02])
  const opacity = useTransform(smooth, [0, 0.08, 0.5, 0.92, 1], [0, 1, 1, 1, 0])

  const ghostZ = useTransform(smooth, [0, 0.5, 1], [-540, -220, 160])
  const ghostOpacity = useTransform(smooth, [0, 0.2, 0.8, 1], [0, 0.85, 0.85, 0])

  return (
    <article
      ref={ref}
      id={chapter.id}
      data-chapter
      data-index={index}
      className={s.chapter}
    >
      <div className={`${s.chapterInner} ${side === 'right' ? s.innerRight : s.innerLeft}`}>
        <motion.span
          className={`${s.chapterGhost} ${side === 'right' ? s.ghostRight : s.ghostLeft}`}
          aria-hidden
          style={{ z: ghostZ, opacity: ghostOpacity }}
        >
          {String(index + 1).padStart(2, '0')}
        </motion.span>

        <motion.div className={s.panel} style={{ rotateY, z, y, scale, opacity }}>
          <span className={s.scrim} aria-hidden />

          <span className={s.chapterSticker} aria-hidden>
            {stickers[index]}
          </span>

          <div className={s.chapterTop}>
            <span className={s.num}>Adventure card {String(index + 1).padStart(2, '0')}</span>
            <span className={s.kicker}>{chapter.kicker}</span>
          </div>

          <h3>{chapter.title}</h3>
          <p className={s.lede}>{chapter.lede}</p>

          <div className={s.pipNote}>
            <div className={s.pipNoteTop}>
              <span className={s.pipNoteWho}>
                <PipBadge size={17} /> Pip says
              </span>
              <span className={s.pipNoteTag}>Quick space wow</span>
            </div>
            <p className={s.pipNoteText}>{pipPrompts[index]}</p>
            <Link
              href={`/explore?world=${chapter.body}&artifact=${chapter.artifactId}`}
              className={s.pipMission}
            >
              Open this exact machine <ArrowUpRight size={13} />
            </Link>
          </div>
        </motion.div>
      </div>
    </article>
  )
}export default function Page() {
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [active, setActive] = useState(0)
  const [inStory, setInStory] = useState(false)
  const [motionOn, setMotionOn] = useState(false)
  const [resolved, setResolved] = useState(false)
  const [missionPick, setMissionPick] = useState<Body | null>(null)

  // Resolve the saved choice, falling back to the OS preference. Runs before
  // paint so there is no flash of the wrong motion state.
  useIsoLayoutEffect(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(MOTION_KEY)
    } catch {
      stored = null
    }
    const osReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setMotionOn(stored === 'on' ? true : stored === 'off' ? false : !osReduced)

    setResolved(true)
  }, [])

  useIsoLayoutEffect(() => {
    if (!resolved) return
    document.documentElement.dataset.motion = motionOn ? 'on' : 'off'
  }, [resolved, motionOn])

  const reduce = resolved ? !motionOn : true

  const toggleMotion = () => {
    const next = !motionOn
    setMotionOn(next)
    try {
      window.localStorage.setItem(MOTION_KEY, next ? 'on' : 'off')
    } catch {
      // Storage can be unavailable in private modes; the choice still applies.
    }
  }

  // anime.js opens the story with a staggered character reveal and replays it
  // when a visitor opts into motion. With motion off the title stays static.
  useIsoLayoutEffect(() => {
    const title = titleRef.current
    if (!title || !resolved) return

    const chars = Array.from(title.querySelectorAll<HTMLElement>('[data-char]'))
    if (!chars.length) return

    if (!motionOn) {
      chars.forEach((char) => {
        char.style.removeProperty('opacity')
        char.style.removeProperty('transform')
      })
      return
    }

    const animation = animate(chars, {
      opacity: [0, 1],
      translateY: [56, 0],
      rotateX: [-82, 0],
      duration: 1150,
      delay: utils.stagger(38, { start: 180 }),
      ease: 'outExpo'
    })

    return () => animation.revert?.()
  }, [resolved, motionOn])

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 })

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })
  const heroSmooth = useSpring(heroProgress, { stiffness: 80, damping: 24, mass: 0.4 })
  const heroY = useTransform(heroSmooth, [0, 1], ['0%', '-16%'])
  const heroOpacity = useTransform(heroSmooth, [0, 0.85], [1, 0])

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'))
    if (!nodes.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = Number((entry.target as HTMLElement).dataset.index)
          if (!Number.isNaN(index)) setActive(index)
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const story = document.getElementById('story')
      if (!story) return
      const rect = story.getBoundingClientRect()
      setInStory(rect.top < window.innerHeight * 0.62 && rect.bottom > window.innerHeight * 0.38)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const textSide = active % 2 === 0 ? 'right' : 'left'
  const globeSide = inStory ? (textSide === 'right' ? 'left' : 'right') : 'right'
  const body: Body = chapters[active]?.body ?? 'moon'

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <main className={s.root} data-body={body}>
      <div className={s.ambient} aria-hidden />
      <div className={s.canvasWrap} aria-hidden>
        <LandingScene body={body} side={globeSide} still={reduce} active={active} />
      </div>
      <div className={s.vignette} aria-hidden />

      <PipGuide motionOn={motionOn} side={globeSide ?? 'right'} />

      <motion.div className={s.progress} style={{ scaleX: progress }} aria-hidden />

      <header className={s.nav}>
        <a href="#top" className={s.brand}>
          <span className={s.brandMark}>
            <Crosshair size={15} strokeWidth={2.2} />
          </span>
          Abandoned Silence
        </a>
        <span className={s.navNote}>A comic space adventure · Moon &amp; Mars</span>
        <div className={s.navActions}>
          <button
            type="button"
            className={`${s.motionToggle} ${motionOn ? s.motionToggleOn : ''}`}
            onClick={toggleMotion}
            aria-pressed={motionOn}
            aria-label={motionOn ? 'Turn ambient motion off' : 'Turn ambient motion on'}
            title={
              motionOn
                ? 'Ambient motion is on. Click to pause it.'
                : 'Ambient motion is off. Click to enable the full animation.'
            }
          >
            <span className={s.motionLed} aria-hidden />
            <span className={s.motionLabel}>Motion</span>
          </button>
          <Link href="/resources" className={s.navData}>
            NASA data
          </Link>
          <Link href="/explore" className={s.navCta}>
            Pick a world <ArrowUpRight size={14} />
          </Link>
        </div>
      </header>

      <section id="top" className={s.hero} ref={heroRef}>
        <motion.div className={s.heroCopy} style={{ y: heroY, opacity: heroOpacity }}>
          <p className={s.eyebrow}>Hey, space explorer — Pip needs you!</p>
          <h1 className={s.title} ref={titleRef} aria-label="Who is still out there?">
            <span className={s.titleLine} aria-hidden>
              {"Who's still".split('').map((char, i) => (
                <span className={s.char} data-char key={`who-${i}`}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
            <em className={s.titleLine} aria-hidden>
              {'out there?'.split('').map((char, i) => (
                <span className={s.char} data-char key={`out-${i}`}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </em>
          </h1>
          <p className={s.tagline}>The universe remembers what humanity leaves behind</p>
          <p className={s.sub}>
            Team up with Pip, zoom to the Moon or Mars, and discover the amazing machines humans
            left behind. Every glowing pin hides a story!
          </p>

          <div className={s.pipInvite} role="note">
            <PipBadge size={22} />
            <span>
              <strong>Pip is your space buddy</strong> · Tap Pip anytime for a clue or a fun fact.
            </span>
          </div>

          <p className={s.worldPrompt}>
            <Rocket size={16} aria-hidden /> Choose your first mission
          </p>
          <div className={s.missionPicker} aria-label="Choose the kind of adventure you want">
            <span>What sounds most fun?</span>
            <div className={s.missionPickerButtons}>
              <button
                type="button"
                className={missionPick === 'moon' ? s.missionPickerOn : ''}
                onClick={() => setMissionPick('moon')}
                aria-pressed={missionPick === 'moon'}
              >
                <Footprints size={15} aria-hidden /> Follow Moon footprints
              </button>
              <button
                type="button"
                className={missionPick === 'mars' ? s.missionPickerOn : ''}
                onClick={() => setMissionPick('mars')}
                aria-pressed={missionPick === 'mars'}
              >
                <Bot size={15} aria-hidden /> Meet brave Mars robots
              </button>
            </div>
            {missionPick && (
              <small role="status">
                Pip’s pick: start with the {missionPick === 'moon' ? 'Moon mystery' : 'Mars robot adventure'}.
              </small>
            )}
          </div>
          <div className={s.worldChoices}>
            <Link
              href="/explore?world=moon"
              className={`${s.worldCard} ${s.missionMoon} ${missionPick === 'moon' ? s.worldCardRecommended : ''} ${missionPick === 'mars' ? s.worldCardQuiet : ''}`}
            >
              {missionPick === 'moon' && <span className={s.recommendedBadge}>Pip’s pick</span>}
              <span className={s.worldIcon} aria-hidden>🌕</span>
              <span className={s.worldCardCopy}>
                <strong>Moon mission</strong>
                <small>Apollo landers, a laser mirror &amp; Luna 9</small>
              </span>
              <ArrowUpRight className={s.worldArrow} size={20} aria-hidden />
            </Link>
            <Link
              href="/explore?world=mars"
              className={`${s.worldCard} ${s.missionMars} ${missionPick === 'mars' ? s.worldCardRecommended : ''} ${missionPick === 'moon' ? s.worldCardQuiet : ''}`}
            >
              {missionPick === 'mars' && <span className={s.recommendedBadge}>Pip’s pick</span>}
              <span className={s.worldIcon} aria-hidden>🔴</span>
              <span className={s.worldCardCopy}>
                <strong>Mars mission</strong>
                <small>Rovers, landers &amp; the Ingenuity helicopter</small>
              </span>
              <ArrowUpRight className={s.worldArrow} size={20} aria-hidden />
            </Link>
          </div>

          <div className={s.heroBits} aria-label="Adventure highlights">
            <span>7 Moon stories</span>
            <span>10 Mars stories</span>
            <span>17 cards to save</span>
          </div>
        </motion.div>

        <a href="#story" className={s.scrollCue}>
          <span className={s.cueLine} />
          Take the quick story tour
        </a>
      </section>

      {inStory && (
        <nav className={s.rail} aria-label="Chapters">
          {chapters.map((chapter, i) => (
          <button
            key={chapter.id}
            type="button"
            onClick={() => goTo(chapter.id)}
            className={i === active ? s.railOn : ''}
            aria-label={`Go to chapter ${i + 1}: ${chapter.title}`}
            aria-current={i === active ? 'true' : undefined}
          >
            <span className={s.railTitle}>{chapter.title}</span>
            <span className={s.railNum}>{String(i + 1).padStart(2, '0')}</span>
            <span className={s.railTick} />
          </button>
          ))}
        </nav>
      )}

      <div id="story" className={s.story}>
        {chapters.map((chapter, i) => (
          <ChapterScene key={chapter.id} chapter={chapter} index={i} />
        ))}
      </div>

      <section id="outro" className={s.outro}>
        <div className={s.outroInner}>
          <div className={s.finale}>
            <p className={`${s.eyebrow} ${s.eyebrowCenter}`}><Sparkles size={14} /> Your turn, explorer!</p>
            <h2>Ready to solve a space mystery?</h2>
            <p>
              Pick a world, tap the glowing pins, collect machine cards, and let Pip tell you the
              coolest parts out loud.
            </p>
            <div className={s.finaleActions}>
              <Link href="/explore" className={s.cta}>
                Start the adventure <ArrowUpRight size={16} />
              </Link>
              <Link href="/science" className={s.navData}>
                What did we find? <ArrowUpRight size={15} />
              </Link>
            </div>
            <p className={s.fineprint}>Made for curious space explorers and their grown-ups.</p>
          </div>
        </div>
      </section>

      <footer className={s.footer}>
        <span>Abandoned Silence · The universe remembers what humanity leaves behind</span>
        <span>Mission data · NASA / JPL</span>
        <span>
          Independent project, not NASA · built with AI coding assistance · every mission fact
          checked against NASA sources
        </span>
      </footer>
    </main>
  )
}
