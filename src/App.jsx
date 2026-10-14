import { useEffect, useState } from 'react'
import { MENU, money, ticketMoney, findDish, extrasFor } from './menu.js'

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
  if (today && h >= today[0] && h < today[1]) return { open: true, text: `Ouvert · jusqu’à ${today[1]} h`, day }
  for (let i = 0; i < 7; i++) {
    const d = (day + i) % 7
    const slot = HOURS[d]
    if (!slot) continue
    if (i === 0 && h >= slot[1]) continue
    const when = i === 0 ? 'aujourd’hui' : i === 1 ? 'demain' : DAYS[d].toLowerCase()
    return { open: false, text: `Fermé · ouvre ${when} à ${slot[0]} h`, day }
  }
  return { open: false, text: 'Fermé', day }
}

/* une photo avec deux tailles : le navigateur prend la bonne */
function Photo({ name, w, h, alt, sizes, eager = false, className }) {
  const [big, small] = w
  const ratio = h / big
  return (
    <img
      className={className}
      src={`/photos/${name}-${big}.jpg`}
      srcSet={`/photos/${name}-${small}.jpg ${small}w, /photos/${name}-${big}.jpg ${big}w`}
      sizes={sizes}
      width={big}
      height={Math.round(big * ratio)}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      {...(eager ? { fetchpriority: 'high' } : {})}
    />
  )
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-plate">
        <Photo
          name="fruit"
          w={[960, 600]}
          h={960}
          eager
          sizes="(max-width: 720px) 100vw, (max-width: 980px) 108vw, 62vw"
          alt="Vue du dessus d’une assiette : bagel au sésame grillé, jambon et « coco » gratinés, entourés de fruits frais (pommes vertes, kiwi, raisins, fraises, bleuets)."
        />
      </div>

      <div className="hero-copy">
        <p className="kicker">Bistro et fabrique de bagels · Repentigny</p>
        <h1 id="hero-title">
          <span><span>Le bagel</span></span>
          <span><span>qui donne</span></span>
          <span><span>faim.</span></span>
        </h1>
        <p className="lead">Des bagels frais, faits sur place, rue Notre-Dame. Déjeuners et dîners servis avec le café à volonté, jusqu’à 15 h.</p>
        <div className="cta">
          <a className="btn btn-cream" href="#menu">Voir le menu</a>
          <a className="btn btn-line" href="#visite">Heures et adresse</a>
        </div>
      </div>
    </section>
  )
}

