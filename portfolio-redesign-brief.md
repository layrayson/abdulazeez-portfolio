# Portfolio Redesign Brief: "Clear"

Handoff for Claude Code. Use it to revamp the existing portfolio at abdulazeezolalere.com. Everything needed is in this file. The design canvas is private, so don't try to fetch it.

---

## 0. Kickoff prompt (paste this into Claude Code)

```
Read portfolio-redesign-brief.md in the repo root. It is the full design spec for revamping this portfolio.

Before writing code:
1. Audit the current site: list every file, every piece of real content (copy, links, images, resume file, certificates, article link, phone number), and how the theme toggle, custom cursor and contact form currently work.
2. Show me the audit and a short plan that follows the phases in section 9. Wait for my go-ahead.

Rules:
- Plain HTML, CSS and JS. No framework, no build step. GSAP + ScrollTrigger + SplitText and Lenis from a CDN are allowed.
- Reuse real content and assets from the current site. Never invent facts, numbers, links or project descriptions. Anything missing stays as a visible [PLACEHOLDER] and goes in a list for me.
- Work phase by phase. After each phase, stop, tell me what changed and how to check it.
- Keep light/dark mode, full mobile support and prefers-reduced-motion support working at every phase.
```

---

## 1. Direction

Clean and centred. One idea per screen, generous white space, one geometric typeface, one cobalt accent, soft rounded cards and a pill-shaped nav. Motion is quiet and precise: text sharpens from a light blur as it lands, cards settle in, highlights slide. Nothing bounces, flies in from the side or spins.

What to avoid: purple or rainbow gradients, glassmorphism everywhere, drop shadows on cards at rest, lift-and-shadow card hovers, emoji.

---

## 2. Design tokens

Put these in `:root` and switch with `[data-theme="dark"]` on `<html>`.

```css
:root {
  /* Light */
  --bg: #FAFAFC;
  --card: #FFFFFF;
  --surface: #F2F2F7;      /* tiles, image wells, inactive pills */
  --rule: #E4E4EC;         /* all 1px borders */
  --dot: #D9D9E3;          /* hero dot grid */
  --ink: #0D0E11;
  --ink-2: #4B4F5C;        /* body copy */
  --muted: #6B7080;        /* labels, captions */
  --accent: #1F3BEA;
  --accent-soft: #EEF1FF;  /* eyebrow pills, focus ring, spotlight */
  --accent-text: #1F3BEA;  /* accent-coloured text */
  --on-accent: #FFFFFF;    /* text on accent buttons */
  --live: #16A34A;         /* open-to-work dot */
  --live-glow: rgba(22,163,74,.15);

  /* Type */
  --font: 'Outfit', system-ui, sans-serif;

  /* Radius */
  --r-card: 24px;  --r-img: 16px;  --r-tile: 16px;  --r-input: 12px;  --r-pill: 999px;

  /* Layout */
  --container: 1120px;
  --section-gap: 160px;    /* 96px under 768px */

  /* Motion */
  --ease-out: cubic-bezier(.22, 1, .36, 1);
  --ease-in-out: cubic-bezier(.65, 0, .35, 1);
  --d-fast: 200ms;
  --d-base: 450ms;
  --d-reveal: 800ms;
}

[data-theme="dark"] {
  --bg: #0B0C0F;
  --card: #111317;
  --surface: #16181D;
  --rule: #23262E;
  --dot: #2A2D36;
  --ink: #F2F3F7;
  --ink-2: #B4B8C4;
  --muted: #8A8F9C;
  --accent: #5B74FF;
  --accent-soft: rgba(91,116,255,.14);
  --accent-text: #8FA0FF;
  --on-accent: #0B0C0F;    /* dark text on the lighter dark-mode accent, for contrast */
  --live: #4ADE80;
  --live-glow: rgba(74,222,128,.18);
}
```

Theme: default to `prefers-color-scheme`, persist the user's choice in `localStorage` (wrap in try/catch), and set `data-theme` from an inline script in `<head>` before first paint so there's no flash.

### Type scale (Outfit only, Google Fonts, variable 300 to 800)

| Role | Desktop | Mobile | Weight | Tracking | Line height |
|---|---|---|---|---|---|
| Hero H1 | 96px | 52px | 700 | -0.035em | 1.0 |
| Contact H2 | 72px | 48px | 700 | -0.035em | 1.05 |
| Section H2 | 48px | 34px | 700 | -0.03em | 1.1 |
| Hero subtitle | 26px | 18px | 500 | -0.01em | 1.4 |
| Card title | 20 to 24px | 18px | 600 | -0.01em | 1.2 |
| Body | 18px | 16px | 400 | 0 | 1.6 |
| Small / labels | 13 to 14px | 13px | 400 to 500 | 0 | 1.4 |

