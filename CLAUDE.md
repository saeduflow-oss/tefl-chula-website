# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing/information site for the TEFL (Teaching English as a Foreign Language) master's program,
Faculty of Education, Chulalongkorn University. Nine hand-written static HTML pages plus one shared
stylesheet and two shared scripts, with content served from Supabase and edited through a small
admin page. **No build step, no package manager, no tests, no framework** — `admin/index.html` and
`cms.js` talk to the Supabase REST API with plain `fetch`, deliberately avoiding a CDN SDK.

## Commands

There is nothing to build, lint, or test. Work is verified by looking at the rendered page.

```bash
# Preview — file:// works directly, no server needed (all paths are relative)
open index.html

# Only needed if you must avoid file:// quirks
python3 -m http.server 8000

# Render a page headlessly to check a change
'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
  --headless --disable-gpu --hide-scrollbars \
  --window-size=1280,1400 --virtual-time-budget=4000 \
  --screenshot=/tmp/shot.png "file://$PWD/index.html"
```

Deployment is Vercel, linked via `.vercel/` (`vercel.json` sets `framework: null`,
`outputDirectory: "."` — the repo root is served as-is). `.vercelignore` keeps `DESIGN.md`,
`CLAUDE.md` and `index.backup.html` out of the deployed site; they are internal and must stay excluded.

Because there is no build step, `site.js` and `site.css` are referenced by a bare filename with no
hash or version query, so a stale browser copy looks exactly like "my change did nothing".
`vercel.json` therefore sends `Cache-Control: max-age=0, must-revalidate` for `.js`/`.css`/`.html`.
When a change appears to have no effect, hard-reload (Cmd+Shift+R) before debugging the code, and
check `git status` — an edit that was never committed is also never deployed.

### Screenshot gotchas

- The screenshot is always captured from the **top of the document**, ignoring `#anchor` and scroll.
  To inspect a section far down the page, temporarily hide the ones above it
  (e.g. inject `.hero,.welcome{display:none!important}`) rather than using a very tall window —
  the hero is `min-height:calc(100vh - var(--hdr-h))` and will grow to fill it.
- Headless Chrome **clamps the layout viewport to a minimum of 500px**, so `--window-size=375`
  still lays out at 500px and crops the right side. Narrow-mobile breakpoints (≤420px, ≤460px)
  cannot be verified this way; verify them by reading the CSS.
- `site.js` hides content until scrolled into view via `.reveal`. Inject
  `.reveal{opacity:1!important;transform:none!important}` when screenshotting, or the page renders blank.

## Architecture

### No templating — the nav is copy-pasted into all 9 pages

The header, search overlay, drawer shell, and footer are duplicated markup in every HTML file.
The menu *items* now come from the `nav` table (edit them in `/admin` → เมนู; `sync-content.py`
writes them into all 9 files), but the header shell around them is still copy-pasted. `DESIGN.md`
§8 has the full checklist for adding a page. `index.backup.html` is a stale copy that is not
deployed — do not update it in sync.

### site.js generates markup at runtime

Three features exist only after `site.js` runs — none of them are in the HTML:

- **Mobile drawer** — cloned from each `.main-nav > ul > li` and its `.dropdown > .dd-menu`.
- **Search index** — built from `.main-nav .dd-menu a` + `.footer-col a` (grouped by the parent
  top-level link / footer `h4`), plus every `section[id] h2` on the current page.
- **Background music** — a hidden `<video muted playsinline>` (used as an audio player) and its
  toggle button are created and appended to `<body>`, so every page that loads `site.js` gets them
  without editing that page.

The first two read the nav markup as their data source. So a new page becomes searchable *only*
once it is linked from the menus, and renaming or restructuring the `.main-nav` / `.dropdown` /
`.dd-menu` / `.footer-col` class hierarchy silently breaks both the drawer and search.

It is a `<video>` and not an `<audio>` on purpose: Chrome refuses to autoplay `<audio>` even when
muted, but allows muted `<video>`. That is what makes the music continuous — it runs silently from
page load, so its clock advances and the position gets saved for the next page, and the first user
gesture only has to unmute it. Reverting to `<audio>` silently breaks continuity. Nothing can make
sound audible before the first user gesture — every avenue has been tested and documented; do not
try again. The player unmutes itself on the visitor's first click/tap/keypress anywhere, and from
then on later pages autoplay with sound on their own. A `pause` handler restarts muted playback if
the browser stops it, because a stopped clock means no saved position and a restarted track on the
next page.

