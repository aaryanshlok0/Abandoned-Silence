'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, Volume2, X } from 'lucide-react'
import PipAstronaut, { ComicBurst, PipBadge } from './PipAstronaut'
import { speak, stopSpeaking } from './pipSpeech'
import s from './pip.module.css'

const pipFacts = [
  'A day on Mars is only about 37 minutes longer than a day on Earth.',
  'Sunlight takes 8 minutes to reach Earth. A Voyager 1 signal takes more than 22 hours.',
  'A laser pulse sent to the Moon and back takes about 2.5 seconds.',
  'Ingenuity’s blades spun more than 2,000 times a minute — much faster than a helicopter on Earth.',
  'Opportunity drove farther than a marathon — on another planet.',
  'The Moon has almost no air, so footprints there can last a very long time.',
  'Voyager 1 is the farthest human-made object from Earth.',
  'There is water ice at the Moon’s poles and under the surface of Mars.'
]

const navigateText =
  'Hi! I’m Pip, your space buddy. Pick the Moon or Mars and we’ll hunt for amazing machines together!'

const exploreText =
  'Tap a glowing pin and I’ll share the coolest part. You can also ask me to read the story out loud!'

export default function PipGuide({
  motionOn,
  side = 'right',
  variant = 'navigate',
  compact = false
}: {
  motionOn?: boolean
  side?: 'left' | 'right'
  variant?: 'navigate' | 'explore'
  compact?: boolean
}) {
  const [autoMotion, setAutoMotion] = useState(true)
  const [open, setOpen] = useState(false)
  const [fact, setFact] = useState<string | null>(null)
  const [waving, setWaving] = useState(false)
  const [entering, setEntering] = useState(false)
  const playedEntrance = useRef(false)
  const waveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const animate = motionOn ?? autoMotion

  useEffect(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem('still-there.motion')
    } catch {
      stored = null
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setAutoMotion(stored === 'on' ? true : stored === 'off' ? false : !reduced)
  }, [])

  // One comic arrival, then Pip settles down as a small navigator.
  useEffect(() => {
    if (!animate || playedEntrance.current) return
    playedEntrance.current = true
    const start = window.setTimeout(() => setEntering(true), 700)
    const stop = window.setTimeout(() => setEntering(false), 2600)
    return () => {
      window.clearTimeout(start)
      window.clearTimeout(stop)
    }
  }, [animate])

  useEffect(() => {
    return () => {
      stopSpeaking()
      if (waveTimer.current) clearTimeout(waveTimer.current)
    }
  }, [])

  const poke = () => {
    setWaving(true)
    if (waveTimer.current) clearTimeout(waveTimer.current)
    waveTimer.current = setTimeout(() => setWaving(false), 1500)
    if (open) {
      const next = pipFacts[Math.floor(Math.random() * pipFacts.length)]
      setFact(next === fact ? pipFacts[(pipFacts.indexOf(next) + 1) % pipFacts.length] : next)
    } else {
      setFact(null)
      setOpen(true)
    }
  }

  const close = () => {
    stopSpeaking()
    setOpen(false)
    setFact(null)
  }

  const text = fact ?? (variant === 'explore' ? exploreText : navigateText)

  return (
    <div
      className={`${s.guide} ${side === 'left' ? s.left : s.right} ${compact ? s.compact : ''} ${
        !animate ? s.still : ''
      }`}
    >
      <div className={s.astroWrap}>
        {entering && <ComicBurst />}

        {!open && !entering && (
          <span className={s.pill}>
            <strong>Pip says hi!</strong>
            <span>Tap your space buddy</span>
          </span>
        )}

        <button
          type="button"
          className={`${s.astroButton} ${entering ? s.astroEnter : ''}`}
          onClick={poke}
          aria-expanded={open}
          aria-label={open ? 'Ask Pip for a fun fact' : 'Talk to Pip, your space buddy'}
        >
          <span className={s.astroGlow} aria-hidden />
          <PipAstronaut waving={waving} />
          <span className={s.astroTag}>
            <span className={s.astroTagDot} /> Pip
          </span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.section
            className={s.bubble}
            initial={animate ? { y: 10, scale: 0.985 } : false}
            animate={{ y: 0, scale: 1 }}
            exit={animate ? { y: 8, opacity: 0 } : { opacity: 0 }}
            transition={{ duration: animate ? 0.28 : 0, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Pip space buddy navigator"
          >
            <header className={s.head}>
              <div className={s.headWho}>
                <span className={s.headBadge}>
                  <PipBadge size={21} />
                </span>
                <div>
                  <p className={s.headName}>Pip the Space Buddy</p>
                  <p className={s.headRole}>{fact ? 'Fun fact finder' : 'Adventure helper'}</p>
                </div>
              </div>
              <button type="button" className={s.iconButton} onClick={close} aria-label="Close Pip">
                <X size={15} />
              </button>
            </header>

            <div className={s.body}>
              <p className={s.label}>
                {fact ? 'Pip’s space wow' : variant === 'explore' ? 'Need a clue?' : 'Ready for adventure?'}
              </p>
              <p className={s.copy}>{text}</p>

              <div className={s.actions}>
                {variant === 'navigate' && (
                  <>
                    <Link href="/explore?world=moon" className={s.worldLink}>
                      🌕 Zoom to Moon
                    </Link>
                    <Link href="/explore?world=mars" className={`${s.worldLink} ${s.worldMars}`}>
                      🔴 Blast to Mars
                    </Link>
                  </>
                )}
                <button
                  type="button"
                  className={s.ghostButton}
                  onClick={() => {
                    const next = pipFacts[Math.floor(Math.random() * pipFacts.length)]
                    setFact(next === fact ? pipFacts[(pipFacts.indexOf(next) + 1) % pipFacts.length] : next)
                  }}
                >
                  <Sparkles size={13} /> Fun fact
                </button>
                <button type="button" className={s.speechButton} onClick={() => speak(text)}>
                  <Volume2 size={13} /> Hear it
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

export function PipNote({ artifact }: { artifact: { name: string; fact: string } }) {
  const line = `I know this one! ${artifact.fact}`

  return (
    <div className={s.note}>
      <span className={s.noteAvatar} aria-hidden>
        <PipAstronaut waving={false} />
      </span>
      <div className={s.noteBubble}>
        <p className={s.label}>Pip says</p>
        <p className={s.noteText}>{line}</p>
        <button type="button" className={s.speechButton} onClick={() => speak(line)}>
          <Volume2 size={13} /> Hear it
        </button>
      </div>
    </div>
  )
}