Use `clamp()` between the desktop and mobile sizes. Keep paragraphs to about 680px wide.

### Components

- **Eyebrow pill:** 30px tall, padding 0 14px, `--accent-soft` background, `--accent-text` text, 13px/500.
- **Primary button:** 52px tall, pill, `--accent` background, `--on-accent` text, 16px/500, optional 16px stroke icon on the left.
- **Secondary button:** same size, `--card` background, 1px `--rule` border, `--ink` text.
- **Card:** `--card` background, 1px `--rule` border, `--r-card` radius, 10px padding. Image well inside with `--r-img` radius and `--surface` background. Text block padding 16px 10px 8px. No shadow.
- **Pill nav / segmented control:** 1px `--rule` border, `--card` background, 5px padding, items 36px tall. A single highlight element (`--surface` in the nav, `--ink` with `--bg` text in the project filter) slides between items.
- **Inputs:** 48px tall, `--r-input` radius, 1px `--rule` border, `--bg` fill. Focus: border `--accent` plus `box-shadow: 0 0 0 4px var(--accent-soft)`.
- **Focus-visible (everything):** `outline: none; box-shadow: 0 0 0 4px var(--accent-soft); border-color: var(--accent)`. For elements without a border, use `outline: 2px solid var(--accent); outline-offset: 3px`.
- **Icons:** simple 1.8px stroke line icons (Lucide style), inline SVG, `currentColor`.

---

## 3. Page structure and content

Single page. Container 1120px centred, 20px side padding on mobile. Every section is a centred stack: eyebrow, H2, one line of support text, then the content. Order below.

Use the real content from the current site wherever it exists. The content listed here is what the owner confirmed. Items in [BRACKETS] are unknown: take them from the current site if they're there, otherwise leave a visible placeholder and list it for the owner.

### 3.1 Header (96px)

- Left: "Abdulazeez Olalere" (18px/600), links to top.
- Centre: pill nav with icons: About, Experience, Projects, Contact.
- Right: GitHub and LinkedIn text links, theme toggle (40px round button, moon/sun icon).
- After the hero scrolls away: the header collapses into one floating pill at the top centre: "AO" monogram, the nav items, and a primary "Resume" button. Background `--card` at 80% with `backdrop-filter: blur(12px)`. It hides when scrolling down and comes back when scrolling up.
- Mobile: name on the left, theme toggle and a menu button on the right. The menu opens a full-screen panel with large stacked links.

### 3.2 Hero (fills the first screen, content centred)

- Background: a faint dot grid (`radial-gradient(var(--dot) 1px, transparent 1.4px)` at 24px spacing) masked with a radial fade so it only shows around the centre. This is the only background texture on the site.
- "Open to work" badge: pill with a 8px `--live` dot and a `--live-glow` ring.
- H1: "Hi, I'm Azeez"
- Subtitle: "Abdulazeez Olalere | Senior Software Engineer" (the pipe in `--muted`)
- One line: "I build full-stack, mobile and applied AI products, mostly in fintech and crypto."
- Buttons: "View projects" (primary, scrolls to Projects) and "Download resume" (secondary, links to the resume file from the current site).
- Stats card, 88px below the buttons, 880px wide, 4 columns separated by 1px rules (2x2 on mobile): 5+ Years experience · 2 Apps published · [N] Projects shipped · 5 Companies.

### 3.3 About

- Eyebrow "About", H2 "What I do".
- Paragraph: "I care about things holding up in production, not just working in a demo. I'm a senior software engineer in Lagos, Nigeria, working across full-stack, mobile and applied AI, with 5+ years in fintech and crypto. Two of my apps are live on the App Store and Play Store, several other platforms are in production, and my background is in Electrical Engineering."
- Three cards in a row (stacked on mobile), each with a 40px `--accent-soft` icon square:
  - Education: "BSc Electrical & Electronics Engineering", "University of Lagos"
  - Certificates: "Node.js · Udemy ↗" and "Scrum · Udemy ↗" (real certificate links from the current site)
  - Writing: "[Article title]" and "Read the article →" (real link from the current site)

### 3.4 Tech I work with

