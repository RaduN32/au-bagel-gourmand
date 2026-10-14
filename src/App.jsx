import { useEffect, useRef, useState } from 'react'
import { Bagel, BAGELS, SPREADS, TOPPINGS, Coffee, Juice, Berries, OrangeSlice } from './art.jsx'

const ADDRESS = '358 rue Notre-Dame, local 100, Repentigny (QC) J6A 2S5'
const PHONE = '450-932-6707'
const FACEBOOK = 'https://www.facebook.com/aubagelgourmand/'
const MAPS = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Au Bagel Gourmand 358 rue Notre-Dame Repentigny')

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const HOURS = { 0: [8, 15], 1: null, 2: [7, 15], 3: [7, 15], 4: [7, 15], 5: [7, 15], 6: [8, 15] }
const ORDER = [2, 3, 4, 5, 6, 0, 1]

function useOpenStatus() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])
  const local = new Date(now.toLocaleString('en-US', { timeZone: 'America/Toronto' }))
  const day = local.getDay()
  const h = local.getHours() + local.getMinutes() / 60
  const today = HOURS[day]
  if (today && h >= today[0] && h < today[1]) return { open: true, text: `Ouvert · jusqu’à ${today[1]} h`, day }
  for (let i = 0; i < 7; i++) {
    const d = (day + i) % 7
    const slot = HOURS[d]
    if (!slot) continue
    if (i === 0 && h >= slot[1]) continue
    const when = i === 0 ? 'aujourd’hui' : i === 1 ? 'demain' : DAYS[d].toLowerCase()
    return { open: false, text: `Fermé · ouvre ${when} à ${slot[0]} h`, day }
  }
  return { open: false, text: 'Fermé', day }
}

function Stage() {
  const ref = useRef(null)
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.setProperty('--mx', x.toFixed(3))
    ref.current.style.setProperty('--my', y.toFixed(3))
  }
  return (
    <div className="stage" ref={ref} onPointerMove={onMove}>
      <div className="stage-item s-bagel" style={{ '--d': 18, '--i': 0 }}><Bagel type="sesame" spread="creme" topping="saumon" /></div>
      <div className="stage-item s-coffee" style={{ '--d': 34, '--i': 1 }}><Coffee /></div>
      <div className="stage-item s-juice" style={{ '--d': 28, '--i': 2 }}><Juice /></div>
      <div className="stage-item s-berries" style={{ '--d': 40, '--i': 3 }}><Berries /></div>
      <div className="stage-item s-orange" style={{ '--d': 24, '--i': 4 }}><OrangeSlice /></div>
    </div>
  )
}

