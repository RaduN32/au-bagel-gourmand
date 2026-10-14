import { useId, useMemo } from 'react'

const CX = 150
const CY = 150

function rng(seed) {
  let s = seed
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

function scatter(n, seed, rIn = 44, rOut = 100) {
  const r = rng(seed)
  return Array.from({ length: n }, () => {
    const a = r() * Math.PI * 2
    const d = Math.sqrt(r() * (rOut * rOut - rIn * rIn) + rIn * rIn)
    return { x: CX + Math.cos(a) * d, y: CY + Math.sin(a) * d, rot: r() * 180, k: r() }
  })
}

const around = (n, offset = 0, radius = 72) =>
  Array.from({ length: n }, (_, i) => {
    const a = ((offset + (360 / n) * i) * Math.PI) / 180
    return { x: CX + Math.cos(a) * radius, y: CY + Math.sin(a) * radius, deg: (a * 180) / Math.PI }
  })

export const BAGELS = {
  sesame: { label: 'Sésame' },
  everything: { label: 'Tout garni' },
  pavot: { label: 'Pavot' },
  nature: { label: 'Nature' },
  fromage: { label: 'Fromage' },
}

export const SPREADS = {
  none: { label: 'Rien', color: null },
  creme: { label: 'Fromage à la crème', color: '#FFFDF2' },
  confiture: { label: 'Confiture de fraises', color: '#B01234' },
  avocat: { label: 'Avocat écrasé', color: '#9DBF4B' },
}

export const TOPPINGS = {
  none: { label: 'Rien' },
  saumon: { label: 'Saumon fumé' },
  oeuf: { label: 'Œuf miroir' },
  fraises: { label: 'Fraises' },
  avocat: { label: 'Tranches d’avocat' },
}

const salmon = around(6, 15)
const berries = around(7, 5, 74)
const avos = around(8, 0, 72)
const eggPos = around(1, -55, 72)[0]

export function Bagel({ type = 'sesame', spread = 'creme', topping = 'saumon', spin = 0 }) {
  const uid = useId().replace(/:/g, '')
  const seeds = useMemo(() => scatter(type === 'pavot' ? 150 : 76, 11), [type])
  const specks = useMemo(() => scatter(40, 77), [])
  const cheese = useMemo(() => scatter(16, 5, 48, 96), [])
  const hole = `M${CX - 34} ${CY}a34 34 0 1 1 68 0a34 34 0 1 1 -68 0Z`
  const outer = `M${CX - 110} ${CY}a110 110 0 1 0 220 0a110 110 0 1 0 -220 0Z`

  return (
    <svg viewBox="0 0 300 300" className="bagel-svg" role="img" aria-label="Bagel composé">
      <defs>
        <radialGradient id={`${uid}d`} cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#F1C072" />
          <stop offset="0.7" stopColor="#D58F3B" />
          <stop offset="1" stopColor="#A9611F" />
        </radialGradient>
        <filter id={`${uid}r`} filterUnits="userSpaceOnUse" x="0" y="0" width="300" height="300">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="7" />
        </filter>
        <filter id={`${uid}s`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.4" floodColor="#000" floodOpacity="0.28" />
        </filter>
      </defs>

      <circle cx={CX} cy={CY} r="146" fill="#fff" />
      <circle cx={CX} cy={CY} r="146" fill="none" stroke="#E6E3DC" strokeWidth="2" />
      <circle cx={CX} cy={CY} r="128" fill="none" stroke="#EFECE5" strokeWidth="1.5" />

      <g style={{ transform: `rotate(${spin}deg)`, transformOrigin: '150px 150px' }}>
        <g filter={`url(#${uid}s)`}>
          <path d={`${outer}${hole}`} fillRule="evenodd" fill={`url(#${uid}d)`} filter={`url(#${uid}r)`} />
        </g>
        <path d={`${outer}${hole}`} fillRule="evenodd" fill="none" stroke="#8A4E17" strokeOpacity="0.35" strokeWidth="2" />
        <circle cx={CX} cy={CY} r="80" fill="none" stroke="#fff" strokeOpacity="0.14" strokeWidth="14" />

        {(type === 'sesame' || type === 'everything') &&
          seeds.map((s, i) => (
            <ellipse key={i} cx={s.x} cy={s.y} rx="3.4" ry="1.8" fill="#F8EBC4" stroke="#B88A45" strokeWidth="0.4" transform={`rotate(${s.rot} ${s.x} ${s.y})`} />
          ))}
        {type === 'everything' &&
          specks.map((s, i) => (
            <ellipse key={i} cx={s.x} cy={s.y} rx={s.k > 0.5 ? 2.6 : 1.5} ry={s.k > 0.5 ? 1.4 : 1.5} fill={s.k > 0.7 ? '#4C6B2A' : '#2A2018'} transform={`rotate(${s.rot} ${s.x} ${s.y})`} />
          ))}
        {type === 'pavot' &&
          seeds.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r="1.5" fill="#22243A" />)}
        {type === 'fromage' &&
          cheese.map((s, i) => (
            <ellipse key={i} cx={s.x} cy={s.y} rx={10 + s.k * 7} ry={6 + s.k * 5} fill="#F7D463" stroke="#C98A1E" strokeWidth="2" transform={`rotate(${s.rot} ${s.x} ${s.y})`} />
          ))}
        {type === 'nature' && (
          <path d={`M${CX - 70} ${CY - 50}A84 84 0 0 1 ${CX + 30} ${CY - 80}`} stroke="#fff" strokeOpacity="0.55" strokeWidth="6" strokeLinecap="round" fill="none" />
        )}
      </g>

      {/* tartinade */}
      <circle
        cx={CX}
        cy={CY}
        r="70"
        fill="none"
        stroke={SPREADS[spread].color || 'transparent'}
        strokeWidth="50"
        filter={`url(#${uid}r)`}
        className="layer"
        style={{ opacity: spread === 'none' ? 0 : 1, transformOrigin: '150px 150px', transform: spread === 'none' ? 'scale(.7)' : 'scale(1)' }}
      />

      {/* dessus */}
      <g className="layer" style={{ opacity: topping === 'saumon' ? 1 : 0, transform: topping === 'saumon' ? 'scale(1)' : 'scale(.5)' }}>
        {salmon.map((p, i) => (
          <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.deg + 90})`} filter={`url(#${uid}s)`}>
            <ellipse rx="25" ry="14" fill="#FF8A6B" />
            <path d="M-18 -4C-8 -10 8 0 18 -6M-20 3C-8 -2 8 8 20 2" stroke="#FFD0BD" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          </g>
        ))}
      </g>

      <g className="layer" style={{ opacity: topping === 'oeuf' ? 1 : 0, transform: topping === 'oeuf' ? 'scale(1)' : 'scale(.5)' }}>
        <g transform={`translate(${eggPos.x} ${eggPos.y})`} filter={`url(#${uid}s)`}>
          <path d="M-36 -6C-40 -26 -14 -40 6 -36C30 -34 44 -16 38 6C34 28 10 40 -10 36C-30 32 -34 14 -36 -6Z" fill="#fff" stroke="#E7E2D6" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="17" fill="#FFB400" />
          <circle cx="0" cy="0" r="17" fill="none" stroke="#E58A00" strokeWidth="1.5" />
          <ellipse cx="-6" cy="-6" rx="5" ry="3" fill="#FFF3B0" transform="rotate(-30 -6 -6)" />
        </g>
      </g>

      <g className="layer" style={{ opacity: topping === 'fraises' ? 1 : 0, transform: topping === 'fraises' ? 'scale(1)' : 'scale(.5)' }}>
        {berries.map((p, i) => (
          <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.deg + 90}) scale(1.35)`} filter={`url(#${uid}s)`}>
            <path d="M0 -10C11 -10 12 4 0 13C-12 4 -11 -10 0 -10Z" fill="#E4243B" />
            <path d="M-6 -10l6 -4l6 4l-6 2z" fill="#3F8F4A" />
            <g fill="#FFD9A0"><circle cx="-4" cy="-2" r="0.9" /><circle cx="3" cy="-3" r="0.9" /><circle cx="0" cy="3" r="0.9" /><circle cx="-3" cy="7" r="0.9" /><circle cx="4" cy="4" r="0.9" /></g>
          </g>
        ))}
      </g>

      <g className="layer" style={{ opacity: topping === 'avocat' ? 1 : 0, transform: topping === 'avocat' ? 'scale(1)' : 'scale(.5)' }}>
        {avos.map((p, i) => (
          <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.deg + 90})`} filter={`url(#${uid}s)`}>
            <ellipse rx="16" ry="8.5" fill="#A8CE50" stroke="#4E7A1E" strokeWidth="2.5" />
            <ellipse rx="9" ry="4" fill="#DDEFA0" />
          </g>
        ))}
      </g>
    </svg>
  )
}