- H2 "Tech I work with" (32px/600, no eyebrow).
- Grid of tiles: 6 columns desktop, 3 mobile. Tile 108px tall, `--surface`, 1px `--rule`, `--r-tile`. Official logo (24px, inline SVG) above the name.
- Confirmed list: TypeScript, React, React Native, Next.js, Node.js, NestJS, PostgreSQL, GraphQL, AWS, Flutter, RAG. Add anything else from the current site's skills list.

### 3.5 Experience

- Eyebrow "Experience", H2 "Where I've worked".
- 800px wide timeline: a 2px `--rule` vertical line on the left with a 40px round marker per job, a card to the right of each marker. The blue fill on the line grows with scroll (see motion).
- Card: company (20px/600) with a years pill on the right, role in `--accent-text`, one line of description.

| Company | Years | Role | Line |
|---|---|---|---|
| Lipaworld | 2025 – Present | Senior Mobile Developer | Stablecoin wallet app, shipped to the App Store and Play Store. |
| Titan Payment Systems | 2024 – 2025 | Frontend & Mobile Engineer | Built MyCashBox. |
| Thrillers Travels | 2023 – 2024 | Software Engineer | Flight and hotel booking. |
| Joovlin | 2021 – 2023 | Software Engineer | Social commerce backend and Flutter app. |
| Full Power Webs | 2020 | Frontend Engineer | Remote, India. |

### 3.6 Projects

- Eyebrow "Projects", H2 "Selected work", line: "Two apps on the stores, personal builds, and web platforms in production."
- Filter pill: All · Mobile apps · Personal · Web. Default: All. Filtering hides non-matching cards and the group headings adapt.
- Under "All", three groups, each with a small `--muted` heading:
  - **Mobile apps · live on App Store and Google Play** (2 columns, larger cards, image well 340px with phone screenshots rising from the bottom edge, "App Store" and "Google Play" link pills):
    - Lipaworld: Stablecoin wallet
    - MyCashBox: Built at Titan Payment Systems
  - **Personal projects** (3 columns, image well 200px, "View project →" in `--accent-text`):
    - VisaRoom: AI voice rehearsal for visa interviews
    - Classwyz: WhatsApp-first AI tutoring with RAG
    - MyQtab Academy: [one-line description]
    - Getlinked AI: Frontend
    - Ridemate: Backend
  - **Web projects** (3 columns, same card):
    - Thrillers Travel: Flight and hotel booking
    - NLM Social: [role / stack]
    - Joovlin Dashboard: Social commerce
    - Afriglobal Insurance: [role / stack]
    - Joovlin Landing: Social commerce
    - Joovlin Flutter App: Social commerce, Flutter
- Use the real screenshots and links from the current site. The whole card is the link.
- Mobile: single column, filter pill stretches full width.

### 3.7 Contact

- H2 "Let's talk" (72px), line: "A role, a project or a question. Send a message and I'll get back to you."
- Primary button with the email: olalereazeez11@gmail.com (mailto).
- Two cards side by side (stacked on mobile), left 360px:
  - Info card: Email, Phone ([from current site]), Location "Lagos, Nigeria (WAT, UTC+1)", GitHub ↗ and LinkedIn ↗ pills at the bottom.
  - Form card: Name + Email (2 columns), Subject, Message (5 rows), "Send message" button (`--ink` background, `--bg` text) aligned right. Real `<label>`s. Keep whatever submission backend the current form uses; if there's none, leave the handler stubbed and tell the owner.
- Footer: centred "© 2026 Abdulazeez Olalere. All rights reserved." above a 1px rule.

---

## 4. Motion setup

Load with `defer`, pinned versions (check the current exact versions when installing):

```html
<script>document.documentElement.classList.add('js')</script>
<script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13/dist/gsap.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13/dist/ScrollTrigger.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13/dist/SplitText.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.min.js"></script>
<script defer src="/js/main.js"></script>
```

```js
gsap.registerPlugin(ScrollTrigger, SplitText);
const mm = gsap.matchMedia();

mm.add({
  full: '(pointer: fine) and (prefers-reduced-motion: no-preference)',
  touch: '(pointer: coarse) and (prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
}, (ctx) => {
  const { full, touch, reduce } = ctx.conditions;
  if (reduce) return initReduced();
  const lenis = new Lenis({ lerp: 0.1, syncTouch: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  initHero(); initReveals(); initTimeline(); initProjects();
  if (full) { initCursor(); initMagnetic(); initCardHover(); initHeroParallax(); }
  return () => lenis.destroy();
});

document.fonts.ready.then(() => ScrollTrigger.refresh());
```

