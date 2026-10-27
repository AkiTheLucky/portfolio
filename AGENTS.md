# Portfolio Design & Engineering Guidelines (`AGENTS.md`)

Always follow these non-negotiable rules when working on Akram Naser's portfolio:

## 1. Typography Rules
- **`Maxitype Modelo` (`--modelo`)**:
  - Use **ONLY** at display or navigation scale where its stencil geometry reads cleanly:
    1. **Hero Name (`AKRAM NASER`)**
    2. **Top Action Bar (`SiteHeader`)**
  - **NEVER** use `Modelo` at tiny badge/caption sizes (`< 0.85rem`), and never for long sentences.
- **No Cursive / Italic Display Fonts**:
  - Never put Akram's name or headings in cursive or italic serif.
- **Everywhere Else**:
  - Use a clean, high-legibility normal sans-serif (`Plus Jakarta Sans Variable`) with clear typographic hierarchy.

## 2. Color System — Blue Hour + Cloud Dancer
- **NEVER return to the Anthropic/Claude combination** of warm beige, rust orange, and delicate serif type.
- **Light (Day) Theme — Blue Hour on Cloud Dancer**:
  - Ground: Pantone **Cloud Dancer 11-4201** (`#F0EEE9`) / soft gallery stone (`#E6E3DC`).
  - Primary: **Muted cobalt** (`#33517A`).
  - Supporting: **Ice blue** (`#AFC5DE`) and graphite ink (`#101820` / `#4C5D6C`).
  - **Zero green, terracotta, or orange.**
- **Dark (Night) Theme — Blue Hour after dark**:
  - Ground: **Obsidian navy** (`#080C13` / `#0F1722` / `#172433`) — **zero green tint**.
  - Primary: **Slate cobalt** (`#2B4A70`).
  - Highlight: **Luminous ice blue** (`#9FC2E4`).
  - Ink: cool off-white (`#F1F5F8` / `#A8B8C8`).
  - **Zero green, terracotta, or orange.**
- Imagery is split by theme and treated as cropped `background-size: cover` layers; never distort aspect ratios.

## 3. Hero Section Simplicity
- The Hero section must contain **ONLY**:
  1. Akram's name (`AKRAM NASER`) set large in `Maxitype Modelo`.
  2. Akram's title/role line in clean font (no location/city badge, no extra pills).
  3. The two call-to-action buttons (`Email me` and `Explore`).
- **Never** clutter the Hero with decorative circles, floating metric cards (`-50%`, `150+`, `1-2h`), or location badges.
- The name is a readability instrument: it must remain readable at rest. Horizontal pointer movement across the hero may gradually thicken/abstract it, capped tightly at **font-weight 400** plus a small text stroke. The ornamental `A—arc gauge—A` indicator should expose the range without looking like a generic range slider.

## 4. Content Rules
- No numbered labels in section headers or decorative index numbers inside cards/headings.
- Keep only the Fermi game and click counter as interactive extras; do not re-add novelty widget toys unless explicitly requested.
- There is no floating bottom-right quick menu. Top navigation is sufficient.
- The “What I can help with” process section was removed; do not restore it without a new approved concept.
- Hero video: `blue_crink` for light mode, `slide_across` for dark mode. Hide video under reduced motion and retain the static artwork fallback.

## 5. Geometry & Portrait
- Avoid bubbly `999px` pill overload and overly rounded cartoon cards. Use crisp, architectural corners (`6px`–`10px`).
- Use `public/me.jpg` for Akram's portrait in the About section.
- Never expose Akram's private email address or phone number in the repository or frontend source.
