# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing/information site for the TEFL (Teaching English as a Foreign Language) master's program,
Faculty of Education, Chulalongkorn University. Nine hand-written static HTML pages plus one shared
stylesheet and one shared script. **No build step, no package manager, no tests, no framework.**

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
**Changing a menu item means editing all 9 files.** `DESIGN.md` §8 has the full checklist for
adding a page. `index.backup.html` is a stale copy that is not deployed — do not update it in sync.

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
- **External form files.** `forms-and-links.html` deep-links to PDFs on `portal.edu.chula.ac.th`.
  Those filenames contain spaces and **must** be written as `%20` in `href`. If the program renames
  a file upstream, the link breaks and has to be fixed here by hand.

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