Initial hidden states are CSS under `html.js` only, so visitors without JS see everything.

### The signature effect: blur-in

Text and cards land by going from a small offset and a light blur to sharp.

```js
function blurIn(targets, { y = 16, blur = 10, stagger = 0.06, delay = 0, duration = 0.8 } = {}) {
  return gsap.fromTo(targets,
    { y, opacity: 0, filter: `blur(${blur}px)` },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration, delay, stagger, ease: 'expo.out',
      clearProps: 'filter' });
}

// Headings: split into words with SplitText
SplitText.create(el, {
  type: 'words', autoSplit: true,
  onSplit: (self) => blurIn(self.words, { stagger: 0.06 }),
});
```

Stagger rule: cap any group so it finishes starting within 500ms (`stagger = Math.min(base, 0.5 / (n - 1))`).

---

## 5. Motion spec by section

Timing values are final. If an element isn't listed, it doesn't animate.

### Tokens

| Token | Value | Use |
|---|---|---|
| ease-out | `expo.out` in GSAP, `cubic-bezier(.22,1,.36,1)` in CSS | Every reveal and hover-in |
| ease-in-out | `power2.inOut` / `cubic-bezier(.65,0,.35,1)` | Theme swap, sliding pill |
| fast | 200ms | Colour, border, cursor |
| base | 450ms | Pill slide, hover |
| reveal | 800ms | Section and card reveals |
| stagger | words 60ms, lines 80ms, cards 70ms | One rhythm site-wide |
| lerp | cursor 0.18, tilt 0.12, magnet 0.2 | Per-frame smoothing |

### Hero load (one timeline, plays once after fonts load)

| Start | Element | Animation | Duration |
|---|---|---|---|
| 0ms | Dot grid | opacity 0 → 1, mask radius grows | 1600ms |
| 0ms | Header / nav pill | y -12 → 0, opacity | 600ms |
| 150ms | Open-to-work badge | scale .9 → 1, blur 6 → 0 | 500ms |
| 250ms | "Hi, I'm Azeez" | blur-in by word, stagger 60 | 900ms |
| 550ms | Subtitle | opacity, blur 6 → 0 | 600ms |
| 700ms | Sentence | blur-in by line, y 12, stagger 80 | 700ms |
| 900ms | Buttons | y 12 → 0, opacity, stagger 80 | 600ms |
| 1100ms | Stats card | y 24 → 0, opacity; numbers count 0 → value (1s) | 900ms |
| 1500ms | Live dot | ring pulses: scale 1 → 2.2, opacity .6 → 0, loop every 2s | loop |

### Hero on scroll (desktop only; ScrollTrigger scrub, start "top top", end "bottom top")

| Element | From → to |
|---|---|
| Headline block | y 0 → -80px, opacity 1 → 0.2 |
| Dot grid | y 0 → 120px (background moves slower than text) |
| Stats card | y 0 → -30px |
| Dot grid mask centre | follows pointer ±40px, lerp 0.08, only while hero is in view |

### Section reveal pattern (every section; start "top 80%", once: true)

| Element | Animation | Timing |
|---|---|---|
| Eyebrow pill | scale .9 → 1, opacity | 450ms |
| H2 | blur-in by word | 800ms, stagger 60, +80ms |
| Support text | blur-in by line, y 12 | 700ms, stagger 80, +200ms |
| Cards / tiles | y 24 → 0, opacity, blur 6 → 0 | 800ms, stagger 70, +300ms |

After a SplitText animation completes, revert the split. Keep the full heading text in `aria-label`.

### About and tech

- About card icon squares pop: scale .6 → 1, starting 150ms after their card.
- Tech tiles: y 16 → 0 + opacity, stagger 40ms in grid order, 600ms. Hover: the logo moves y -3px, the tile border turns `--accent`, 200ms.

### Experience

- Rail fill: an accent line on top of the grey line, `scaleY` 0 → 1 with `transform-origin: top`, scrubbed from list "top 60%" to "bottom 60%".
- Marker: when the fill reaches it, grey → accent dot plus a 4px `--accent-soft` ring, 300ms. Reverses on scroll up.
- Each card: x 24 → 0, opacity, blur 6 → 0, 700ms, its own trigger.
- Card hover: border → `--accent` plus spotlight (below). No tilt here.

