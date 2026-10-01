// Builds the live sample at /sample/: the real wedding website template from
// ../WeddingWebsite, showing Isabel & Miguel's wedding. The result goes into
// public/sample/ and is committed, because the hosting build only sees this
// repo. Run it again after changing the template or their wedding.json.
//
// The sample runs in the template's test mode, so RSVPs sent from it are
// never saved, and in its sample mode, so the form resets for the next try.
//
// It also adds a bar at the bottom: a link back to this site, and buttons
// that switch the sample between the 6 designs (colors, fonts, photo shade).
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { brand, designs } from '../src/content.js'

const template = resolve(import.meta.dirname, '../../WeddingWebsite')
const outDir = resolve(import.meta.dirname, '../public/sample')
const wedding = 'isabel-and-miguel'
const weddingFile = join(template, 'weddings', wedding, 'wedding.json')

if (!existsSync(weddingFile)) throw new Error(`Template wedding not found: ${weddingFile}`)

const env = {
  ...process.env,
  // Set here so the sample stays the same whichever couple the template's
  // .env is switched to.
  VITE_WEDDING: wedding,
  // The template trims these, so a space means "no database": test mode.
  VITE_SUPABASE_URL: ' ',
  VITE_SUPABASE_ANON_KEY: ' ',
  // Says on the RSVP form that nothing is saved, and brings the empty form
  // back a few seconds after the thank-you.
  VITE_SAMPLE: 'true',
}

const vite = join(template, 'node_modules/vite/bin/vite.js')
const args = [vite, 'build', '--base', '/sample/', '--outDir', outDir, '--emptyOutDir']
const { status } = spawnSync(process.execPath, args, { cwd: template, env, stdio: 'inherit' })
if (status !== 0) process.exit(status ?? 1)

// Double-check that no database address or key made it into the sample.
const templateEnv = existsSync(join(template, '.env')) ? readFileSync(join(template, '.env'), 'utf8') : ''
const secrets = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']
  .map((name) => templateEnv.match(new RegExp(`^${name}=(.*)$`, 'm'))?.[1].trim())
  .filter(Boolean)
const files = readdirSync(outDir, { recursive: true, withFileTypes: true }).filter((entry) => entry.isFile())
for (const file of files) {
  const text = readFileSync(join(file.parentPath, file.name), 'utf8')
  if (secrets.some((secret) => text.includes(secret))) {
    rmSync(outDir, { recursive: true })
    throw new Error(`The sample included the RSVP database settings (${file.name}), so it was deleted.`)
  }
}

// Each design's colors and fonts, worked out by the template's own theme code
// so they match a real couple's site. The design names are the ones this site
// uses. The template sets these as CSS variables on its page, and the bar
// overrides them with !important, so switching needs no change to the template.
const { normalizeTheme, themeVars, googleFontsHref } = await import(
  pathToFileURL(join(template, 'src/lib/themes.js')).href
)
const { theme: coupleTheme } = JSON.parse(readFileSync(weddingFile, 'utf8'))
const themes = designs.map((design) => {
  const theme = normalizeTheme({ ...coupleTheme, preset: design.id })
  if (theme.preset !== design.id) throw new Error(`The template has no "${design.id}" theme.`)
  return {
    id: design.id,
    name: design.name,
    swatch: [theme.colors.background, theme.colors.primary],
    vars: themeVars(theme),
    fonts: googleFontsHref(theme),
  }
})

const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
const current = themes.find((theme) => theme.id === coupleTheme.preset) ?? themes[0]
const swatches = themes.map(
  (theme) =>
    `<button type="button" data-design="${theme.id}" aria-label="${escape(theme.name)}" title="${escape(theme.name)}" aria-pressed="${theme === current}" style="--a:${theme.swatch[0]};--b:${theme.swatch[1]}"></button>`,
)

