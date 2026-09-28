import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { designPath, designs, share } from './src/content.js'

const escape = (text) =>
  text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')

// Facebook and Messenger read link previews from the HTML without running
// JavaScript, so every page people share needs its tags in its own file.
// This fills in index.html, and on build writes designs/<id>/index.html for
// each design: the same page with that design's tags.
function sharePages(siteUrl) {
  const home = { path: '/', image: 'home', ...share.home }
  const designPages = designs.map((design) => ({
    path: designPath(design),
    image: design.id,
    ...share.design(design),
  }))

  const imageFile = (page) => new URL(`./public/share/${page.image}.jpg`, import.meta.url)

  // ?v= changes whenever the picture does, so Facebook fetches the new one
  // instead of showing its cached copy.
  function imageUrl(page) {
    const url = `${siteUrl}/share/${page.image}.jpg`
    if (!existsSync(imageFile(page))) return url
    const version = createHash('sha1').update(readFileSync(imageFile(page))).digest('hex')
    return `${url}?v=${version.slice(0, 8)}`
  }

  function tags(page) {
    const url = siteUrl + page.path
    return [
      `<title>${escape(page.title)}</title>`,
      `<meta name="description" content="${escape(page.description)}" />`,
      `<link rel="canonical" href="${url}" />`,
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:title" content="${escape(page.title)}" />`,
      `<meta property="og:description" content="${escape(page.description)}" />`,
      `<meta property="og:image" content="${imageUrl(page)}" />`,
      `<meta property="og:image:alt" content="${escape(page.imageAlt)}" />`,
    ].join('\n    ')
  }

  return {
    name: 'share-pages',
    transformIndexHtml: (html) => html.replace('<!-- page tags -->', tags(home)),
    writeBundle({ dir }) {
      const missing = [home, ...designPages].filter((page) => !existsSync(imageFile(page)))
      if (missing.length) {
        const paths = missing.map((page) => page.path).join(' ')
        throw new Error(`No preview picture for ${paths}. Run npm run share-images.`)
      }
      const html = readFileSync(join(dir, 'index.html'), 'utf8')
      const homeTags = tags(home)
      if (!html.includes(homeTags)) throw new Error('share-pages: page tags not found in index.html')
      for (const page of designPages) {
        mkdirSync(join(dir, page.path), { recursive: true })
        writeFileSync(join(dir, page.path, 'index.html'), html.replace(homeTags, tags(page)))
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const { VITE_SITE_URL } = loadEnv(mode, import.meta.dirname)
  if (!VITE_SITE_URL) throw new Error('Set VITE_SITE_URL in .env to your live domain.')
  return {
    plugins: [react(), sharePages(VITE_SITE_URL.replace(/\/$/, ''))],
  }
})
