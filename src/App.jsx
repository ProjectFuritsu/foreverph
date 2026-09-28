import { useEffect, useRef, useState } from 'react'
import Icon, { MessengerIcon } from './components/Icon.jsx'
import SitePreview from './components/SitePreview.jsx'
import SiteTour from './components/SiteTour.jsx'
import {
  brand,
  designs,
  faqs,
  guestQuestions,
  heroDesign,
  included,
  messages,
  messengerUrl,
  packages,
  specLabels,
  steps,
} from './content.js'
import { useNow } from './preview.js'
import './App.css'

// Nav border once the page scrolls; the mobile CTA bar shows between
// the hero buttons and the final call-to-action.
function useScrollState(heroCtaRef, finalRef) {
  const [state, setState] = useState({ scrolled: false, showBar: false })
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const heroBottom = heroCtaRef.current?.getBoundingClientRect().bottom ?? 0
      const finalTop = finalRef.current?.getBoundingClientRect().top ?? Infinity
      const scrolled = window.scrollY > 8
      const showBar = heroBottom < 0 && finalTop > window.innerHeight
      setState((prev) =>
        prev.scrolled === scrolled && prev.showBar === showBar ? prev : { scrolled, showBar },
      )
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [heroCtaRef, finalRef])
  return state
}

function MessengerButton({ message, variant = 'primary', size, block, children }) {
  const classes = ['btn', `btn--${variant}`, size && `btn--${size}`, block && 'btn--block']
  return (
    <a
      className={classes.filter(Boolean).join(' ')}
      href={messengerUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <MessengerIcon size={size === 'sm' ? 16 : 19} />
      {children ?? 'Message us on Messenger'}
    </a>
  )
}

function SectionHead({ eyebrow, title, children }) {
  return (
    <header className="section__head">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </header>
  )
}

function Nav({ scrolled }) {
  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container nav__inner">
        <a className="brand" href="#top">
          <img src="/logo.png" alt="" width="30" height="38" />
          {brand.name}
        </a>
        <nav className="nav__links" aria-label="Sections">
          <a href="#designs">Designs</a>
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>
        <MessengerButton message={messages.general} size="sm">
          Message us
        </MessengerButton>
      </div>
    </header>
  )
}

