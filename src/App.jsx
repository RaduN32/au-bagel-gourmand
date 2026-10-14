import { useEffect, useState } from 'react'
import { Bagel, BAGELS, SPREADS, TOPPINGS, Coffee, Juice, Berries, OrangeSlice } from './art.jsx'

const ADDRESS = '358 rue Notre-Dame, local 100, Repentigny (QC) J6A 2S5'
const PHONE = '450-932-6707'
const TEL = `tel:${PHONE.replace(/-/g, '')}`
const FACEBOOK = 'https://www.facebook.com/aubagelgourmand/'
const MAPS = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Au Bagel Gourmand 358 rue Notre-Dame Repentigny')

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const HOURS = { 0: [8, 15], 1: null, 2: [7, 15], 3: [7, 15], 4: [7, 15], 5: [7, 15], 6: [8, 15] }
const ORDER = [2, 3, 4, 5, 6, 0, 1]

function useNow(ms = 60000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), ms)
    return () => clearInterval(t)
  }, [ms])
  return now
}

function useOpenStatus() {
  const now = useNow()
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

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-plate" aria-hidden="true">
        <Bagel type="sesame" spread="creme" topping="saumon" label="" />
      </div>
      <div className="hero-side hs-coffee" aria-hidden="true"><Coffee /></div>
      <div className="hero-side hs-juice" aria-hidden="true"><Juice /></div>
      <div className="hero-side hs-berries" aria-hidden="true"><Berries /></div>
      <div className="hero-side hs-orange" aria-hidden="true"><OrangeSlice /></div>

      <div className="hero-copy">
        <p className="kicker">Bistro et fabrique de bagels · Repentigny</p>
        <h1 id="hero-title">
          <span><span>Le bagel</span></span>
          <span><span>qui donne</span></span>
          <span><span>faim.</span></span>
        </h1>
        <p className="lead">Roulés et cuits sur place, rue Notre-Dame. Garnis sans gêne, servis avec un bon café, du déjeuner jusqu’à 15 h.</p>
        <div className="cta">
          <a className="btn btn-cream" href="#compose">Compose ton bagel</a>
          <a className="btn btn-line" href="#visite">Heures et adresse</a>
        </div>
      </div>
    </section>
  )
}

