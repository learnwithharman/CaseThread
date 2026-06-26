# CaseThread – Design Memory & Vision

> **This is the permanent source of truth for ALL design decisions in CaseThread.**
> Every AI session must read this before writing any frontend code.
> This is NOT a finished product spec — it is an evolving design intent document.

---

## 🎯 Core Concept

CaseThread is a premium task manager where the UI is NOT generic. Each user picks a **character persona** that completely transforms:
1. The **visual identity** (colors, backgrounds, fonts, animations)
2. The **terminology** used throughout the app (Tasks → Cases, Notes → Observations, etc.)
3. The **emotional vibe** of every screen

**Rule:** The app should feel like you're actually using a tool designed BY that character, FOR that character. Dexter's interface should feel clinical, cold, calculated. Breaking Bad should feel dangerous and chemical. Patrick Jane should feel warm, elegant, perceptive. Every design decision flows from "what would THIS character's workspace look like?"

---

## 🖼️ Screen 1: Profile Selection (Netflix-Style Picker)

**Concept:** First screen the user sees. Inspired by Netflix profile selection — a grid of character cards. No login yet. Just "who are you today?"

### Layout
- Full dark background (`#09090b` or deep black)
- Title: `"Who is coordinating today?"` — clean, white, large sans-serif
- Subtitle: `"Choose a persona. Each one loads a unique theme, font, and terminology."`
- Grid of character cards — 2 columns on mobile, up to 7 on desktop
- Each card is a portrait-ratio image with the character's face/art

### Card Behavior
- Default state: slightly dark/muted, character name below
- **Hover:** Card lifts up (`translateY(-8px)`), border glows in that character's accent color, their signature quote fades in below the name
- **Click:** Opens a confirmation modal — see per-persona modal text below

### Confirmation Modal
When a card is clicked, a modal appears styled in that persona's colors. The modal asks:
- **Dexter:** "Tonight's the night. Are you sure you want to enter the Kill Room?"
- **Breaking Bad (Walter White):** "We need to cook. Are you ready to enter the Superlab?"
- **Patrick Jane (The Mentalist):** "There's always a tell. Ready to access CBI headquarters?"
- **Sherlock:** "The game is afoot. Ready to access the Mind Palace?"
- **Goku:** "Ready to begin training in the Gravity Chamber?"
- **AoT (Levi):** "Do you pledge to dedicate your heart to the Survey Corps?"