function Chips({ label, options, value, onChange }) {
  return (
    <fieldset className="chips">
      <legend>{label}</legend>
      <div>
        {Object.entries(options).map(([k, v]) => (
          <button key={k} type="button" aria-pressed={value === k} className={value === k ? 'on' : ''} onClick={() => onChange(k)}>
            {v.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function Compose() {
  const [type, setType] = useState('sesame')
  const [spread, setSpread] = useState('creme')
  const [topping, setTopping] = useState('saumon')
  const [spin, setSpin] = useState(0)

  const pick = (set) => (v) => {
    set(v)
    setSpin((s) => s + 40)
  }
  const surprise = () => {
    const rnd = (o) => Object.keys(o)[Math.floor(Math.random() * Object.keys(o).length)]
    setType(rnd(BAGELS))
    setSpread(rnd(SPREADS))
    setTopping(rnd(TOPPINGS))
    setSpin((s) => s + 120)
  }

  const parts = [`Bagel ${BAGELS[type].label.toLowerCase()}`]
  if (spread !== 'none') parts.push(SPREADS[spread].label.toLowerCase())
  if (topping !== 'none') parts.push(TOPPINGS[topping].label.toLowerCase())
  const name = parts.length === 1 ? parts[0] : `${parts[0]}, ${parts.slice(1).join(' et ')}`

  return (
    <section className="compose" id="compose">
      <div className="wrap compose-grid">
        <div className="compose-controls">
          <p className="eyebrow">Ton tour</p>
          <h2>Compose ton bagel</h2>
          <p className="lead">Choisis le bagel, ce qu’on étend dessus, ce qu’on met par-dessus. Ensuite, viens le chercher.</p>
          <Chips label="Le bagel" options={BAGELS} value={type} onChange={pick(setType)} />
          <Chips label="La tartinade" options={SPREADS} value={spread} onChange={pick(setSpread)} />
          <Chips label="Le dessus" options={TOPPINGS} value={topping} onChange={pick(setTopping)} />
          <button type="button" className="btn btn-ink" onClick={surprise}>Surprends-moi</button>
        </div>
        <div className="compose-plate">
          <div className="plate-bg"><Bagel type={type} spread={spread} topping={topping} spin={spin} /></div>
          <p className="plate-name" aria-live="polite">{name}</p>
          <a className="btn btn-red" href={`tel:${PHONE.replace(/-/g, '')}`}>Appelle pour le commander · {PHONE}</a>
          <p className="fine">Illustration d’inspiration : la sélection varie en comptoir.</p>
        </div>
      </div>
    </section>
  )
}

const OFFER = [
  { title: 'Des bagels frais', text: 'Un bistro avec sa propre fabrique de bagels : on les roule et on les cuit ici, pas ailleurs.', art: <Bagel type="everything" spread="creme" topping="none" /> },
  { title: 'Déjeuners et dîners', text: 'Des assiettes généreuses et soignées, faites maison avec des produits frais, du matin jusqu’à 15 h.', art: <Bagel type="sesame" spread="avocat" topping="oeuf" /> },
  { title: 'Desserts et boissons', text: 'Jus, café, fruits et douceurs pour finir le repas ou pour une pause en plein après-midi.', art: <Coffee /> },
]

export default function App() {
  const status = useOpenStatus()

  return (
    <>
      <a className="skip" href="#compose">Aller à la composition</a>
      <header className="top">
        <a className="brand" href="#top">Au Bagel <em>Gourmand</em></a>
        <nav aria-label="Principal">
          <a href="#compose">Compose</a>
          <a href="#carte">La maison</a>
          <a href="#visite">Visite</a>
        </nav>
        <span className={`pill ${status.open ? 'open' : 'closed'}`}><i />{status.text}</span>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Bistro et fabrique de bagels · Repentigny</p>
            <h1>Le bagel qui donne faim.</h1>
            <p className="lead">Frais du jour, garnis sans gêne, servis avec un bon café. Du déjeuner au dîner, tous les jours sauf le lundi.</p>
            <div className="cta">
              <a className="btn btn-red" href="#compose">Compose ton bagel</a>
              <a className="btn btn-line" href="#visite">Heures et adresse</a>
            </div>
          </div>
          <Stage />
        </section>

        <div className="marquee" aria-hidden="true">
          <div>
            {Array.from({ length: 2 }, (_, k) => (
              <span key={k}>
                Bagels frais ✺ Déjeuners ✺ Dîners ✺ Desserts ✺ Fait maison ✺ Repentigny ✺ Bagels frais ✺ Déjeuners ✺ Dîners ✺ Desserts ✺ Fait maison ✺ Repentigny ✺{' '}
              </span>
            ))}
          </div>
        </div>

        <Compose />

        <section className="house" id="carte">
          <div className="wrap">
            <p className="eyebrow">La maison</p>
            <h2>Tout est fait sur place</h2>
            <div className="cards">
              {OFFER.map((o) => (
                <article key={o.title} className="card">
                  <div className="card-art">{o.art}</div>
                  <h3>{o.title}</h3>
                  <p>{o.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="proof">
          <div className="wrap proof-in">
            <h2>5 sur 5, selon les clients</h2>
            <p>Sur Pages Jaunes, les commentaires reviennent toujours aux mêmes choses.</p>
            <ul>
              <li>Les bagels</li>
              <li>La présentation des assiettes</li>
              <li>Le service</li>
              <li>Les prix raisonnables</li>
              <li>Le fromage à la crème</li>
            </ul>
          </div>
        </section>

        <section className="visit" id="visite">
          <div className="wrap visit-grid">
            <div>
              <p className="eyebrow">Passe nous voir</p>
              <h2>Au coin de la rue Notre-Dame</h2>
              <address>{ADDRESS}</address>
              <p className="phone"><a href={`tel:${PHONE.replace(/-/g, '')}`}>{PHONE}</a></p>
              <div className="cta">
                <a className="btn btn-ink" href={MAPS} target="_blank" rel="noreferrer">Voir sur la carte</a>
                <a className="btn btn-line" href={FACEBOOK} target="_blank" rel="noreferrer">Facebook</a>
              </div>
            </div>
            <table className="hours">
              <caption>Heures d’ouverture</caption>
              <tbody>
                {ORDER.map((d) => (
                  <tr key={d} className={d === status.day ? 'today' : ''}>
                    <th scope="row">{DAYS[d]}</th>
                    <td>{HOURS[d] ? `${HOURS[d][0]} h – ${HOURS[d][1]} h` : 'Fermé'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr><td colSpan="2">Jours fériés : appelle avant de venir.</td></tr></tfoot>
            </table>
          </div>
        </section>
      </main>

      <footer>
        <span className="brand">Au Bagel <em>Gourmand</em></span>
        <span>{ADDRESS}</span>
      </footer>
    </>
  )
}
