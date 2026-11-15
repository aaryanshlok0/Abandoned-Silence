'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowUpRight, ChevronDown, Telescope } from 'lucide-react'
import {
  GROUP_NAME,
  discoveries,
  type Discovery,
  type DiscoveryGroup
} from '@/src/data/discoveries'
import s from './science.module.css'

type Filter = 'all' | DiscoveryGroup

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'moon', label: 'The Moon' },
  { id: 'mars', label: 'Mars' },
  { id: 'deep', label: 'Deep space' }
]

function groupClass(group: DiscoveryGroup) {
  return group === 'mars' ? s.tagMars : group === 'deep' ? s.tagDeep : s.tagMoon
}

export default function SciencePage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  const visible = useMemo(
    () => (filter === 'all' ? discoveries : discoveries.filter((d) => d.group === filter)),
    [filter]
  )

  const toggle = (id: string) => setOpenId((current) => (current === id ? null : id))

  const counts = useMemo(
    () => ({
      all: discoveries.length,
      moon: discoveries.filter((d) => d.group === 'moon').length,
      mars: discoveries.filter((d) => d.group === 'mars').length,
      deep: discoveries.filter((d) => d.group === 'deep').length
    }),
    []
  )

  return (
    <main className={s.page}>
      <div className={s.shell}>
        <header className={s.topbar}>
          <Link href="/" className={s.back}>
            <ArrowLeft size={15} /> Home
          </Link>
          <Link href="/explore" className={s.back}>
            Field guide <ArrowUpRight size={14} />
          </Link>
        </header>

        <p className={s.eyebrow}>
          <Telescope size={13} /> Science discoveries
        </p>
        <h1 className={s.title}>What did we find out there?</h1>
        <p className={s.sub}>
          Seven big questions. Tap one to see what we learned — and the machines that found it out.
        </p>

        <div className={s.filters} role="group" aria-label="Choose a place">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${s.filter} ${filter === item.id ? s.filterOn : ''}`}
              aria-pressed={filter === item.id}
              onClick={() => {
                setFilter(item.id)
                setOpenId(null)
              }}
            >
              {item.label}
              <span className={s.filterCount}>{counts[item.id]}</span>
            </button>
          ))}
        </div>

        <div className={s.grid}>
          {visible.map((discovery) => (
            <Card
              key={discovery.id}
              discovery={discovery}
              open={openId === discovery.id}
              onToggle={() => toggle(discovery.id)}
            />
          ))}
        </div>

        <footer className={s.footer}>
          <p>
            Facts come from NASA mission pages and the NASA Space Science Data Coordinated Archive.
            Want the full records?{' '}
            <Link href="/resources">Open the NASA resource library</Link>.
          </p>
          <p>
            The machines above are real. Their first-person stories in the field guide are
            storytelling, not real transmissions.
          </p>
        </footer>
      </div>
    </main>
  )
}

function Card({
  discovery,
  open,
  onToggle
}: {
  discovery: Discovery
  open: boolean
  onToggle: () => void
}) {
  return (
    <article className={`${s.card} ${open ? s.cardOpen : ''}`}>
      <button
        type="button"
        className={s.cardToggle}
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className={s.emoji} aria-hidden>
          {discovery.emoji}
        </span>

        <span className={s.cardText}>
          <span className={s.question}>{discovery.question}</span>
          <span className={s.short}>{discovery.short}</span>
          <span className={s.cardMeta}>
            <span className={`${s.tag} ${groupClass(discovery.group)}`}>
              {GROUP_NAME[discovery.group]}
            </span>
            <span className={s.machineCount}>
              {discovery.machines.length}{' '}
              {discovery.machines.length === 1 ? 'machine' : 'machines'}
            </span>
          </span>
        </span>

        <span className={`${s.chevron} ${open ? s.chevronOpen : ''}`} aria-hidden>
          <ChevronDown size={18} />
        </span>
      </button>

      {open && (
        <div className={s.detail}>
          <p className={s.answer}>{discovery.answer}</p>

          <div className={s.found}>
            <span className={s.label}>What we learned</span>
            <ul>
              {discovery.found.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={s.machines}>
            <span className={s.label}>Tap a machine to meet it</span>
            <div className={s.chips}>
              {discovery.machines.map((machine) => (
                <Link key={machine.name} href={machine.href} className={s.chip}>
                  <span>{machine.name}</span>
                  <em>{machine.where}</em>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
