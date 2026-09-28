import {
  countdown,
  formatShortDate,
  formatWeddingDate,
  initials,
  siteDomain,
  themeStyle,
  weddingTime,
} from '../preview.js'
import Icon from './Icon.jsx'

function Heading({ kicker, title }) {
  return (
    <header className="pv-head">
      <p className="pv-kicker">{kicker}</p>
      <p className="pv-title">{title}</p>
    </header>
  )
}

function Details({ design }) {
  return (
    <>
      <Heading kicker="Join us" title="The details" />
      <div className="pv-card">
        <span className="pv-label">When</span>
        <p>{formatWeddingDate(design.date)}</p>
        <p className="pv-muted">Ceremony at 3:00 PM</p>
      </div>
      <div className="pv-card">
        <span className="pv-label">Where</span>
        <p>{design.venue}</p>
        <p className="pv-muted">{design.city}</p>
      </div>
      <div className="pv-card">
        <span className="pv-label">Dress code</span>
        <p>Formal, in our motif colors</p>
        <span className="pv-swatches">
          <i style={{ background: design.colors.primary }} />
          <i className="pv-swatch--soft" />
          <i style={{ background: design.colors.text }} />
        </span>
      </div>
      <p className="pv-subtitle">Our story</p>
      <p className="pv-text">
        We met at a friend's birthday in 2019. Six years and one very nervous proposal later, we're
        getting married.
      </p>
    </>
  )
}

function Venue({ design }) {
  return (
    <>
      <Heading kicker="Getting there" title="The venue" />
      <div className="pv-map">
        <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice">
          <rect className="pv-map__land" width="200" height="130" />
          <path className="pv-map__park" d="M-5 88c28-10 52 4 70 22s10 30-6 30H-5Z" />
          <path className="pv-map__park" d="M138-5c-6 20 6 36 30 40s38-6 38-6V-5Z" />
          <path className="pv-map__water" d="M-5 22c40 10 62-6 92 4s50 34 118 20" />
          <path className="pv-map__road" d="M-5 64h210M76-5l30 140M150 135c-8-40 4-70 55-88" />
          <path className="pv-map__lane" d="M20-5v70M-5 104h86M118 64l30-69M106 135l44-71" />
          <circle className="pv-map__pulse" cx="104" cy="60" r="15" />
          <path className="pv-map__pin" d="M104 64s-11-10-11-19a11 11 0 0 1 22 0c0 9-11 19-11 19Z" />
          <circle cx="104" cy="45" r="4" fill="#fff" />
        </svg>
      </div>
      <div className="pv-card">
        <span className="pv-label">Ceremony &amp; reception</span>
        <p>{design.venue}</p>
        <p className="pv-muted">{design.city}</p>
      </div>
      <span className="pv-button">
        <Icon name="pin" size={12} />
        Get directions
      </span>
    </>
  )
}

const scheduleItems = [
  ['2:30 PM', 'Guests arrive', 'Welcome drinks'],
  ['3:00 PM', 'Ceremony', 'Garden chapel'],
  ['4:30 PM', 'Cocktails & photos', 'Garden lawn'],
  ['6:00 PM', 'Dinner & program', 'Grand hall'],
  ['9:00 PM', 'Party & send-off', 'Grand hall'],
]

function Schedule() {
  return (
    <>
      <Heading kicker="The big day" title="Schedule" />
      <ol className="pv-timeline">
        {scheduleItems.map(([time, title, place]) => (
          <li key={time}>
            <span className="pv-time">{time}</span>
            <span>
              <p>{title}</p>
              <p className="pv-muted">{place}</p>
            </span>
          </li>
        ))}
      </ol>
    </>
  )
}

const faqItems = [
  ['Is there parking?', 'Yes. Parking is free at the venue, and marshals will guide you in.'],
  ['Can I bring a plus-one?'],
  ['Are kids welcome?'],
  ['What time should I arrive?'],
  ['Do you have a gift registry?'],
]

function Faq() {
  return (
    <>
      <Heading kicker="Good to know" title="Guest FAQ" />
      <div className="pv-faq">
        {faqItems.map(([question, answer]) => (
          <div className={`pv-faq__item${answer ? ' is-open' : ''}`} key={question}>
            <p className="pv-faq__q">
              {question}
              <span>{answer ? '–' : '+'}</span>
            </p>
            {answer && <p className="pv-faq__a">{answer}</p>}
          </div>
        ))}
      </div>
    </>
  )
}

function Photos() {
  return (
    <>
      <Heading kicker="Our prenup" title="Gallery" />
      <div className="pv-gallery">
        {Array.from({ length: 6 }, (_, i) => (
          <span className="pv-photo" key={i} />
        ))}
      </div>
      <p className="pv-muted pv-center">Your prenup photos go here</p>
    </>
  )
}

function Countdown({ design, now }) {
  return (
    <>
      <Heading kicker="Counting down" title="Until we say “I do”" />
      <div className="pv-count">
        {countdown(design.date, now, true).map(([label, value]) => (
          <span key={label}>
            {String(value).padStart(2, '0')}
            <small>{label}</small>
          </span>
        ))}
      </div>
      <p className="pv-muted pv-center">{formatWeddingDate(design.date)}</p>
      <span className="pv-button pv-button--ghost">Add to calendar</span>
    </>
  )
}

function Rsvp({ design }) {
  const replyBy = new Date(weddingTime(design.date) - 50 * 86_400_000)
  return (
    <>
      <Heading kicker={`Kindly reply by ${formatShortDate(replyBy)}`} title="RSVP" />
      <div className="pv-form">
        <span className="pv-label">Full name</span>
        <span className="pv-input">Maria Santos</span>
        <span className="pv-label">Will you attend?</span>
        <span className="pv-options">
          <span className="is-on">Joyfully accepts</span>
          <span>Regretfully declines</span>
        </span>
        <span className="pv-label">Dietary needs</span>
        <span className="pv-chips">
          <span className="is-on">Vegetarian</span>
          <span>Halal</span>
          <span>No pork</span>
          <span className="is-on">Nut-free</span>
        </span>
        <span className="pv-label">Food allergies</span>
        <span className="pv-input">Peanuts (severe)</span>
        <span className="pv-label">Arriving</span>
        <span className="pv-input pv-select">On the wedding day</span>
        <span className="pv-button">Send RSVP</span>
      </div>
    </>
  )
}

const sections = {
  details: Details,
  map: Venue,
  schedule: Schedule,
  faq: Faq,
  photos: Photos,
  countdown: Countdown,
  rsvp: Rsvp,
}

export default function SectionPreview({ design, section, now }) {
  const Section = sections[section.id]
  return (
    <div
      className="preview preview--section"
      style={themeStyle(design)}
      role="img"
      aria-label={`${section.title} section of a sample wedding website in the ${design.name} design`}
    >
      <div className="preview__url">
        <span>{siteDomain(design.couple)}</span>
      </div>
      <div className="preview__nav">
        <span>{initials(design.couple)}</span>
        <Icon name="menu" size={16} />
      </div>
      <div className="pv-body" key={`${section.id}-${design.id}`}>
        <Section design={design} now={now} />
      </div>
    </div>
  )
}