### Projects

- **Filter pill:** one highlight element slides to the chosen item (x and width), 450ms ease-in-out.
- **Filter change:** use FLIP (GSAP `Flip` plugin, or measure-and-invert by hand). Cards that stay glide to their new spots, 500ms ease-out. Cards leaving: scale .96 + fade, 250ms. Cards entering: blur-in.
- **Card reveal:** section pattern, stagger 70ms.
- **Mobile app cards:** on reveal, the phone screenshots rise y 40 → 0 inside the image well, staggered 120ms, 900ms.
- **Card hover (desktop, pointer fine):**
  - Spotlight: a 220px radial gradient of `--accent-soft` sits under the card content at the pointer position. Set `--mx`/`--my` custom properties on pointermove.
  - Border `--rule` → `--accent`, 200ms, plus `box-shadow: 0 0 0 4px var(--accent-soft)`.
  - Tilt: max 3° on Y and 2° on X, `perspective(900px)`, lerp 0.12. Springs back to 0 on leave.
  - Image: scale 1 → 1.04, 600ms ease-out, inside `overflow: hidden`.
  - No lift and no drop shadow.
  - Keyboard focus gets the border and ring, never the tilt.

```js
card.addEventListener('pointermove', (e) => {
  const r = card.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
  card.style.setProperty('--mx', `${px * 100}%`);
  card.style.setProperty('--my', `${py * 100}%`);
  target.rx = (0.5 - py) * 4;   // max 2deg
  target.ry = (px - 0.5) * 6;   // max 3deg
});
// rAF loop: current += (target - current) * 0.12; apply rotateX/rotateY
```

### Contact and global UI

| Element | Animation | Timing | Notes |
|---|---|---|---|
| "Let's talk" | blur-in by word | 800ms, stagger 60 | |
| Inputs | border → accent, ring 0 → 4px accent-soft | 200ms | Placeholder fades to 50% |
| Send button | magnetic; on submit: label → spinner → check | 300ms each step | Error: shake x ±5px × 3, 300ms, plus inline message |
| Header on scroll | collapses to the floating pill | 450ms ease-out | Hide on scroll down, show on scroll up |
| Nav highlight | slides to the section in view | 450ms ease-in-out | Driven by the same ScrollTriggers as the sections |
| Anchor links | `lenis.scrollTo(target, { offset: -96, duration: 1.2 })` | | Update the hash with `history.replaceState` |
| Theme toggle | View Transitions API: new theme revealed as a circle growing from the button | 600ms ease-in-out | Radius 0 → `Math.hypot(innerWidth, innerHeight)`. Fallback: 200ms colour fade |
| Mobile menu | panel fades + y -8 → 0; links blur-in, stagger 60 | 450ms | `lenis.stop()` while open, trap focus, Esc closes |

### Magnetic buttons (primary and secondary buttons, send button)

- Active when the pointer is within the button's bounds plus 60px.
- Button moves toward the pointer: `offset = (pointer - centre) * 0.3`, clamped to 10px, lerp 0.2.
- On leave: return to 0 with `elastic.out(1, 0.5)`, 500ms.

---

## 6. Custom cursor (desktop with a mouse only)

Two fixed elements, `pointer-events: none`, `aria-hidden="true"`, moved with `translate3d` in a rAF loop. Only enabled on `(pointer: fine)` with motion allowed. Hide the native cursor only when it's active (`html.has-cursor`). Elements opt in with `data-cursor`.

| State | Trigger | Look | Transition |
|---|---|---|---|
| Default | anywhere | 8px `--ink` dot follows 1:1; 32px ring (1px `--ink` at 30%) trails with lerp 0.18 | |
| Link | `a`, `[data-cursor="link"]` | dot hides; ring grows to 44px filled `--accent` at 12%; the link's underline draws in (scaleX 0 → 1) | 200ms |
| Button | `[data-cursor="button"]` | cursor hides entirely; the button's magnetic pull and focus-style ring take over | 200ms |
| Project card | `[data-cursor="view"]` | ring morphs into a dark pill (`--ink` background, `--bg` text, 14px/500) with the label from `data-cursor-label` ("View project ↗", "App Store") | 300ms ease-out |
| Text field | `input`, `textarea` | custom cursor hides, native text cursor returns | instant |
| Press | pointerdown | ring scale 1 → 0.85 | 150ms |
| Leave window | pointerleave on document | both fade out | 200ms |