function Menu() {
  return (
    <section className="menu" id="menu" aria-labelledby="menu-title">
      <div className="menu-band">
        <Photo
          name="flatlay"
          w={[1440, 760]}
          h={960}
          sizes="100vw"
          alt="Table vue du dessus : bagels au sésame et au pavot, salade avec « cocos », potage du jour, assiette de fruits, yogourt aux petits fruits, jus d’orange et café."
        />
      </div>
      <div className="menu-head">
        <h2 id="menu-title">Le menu</h2>
        <div>
          <p className="menu-price-note">Prix de septembre — confirme en magasin au <a href={TEL}>{PHONE}</a>.</p>
          <nav className="menu-jump" aria-label="Sections du menu">
            {MENU.map((c) => <a key={c.id} href={`#m-${c.id}`}>{c.title}</a>)}
          </nav>
        </div>
      </div>

      {MENU.map((cat) => (
        <div className="cat" id={`m-${cat.id}`} key={cat.id}>
          <div className="cat-head">
            <h3>{cat.title}</h3>
            {cat.note && <p>{cat.note}</p>}
          </div>
          <ul className="items">
            {cat.items.map((it) => (
              <li key={it.id}>
                <p className="item-top"><span className="item-name">{it.name}</span><span className="item-dots" aria-hidden="true" /><span className="item-price">{money(it.price)}</span></p>
                {it.desc && <p className="item-desc">{it.desc}</p>}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <p className="menu-foot">Option sur les plats avec bagel : choisis ton bagel préféré pour 1,75 $. <a href="#compose">Faire le compte d’un plat</a></p>
    </section>
  )
}

function Pills({ label, options, value, onChange }) {
  return (
    <fieldset className="opts">
      <legend>{label}</legend>
      <div>
        {options.map((o) => (
          <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)}>
            {o.label}
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

function Ticket({ cat, item, picks, extras }) {
  const now = useNow(30000)
  const opts = extrasFor(cat, item).filter((e) => extras[e.key])
  const total = item.price + opts.reduce((s, e) => s + e.price, 0)
  const lines = [{ k: `d-${item.id}`, t: `1 × ${item.name.toUpperCase()}`, p: ticketMoney(item.price) }]
  ;(item.choices || []).forEach((c) => lines.push({ k: `c-${c.key}-${picks[c.key]}`, t: `  · ${picks[c.key].toUpperCase()}`, sub: true }))
  opts.forEach((e) => lines.push({ k: `e-${e.key}`, t: `  + ${e.ticket}`, p: ticketMoney(e.price), sub: true }))
  if (cat.incl) lines.push({ k: `i-${cat.id}`, t: `  INCLUS : ${cat.incl}`, sub: true, small: true })

  return (
    <div className="ticket" role="group" aria-label="Aperçu de l’addition">
      <div className="ticket-in">
        <p className="t-center t-strong">AU BAGEL GOURMAND</p>
        <p className="t-center">358, RUE NOTRE-DAME</p>
        <hr />
        <p className="t-row"><span className="t-flag">APERÇU</span><span>{stamp(now)}</span></p>
        <hr />
        <div aria-live="polite">
          {lines.map((l) => (
            <p key={l.k} className={`t-line${l.sub ? ' t-sub' : ''}${l.small ? ' t-incl' : ''}`}>
              <span>{l.t}</span>{l.p && <span>{l.p}</span>}
            </p>
          ))}
          <hr />
          <p key={`tot-${total}`} className="t-line t-total"><span>TOTAL AVANT TAXES</span><span>{money(total)}</span></p>
        </div>
        <hr />
        <p className="t-center t-small">PRIX DE SEPTEMBRE · PAS UNE COMMANDE</p>
        <p className="t-center t-small">POUR COMMANDER, APPELLE AU</p>
        <p className="t-center t-strong">{PHONE}</p>
      </div>
    </div>
  )
}

const defaultPicks = (item) => Object.fromEntries((item.choices || []).map((c) => [c.key, c.options[0]]))

function Compose() {
  const [dishId, setDishId] = useState('classique')
  const { cat, item } = findDish(dishId)
  const [picks, setPicks] = useState(() => defaultPicks(item))
  const [extras, setExtras] = useState({})

  const choose = (id) => {
    setDishId(id)
    setPicks(defaultPicks(findDish(id).item))
    setExtras({})
  }
  const surprise = () => {
    const all = MENU.flatMap((c) => c.items).filter((i) => i.id !== dishId)
    choose(all[Math.floor(Math.random() * all.length)].id)
  }
  const avail = extrasFor(cat, item)

  return (
    <section className="compose" id="compose" aria-labelledby="compose-title">
      <div className="compose-grid">
        <div className="compose-head">
          <h2 id="compose-title">Choisis ton plat</h2>
          <p className="lead">Choisis un plat de la carte et ses options : le bon fait le compte. Ensuite, t’as juste à appeler ou à passer nous voir.</p>
        </div>

        <div className="compose-controls">
          <Pills
            label="La section"
            options={MENU.map((c) => ({ value: c.id, label: c.title }))}
            value={cat.id}
            onChange={(id) => id !== cat.id && choose(MENU.find((c) => c.id === id).items[0].id)}
          />

          <fieldset className="dishes">
            <legend>Le plat</legend>
            <div className="dish-list">
              {cat.items.map((it) => (
                <label key={it.id} className="dish">
                  <input type="radio" name="dish" value={it.id} checked={it.id === dishId} onChange={() => choose(it.id)} />
                  <span className="dish-name">{it.name}</span>
                  <span className="dish-price">{money(it.price)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {item.desc && <p className="dish-desc"><span>Dans l’assiette :</span> {item.desc}</p>}

          {(item.choices || []).map((c) => (
            <Pills
              key={c.key}
              label={c.label}
              options={c.options.map((o) => ({ value: o, label: o }))}
              value={picks[c.key]}
              onChange={(v) => setPicks((p) => ({ ...p, [c.key]: v }))}
            />
          ))}

          {avail.length > 0 && (
            <fieldset className="opts">
              <legend>En extra</legend>
              <div>
                {avail.map((e) => (
                  <button key={e.key} type="button" aria-pressed={!!extras[e.key]} onClick={() => setExtras((x) => ({ ...x, [e.key]: !x[e.key] }))}>
                    {e.label} <span className="opt-price">+{money(e.price)}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <button type="button" className="btn btn-line btn-surprise" onClick={surprise}>Surprends-moi</button>
        </div>

        <div className="compose-stage">
          <div className="compose-photo">
            <Photo
              name="brunch"
              w={[900, 560]}
              h={900}
              sizes="(max-width: 980px) 90vw, 46vw"
              alt="Déjeuner servi au bistro : salade avec deux « cocos » et fruits, assiette de fruits avec bagel multigrain grillé, potage aux croûtons et yogourt aux fraises."
            />
          </div>
          <div className="compose-ticket">
            <Ticket cat={cat} item={item} picks={picks} extras={extras} />
            <a className="btn btn-cream btn-call" href={TEL}>Appeler le {PHONE}</a>
            <p className="no-online"><strong>Aperçu</strong> — on ne prend pas les commandes en ligne ; appelle ou passe nous voir.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

const HOUSE = [
  {
    tag: 'La fabrique',
    tone: 'crust',
    title: 'Des bagels frais, faits ici',
    text: 'Un bistro avec sa propre fabrique : les bagels sont faits sur place, puis servis au déjeuner comme au dîner. Une envie d’une autre sorte que celle de la maison ? Choisis ton bagel préféré pour 1,75 $.',
    photo: { name: 'bagels', w: [1000, 600], h: 1000, alt: 'Plateau de bagels au sésame dorés, tout juste sortis du four.' },
  },
  {
    tag: 'Fait maison',
    tone: 'herb',
    title: 'Hollandaise, creton et compagnie',
    text: 'La sauce hollandaise, le creton, la sauce à la viande et la tartinade à la truite fumée sont faits maison. Le fromage à la crème, lui, se choisit. Et le café est à volonté.',
    photo: { name: 'sandwich', w: [900, 560], h: 900, alt: 'Bagel au sésame garni de laitue, tomate et jambon, enveloppé dans du papier sur une planche de bois, à côté d’un bagel au pavot et de tomates cerises.' },
  },
]

export default function App() {
  const status = useOpenStatus()

  return (
    <>
      <a className="skip" href="#menu">Aller au menu</a>
      <header className="top">
        <a className="brand" href="#top">Au Bagel Gourmand</a>
        <nav aria-label="Principal">
          <a href="#menu">Menu</a>
          <a href="#compose">Ton plat</a>
          <a href="#maison">La maison</a>
          <a href="#visite">Visite</a>
        </nav>
        <a className={`status ${status.open ? 'open' : 'closed'}`} href="#visite"><i aria-hidden="true" />{status.text}</a>
      </header>

      <main id="top">
        <Hero />
        <Menu />
        <Compose />

        <section className="house" id="maison" aria-labelledby="house-title">
          <h2 id="house-title" className="house-title">Tout est fait sur place</h2>
          {HOUSE.map((o, i) => (
            <article key={o.title} className={`row row-${i % 2 ? 'r' : 'l'} tone-${o.tone}`}>
              <div className="row-art">
                <Photo {...o.photo} sizes="(max-width: 980px) 92vw, 46vw" />
              </div>
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
      <div className="radcrafts-credit">
        <span>&copy; 2026</span>
        <a href="https://radcrafts.ca" target="_blank" rel="noopener">
          <img src="/images/radcrafts-r.png" alt="" width="15" height="15" />
          <span>RadCrafts</span>
        </a>
      </div>
    </>
  )
}
