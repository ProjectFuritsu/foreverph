import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { brand, designPath, designs, samplePath, share } from './src/content.js'

const escape = (text) =>
  text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')

// Preview tags in index.html that every page shares: site name, language,
// Facebook Page and picture size. The sample's pages come from the template,
// so they get copies of these.
const SHARED_META =
  /<meta (property="(og:site_name|og:locale|fb:pages|og:image:(type|width|height))"|name="twitter:card") [^>]*>/g

// Facebook and Messenger read link previews from the HTML without running
// JavaScript, so every page people share needs its tags in its own file.
// This fills in index.html, and on build writes designs/<id>/index.html for
// each design: the same page with that design's tags. It also writes
// robots.txt and sitemap.xml so search engines find every page.
function sharePages(siteUrl) {
  const home = { path: '/', image: 'home', ...share.home }
  const designPages = designs.map((design) => ({
    path: designPath(design),
    image: design.id,
    ...share.design(design),
  }))
  // The live sample from `npm run sample`, already in public/sample/, plus a
  // page that opens it in each design.
  const samplePages = [
    { path: '/sample/', image: 'sample', ...share.sample },
    ...designs.map((design) => ({
      path: samplePath(design),
      image: `sample-${design.id}`,
      ...share.sampleDesign(design),
    })),
  ]
  const allPages = [home, ...designPages, ...samplePages]

  const imageFile = (page) => new URL(`./public/share/${page.image}.jpg`, import.meta.url)

  // ?v= changes whenever the picture does, so Facebook fetches the new one
  // instead of showing its cached copy.
  function imageUrl(page) {
    const url = `${siteUrl}/share/${page.image}.jpg`
    if (!existsSync(imageFile(page))) return url
    const version = createHash('sha1').update(readFileSync(imageFile(page))).digest('hex')
    return `${url}?v=${version.slice(0, 8)}`
  }

  // Tells Google the site is called "ForeverPH" (the name shown above the
  // title in results) and ties the site, logo and Facebook Page together.
  function structuredData() {
    const organization = `${siteUrl}/#organization`
    const json = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: brand.name,
          alternateName: ['Forever PH', new URL(siteUrl).hostname],
          url: `${siteUrl}/`,
          publisher: { '@id': organization },
        },
        {
          '@type': 'Organization',
          '@id': organization,
          name: brand.name,
          url: `${siteUrl}/`,
          logo: `${siteUrl}/icon-192.png`,
          description: share.home.description,
          areaServed: { '@type': 'Country', name: 'Philippines' },
          sameAs: [brand.facebookUrl],
        },
      ],
    })
    return `<script type="application/ld+json">${json.replaceAll('<', '\\u003c')}</script>`
  }

  function tags(page) {
    const url = siteUrl + page.path
    const lines = [
      `<title>${escape(page.title)}</title>`,
      `<meta name="description" content="${escape(page.description)}" />`,
      `<link rel="canonical" href="${url}" />`,
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:title" content="${escape(page.title)}" />`,
      `<meta property="og:description" content="${escape(page.description)}" />`,
      `<meta property="og:image" content="${imageUrl(page)}" />`,
      `<meta property="og:image:alt" content="${escape(page.imageAlt)}" />`,
    ]
    if (page === home) lines.push(structuredData())
    return lines.join('\n    ')
  }

  return {
    name: 'share-pages',
    transformIndexHtml: (html) => html.replace('<!-- page tags -->', tags(home)),
    // The dev server answers /sample/ and /sample/<design>/ with this site's
    // own page, so point them at the sample's page, which reads the design
    // from the address. (The build writes a real page for each.)
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, 'http://localhost')
        if (/^\/sample(\/[a-z]+)?\/?$/.test(url.pathname)) req.url = `/sample/index.html${url.search}`
        next()
      })
    },
    writeBundle({ dir }) {
      const missing = allPages.filter((page) => !existsSync(imageFile(page)))
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

      // The sample's pages keep the template's page but swap the couple's
      // title and preview for ForeverPH's, so shared links say whose sample
      // it is. Each design's page is the same page; its script reads the
      // design from the address.
      const sampleFile = join(dir, 'sample/index.html')
      if (!existsSync(sampleFile)) throw new Error('No sample in public/sample/. Run npm run sample.')
      const sampleHtml = readFileSync(sampleFile, 'utf8')
        .replace(/<title>.*?<\/title>\s*/, '')
        .replace(/<meta (name="description"|property="og:(title|description)") [^>]*>\s*/g, '')
      const sharedMeta = html.match(SHARED_META) ?? []
      if (!sharedMeta.some((tag) => tag.includes('fb:pages'))) {
        throw new Error('share-pages: shared preview tags not found in index.html')
      }
      for (const page of samplePages) {
        const pageTags = [tags(page), ...sharedMeta].join('\n    ')
        mkdirSync(join(dir, page.path), { recursive: true })
        writeFileSync(join(dir, page.path, 'index.html'), sampleHtml.replace('</head>', `  ${pageTags}\n  </head>`))
      }

      writeFileSync(join(dir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`)
      const urls = allPages.map((page) => `  <url><loc>${siteUrl}${page.path}</loc></url>`)
      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls,
        '</urlset>',
      ]
      writeFileSync(join(dir, 'sitemap.xml'), `${sitemap.join('\n')}\n`)
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
