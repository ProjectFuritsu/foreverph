// Screenshots the top of the home page and each design page into
// public/share/, the pictures Facebook and Messenger show in link previews.
// Uses your installed Google Chrome; set CHROME_PATH to use another browser.
import { mkdir } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'
import { createServer } from 'vite'
import { designPath, designs } from '../src/content.js'

const pages = [['home', '/'], ...designs.map((design) => [design.id, designPath(design)])]

// A 1340×704 window, scrolled until the hero sits just under the sticky nav,
// fits everything from the logo to the trust list in Facebook's 1.91:1
// frame. The scale saves it at 1200×630.
const viewport = { width: 1340, height: 704, deviceScaleFactor: 1200 / 1340 }
const scroll = 75

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
    await page.evaluate(async (top) => {
      await document.fonts.ready
      window.scrollTo({ top, behavior: 'instant' })
      // Let the nav pick up the scroll before the shot.
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    }, scroll)
    await page.screenshot({ path: `public/share/${name}.jpg`, type: 'jpeg', quality: 90 })
    console.log(`public/share/${name}.jpg`)
  }
} finally {
  await browser.close()
  await server.close()
}