Because the site is multi-page rather than an SPA, the player is destroyed on every navigation and
resumes from the stored position, so a short gap per page load is unavoidable.

**Headless Chrome cannot verify any of this** — it blocks autoplay in every mode. Test with real
Chrome over `--remote-debugging-port` and read results back with `curl .../json`; `DESIGN.md` §3.8
has the exact recipe and the full findings table.

### CSS lives in two places, and load order matters

`<head>` order must always be **`fonts/chula.css` → `site.css` → the page's own `<style>`**
(font variables are declared in chula.css and consumed by site.css).

- `site.css` — everything shared or reusable across pages: tokens, buttons, header, footer,
  page banner, tables, cards, carousel, and the per-page component blocks appended at the end.
- Page `<style>` — only styles unique to that page (`index.html` hero/missions/courses,
  `about.html` staff cards, etc.).

New shared components go at the end of `site.css` in a commented block, following the existing
pattern (see the CONTACT PAGE and FORMS & LINKS blocks).

### Cross-cutting contracts

- **Anchor navigation.** Dropdown items link straight to `#id` on subpages. Every section named in
  a menu must carry that exact `id`. The `scroll-margin-top` already on `.content section` keeps the
  sticky header from covering the heading — it must stay larger than the current header height.
- **`--hdr-h`** holds the real header height at each of the three breakpoints (see the top of
  `site.css` for the current values — they change whenever the logo is resized) and the hero height
  is computed from it. Changing logo size or header padding means updating `--hdr-h` *and* the
  `scroll-margin-top` above, or headings end up hidden behind the header on anchor links.
- **`data-cms` attributes.** The hooks `cms.js` and `sync-content.py` use to find content
  containers. Renaming or removing one silently stops that block from updating — the page keeps
  showing whatever HTML was last written into the file, which looks like "the CMS saved nothing".
- **External form files.** `forms-and-links.html` deep-links to PDFs on `portal.edu.chula.ac.th`.
  Those filenames contain spaces and **must** be written as `%20` in `href`. If the program renames
  a file upstream, the link breaks and has to be fixed here by hand.

### Content lives in Supabase, not in the HTML (as of Sep 2026)

Two kinds of content now live in Supabase and are edited through `admin/index.html`, served at `/admin`:

- **collections** (`staff`, `lecturers`, `faqs`, `news`, `events`, `links`, `courses`, `tuition`) — repeating
  items with real columns, marked in the HTML by `data-cms`
- **blocks** (`blocks`, 58 rows) — the prose and headings of every `<section>` plus four footer
  regions, stored as raw HTML and marked by `data-cms-block`
- **nav** (`nav`, two levels via `parent_id`) — the main menu, rendered into `.main-nav ul[data-cms="nav"]`
  with `class="active"` computed from the current filename
- **settings** (`settings`, key/value) — the site's external connections: form endpoint, contact
  email/phone, map place, social URLs, background music. Applied to elements marked
  `data-setting-href` / `data-setting-text` / `data-setting-map` (with an optional
  `data-setting-prefix` such as `tel:` or `mailto:`); an empty `href` value hides the element.
  Exposed as `window.TEFLSettings` and announced with a `tefl:settings` event, which the contact
  form (`contact.html`) and the music player (`site.js`) consume.

**Blocks must render before collections.** Writing a section's `innerHTML` recreates its `data-cms`
container empty, so filling collections first means they get wiped. `cms.js` and `sync-content.py`
both enforce that order.

`data-cms-block` sits on the `<section>` itself rather than on an added wrapper `<div>`, because
`.content .is-centered > p` selects a direct child — an extra wrapper silently breaks the layout.

Three pieces have to stay in step:

- `cms.js` — loaded by the 7 content pages; swaps DB content into the containers marked `data-cms`
- `admin/` — the editing UI at `/admin`: `index.html` (markup + script load order), `admin.css`, and
  `js/` split by concern (`config`, `icons`, `schema`, `core`, `views/{shell,dashboard,list,facebook,account}`,
  `editor`, `app`). They are classic scripts sharing top-level globals — **load order in `index.html` is
  the contract**, and `schema.js` must reference later-loaded view functions lazily. `index.html` carries
  `<base href="../">` because it sits one directory down while every image, font, css and js path is
  written relative to the site root — remove it and the page loses its styles, scripts, logo and thumbnails
