'use client'

import s from './pip.module.css'

export function PipBadge({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className={s.badgeIcon}>
      <circle cx="12" cy="12" r="10.5" fill="rgba(245,181,68,.16)" stroke="rgba(245,181,68,.45)" />
      <circle cx="12" cy="11" r="6.1" fill="#e9f0f9" />
      <ellipse cx="12" cy="11.4" rx="4.2" ry="3.4" fill="#0a1b2b" stroke="#f5b544" strokeWidth="1.2" />
      <circle cx="10.3" cy="11" r="0.8" fill="#8ef0ff" />
      <circle cx="13.7" cy="11" r="0.8" fill="#8ef0ff" />
      <path d="M9.7 13.2 Q12 15.2 14.3 13.2" fill="none" stroke="#8ef0ff" strokeWidth="1" strokeLinecap="round" />
      <path d="M6 20.5h12" stroke="#f5b544" strokeWidth="1.6" strokeLinecap="round" opacity=".7" />
    </svg>
  )
}

export function ComicBurst() {
  return (
    <div className={s.burst} aria-hidden>
      <svg viewBox="0 0 240 160" focusable="false">
        <path
          d="M120 4 L134 34 L165 14 L159 48 L198 42 L178 68 L218 80 L178 92 L198 118 L159 112 L165 146 L134 126 L120 156 L106 126 L75 146 L81 112 L42 118 L62 92 L22 80 L62 68 L42 42 L81 48 L75 14 L106 34 Z"
          fill="#f5b544"
          stroke="#0b0d12"
          strokeWidth="6"
          strokeLinejoin="round"
        />
      </svg>
      <span>WHOOSH!</span>
    </div>
  )
}

