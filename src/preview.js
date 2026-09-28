import { useEffect, useState } from 'react'

const dateFormat = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'Asia/Manila',
})

const shortDateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'Asia/Manila',
})

// Sample dates are Philippine time.
export const weddingTime = (date) => new Date(`${date}:00+08:00`)

export const formatWeddingDate = (date) => dateFormat.format(weddingTime(date))

export const formatShortDate = (time) => shortDateFormat.format(time)

export const initials = ([one, two]) => `${one[0]} & ${two[0]}`

export const siteDomain = ([one, two]) => `${one}and${two}.com`.toLowerCase()

export function countdown(date, now, withSeconds = false) {
  const ms = Math.max(0, weddingTime(date) - now)
  const parts = [
    ['Days', Math.floor(ms / 86_400_000)],
    ['Hours', Math.floor(ms / 3_600_000) % 24],
    ['Min', Math.floor(ms / 60_000) % 60],
  ]
  if (withSeconds) parts.push(['Sec', Math.floor(ms / 1000) % 60])
  return parts
}

// CSS variables the .preview styles read, taken from one design.
export function themeStyle({ colors, fonts }) {
  return {
    '--p-bg': colors.bg,
    '--p-surface': colors.surface,
    '--p-text': colors.text,
    '--p-muted': colors.muted,
    '--p-primary': colors.primary,
    '--p-on-primary': colors.onPrimary,
    '--p-script': `'${fonts.script}', cursive`,
    '--p-heading': `'${fonts.heading}', serif`,
  }
}

export function useNow(intervalMs) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

// Request only basic Latin for the 9 preview font families, which keeps
// each file a few KB while still covering any names typed into content.js.
export function loadPreviewFonts(designs) {
  if (document.getElementById('preview-fonts')) return
  const families = new Set(designs.flatMap((design) => [design.fonts.script, design.fonts.heading]))
  let chars = '“”‘’–·'
  for (let code = 32; code < 127; code++) chars += String.fromCharCode(code)
  const query = [...families].map((family) => `family=${family.replaceAll(' ', '+')}`).join('&')
  const link = document.createElement('link')
  link.id = 'preview-fonts'
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?${query}&text=${encodeURIComponent(chars)}&display=swap`
  document.head.append(link)
}