- `sync-content.py` — writes the DB content back into the HTML files

**The HTML inside a `data-cms` container is generated.** Hand-editing it works until someone runs
`sync-content.py`, which overwrites it. Change content in `/admin` instead.

`cms.js` and `sync-content.py` build the same markup twice, in two languages. They must stay
byte-identical to each other *and* to the markup already in the HTML, or the CSS stops matching.
Editing one without the other is the main way to break this.

### Rebinding after a block render — the silent-breakage trap

Writing a section's `innerHTML` destroys **every element inside it**. The `<section>` survives; its
children do not. Any script still holding a reference to a child then drives a node that is no
longer on the page — no error, no console warning, the feature simply stops. That is exactly how
the homepage hero froze on slide 1 (`index.html` had captured `#heroTrack` and the dot buttons at
load) and how the news carousel lost its dots and arrows.

So after `renderBlocks()`, `cms.js` calls, in this order:

- `window.TEFLHeroRebind()` — re-applies the current slide to the new `#heroTrack` (`index.html`)
- `window.TEFLCarouselInit()` — binds the news carousel to the new `.nc-viewport` (`site.js`)
- `renderNav()` → `window.TEFLDrawerRebuild()` — the mobile drawer is cloned from the nav at load,
  so a new nav needs a new drawer
- collections fill, then a `resize` event — recomputes carousel dots and arrow states
- `applySettings()` — must run **after** blocks, because its targets (footer social links,
  phone) live inside the `site/footer-*` blocks and would be overwritten otherwise
- `window.TEFLSearchReindex()` — rebuilds the search index from the new nav, headings and footer

`sync-content.py` mirrors the same dependency: it applies settings to a block's HTML *before*
writing it, otherwise the block pass and the settings pass overwrite each other on every run.

Two rules for any new script that touches a `data-cms-block` section:

1. Look elements up live inside the handler; never cache an element or NodeList across the render
   (this is also why the carousel resolves `.nc-card` on every call).
2. Put an "already initialised" marker on a child that the rewrite replaces — `.nc-viewport` — and
   **never on the `<section>`**: the section survives the rewrite, so a marker there makes the
   re-init skip the whole block and the stale bindings stay in place.

The static HTML is deliberately kept and still correct — it is the no-JS/SEO copy and the fallback
when Supabase is unreachable. That means files drift from the database after every admin edit; run
`python3 sync-content.py` (or `--check` first) and commit before deploying.

**Latest News is fed from the Facebook page.** The Edge Function `supabase/functions/fb-sync` pulls the
latest posts into `news` (`placement='home'`, `fb_post_id` set, images copied to `media/fb/`) every 6 hours
via `pg_cron`, or on demand from the Facebook page in `/admin`, which also shows connection status and lets an
admin paste a new page token. The token lives in the `integrations` table (admin-only RLS, no anon policy)
with the function secret `FB_PAGE_TOKEN` as fallback — never in `settings`, `cms.js` or the HTML. Nothing on
the rendering side knows about Facebook; a synced post is an ordinary news row. The home slider shows the
first `news.home_count` rows; the Announcements section at the end of `activities.html` shows them all, followed by the
`events` calendar (there is no separate News page any more — `vercel.json` redirects `/news.html` there). `DESIGN.md` §9.8–9.9 has
the rules (existing rows are never overwritten, deleted rows come back — hide instead), the CORS gotcha, and
the one-time setup commands.

Writes are restricted to emails listed in the `admins` table, not merely to logged-in users —
Supabase allows public self-signup with the publishable key, so `role = authenticated` alone would
let anyone edit the site. `DESIGN.md` §9 has the schema, the permission table and how to add an admin.

## DESIGN.md is the design source of truth

Before changing anything visual, read `DESIGN.md` — it documents the color tokens, the signature
gradient, the type scale, breakpoints, and every shared component, including deliberate decisions
and their reasons (e.g. which font sizes are intentionally *not* scaled up, and why). After a
visual change, update the matching section so the doc does not drift.

## Conventions

- Code comments are written in **Thai**; user-facing page content is in **English**. Match this.
- Comments explain *why* a rule exists and what breaks if it is removed — keep that habit rather
  than restating what the CSS already says.
- Photo credit lines in the footer (`.photo-credits`) are a CC license requirement. Do not remove them.
