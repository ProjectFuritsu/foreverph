import { countdown, formatWeddingDate, initials, siteDomain, themeStyle } from '../preview.js'
import Icon from './Icon.jsx'

// withPhoto puts the couple's photo behind the hero, like the template's photo heroes.
export default function SitePreview({ design, now, variant = 'card', withPhoto = false }) {
  const { couple, date, venue } = design
  const isHero = variant === 'hero'
  const style = withPhoto
    ? {
        ...themeStyle(design),
        '--p-text': '#ffffff',
        '--p-muted': 'rgb(255 255 255 / 0.82)',
        '--p-photo': `url(${design.photo})`,
      }
    : themeStyle(design)

  return (
    <div
      className={`preview preview--${variant}${withPhoto ? ' preview--photo' : ''}`}
      style={style}
      role="img"
      aria-label={`Sample wedding website for ${couple[0]} and ${couple[1]} in the ${design.name} design`}
    >
      {isHero && (
        <div className="preview__url">
          <span>{siteDomain(couple)}</span>
        </div>
      )}
      <div className="preview__nav">
        <span>{initials(couple)}</span>
        {isHero ? (
          <Icon name="menu" size={16} />
        ) : (
          <span className="preview__links">
            <span>Details</span>
            <span>Schedule</span>
            <span>RSVP</span>
          </span>
        )}
      </div>

      <div className="preview__hero">
        <p className="preview__eyebrow">{design.eyebrow ?? "We're getting married"}</p>
        <p className="preview__names">
          <span>{couple[0]}</span>
          <span className="preview__amp">&amp;</span>
          <span>{couple[1]}</span>
        </p>
        <p className="preview__date">{formatWeddingDate(date)}</p>
        <p className="preview__venue">{venue}</p>
        <div className="preview__count">
          {countdown(date, now).map(([label, value]) => (
            <span key={label}>
              {value}
              <small>{label}</small>
            </span>
          ))}
        </div>
        <span className="preview__rsvp">RSVP</span>
      </div>

      {isHero && (
        <div className="preview__schedule">
          <p className="preview__schedule-title">Schedule</p>
          <ul>
            <li>
              <span>3:00 PM</span>Ceremony
            </li>
            <li>
              <span>5:30 PM</span>Reception
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