function Counter({ onPick }) {
  return (
    <section className="counter" aria-labelledby="counter-title">
      <div className="counter-head">
        <h2 id="counter-title">Cinq sortes, faites ici</h2>
        <p>Touche-en une pour la mettre sur ton bon de commande.</p>
      </div>
      <ul className="counter-row">
        {Object.entries(BAGELS).map(([k, v]) => (
          <li key={k}>
            <a href="#compose" onClick={() => onPick(k)} aria-label={`Choisir le bagel ${v.label.toLowerCase()} dans le bon de commande`}>
              <span className="counter-art" aria-hidden="true"><Bagel type={k} spread="none" topping="none" plate={false} label="" /></span>
              <span className="counter-name">{v.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Options({ label, options, value, onChange }) {
  return (
    <fieldset className="opts">
      <legend>{label}</legend>
      <div>
        {Object.entries(options).map(([k, v]) => (
          <button key={k} type="button" aria-pressed={value === k} onClick={() => onChange(k)}>
            {v.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

const stamp = (d) => {
  const f = new Intl.DateTimeFormat('fr-CA', { timeZone: 'America/Toronto', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
  const p = Object.fromEntries(f.formatToParts(d).map((x) => [x.type, x.value]))
  return `${p.weekday} ${p.day} ${p.month} · ${p.hour} h ${p.minute}`.toUpperCase()
}

function Ticket({ type, spread, topping, no }) {
  const now = useNow(30000)
  const lines = [{ k: `b-${type}`, t: `1 × BAGEL ${BAGELS[type].label.toUpperCase()}` }]
  if (spread !== 'none') lines.push({ k: `s-${spread}`, t: `  + ${SPREADS[spread].label.toUpperCase()}`, sub: true })
  if (topping !== 'none') lines.push({ k: `t-${topping}`, t: `  + ${TOPPINGS[topping].label.toUpperCase()}`, sub: true })
  if (spread === 'none' && topping === 'none') lines.push({ k: 'plain', t: '  (TEL QUEL, NATURE)', sub: true })

  return (
    <div className="ticket" role="group" aria-label="Ton bon de commande">
      <div className="ticket-in">
        <p className="t-center t-strong">AU BAGEL GOURMAND</p>
        <p className="t-center">358, RUE NOTRE-DAME</p>
        <hr />
        <p className="t-row"><span>BON</span><span key={no} className="t-no">#{String(no).padStart(4, '0')}</span></p>
        <p className="t-row"><span>{stamp(now)}</span><span>COMPTOIR</span></p>
        <hr />
        <div aria-live="polite">
          {lines.map((l) => (
            <p key={l.k} className={`t-line${l.sub ? ' t-sub' : ''}`}>{l.t}</p>
          ))}
        </div>
        <hr />
        <p className="t-center t-small">COMMANDE PAR TÉLÉPHONE</p>
        <p className="t-center t-strong">{PHONE}</p>
      </div>
    </div>
  )
}

function Compose({ type, setType }) {
  const [spread, setSpread] = useState('creme')
  const [topping, setTopping] = useState('saumon')
  const [spin, setSpin] = useState(0)
  const [no, setNo] = useState(427)

  const bump = (deg) => {
    setSpin((s) => s + deg)
    setNo((n) => n + 1)
  }
  const pick = (set) => (v) => {
    set(v)
    bump(40)
  }
  const surprise = () => {
    const rnd = (o) => Object.keys(o)[Math.floor(Math.random() * Object.keys(o).length)]
    setType(rnd(BAGELS))
    setSpread(rnd(SPREADS))
    setTopping(rnd(TOPPINGS))
    bump(140)
  }

  return (
    <section className="compose" id="compose" aria-labelledby="compose-title">
      <div className="compose-grid">
        <div className="compose-head">
          <h2 id="compose-title">Bon de commande</h2>
          <p className="lead">Choisis ton bagel, ce qu’on étend dessus et ce qu’on met par-dessus. Le bon s’écrit tout seul : t’as juste à appeler.</p>
        </div>
        <div className="compose-controls">
          <Options label="Le bagel" options={BAGELS} value={type} onChange={pick(setType)} />
          <Options label="La tartinade" options={SPREADS} value={spread} onChange={pick(setSpread)} />
          <Options label="Le dessus" options={TOPPINGS} value={topping} onChange={pick(setTopping)} />
          <button type="button" className="btn btn-line btn-surprise" onClick={surprise}>Surprends-moi</button>
        </div>

        <div className="compose-plate" aria-hidden="true">
          <Bagel type={type} spread={spread} topping={topping} spin={spin} label="" />
        </div>

        <div className="compose-ticket">
          <Ticket type={type} spread={spread} topping={topping} no={no} />
          <a className="btn btn-cream btn-call" href={TEL}>Commander au {PHONE}</a>
          <p className="fine">Illustration d’inspiration : la sélection varie au comptoir.</p>
        </div>
      </div>
    </section>
  )
}

const OFFER = [
  {
    tag: 'La fabrique',
    tone: 'crust',
    title: 'Des bagels frais',
    text: 'Un bistro avec sa propre fabrique : les bagels sont roulés et cuits ici, pas ailleurs. Nature, sésame, pavot, tout garni ou au fromage.',
    art: <Bagel type="everything" spread="creme" topping="none" label="" />,
  },
  {
    tag: 'Jusqu’à 15 h',
    tone: 'herb',
    title: 'Déjeuners et dîners',
    text: 'Des assiettes généreuses et soignées, faites maison avec des produits frais. Œufs, avocat, saumon fumé, fruits à côté.',
    art: <Bagel type="sesame" spread="avocat" topping="oeuf" label="" />,
  },
  {
    tag: 'Pour finir',
    tone: 'berry',
    title: 'Desserts et boissons',
    text: 'Jus, café, fruits et douceurs pour finir le repas, ou pour une pause en plein après-midi.',
    art: (
      <div className="duo">
        <Coffee />
        <Juice />
      </div>
    ),
  },
]

export default function App() {
  const status = useOpenStatus()
  const [type, setType] = useState('sesame')

  return (
    <>
      <a className="skip" href="#compose">Aller au bon de commande</a>
      <header className="top">
        <a className="brand" href="#top">Au Bagel Gourmand</a>
        <nav aria-label="Principal">
          <a href="#compose">Commander</a>
          <a href="#carte">La maison</a>
          <a href="#visite">Visite</a>
        </nav>
        <a className={`status ${status.open ? 'open' : 'closed'}`} href="#visite"><i aria-hidden="true" />{status.text}</a>
      </header>

      <main id="top">
        <Hero />
        <Counter onPick={setType} />
        <Compose type={type} setType={setType} />

        <section className="house" id="carte" aria-labelledby="house-title">
          <h2 id="house-title" className="house-title">Tout est fait sur place</h2>
          {OFFER.map((o, i) => (
            <article key={o.title} className={`row row-${i % 2 ? 'r' : 'l'} tone-${o.tone}`}>
              <div className="row-art" aria-hidden="true">{o.art}</div>
              <div className="row-copy">
                <p className="tag">{o.tag}</p>
                <h3>{o.title}</h3>
                <p>{o.text}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="proof" aria-labelledby="proof-title">
          <div className="proof-score">
            <p className="score" aria-hidden="true">5/5</p>
            <h2 id="proof-title">5 sur 5 sur Pages Jaunes</h2>
          </div>
          <div className="proof-copy">
            <p>Dans les commentaires des clients, ce sont toujours les mêmes choses qui reviennent :</p>
            <ul>
              <li>les bagels</li>
              <li>la présentation des assiettes</li>
              <li>le service</li>
              <li>les prix raisonnables</li>
              <li>le fromage à la crème</li>
            </ul>
          </div>
        </section>

        <section className="visit" id="visite" aria-labelledby="visit-title">
          <div className="visit-main">
            <h2 id="visit-title">Rue Notre-Dame, à Repentigny</h2>
            <address>{ADDRESS}</address>
            <a className="phone" href={TEL}>{PHONE}</a>
            <div className="cta">
              <a className="btn btn-cream" href={MAPS} target="_blank" rel="noreferrer">Voir sur la carte</a>
              <a className="btn btn-line" href={FACEBOOK} target="_blank" rel="noreferrer">Facebook</a>
            </div>
          </div>
          <table className="hours">
            <caption>Heures d’ouverture</caption>
            <tbody>
              {ORDER.map((d) => (
                <tr key={d} className={d === status.day ? 'today' : ''}>
                  <th scope="row">{DAYS[d]}{d === status.day && <span className="sr"> (aujourd’hui)</span>}</th>
                  <td>{HOURS[d] ? `${HOURS[d][0]} h – ${HOURS[d][1]} h` : 'Fermé'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><td colSpan="2">Jours fériés : appelle avant de venir.</td></tr></tfoot>
          </table>
        </section>
      </main>

      <footer className="foot">
        <span className="brand">Au Bagel Gourmand</span>
        <span>{ADDRESS}</span>
        <a href={TEL}>{PHONE}</a>
      </footer>
    </>
  )
}
