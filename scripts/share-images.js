// Screenshots the top of the home page, each design page and the live sample
// in each design into public/share/, the pictures Facebook and Messenger show
// in link previews. Uses your installed Google Chrome; set CHROME_PATH to use
// another browser. Name pictures to redo only those: `npm run share-images --
// sample` redoes sample.jpg and every sample-<design>.jpg.
import { mkdir } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'
import { createServer } from 'vite'
import { designPath, designs, samplePath } from '../src/content.js'

const only = process.argv.slice(2)
const wanted = ([name]) => only.length === 0 || only.some((o) => name === o || name.startsWith(`${o}-`))
const pages = [['home', '/'], ...designs.map((design) => [design.id, designPath(design)])].filter(wanted)
const samplePages = [
  ['sample', '/sample/'],
  ...designs.map((design) => [`sample-${design.id}`, samplePath(design)]),
].filter(wanted)

// A 1340×704 window, scrolled until the top 75px of the hero is tucked under
// the sticky nav, fits everything from the logo to the trust list in
// Facebook's 1.91:1 frame. The scale saves it at 1200×630.
const viewport = { width: 1340, height: 704, deviceScaleFactor: 1200 / 1340 }
const heroTuck = 75

const server = await createServer({ logLevel: 'warn' })
await server.listen()
const browser = await puppeteer.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' },
)

try {
  const page = await browser.newPage()
  await page.setViewport(viewport)
  // Turns off the entrance and floating animations so each shot is still.
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await mkdir('public/share', { recursive: true })
  for (const [name, path] of pages) {
    await page.goto(new URL(path, server.resolvedUrls.local[0]).href, { waitUntil: 'networkidle0' })
    await page.evaluate(async (tuck) => {
      await document.fonts.ready
      const hero = document.querySelector('.hero')
      const nav = document.querySelector('.nav')
      window.scrollTo({ top: hero.offsetTop - nav.offsetHeight + tuck, behavior: 'instant' })
      // Let the nav pick up the scroll before the shot.
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    }, heroTuck)
    await page.screenshot({ path: `public/share/${name}.jpg`, type: 'jpeg', quality: 90 })
    console.log(`public/share/${name}.jpg`)
  }

  // The live sample (npm run sample): the top of the couple's page, without
  // the bar at the bottom.
  await page.setViewport({ width: 1200, height: 630 })
  for (const [name, path] of samplePages) {
    await page.goto(new URL(path, server.resolvedUrls.local[0]).href, { waitUntil: 'networkidle0' })
    await page.evaluate(async () => {
      await document.fonts.ready
      document.querySelector('.fph-sample')?.remove()
    })
    await page.screenshot({ path: `public/share/${name}.jpg`, type: 'jpeg', quality: 90 })
    console.log(`public/share/${name}.jpg`)
  }
} finally {
  await browser.close()
  await server.close()
}
