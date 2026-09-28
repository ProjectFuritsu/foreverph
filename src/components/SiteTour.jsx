import { useRef, useState } from 'react'
import { designs, features } from '../content.js'
import { useNow } from '../preview.js'
import Icon from './Icon.jsx'
import SectionPreview from './SectionPreview.jsx'

const NEXT_KEYS = ['ArrowDown', 'ArrowRight']
const PREV_KEYS = ['ArrowUp', 'ArrowLeft']

// Links like ?section=rsvp&design=sage#features open the tour on that view.
function fromQuery(name, options, fallback) {
  const value = new URLSearchParams(window.location.search).get(name)
  return options.some((option) => option.id === value) ? value : fallback
}

// Left: the sections every wedding website has. Right: how the selected
// section looks on a guest's phone, in whichever design is picked.
export default function SiteTour({ defaultDesign }) {
  const [activeId, setActiveId] = useState(() => fromQuery('section', features, features[0].id))
  const [designId, setDesignId] = useState(() => fromQuery('design', designs, defaultDesign.id))
  const tabRefs = useRef([])
  const active = features.find((feature) => feature.id === activeId)
  const design = designs.find((d) => d.id === designId)
  const now = useNow(activeId === 'countdown' ? 1000 : 30_000)

  function select(index) {
    const feature = features[(index + features.length) % features.length]
    setActiveId(feature.id)
    tabRefs.current[features.indexOf(feature)]?.focus()
  }

  function onKeyDown(event, index) {
    if (NEXT_KEYS.includes(event.key)) select(index + 1)
    else if (PREV_KEYS.includes(event.key)) select(index - 1)
    else if (event.key === 'Home') select(0)
    else if (event.key === 'End') select(features.length - 1)
    else return
    event.preventDefault()
  }

  return (
    <div className="tour">
      <div className="tour__tabs" role="tablist" aria-label="Wedding website sections" aria-orientation="vertical">
        {features.map((feature, i) => {
          const selected = feature.id === activeId
          return (
            <button
              key={feature.id}
              ref={(el) => (tabRefs.current[i] = el)}
              id={`tour-tab-${feature.id}`}
              className="tour__tab"
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="tour-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(feature.id)}
              onKeyDown={(event) => onKeyDown(event, i)}
            >
              <span className="tour__icon">
                <Icon name={feature.icon} size={20} />
              </span>
              <span className="tour__copy">
                <span className="tour__title">{feature.title}</span>
                <span className="tour__text">{feature.text}</span>
                {feature.tags && (
                  <span className="tour__tags">
                    {feature.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </div>

      <div className="tour__stage" id="tour-panel" role="tabpanel" aria-labelledby={`tour-tab-${activeId}`}>
        <p className="tour__caption">{active.text}</p>
        <div className="phone">
          <span className="phone__notch" aria-hidden="true" />
          <SectionPreview design={design} section={active} now={now} />
        </div>
        <div className="swatches">
          <span className="swatches__label">
            Design: <strong>{design.name}</strong>
          </span>
          <span className="swatches__list">
            {designs.map((d) => (
              <button
                key={d.id}
                type="button"
                className="swatch"
                style={{ '--swatch-bg': d.colors.bg, '--swatch-fg': d.colors.primary }}
                aria-label={`Show in ${d.name}`}
                aria-pressed={d.id === designId}
                onClick={() => setDesignId(d.id)}
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  )
}