function Hero({ now, ctaRef }) {
  return (
    <section className="hero" id="top">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">Wedding websites with RSVP</p>
          <h1>
            Everything your guests need, <em>in one link.</em>
          </h1>
          <p className="lead">
            Details, map, schedule, photos, countdown and RSVP in one beautiful website, made for
            Filipino weddings. Ready in 2–3 days, from ₱2,499.
          </p>
          <div className="hero__actions" ref={ctaRef}>
            <MessengerButton message={messages.general} size="lg" />
            <a className="btn btn--ghost btn--lg" href="#designs">
              See the designs
              <Icon name="down" size={18} />
            </a>
          </div>
          <ul className="trust">
            <li>
              <Icon name="check" size={18} />
              Ready in 2–3 days
            </li>
            <li>
              <Icon name="check" size={18} />
              GCash, Maya &amp; bank transfer
            </li>
            <li>
              <Icon name="check" size={18} />A real person on Messenger
            </li>
          </ul>
        </div>

        <div className="hero__visual">
          <div className="phone">
            <span className="phone__notch" aria-hidden="true" />
            <SitePreview design={heroDesign} now={now} variant="hero" />
          </div>
          <div className="float float--rsvp" aria-hidden="true">
            <span className="float__icon">
              <Icon name="check" size={18} />
            </span>
            <span>
              <strong>New RSVP</strong>
              Tita Baby &amp; family · 4 attending
            </span>
          </div>
          <div className="float float--diet" aria-hidden="true">
            <span className="float__icon">
              <Icon name="rsvp" size={18} />
            </span>
            <span>
              <strong>Dietary notes</strong>1 vegetarian · 1 nut allergy
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function GuestQuestions() {
  return (
    <section className="section section--soft">
      <div className="container">
        <SectionHead
          eyebrow="Sound familiar?"
          title={
            <>
              Five questions every guest asks, <em>answered in one link.</em>
            </>
          }
        >
          Stop replying to the same messages one chat at a time. Send your website once and let it
          do the answering, day and night.
        </SectionHead>
        <ol className="qa">
          {guestQuestions.map((item) => (
            <li className="qa__row" key={item.question}>
              <p className="qa__bubble">{item.question}</p>
              <span className="qa__line" aria-hidden="true" />
              <p className="qa__answer">
                <span className="sr-only">Answered by: </span>
                <Icon name={item.icon} size={18} />
                {item.answer}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section className="section" id="features">
      <div className="container">
        <SectionHead
          eyebrow="Every package includes"
          title={
            <>
              All the details, <em>none of the chaos.</em>
            </>
          }
        >
          Pick a section to see how it looks on your guests' phones, then try it in each design.
        </SectionHead>
        <SiteTour />
      </div>
    </section>
  )
}

const designStyles = [
  [false, 'Simple'],
  [true, 'With photos'],
]

function Designs({ now }) {
  // ?designs=photos opens this section on the photo previews.
  const [withPhoto, setWithPhoto] = useState(
    () => new URLSearchParams(window.location.search).get('designs') === 'photos',
  )
  const sample = brand.sampleSiteUrl
    ? { href: brand.sampleSiteUrl, label: 'See a live sample' }
    : { href: messengerUrl(messages.demo), label: 'Ask for a live demo' }
  return (
    <section className="section section--soft" id="designs">
      <div className="container">
        <SectionHead eyebrow="Designs" title="Pick from 6 ready designs">
          Each one is filled in with your names, photos and details. Want something one-of-a-kind?
          Bespoke is designed just for you.
        </SectionHead>
        <div className="segmented" role="group" aria-label="Preview style">
          {designStyles.map(([value, label]) => (
            <button
              key={label}
              type="button"
              aria-pressed={withPhoto === value}
              onClick={() => setWithPhoto(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <ul className="designs">
          {designs.map((design) => (
            <li className="design" key={design.id}>
              <SitePreview design={design} now={now} withPhoto={withPhoto} />
              <h3>{design.name}</h3>
              <p>{design.note}</p>
            </li>
          ))}
        </ul>
        <p className="designs__hint" aria-hidden="true">
          Swipe to see all 6 <Icon name="arrow" size={16} />
        </p>
        <div className="section__foot">
          <a className="btn btn--ghost" href={sample.href} target="_blank" rel="noopener noreferrer">
            {sample.label}
            <Icon name="arrow" size={18} />
          </a>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section className="section" id="how">
      <div className="container">
        <SectionHead
          eyebrow="How it works"
          title={
            <>
              From first message to live website <em>in 2–3 days.</em>
            </>
          }
        >
          That's for Essentials and Signature. Bespoke takes 2–4 weeks because we design it from
          scratch.
        </SectionHead>
        <ol className="steps">
          {steps.map((step, i) => (
            <li className="step" key={step.title}>
              <span className="step__num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section className="section section--soft" id="pricing">
      <div className="container">
        <SectionHead eyebrow="Packages & pricing" title="Pick your package">
          Every package has the same features and RSVP. What changes is your link, how long it stays
          online and the design.
        </SectionHead>
        <div className="plans">
          {packages.map((plan) => (
            <article className={`plan${plan.badge ? ' plan--featured' : ''}`} key={plan.name}>
              <header className="plan__head">
                <h3>
                  {plan.name}
                  {plan.badge && <span className="badge">{plan.badge}</span>}
                </h3>
                <p>{plan.tagline}</p>
              </header>
              <p className="plan__price">
                {plan.pricePrefix && <small>{plan.pricePrefix}</small>}
                <span>{plan.price}</span>
                {plan.priceNote && <small>{plan.priceNote}</small>}
              </p>
              {specLabels.map((label, i) => {
                const value = plan.specs[i]
                return (
                  <div className="spec" key={label}>
                    <span className="spec__label">{label}</span>
                    <span className="spec__value">
                      {typeof value === 'string' ? value : <code>{value.link}</code>}
                    </span>
                  </div>
                )
              })}
              <MessengerButton
                message={messages.package(plan.name)}
                variant={plan.badge ? 'primary' : 'outline'}
                block
              >
                {plan.cta}
              </MessengerButton>
            </article>
          ))}
        </div>
        <div className="plans__notes">
          <p className="included">
            <strong>Every package includes</strong> {included}
          </p>
          <p className="referral">
            <Icon name="gift" size={22} />
            Referred by a past couple? Get ₱200 off.
          </p>
        </div>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section className="section" id="faq">
      <div className="container faq">
        <header className="faq__head">
          <p className="eyebrow">FAQ</p>
          <h2>Questions, answered</h2>
          <p>Something we didn't cover? Ask us. A real person replies.</p>
          <MessengerButton message={messages.general} variant="outline">
            Ask us on Messenger
          </MessengerButton>
        </header>
        <div className="faq__list">
          {faqs.map((faq) => (
            <details className="faq__item" key={faq.q}>
              <summary>
                {faq.q}
                <Icon name="plus" size={20} className="faq__icon" />
              </summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta({ sectionRef }) {
  return (
    <section className="final" ref={sectionRef}>
      <div className="container final__inner">
        <img src="/logo.png" alt="" width="72" height="91" />
        <h2>
          Let's start your <em>wedding website.</em>
        </h2>
        <p>
          Message us your wedding date and the package you like. We'll reply on Messenger and take
          care of the rest.
        </p>
        <MessengerButton message={messages.general} size="lg" />
        <p className="final__note">GCash · Maya · Bank transfer</p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <a className="brand" href="#top">
          <img src="/logo.png" alt="" width="24" height="30" />
          {brand.name}
        </a>
        <p>{brand.tagline}</p>
        <p>
          © {new Date().getFullYear()} {brand.name}
        </p>
      </div>
    </footer>
  )
}

function MobileBar({ visible }) {
  return (
    <div className={`mobile-bar${visible ? ' is-visible' : ''}`} inert={!visible}>
      <p className="mobile-bar__price">
        From <strong>₱2,499</strong>
      </p>
      <MessengerButton message={messages.general}>Message us</MessengerButton>
    </div>
  )
}

export default function App() {
  const now = useNow(15_000)
  const heroCtaRef = useRef(null)
  const finalRef = useRef(null)
  const { scrolled, showBar } = useScrollState(heroCtaRef, finalRef)

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav scrolled={scrolled} />
      <main id="main">
        <Hero now={now} ctaRef={heroCtaRef} />
        <GuestQuestions />
        <Features />
        <Designs now={now} />
        <HowItWorks />
        <Pricing />
        <Faq />
        <FinalCta sectionRef={finalRef} />
      </main>
      <Footer />
      <MobileBar visible={showBar} />
    </>
  )
}
