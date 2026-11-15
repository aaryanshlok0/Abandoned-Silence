'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Database, Search, Telescope, X } from 'lucide-react'
import {
  GROUP_LABEL,
  PLACEMENT_LABEL,
  nasaResources,
  resourceGroups,
  type NasaResource,
  type Placement,
  type ResourceGroup
} from '@/src/data/nasaResources'
import s from './resources.module.css'

type GroupFilter = 'all' | ResourceGroup
type StatusFilter = 'all' | Placement

const statuses: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'Any status' },
  { id: 'surface', label: 'On a surface' },
  { id: 'inactive', label: 'Inactive' },
  { id: 'orbiting', label: 'Still in orbit' },
  { id: 'travelling', label: 'Travelling outward' },
  { id: 'active', label: 'Active' }
]

function pillClass(placement: Placement) {
  if (placement === 'orbiting') return s.pillOrbit
  if (placement === 'travelling') return s.pillTravel
  if (placement === 'active') return s.pillActive
  return s.pillSurface
}

function tagClass(group: ResourceGroup) {
  return group === 'mars' ? s.tagMars : group === 'deep' ? s.tagDeep : s.tagMoon
}

export default function ResourcesPage() {
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<GroupFilter>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  const selected = useMemo(
    () => nasaResources.find((resource) => resource.id === openId) ?? null,
    [openId]
  )

  // Deep links from the science page: /resources?record=dawn
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('record')
    if (id && nasaResources.some((resource) => resource.id === id)) setOpenId(id)
  }, [])

  useEffect(() => {
    if (!openId) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openId])

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return nasaResources.filter((resource) => {
      if (group !== 'all' && resource.group !== group) return false
      if (status !== 'all' && resource.placement !== status) return false
      if (!needle) return true
      return [
        resource.name,
        resource.shortName,
        resource.kind,
        resource.destination,
        resource.purpose,
        resource.location
      ]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    })
  }, [query, group, status])

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
          <Link href="/science" className={s.back}>
            Science <ArrowUpRight size={14} />
          </Link>
        </header>

        <p className={s.eyebrow}>
          <Database size={13} /> Official challenge resources
        </p>
        <h1 className={s.title}>The machines, with receipts.</h1>
        <p className={s.sub}>
          All fourteen resources named on the NASA Space Apps 2026 challenge page, checked against
          NASA&apos;s NSSDCA master catalog and NASA Science mission pages. Status and final locations
          are recorded as verified, not invented.
        </p>

        <p className={s.notice}>
          <strong>How to read this page.</strong> Mission facts are sourced. Pip&apos;s first-person
          lines are clearly labelled storytelling — an imagined voice, not a spacecraft transmission
          or a historical quotation. Data last verified <strong>13 November 2026</strong>.
        </p>

        <div className={s.toolbar}>
          <label className={s.search}>
            <Search size={16} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a spacecraft, mission or place"
              aria-label="Search NASA resources"
            />
          </label>

          <div className={s.chips} role="group" aria-label="Filter by destination">
            {resourceGroups.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${s.chip} ${group === item.id ? s.chipOn : ''}`}
                aria-pressed={group === item.id}
                onClick={() => setGroup(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <label className={s.statusWrap}>
            <span className={s.srOnly}>Filter by status</span>
            <select
              className={s.select}
              value={status}
              onChange={(event) => setStatus(event.target.value as StatusFilter)}
            >
              {statuses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className={s.count}>
          {results.length} of {nasaResources.length} resources
        </p>

        <div className={s.grid}>
          {results.map((resource) => (
            <button
              key={resource.id}
              type="button"
              className={s.card}
              onClick={() => setOpenId(resource.id)}
            >
              <span className={s.cardTop}>
                <span className={`${s.tag} ${tagClass(resource.group)}`}>
                  {GROUP_LABEL[resource.group]}
                </span>
                <span className={`${s.pill} ${pillClass(resource.placement)}`}>
                  {PLACEMENT_LABEL[resource.placement]}
                </span>
              </span>
              <span className={s.name}>{resource.name}</span>
              <span className={s.kind}>{resource.kind}</span>
              <span className={s.purpose}>{resource.purpose}</span>
              <span className={s.open}>
                Open record <ArrowUpRight size={13} />
              </span>
            </button>
          ))}
        </div>

        {results.length === 0 && (
          <div className={s.empty}>
            <Telescope size={22} />
            <p>No resource matches that search. Try “Mars”, “lander” or “orbit”.</p>
            <button
              type="button"
              className={s.chip}
              onClick={() => {
                setQuery('')
                setGroup('all')
                setStatus('all')
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        <footer className={s.footer}>
          <p>
            Sources: NASA NSSDCA Master Catalog, NASA Science mission pages, NASA/JPL and the Apollo
            Lunar Surface Journal. Challenge list:{' '}
            <a
              href="https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/?tab=resources"
              target="_blank"
              rel="noreferrer"
            >
              NASA Space Apps 2026
            </a>
            .
          </p>
          <p>
            This is an independent project for the NASA Space Apps Challenge. It is not an official
            NASA website and uses no NASA logos or insignia.
          </p>
        </footer>
      </div>

      {selected && (
        <RecordDrawer resource={selected} onClose={() => setOpenId(null)} />
      )}
    </main>
  )
}

function RecordDrawer({
  resource,
  onClose
}: {
  resource: NasaResource
  onClose: () => void
}) {
  return (
    <div className={s.drawerBackdrop} onClick={onClose} role="presentation">
      <section
        className={s.drawer}
        role="dialog"
        aria-modal="true"
        aria-label={`${resource.name} record`}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className={s.close} onClick={onClose} aria-label="Close record">
          <X size={18} />
        </button>

        <div className={s.drawerHead}>
          <span className={`${s.tag} ${tagClass(resource.group)}`}>
            {GROUP_LABEL[resource.group]}
          </span>
          <span className={`${s.pill} ${pillClass(resource.placement)}`}>
            {PLACEMENT_LABEL[resource.placement]}
          </span>
        </div>

        <h2>{resource.name}</h2>
        <p className={s.drawerKind}>{resource.kind}</p>

        <dl className={s.meta}>
          <div>
            <dt>Launched</dt>
            <dd>{resource.launched}</dd>
          </div>
          <div>
            <dt>Destination</dt>
            <dd>{resource.destination}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{resource.status}</dd>
          </div>
          <div>
            <dt>Final location</dt>
            <dd>{resource.location}</dd>
          </div>
        </dl>

        <div className={s.story}>
          <span className={s.storyLabel}>Pip&apos;s imagined voice · storytelling, not a transmission</span>
          <p>{resource.story}</p>
        </div>

        <div className={s.section}>
          <span className={s.label}>Why it was built</span>
          <p>{resource.whySent}</p>
        </div>

        <div className={s.section}>
          <span className={s.label}>Mission purpose</span>
          <p>{resource.purpose}</p>
        </div>

        {resource.discoveries.length > 0 && (
          <div className={s.section}>
            <span className={s.label}>What it found</span>
            <ul>
              {resource.discoveries.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {resource.instruments.length > 0 && (
          <div className={s.section}>
            <span className={s.label}>Instruments and hardware</span>
            <ul>
              {resource.instruments.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className={s.section}>
          <span className={s.label}>Why it stopped</span>
          <p>{resource.ended}</p>
        </div>

        <div className={s.section}>
          <span className={s.label}>Legacy</span>
          <p>{resource.legacy}</p>
        </div>

        <div className={s.sources}>
          <span className={s.label}>Sources · verified {resource.verified}</span>
          <div className={s.sourceLinks}>
            {resource.nssdca && (
              <a href={resource.nssdca.url} target="_blank" rel="noreferrer">
                {resource.nssdca.label} <ArrowUpRight size={12} />
              </a>
            )}
            {resource.sources.map((source) => (
              <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                {source.label} <ArrowUpRight size={12} />
              </a>
            ))}
          </div>
        </div>

        {resource.artifactIds.length > 0 && (
          <Link href="/explore" className={s.storyLink}>
            Meet it in the comic field guide <ArrowUpRight size={13} />
          </Link>
        )}
      </section>
    </div>
  )
}