const bar = `<aside class="fph-sample" aria-label="About this sample">
      <p class="fph-sample__about">
        <img src="/logo.png" alt="" width="22" height="28" />
        <span><strong>Sample website</strong> by ${brand.name}</span>
      </p>
      <div class="fph-sample__designs" role="group" aria-label="Try another design">
        <span class="fph-sample__name" aria-live="polite">${escape(current.name)}</span>
        <span class="fph-sample__swatches">
          ${swatches.join('\n          ')}
        </span>
      </div>
      <a class="fph-sample__cta" href="/">Get yours</a>
    </aside>
    <style>
      .fph-sample { position: fixed; z-index: 90; left: 50%; bottom: max(12px, env(safe-area-inset-bottom)); translate: -50% 0; display: grid; grid-template-columns: 1fr auto; grid-template-areas: 'about cta' 'designs designs'; align-items: center; gap: 10px 12px; width: min(420px, calc(100% - 24px)); margin: 0; padding: 10px 10px 12px 14px; border: 1px solid #efe7e5; border-radius: 22px; background: rgb(255 255 255 / 0.97); box-shadow: 0 18px 40px -18px rgb(43 34 32 / 0.5); font: 400 13px/1.3 system-ui, -apple-system, 'Segoe UI', sans-serif; color: #6f625e; }
      .fph-sample__about { grid-area: about; display: flex; align-items: center; gap: 10px; margin: 0; }
      .fph-sample__about img { flex: none; width: auto; height: 28px; }
      .fph-sample strong { font-weight: 600; color: #2b2220; }
      .fph-sample__cta { grid-area: cta; padding: 9px 16px; border-radius: 999px; background: #c0456a; color: #fff; font-weight: 600; text-decoration: none; }
      .fph-sample__cta:hover { background: #a8395b; }
      .fph-sample__designs { grid-area: designs; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 10px; border-top: 1px solid #efe7e5; }
      .fph-sample__name { font-weight: 600; color: #2b2220; white-space: nowrap; }
      .fph-sample__swatches { display: flex; gap: 8px; }
      .fph-sample__swatches button { width: 24px; height: 24px; padding: 0; border: 1px solid rgb(0 0 0 / 0.12); border-radius: 50%; background: linear-gradient(135deg, var(--a) 0 50%, var(--b) 50% 100%); cursor: pointer; }
      .fph-sample__swatches button[aria-pressed='true'] { box-shadow: 0 0 0 2px #fff, 0 0 0 4px #c0456a; }
      .fph-sample :focus-visible { outline: 2px solid #c0456a; outline-offset: 3px; }
      @media (min-width: 760px) {
        .fph-sample { grid-template-columns: auto auto auto; grid-template-areas: 'about designs cta'; gap: 16px; width: max-content; padding: 7px 7px 7px 16px; border-radius: 999px; }
        .fph-sample__designs { padding: 0 0 0 16px; border-top: 0; border-left: 1px solid #efe7e5; }
      }
      body { padding-bottom: 120px; }
      @media (min-width: 760px) { body { padding-bottom: 80px; } }
    </style>
    <script>
      (() => {
        // Sample RSVPs aren't kept, so every visit starts with a fresh form
        // (the key is from the template's src/lib/rsvpReceipt.js).
        try {
          localStorage.removeItem('wedding-rsvp-sent:${wedding}')
        } catch {
          // Storage blocked: nothing was remembered either.
        }
        const themes = ${JSON.stringify(Object.fromEntries(themes.map(({ id, name, vars, fonts }) => [id, { name, vars, fonts }])))}
        const bar = document.querySelector('.fph-sample')
        const buttons = bar.querySelectorAll('[data-design]')
        const override = document.head.appendChild(document.createElement('style'))
        function show(id) {
          const theme = themes[id]
          const vars = Object.entries(theme.vars).map(([name, value]) => name + ':' + value + ' !important')
          override.textContent = ':root, .ws {' + vars.join(';') + '}'
          if (theme.fonts && !document.querySelector('link[href="' + theme.fonts + '"]')) {
            document.head.append(Object.assign(document.createElement('link'), { rel: 'stylesheet', href: theme.fonts }))
          }
          document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.vars['--c-bg'])
          bar.querySelector('.fph-sample__name').textContent = theme.name
          buttons.forEach((button) => button.setAttribute('aria-pressed', button.dataset.design === id))
        }
        // /sample/?design=midnight opens the sample in that design.
        const start = new URLSearchParams(location.search).get('design')
        if (themes[start]) show(start)
        buttons.forEach((button) =>
          button.addEventListener('click', () => {
            show(button.dataset.design)
            const url = new URL(location.href)
            url.searchParams.set('design', button.dataset.design)
            history.replaceState(null, '', url)
          }),
        )
      })()
    </script>`

const indexFile = join(outDir, 'index.html')
writeFileSync(indexFile, readFileSync(indexFile, 'utf8').replace('</body>', `  ${bar}\n  </body>`))

console.log(`\nSample built into public/sample/ (${files.length} files), RSVPs in test mode.`)