export function Coffee() {
  return (
    <svg viewBox="0 0 160 160" aria-hidden="true">
      <circle cx="78" cy="82" r="64" fill="#fff" stroke="#DDD" strokeWidth="2" />
      <rect x="112" y="72" width="30" height="20" rx="10" fill="#fff" stroke="#CFCFCF" strokeWidth="2" />
      <circle cx="78" cy="80" r="44" fill="#fff" stroke="#CFCFCF" strokeWidth="2" />
      <circle cx="78" cy="80" r="35" fill="#2A170F" />
      <path d="M52 70A28 28 0 0 1 72 54" stroke="#8A5A3B" strokeWidth="4" strokeLinecap="round" fill="none" />
      <rect x="20" y="130" width="46" height="5" rx="2.5" fill="#B9B9B9" transform="rotate(-20 20 130)" />
    </svg>
  )
}

export function Juice() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="52" fill="#E8EEF0" stroke="#CBD6DA" strokeWidth="2" />
      <circle cx="60" cy="60" r="44" fill="#FFAA1D" />
      <circle cx="60" cy="60" r="44" fill="none" stroke="#FFD27A" strokeWidth="6" />
      <path d="M30 42A36 36 0 0 1 52 26" stroke="#fff" strokeOpacity=".8" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function Berries() {
  const blue = [[40, 44], [62, 34], [84, 50], [48, 76], [76, 80], [92, 70]]
  const red = [[58, 58], [84, 94], [34, 92]]
  return (
    <svg viewBox="0 0 130 130" aria-hidden="true">
      <circle cx="65" cy="65" r="60" fill="#fff" stroke="#DDD" strokeWidth="2" />
      <circle cx="65" cy="65" r="48" fill="#F2F0EA" />
      {blue.map(([x, y], i) => (
        <circle key={i} cx={x + 4} cy={y + 4} r="9" fill="#3B4A8C" stroke="#2B3770" strokeWidth="1.5" />
      ))}
      {red.map(([x, y], i) => (
        <g key={i} transform={`translate(${x + 4} ${y + 4}) rotate(${i * 40})`}>
          <path d="M0 -11C12 -11 13 4 0 14C-13 4 -12 -11 0 -11Z" fill="#E4243B" />
          <path d="M-6 -11l6 -4l6 4l-6 2z" fill="#3F8F4A" />
        </g>
      ))}
    </svg>
  )
}

export function OrangeSlice() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="#FF9A1F" />
      <circle cx="50" cy="50" r="40" fill="#FFF1D6" />
      <circle cx="50" cy="50" r="35" fill="#FFB22E" />
      <g stroke="#FFF1D6" strokeWidth="3">
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1="50" y1="50" x2={50 + Math.cos((i * Math.PI) / 4) * 35} y2={50 + Math.sin((i * Math.PI) / 4) * 35} />
        ))}
      </g>
    </svg>
  )
}