---

## 7. Reduced motion (`prefers-reduced-motion: reduce`)

| Feature | Behaviour |
|---|---|
| Smooth scroll | Lenis not created, native scroll |
| All reveals | opacity 0 → 1 over 200ms, no blur, no movement, no split |
| Hero parallax and scrub | off; timeline rail shows fully filled |
| Tilt, magnetic, spotlight | off; border colour change on hover stays |
| Counters | show final values |
| Project filter | instant re-layout |
| Custom cursor | off, native cursor |
| Live dot pulse | static ring |
| Theme toggle | instant swap |

Listen for changes to the media query; `gsap.matchMedia` reverts and re-runs automatically.

---

## 8. Performance and accessibility

- [ ] Animate only `transform`, `opacity` and `filter`. Keep blur at 10px or less and clear the filter after each animation.
- [ ] Initial hidden states live under `html.js` only.
- [ ] Reveals use `once: true`. Call `ScrollTrigger.refresh()` after fonts and images load.
- [ ] Touch devices: reveals, filter, timeline fill and mobile menu only. No cursor, tilt, magnetic or spotlight.
- [ ] Every interactive element is a real `<a>`, `<button>`, `<input>` or `<textarea>` with a visible focus state.
- [ ] Icon-only buttons (theme toggle, menu) have `aria-label`.
- [ ] Colour contrast: body text at least 4.5:1 in both themes (the tokens above pass; recheck any new colours).
- [ ] Images: `loading="lazy"`, explicit width and height, WebP/AVIF with fallbacks, meaningful `alt`.
- [ ] Hover-only details (spotlight, cursor labels) never hide information that isn't also visible as text.
- [ ] Test on a mid-range Android phone. If blur-in stutters there, switch touch devices to opacity + y only.
- [ ] Lighthouse: performance 90+, accessibility 100, no layout shift from the fonts (`font-display: swap` + preconnect).

---

## 9. Implementation plan

Work phase by phase. Stop after each phase for review.

### Phase 1: Audit and setup
- [ ] Inventory the current site: files, content, links, images, resume, certificates, article, phone, form backend.
- [ ] List every [PLACEHOLDER] in this brief that the current site can fill, and the ones it can't.
- [ ] Create a branch. Keep the old CSS/JS until the new version replaces it.
- [ ] Add the tokens, Outfit font, base reset and the no-flash theme script.

### Phase 2: Static layout
- [ ] Header and pill nav, including the mobile menu (no animation yet).
- [ ] Hero with dot grid, badge, buttons and stats card.
- [ ] About, Tech tiles, Experience timeline, Projects with working filter (instant), Contact with form, footer.
- [ ] Both themes, all breakpoints (1440, 1024, 768, 390). No horizontal scroll at any width.

### Phase 3: Core motion
- [ ] GSAP, ScrollTrigger, SplitText, Lenis set up through `gsap.matchMedia`.
- [ ] Hero load timeline and stat counters.
- [ ] Section reveal pattern with blur-in.
- [ ] Experience rail fill and markers.
- [ ] Reduced-motion path working end to end.

### Phase 4: Interaction polish
- [ ] Sliding highlight in nav and filter, plus FLIP on filter change.
- [ ] Card spotlight, tilt and image zoom.
- [ ] Magnetic buttons.
- [ ] Custom cursor with all states.
- [ ] Header collapse to floating pill; theme toggle View Transition.
- [ ] Hero scroll parallax and pointer-follow dot grid.

### Phase 5: QA
- [ ] Keyboard-only pass through the whole page.
- [ ] Screen reader pass on headings and the form.
- [ ] Safari, Chrome, Firefox desktop; iOS Safari and Android Chrome.
- [ ] Reduced-motion pass with the OS setting on.
- [ ] Lighthouse targets from section 8.
- [ ] Final list for the owner of any placeholders still left.

---

## 10. Acceptance checklist

- [ ] Looks and behaves as described in both themes on desktop and mobile.
- [ ] No invented content; all placeholders listed.
- [ ] Every animation in section 5 is present with the stated timings, and nothing else moves.
- [ ] Reduced-motion users get the calm version everywhere.
- [ ] Custom cursor only appears with a mouse and never blocks clicks or text selection.
- [ ] Resume download works from the hero and from the floating nav.
- [ ] Contact form submits (or the stub is clearly flagged).
- [ ] No console errors. Plain HTML/CSS/JS with CDN libraries only.