Two buttons: Cancel (neutral) + Continue (persona's accent color). Top border of modal uses persona's primary color as a thin accent stripe.

---

## 🔐 Screen 2: Login / Sign Up Page

**IMPORTANT: This is the main reference. See the uploaded images in `/login themes/` folder.**

### Layout Structure
Split-screen: **Left panel (visual/branding)** + **Right panel (form)**

#### LEFT PANEL (changes per persona)
- Full height, ~45–50% width
- **Background:** Use the actual image assets from `d:\learning files\CaseThread\login themes\`
  - Dexter → `dexter_season_6__the_kill_room_by_inickeon_d4af089-pre.jpg` (dark green + noir kill room vibe)
  - Breaking Bad → `breaking-bad-fascinating-facts.BXGqgKI3.jpg` (Walter White, toxic yellow/golden tones)
  - Patrick Jane → `R.jpeg` (The Mentalist — dark, elegant, mysterious)
- Background image: `cover` + `center`, with a dark overlay (`rgba(0,0,0,0.55)`) for text readability
- Content (bottom-left aligned, z-index above overlay):
  - `PERSONA ENGINE` label in tiny all-caps, spaced tracking, muted color
  - Character name in HUGE bold font — persona-specific (see fonts section)
  - Tagline below in lighter/muted style, italic or semi-bold
  - At the very bottom: row of persona switcher pill buttons (clicking switches the whole page theme live)

#### RIGHT PANEL (form area)
- Pure black or very dark (`#000` or `#080808`)
- Vertically/horizontally centered form card
- NO extra glassmorphism card on top — the dark panel IS the card
- Content:
  - Small label: `SIGN IN` in tiny uppercase tracked letters, muted zinc color
  - Big heading: persona-specific login title (e.g. "Enter the Kill Room.", "Enter the Superlab.")
  - Email input
  - Password input (with show/hide toggle)
  - Submit button — full width, persona's accent color, bold text
  - "No account? Create one" link below
  - Optional: credentials hint for dev/demo use

### Animations
- When switching personas via bottom buttons: left panel background crossfades (`opacity` transition, ~0.6–0.8s)
- The character name + tagline slide out/in vertically (`y: 20 → 0`, `opacity: 0 → 1`, Framer Motion `AnimatePresence`)
- The submit button color transitions smoothly
- When switching between Sign In and Sign Up: form fields animate in/out (slide + fade)

---

## 📊 Screen 3: Dashboard (Inner App)

**Reference: The Dexter Task Manager screenshot shared by user (dark red/black UI with sidebar, stats, chart, calendar, and Pomodoro timer)**

### Overall Structure
- `min-h-screen flex` — sidebar on left, main content area on right
- Background: persona-specific deep dark gradient, NOT flat black
- All cards/panels use subtle glassmorphism: `backdrop-filter: blur(12px)`, semi-transparent background, very thin white/colored border (`rgba(255,255,255,0.06)`)

### Sidebar
- Left side, fixed, ~240–260px wide
- Shows: brand logo/name (persona-styled), active user avatar + name, nav links, shortcuts section, bottom logout/switch button
- Nav items use persona terminology:
  - Dashboard label = persona's main HQ name
  - Tasks = persona's task term (Cases, Batches, Expeditions, etc.)
  - Categories = persona's category term (Evidence Files, Chemicals, Regiments, Clues)
  - Notes = persona's notes term
  - Trash = persona's trash term (Deep Ocean, Acid Vat, Graveyard, etc.)
- Active nav item highlighted with persona's primary color
- Bottom: keyboard shortcuts listed (`N`, `F`, `D`, `K`, `?`)
- Bottom quote from the character in italic muted text

### Top Header / Greeting
- Large greeting: `"Hello, [Character Name]"` — character name in persona's accent color
- Subtext: short motivational line in that character's style
- Right side: search bar (Ctrl+K), notification bell, user avatar dropdown

### Stats Row (5 cards)
- Today's Tasks, Pending, Completed, Productivity %, Streak count
- Small cards, dark bg, minimal — number big, label small above, context text small below
- Streak card has a flame icon, animated pulse

### Main Content Grid
Two-column layout:
- **Left (2/3):** Task Completion line chart (SVG, persona-colored gradient fill) + Task list below
- **Right (1/3):** Recent Activity feed + Daily Focus Mode card + Pomodoro Timer + Sticky Notes

### Task List
- Filter tabs: All / Today / Tomorrow / This Week / Overdue
- `+ New Task` button in persona's primary color
- Each task row: checkbox → title + category badge → priority dot → due date → status badge → action icons (star/focus, heart/favorite, trash)
- Completed tasks: strikethrough, dimmed text
- Focus Mode: when ANY task is pinned to focus set, all NON-focus tasks get `opacity: 0.25` + slight `blur(0.5px)` — creates a dramatic tunnel-vision effect

### Focus Mode Widget (right panel)
- Title uses persona's focus term
- Lists up to 3 pinned tasks
- CTA button in persona color: persona's focus action label (e.g. "Start Stalking", "Start Cooking", "Begin Deduction")

### Pomodoro Timer Widget
- Circular SVG progress ring in persona's accent color
- Timer text `25:00` in large monospace font
- Play/Reset controls below
- Timer label uses persona's timer term (e.g. "Ritual Timer", "Reaction Timer", "Concentration Timer")

### Sticky Notes Widget
- Simple textarea
- Placeholder text is persona-specific ("Jot down crime scene observations...", "Write the synthesis formula...", "Record your deductions...")
- Auto-saved to localStorage, keyed by persona

---

## 🎨 Per-Persona Design Specifications

### 1. DEFAULT (Clean & Modern)
- **Font:** `Inter` (sans-serif) — clean, professional, modern
- **Primary Color:** `#3b82f6` (blue-500)
- **Accent:** `#10b981` (emerald-500)
- **Background:** `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)` (deep navy)
- **Card BG:** `rgba(30, 41, 59, 0.7)`
- **Text:** `#f8fafc`
- **Login BG:** Clean dark gradient, no character image
- **Login Title:** "Enter the Dashboard."
- **Tagline:** "Clean. Modern. Focused."
- **Vibe:** Professional SaaS, minimal, Linear.app style

---

### 2. DEXTER MORGAN
- **Font:** `Courier New` / monospace — cold, clinical, typewriter feel — exactly like the reference login screenshot
- **Primary Color:** `#b91c1c` (red-700) — deep blood red
- **Accent:** `#ef4444` (red-500)
- **Background:** `linear-gradient(135deg, #050505 0%, #120202 100%)` — near-black with red tint
- **Card BG:** `rgba(15, 15, 15, 0.85)`
- **Text:** `#e2e8f0` (near-white)
- **Login Background Image:** `dexter_season_6__the_kill_room_by_inickeon_d4af089-pre.jpg` — has his face + dark green/noir tones. Overlay: `rgba(0,0,0,0.65)`
- **Login Left Panel BG:** The image itself gives a dark, clinical, slightly greenish kill-room atmosphere
- **Login Title:** "Enter the Kill Room." (monospace font, bold)
- **Tagline:** "Tonight's the night." (exact quote from show)
- **Decorative Micro-animations:** Subtle blood drip animations on the login page corners/top. A few `<div>` elements with absolute positioning that animate `translateY` slowly downward in blood-red.
- **Dashboard Accent Details:** Red glow on stat cards, red line chart, red sidebar active highlight, blood-red `Start Stalking` button

---

### 3. WALTER WHITE / BREAKING BAD
- **Font:** `Special Elite` (Google Font) — gritty, old typewriter newspaper feel; OR `Courier New` bold
- **Primary Color:** `#eab308` (yellow-500) — hazmat yellow / Heisenberg hat yellow
- **Accent:** `#06b6d4` (cyan-500) — meth blue/crystal blue accent
- **Background:** `linear-gradient(135deg, #111827 0%, #031c1c 100%)` — dark with teal undertones
- **Card BG:** `rgba(17, 24, 39, 0.85)`
- **Text:** `#f3f4f6`
- **Login Background Image:** `breaking-bad-fascinating-facts.BXGqgKI3.jpg` — Walter White's face, toxic golden-yellow tones. This image is VERY golden/amber — overlay: `rgba(0,0,0,0.6)`
- **Login Title:** "Enter the Superlab." (bold, slightly condensed feel)
- **Tagline:** "Say my name. We're in the empire business."
- **Special UI Detail:** The "Br" and "Ba" in "Breaking Bad" style — use periodic table element styling for the app logo. E.g. wrap "Ca" in CaseThread in a box like `[Ca]seThread` with atomic number.
- **Dashboard Accent Details:** Yellow stat highlights, teal/cyan accent for charts, periodic element styled badges on task categories

---

### 4. PATRICK JANE (The Mentalist)
- **Font:** `Lora` or `Playfair Display` (Google Font) — elegant serif, warm, intelligent, refined
- **Primary Color:** `#0e7490` (teal/slate-blue — CBI badge color) or `#1e40af` (deep blue)
- **Accent:** `#d97706` (amber-600 — gold/warm)
- **Background:** `linear-gradient(135deg, #f0ede8 0%, #ddd8d0 100%)` — warm LIGHT background (cream/off-white) — this IS the light theme persona
- **Card BG:** `rgba(255, 255, 255, 0.8)` — white glass-like
- **Text:** `#1e293b` (dark slate on light bg)
- **Login Background Image:** `R.jpeg` — Patrick Jane/The Mentalist poster — dark on edges, elegant. Overlay: `rgba(0,0,0,0.45)`
- **Login Title:** "Enter the Mind Palace." OR "Access CBI Files."
- **Tagline:** "There's always a tell."
- **Special UI Detail:** Warm, clean, almost Apple-like elegance. Light cards. Calm amber accents. Nothing harsh.
- **Dashboard Vibe:** Feels like a bright, sunlit CBI office — airy, sophisticated, minimal clutter

---

### 5. SHERLOCK HOLMES
- **Font:** `Cinzel` or `Playfair Display` (Google Font) — classical, Victorian, intellectual serif
- **Primary Color:** `#d97706` (amber-600) — aged gold, like a Victorian pocket watch
- **Accent:** `#1d4ed8` (royal blue)
- **Background:** `linear-gradient(135deg, #0b0f19 0%, #1a1510 100%)` — very dark, warm charcoal/brown-black
- **Card BG:** `rgba(28, 22, 18, 0.85)` — very dark warm brown glass
- **Text:** `#fef3c7` (warm cream/parchment colored text)
- **Login Title:** "Enter the Mind Palace."
- **Tagline:** "When you have eliminated the impossible, whatever remains must be the truth."
- **Special UI Detail:** Magnifying glass cursor on hover. Vintage map/parchment texture possible on sidebar. All-caps spaced lettering for labels. Deduction-log style activity feed.

---

## 📐 Animation & Interaction Guidelines

### Persona Switcher (Login Page Bottom Buttons)
- Clicking a persona pill button triggers a smooth transition:
  1. Left panel background fades out → new image fades in (0.7s ease)
  2. Character name slides down-out → new name slides up-in (`AnimatePresence` mode="wait")
  3. All colors (submit button, borders, accents) animate via CSS variable transition (0.4s)
- Do NOT hard-cut. Everything must feel fluid and theatrical.

### Page Transitions
- All route changes use Framer Motion `<motion.div>` with `initial={{ opacity: 0 }}` → `animate={{ opacity: 1 }}` → `exit={{ opacity: 0 }}`
- Duration: 0.3–0.5s

### Micro-Animations
- **Dexter only:** Subtle blood drip animation on login page. CSS keyframe `drip` — thin vertical red divs that slowly extend downward from top of the page, random positions, staggered delays.
- **Breaking Bad:** Slight chemical reaction bubbling effect possible on login. Animated circular particles in yellow/blue.
- **Hover states:** All interactive elements scale slightly (`scale: 1.02–1.05`) and transition color in 200–300ms.
- **Task completion:** `canvas-confetti` burst in persona's accent colors when a task is marked done.
- **Pomodoro finish:** Full confetti burst.
- **Focus mode toggle:** Other tasks blur in/out smoothly, not a snap.

### Loading States
- All data-loading states show skeleton loaders (animated shimmer `bg-zinc-800` → `bg-zinc-700` gradient) — never raw spinners alone.

---

## 🗂️ Asset File Mapping

All character image assets live in: `d:\learning files\CaseThread\login themes\`

| Persona | File | Usage |
|---|---|---|
| Dexter | `dexter_season_6__the_kill_room_by_inickeon_d4af089-pre.jpg` | Login left panel BG |
| Breaking Bad | `breaking-bad-fascinating-facts.BXGqgKI3.jpg` | Login left panel BG |
| Patrick Jane | `R.jpeg` | Login left panel BG (The Mentalist poster) |
| Sherlock | *(to be added)* | Login left panel BG |
| Goku | *(to be added)* | Login left panel BG |
| AoT | *(to be added)* | Login left panel BG |

When building the frontend, copy these assets into `frontend/public/assets/login/` and reference them via `/assets/login/filename`.

---

## 🏗️ Implementation Notes (For AI)

1. **NEVER use a generic blue button** — buttons MUST use the active persona's primary color from the theme config.
2. **NEVER hard-code terminology** — all labels (Task, Case, Batch, Expedition, etc.) MUST come from the persona's label dictionary.
3. **Fonts must actually load** — import all Google Fonts in the CSS `@import` at the top of `index.css`. Each persona switches `body { font-family }` dynamically.
4. **The login page IS the first impression** — spend extra effort on it. It should feel like opening a high-end SaaS product, not a tutorial project.
5. **DO NOT BUILD until the user says to start.** When asked to implement, refer back to this memory.md for every design decision.
6. **The `/login themes/` folder = ground truth for character backgrounds.** Always use those actual image files for the login screen, not placeholders or generated images.
7. **Background images need overlays** — always add a dark semi-transparent overlay on top of the character image so text is readable.
8. **Persona switcher buttons at the bottom of the login left panel** are critical — they must switch the theme live without page reload.