export default function PipAstronaut({ waving }: { waving: boolean }) {
  return (
    <svg
      viewBox="0 0 280 380"
      className={`${s.astro} ${waving ? s.astroWaveOn : ''}`}
      role="presentation"
      focusable="false"
    >
      <defs>
        <linearGradient id="pipSuit" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.42" stopColor="#e9edf3" />
          <stop offset="0.78" stopColor="#c6cfdb" />
          <stop offset="1" stopColor="#a9b5c4" />
        </linearGradient>
        <linearGradient id="pipGlove" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbfcfe" />
          <stop offset="0.6" stopColor="#dbe2eb" />
          <stop offset="1" stopColor="#b7c2d0" />
        </linearGradient>
        <linearGradient id="pipVisor" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#d8fbff" />
          <stop offset="0.32" stopColor="#8eeaf7" />
          <stop offset="0.72" stopColor="#3d9fc2" />
          <stop offset="1" stopColor="#176080" />
        </linearGradient>
        <linearGradient id="pipPack" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b485d" />
          <stop offset="0.6" stopColor="#232d3d" />
          <stop offset="1" stopColor="#121924" />
        </linearGradient>
        <pattern id="pipDots" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.1" fill="#0b0d12" opacity="0.28" />
        </pattern>
      </defs>

      <ellipse cx="140" cy="374" rx="76" ry="8" fill="#000" opacity="0.34" />

      {/* Life-support backpack */}
      <g stroke="#0b0d12" strokeWidth="4" strokeLinejoin="round">
        <rect x="48" y="140" width="184" height="142" rx="34" fill="url(#pipPack)" />
        <rect
          x="60"
          y="154"
          width="160"
          height="110"
          rx="24"
          fill="none"
          stroke="#5b687c"
          strokeWidth="2.5"
        />
        <path d="M66 148V112" fill="none" />
        <circle cx="66" cy="107" r="5" fill="#f5b544" strokeWidth="3" className={s.antenna} />
        <path
          d="M82 172h26M82 188h26M82 204h16"
          stroke="#8b98ab"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Legs */}
      <g stroke="#0b0d12" strokeWidth="4" strokeLinejoin="round">
        <path d="M98 254 C94 286 94 322 100 350 L124 356 L132 318 L132 254 Z" fill="url(#pipSuit)" />
        <path d="M148 254 L148 318 L156 356 L180 350 C186 322 186 286 182 254 Z" fill="url(#pipSuit)" />
        <path d="M96 312h38M146 312h38" stroke="#8f9bab" strokeWidth="2.5" />
        <path d="M100 350 C100 362 108 370 122 370 L130 370 L132 352 Z" fill="#d7dee8" />
        <path d="M180 350 C180 362 172 370 158 370 L150 370 L148 352 Z" fill="#d7dee8" />
        <path d="M96 366h40M144 366h40" stroke="#1b222d" strokeWidth="3" />
        <path d="M112 352v12M168 352v12" stroke="#7c8798" strokeWidth="2" />
        <path d="M150 268l-2 38M130 268l-3 38" stroke="#aab4c2" strokeWidth="2" />
      </g>

      {/* Torso */}
      <path
        d="M80 158 C80 140 104 130 140 130 C176 130 200 140 200 158 L196 248 C196 264 172 274 140 274 C108 274 84 264 84 248 Z"
        fill="url(#pipSuit)"
        stroke="#0b0d12"
        strokeWidth="4.5"
      />
      <path
        d="M146 134 C176 136 196 148 198 166 L194 246 C193 258 176 266 148 269 Z"
        fill="url(#pipDots)"
        opacity="0.55"
      />
      <path d="M140 154v108" stroke="#b3bdcb" strokeWidth="2.5" />
      <path d="M92 176 C86 202 86 228 90 246" stroke="#8e99a9" strokeWidth="2.5" fill="none" />
      <path d="M188 176 C194 202 194 228 190 246" stroke="#7d8898" strokeWidth="2.5" fill="none" />

      {/* Shoulder joints */}
      <ellipse cx="86" cy="164" rx="17" ry="22" fill="#dfe5ed" stroke="#0b0d12" strokeWidth="3.5" />
      <ellipse cx="194" cy="164" rx="17" ry="22" fill="#dfe5ed" stroke="#0b0d12" strokeWidth="3.5" />
      <path d="M76 154l20 12M76 168l20 12" stroke="#98a3b2" strokeWidth="2" />

      {/* Chest hose sits behind the control module */}
      <path
        d="M110 222 C88 226 78 240 84 254"
        fill="none"
        stroke="#0b0d12"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M110 222 C88 226 78 240 84 254"
        fill="none"
        stroke="#465263"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M110 222 C88 226 78 240 84 254"
        fill="none"
        stroke="#8b98ab"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="2 7"
      />

      {/* Chest control module */}
      <g>
        <rect
          x="112"
          y="182"
          width="56"
          height="44"
          rx="8"
          fill="#f3eee2"
          stroke="#0b0d12"
          strokeWidth="3.5"
        />
        <rect x="120" y="190" width="40" height="14" rx="3" fill="#15202e" />
        <path d="M124 197h12M140 197h10" stroke="#6ee7f9" strokeWidth="2" />
        <circle cx="124" cy="213" r="4" fill="#f5b544" stroke="#0b0d12" strokeWidth="1.6" />
        <circle cx="136" cy="213" r="4" fill="#6ee7f9" stroke="#0b0d12" strokeWidth="1.6" />
        <circle cx="148" cy="213" r="4" fill="#ed7958" stroke="#0b0d12" strokeWidth="1.6" />
        <rect
          x="156"
          y="208"
          width="8"
          height="9"
          rx="2"
          fill="#9aa6b6"
          stroke="#0b0d12"
          strokeWidth="1.6"
        />
      </g>

      {/* Belt */}
      <rect x="92" y="248" width="96" height="20" rx="7" fill="#c6cdd8" stroke="#0b0d12" strokeWidth="3.5" />
      <rect x="128" y="251" width="24" height="14" rx="3" fill="#8d99aa" stroke="#0b0d12" strokeWidth="2" />

      {/* Shoulder patch */}
      <g>
        <circle cx="178" cy="188" r="14" fill="#1d2c42" stroke="#0b0d12" strokeWidth="3" />
        <path
          d="M178 179l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"
          fill="#f5b544"
        />
      </g>

      {/* Resting arm */}
      <g>
        <path
          d="M92 170 C74 190 64 214 60 236"
          fill="none"
          stroke="#0b0d12"
          strokeWidth="40"
          strokeLinecap="round"
        />
        <path
          d="M92 170 C74 190 64 214 60 236"
          fill="none"
          stroke="url(#pipSuit)"
          strokeWidth="32"
          strokeLinecap="round"
        />
        <path
          d="M92 170 C74 190 64 214 60 236"
          fill="none"
          stroke="#9aa5b4"
          strokeWidth="2"
          strokeDasharray="2 9"
        />
        <ellipse
          cx="70"
          cy="214"
          rx="16"
          ry="8"
          transform="rotate(-58 70 214)"
          fill="none"
          stroke="#0b0d12"
          strokeWidth="3"
        />
        <path d="M64 208l12 10M60 214l12 10M56 220l12 10" stroke="#98a3b2" strokeWidth="2" />
        <rect x="46" y="244" width="32" height="12" rx="5" fill="#c2cbd7" stroke="#0b0d12" strokeWidth="3" />
        <path
          d="M48 254 C38 262 38 280 48 288 C58 296 74 292 78 280 C82 268 76 254 66 250 Z"
          fill="url(#pipGlove)"
          stroke="#0b0d12"
          strokeWidth="4"
        />
        <path d="M52 268h16M52 276h14M56 284h10" stroke="#98a3b2" strokeWidth="2.2" strokeLinecap="round" />
      </g>

      {/* Raised, waving arm */}
      <g className={s.armWave}>
        <path
          d="M194 172 L220 136 L236 102"
          fill="none"
          stroke="#0b0d12"
          strokeWidth="42"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M194 172 L220 136 L236 102"
          fill="none"
          stroke="url(#pipSuit)"
          strokeWidth="33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M194 172 L220 136 L236 102"
          fill="none"
          stroke="#9aa5b4"
          strokeWidth="2"
          strokeDasharray="2 9"
        />
        <ellipse
          cx="220"
          cy="136"
          rx="17"
          ry="9"
          transform="rotate(48 220 136)"
          fill="none"
          stroke="#0b0d12"
          strokeWidth="3"
        />
        <path d="M212 130l12 9M216 124l12 9" stroke="#98a3b2" strokeWidth="2" />
        <rect
          x="224"
          y="94"
          width="30"
          height="12"
          rx="5"
          transform="rotate(18 239 100)"
          fill="#c2cbd7"
          stroke="#0b0d12"
          strokeWidth="3"
        />
        <path
          d="M232 66 C228 54 238 44 250 46 C260 48 264 60 258 70 C252 80 240 82 232 76 Z"
          fill="url(#pipGlove)"
          stroke="#0b0d12"
          strokeWidth="4"
        />
        <g fill="url(#pipGlove)" stroke="#0b0d12" strokeWidth="3" strokeLinejoin="round">
          <rect x="228" y="48" width="7" height="18" rx="3.5" transform="rotate(-18 231 57)" />
          <rect x="237" y="44" width="7" height="20" rx="3.5" />
          <rect x="246" y="45" width="7" height="19" rx="3.5" transform="rotate(8 249 54)" />
          <rect x="255" y="50" width="7" height="16" rx="3.5" transform="rotate(20 258 58)" />
          <rect x="222" y="66" width="8" height="14" rx="4" transform="rotate(-42 226 73)" />
        </g>
        <path d="M236 60l-2 12M245 58v12" stroke="#98a3b2" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Helmet */}
      <g>
        <rect
          x="94"
          y="130"
          width="92"
          height="26"
          rx="12"
          fill="#c3cbd6"
          stroke="#0b0d12"
          strokeWidth="4"
        />
        <circle cx="104" cy="143" r="3" fill="#8d99aa" stroke="#0b0d12" strokeWidth="1.5" />
        <circle cx="176" cy="143" r="3" fill="#8d99aa" stroke="#0b0d12" strokeWidth="1.5" />
        <circle cx="140" cy="82" r="64" fill="url(#pipSuit)" stroke="#0b0d12" strokeWidth="5" />
        <circle cx="140" cy="82" r="56" fill="#eef2f7" stroke="#9aa5b4" strokeWidth="2" />
        <path
          d="M188 124 C206 106 210 80 200 56 C206 90 192 116 168 130 Z"
          fill="url(#pipDots)"
          opacity="0.55"
        />
        <ellipse
          cx="140"
          cy="86"
          rx="45"
          ry="36"
          fill="url(#pipVisor)"
          stroke="#0b0d12"
          strokeWidth="4.5"
        />

        {/* Pip's friendly face stays visible through the bright comic visor. */}
        <g className={s.pipFace}>
          <ellipse cx="140" cy="88" rx="28" ry="24" fill="#f4b978" stroke="#0b0d12" strokeWidth="2.8" />
          <path
            d="M116 82 C119 66 130 59 140 59 C153 59 162 67 164 82 C156 74 149 72 140 72 C131 72 124 75 116 82 Z"
            fill="#4c2d24"
            stroke="#0b0d12"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M123 82 Q129 78 134 82" fill="none" stroke="#0b0d12" strokeWidth="2" strokeLinecap="round" />
          <path d="M146 82 Q151 78 157 82" fill="none" stroke="#0b0d12" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="129" cy="87" rx="4.3" ry="5" fill="#14202b" />
          <ellipse cx="151" cy="87" rx="4.3" ry="5" fill="#14202b" />
          <circle cx="130.4" cy="85.5" r="1.4" fill="#ffffff" />
          <circle cx="152.4" cy="85.5" r="1.4" fill="#ffffff" />
          <circle cx="121" cy="96" r="4" fill="#ed7958" opacity="0.5" />
          <circle cx="159" cy="96" r="4" fill="#ed7958" opacity="0.5" />
          <path
            d="M128 96 Q140 108 152 96 Q149 111 140 112 Q131 111 128 96 Z"
            fill="#ffffff"
            stroke="#0b0d12"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M134 105 Q140 102 146 105" fill="none" stroke="#ed7958" strokeWidth="2.3" strokeLinecap="round" />
        </g>
        <path
          d="M105 68 C118 48 145 43 165 53"
          fill="none"
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.42"
        />
        <path
          d="M112 61 C124 52 139 49 151 51"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.6"
          strokeLinecap="round"
          opacity="0.72"
        />
        <ellipse cx="168" cy="101" rx="11" ry="7" fill="#ffffff" opacity="0.24" />
        <circle cx="170" cy="98" r="4" fill="#bdf3ff" opacity="0.65" />
        <rect
          x="70"
          y="72"
          width="17"
          height="30"
          rx="8"
          fill="#d5dce6"
          stroke="#0b0d12"
          strokeWidth="3"
        />
        <rect
          x="193"
          y="72"
          width="17"
          height="30"
          rx="8"
          fill="#d5dce6"
          stroke="#0b0d12"
          strokeWidth="3"
        />
        <circle cx="78.5" cy="87" r="4" fill="#f5b544" stroke="#0b0d12" strokeWidth="1.5" className={s.lamp} />
        <circle
          cx="201.5"
          cy="87"
          r="4"
          fill="#f5b544"
          stroke="#0b0d12"
          strokeWidth="1.5"
          className={s.lamp}
        />
        <g fill="#aeb8c6" stroke="#0b0d12" strokeWidth="1.5">
          <circle cx="140" cy="21" r="3" />
          <circle cx="190" cy="50" r="3" />
          <circle cx="190" cy="110" r="3" />
          <circle cx="140" cy="141" r="3" />
          <circle cx="90" cy="110" r="3" />
          <circle cx="90" cy="50" r="3" />
        </g>
        <path d="M98 32 C86 18 78 12 66 10" fill="none" stroke="#0b0d12" strokeWidth="3" />
        <circle
          cx="64"
          cy="9"
          r="5"
          fill="#f5b544"
          stroke="#0b0d12"
          strokeWidth="2.5"
          className={s.antenna}
        />
      </g>

      {/* Rim light from the planet below */}
      <path d="M84 164 C76 196 78 228 86 248" stroke="#6ee7f9" strokeWidth="2.5" fill="none" opacity="0.5" />
      <path d="M198 164 C204 196 204 226 196 248" stroke="#f5b544" strokeWidth="2.5" fill="none" opacity="0.45" />
    </svg>
  )
}
