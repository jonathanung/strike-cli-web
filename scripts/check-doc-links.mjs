#!/usr/bin/env node
/**
 * Broken-link check for on-domain docs.
 * Verifies:
 *  - every content/docs/*.md has a DOC_PAGES slug (via filename)
 *  - internal markdown links (/docs/..., relative .md, #anchors on same page) resolve
 *  - homepage feature deep-links and known nav paths exist
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = join(root, 'src/content/docs')

const SLUG_ALIASES = {
  'agents-skills': 'multi-agent',
}

/** Required hub routes from product acceptance. */
const REQUIRED_SLUGS = [
  'install',
  'quickstart',
  'auth',
  'ftue',
  'usage',
  'keybinds',
  'editors',
  'sandbox',
  'scheduler',
  'multi-agent',
  'goal',
  'loop',
  'config',
  'mcp',
  'theme',
  'web',
  'peer-ecosystem',
]

function slugifyHeading(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function collectHeadings(md) {
  const ids = new Set()
  for (const line of md.split('\n')) {
    const m = /^(#{1,6})\s+(.+)$/.exec(line)
    if (!m) continue
    ids.add(slugifyHeading(m[2].replace(/`/g, '')))
  }
  return ids
}

function loadDocs() {
  const files = readdirSync(docsDir).filter((f) => f.endsWith('.md'))
  /** @type {Map<string, { path: string, md: string, headings: Set<string> }>} */
  const bySlug = new Map()
  for (const file of files) {
    const slug = file.replace(/\.md$/, '')
    const md = readFileSync(join(docsDir, file), 'utf8')
    bySlug.set(slug, { path: `src/content/docs/${file}`, md, headings: collectHeadings(md) })
  }
  return bySlug
}

const LINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g

function parseHref(href) {
  const [pathPart, frag = ''] = href.split('#')
  return { path: pathPart, frag }
}

function resolveInternal(href, currentSlug, docs) {
  if (!href || href.startsWith('mailto:') || href.startsWith('http://') || href.startsWith('https://')) {
    return { ok: true, skip: true }
  }
  if (href.startsWith('//')) return { ok: false, reason: 'protocol-relative URL not allowed in docs' }

  const { path, frag } = parseHref(href)

  if (!path || path === '') {
    // same-page anchor
    if (frag && !docs.get(currentSlug)?.headings.has(frag)) {
      return { ok: false, reason: `missing heading #${frag} on ${currentSlug}` }
    }
    return { ok: true }
  }

  if (path.startsWith('/')) {
    if (path === '/docs' || path === '/docs/') return { ok: true }
    const m = /^\/docs\/([a-z0-9-]+)\/?$/.exec(path)
    if (!m) {
      // allow homepage hashes and other known site routes
      if (path === '/' || path.startsWith('/#') || path === '/changelog' || path === '/github') {
        return { ok: true }
      }
      return { ok: false, reason: `unknown internal path ${path}` }
    }
    let slug = m[1]
    if (SLUG_ALIASES[slug]) slug = SLUG_ALIASES[slug]
    if (!docs.has(slug)) return { ok: false, reason: `no doc page for /docs/${m[1]}` }
    if (frag && !docs.get(slug).headings.has(frag)) {
      return { ok: false, reason: `missing heading #${frag} on ${slug}` }
    }
    return { ok: true }
  }

  // relative .md
  const base = path.replace(/^\.\//, '').split('/').pop()
  if (!base?.endsWith('.md')) {
    return { ok: false, reason: `unresolved relative link ${href}` }
  }
  let slug = base.replace(/\.md$/, '')
  if (SLUG_ALIASES[slug]) slug = SLUG_ALIASES[slug]
  if (!docs.has(slug)) {
    // architecture etc. should have been rewritten to GitHub — flag leftover
    return { ok: false, reason: `relative md not on hub: ${href}` }
  }
  if (frag && !docs.get(slug).headings.has(frag)) {
    return { ok: false, reason: `missing heading #${frag} on ${slug}` }
  }
  return { ok: true }
}

function checkMarkdownLinks(docs) {
  const errors = []
  for (const [slug, doc] of docs) {
    let m
    const re = new RegExp(LINK_RE.source, 'g')
    while ((m = re.exec(doc.md)) !== null) {
      const href = m[2].trim()
      const result = resolveInternal(href, slug, docs)
      if (!result.ok) {
        errors.push(`${doc.path}: [${m[1]}](${href}) — ${result.reason}`)
      }
    }
  }
  return errors
}

function checkSourceRoutes(docs) {
  const errors = []
  const docsTs = readFileSync(join(root, 'src/lib/docs.ts'), 'utf8')
  const slugsInTs = [...docsTs.matchAll(/slug:\s*'([a-z0-9-]+)'/g)].map((m) => m[1])
  const unique = new Set(slugsInTs)
  for (const slug of docs.keys()) {
    if (!unique.has(slug)) errors.push(`src/lib/docs.ts missing slug '${slug}' (file exists)`)
  }
  for (const slug of unique) {
    if (!docs.has(slug)) errors.push(`src/lib/docs.ts slug '${slug}' has no src/content/docs/${slug}.md`)
  }
  return errors
}


function checkSitemap(docs) {
  const errors = []
  const sm = readFileSync(join(root, 'public/sitemap.xml'), 'utf8')
  for (const slug of docs.keys()) {
    const loc = `https://strike.jonathanung.ca/docs/${slug}`
    if (!sm.includes(`<loc>${loc}</loc>`)) {
      errors.push(`public/sitemap.xml missing ${loc}`)
    }
  }
  if (!sm.includes('<loc>https://strike.jonathanung.ca/docs</loc>')) {
    errors.push('public/sitemap.xml missing /docs index')
  }
  return errors
}

function checkFeatureDeepLinks(docs) {

  const errors = []
  const features = readFileSync(join(root, 'src/components/Features.tsx'), 'utf8')
  const links = [
    ...features.matchAll(/to=\{?["'`](\/docs\/[a-z0-9-]+)["'`]/g),
    ...features.matchAll(/docsTo:\s*['"](\/docs\/[a-z0-9-]+)['"]/g),
  ].map((m) => m[1])
  if (links.length === 0) {
    errors.push('Features.tsx: expected deep-links to /docs/* on feature cards')
  }
  for (const path of links) {
    const slug = path.replace('/docs/', '')
    if (!docs.has(slug)) errors.push(`Features.tsx links to missing ${path}`)
  }

  for (const slug of REQUIRED_SLUGS) {
    if (!docs.has(slug)) errors.push(`required docs page missing: ${slug}`)
  }
  return errors
}

function main() {
  const docs = loadDocs()
  const errors = [
    ...checkSourceRoutes(docs),
    ...checkMarkdownLinks(docs),
    ...checkFeatureDeepLinks(docs),
    ...checkSitemap(docs),
  ]

  if (errors.length) {
    console.error(`check-doc-links: ${errors.length} problem(s)\n`)
    for (const e of errors) console.error(`  - ${e}`)
    process.exit(1)
  }
  console.log(`check-doc-links: ok (${docs.size} pages)`)
}

main()
