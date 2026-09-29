import { useState } from 'react'
import { designs } from '../content.js'
import { formatShortDate, initials, themeStyle, weddingTime } from '../preview.js'

// A sample reception: each table's family, guests and dietary notes. The
// Santos family is too big for one table, so they get two side by side.
const families = {
  Santos: '#c0456a',
  Reyes: '#b08634',
  Cruz: '#6f8a66',
  Garcia: '#7d72a8',
  Mendoza: '#4f86a3',
}

const tables = [
  { family: 'Santos', guests: 8, notes: '1 vegetarian' },
  { family: 'Santos', guests: 7, notes: '—' },
  { family: 'Reyes', guests: 8, notes: '1 nut allergy' },
  { family: 'Cruz', guests: 6, notes: '1 halal' },
  { family: 'Garcia', guests: 8 },
  { family: 'Mendoza', guests: 5 },
]

const SEATS = 8
const columns = [55, 150, 245]
const rows = [84, 178]

function SeatingPlan({ design }) {
  return (
    <svg
      className="seating"
      viewBox="0 0 300 234"
      role="img"
      aria-label="Sample seating plan: the Santos family at tables 1 and 2, then the Reyes, Cruz, Garcia and Mendoza families at their own tables"
    >
      <rect className="seating__couple" x="95" y="6" width="110" height="24" rx="12" />
      <text className="seating__couple-name" x="150" y="21.5">
        {design.couple.join(' & ')}
      </text>
      <rect className="seating__group" x="13" y="44" width="179" height="96" rx="22" />
      {tables.map((table, i) => {
        const x = columns[i % 3]
        const y = rows[Math.floor(i / 3)]
        return (
          <g key={i} style={{ '--family': families[table.family] }}>
            {Array.from({ length: SEATS }, (_, seat) => {
              const angle = (seat / SEATS) * 2 * Math.PI - Math.PI / 2
              return (
                <circle
                  key={seat}
                  className={`seating__seat${seat < table.guests ? ' is-taken' : ''}`}
                  cx={x + 29 * Math.cos(angle)}
                  cy={y + 29 * Math.sin(angle)}
                  r="4.5"
                />
              )
            })}
            <circle className="seating__table" cx={x} cy={y} r="19" />
            <text className="seating__num" x={x} y={y + 5}>
              {i + 1}
            </text>
            <text className="seating__family" x={x} y={y + 48}>
              {table.family}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function PlaceCards({ design }) {
  const [motifId, setMotifId] = useState(design.id)
  const motif = designs.find((d) => d.id === motifId)
  return (
    <>
      <div
        className="cards"
        style={themeStyle(motif)}
        role="img"
        aria-label={`Place card for Carmen Santos, table 1, in the ${motif.name} design`}
      >
        <div className="placecard placecard--back">
          <p className="placecard__mono">{initials(motif.couple)}</p>
          <p className="placecard__name">Tita Baby</p>
          <p className="placecard__table">Table 1</p>
        </div>
        <div className="placecard">
          <p className="placecard__mono">{initials(motif.couple)}</p>
          <p className="placecard__name">Carmen Santos</p>
          <p className="placecard__table">Table 1</p>
        </div>
      </div>
      <div className="swatches">
        <span className="swatches__label">
          Motif: <strong>{motif.name}</strong>
        </span>
        <span className="swatches__list">
          {designs.map((d) => (
            <button
              key={d.id}
              type="button"
              className="swatch"
              style={{ '--swatch-bg': d.colors.bg, '--swatch-fg': d.colors.primary }}
              aria-label={`Show place cards in ${d.name}`}
              aria-pressed={d.id === motifId}
              onClick={() => setMotifId(d.id)}
            />
          ))}
        </span>
      </div>
    </>
  )
}

function CatererExport({ design }) {
  const listed = tables.slice(0, 4)
  return (
    <div
      className="export"
      role="img"
      aria-label="Sample caterer export: guests and dietary notes per table, 142 guests at 18 tables, as Excel or PDF"
    >
      <div className="export__head">
        <p>
          <strong>Final headcount</strong>
          {formatShortDate(weddingTime(design.date))}
        </p>
        <span className="export__file export__file--pdf">PDF</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Table</th>
            <th>Guests</th>
            <th>Dietary notes</th>
          </tr>
        </thead>
        <tbody>
          {listed.map((table, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{table.guests}</td>
              <td>{table.notes}</td>
            </tr>
          ))}
          <tr className="export__more">
            <td colSpan="3">+ 14 more tables</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>142</td>
            <td>7 notes</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

const previews = { seating: SeatingPlan, cards: PlaceCards, caterer: CatererExport }

export default function ReceptionPreview({ tool, design }) {
  const Preview = previews[tool.id]
  return <Preview design={design} />
}
