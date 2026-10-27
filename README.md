# Akram Naser — Portfolio

A motion-led, content-driven portfolio built with Astro, React, TypeScript, GSAP ScrollTrigger, and Motion. The public site is static and deploys to GitHub Pages; small optional services provide form delivery and the shared click count.

## Run locally

Requires Node.js 24.

```sh
npm install
npm run dev
```

Astro serves the project at `http://localhost:4321/portfolio/`.

```sh
npm test          # Unit tests
npm run build     # Typecheck and production build
npm run preview   # Preview the production build
```

## Public configuration

Copy `.env.example` to `.env` for local development. All three values are public configuration, not secrets:

- `PUBLIC_FORMSPREE_ENDPOINT` — Formspree form URL; activates contact delivery.
- `PUBLIC_CLICK_COUNTER_URL` — Cloudflare Worker origin; activates global click syncing.
- `PUBLIC_LINKEDIN_URL` — Your full LinkedIn profile URL.

For GitHub Pages, add these as **Actions repository variables** in **Settings → Secrets and variables → Actions → Variables**. Do not place private email credentials, API secrets, or the destination inbox in the frontend.

## Edit content

Content uses Astro collections and Markdown/MDX:

- `src/content/experience/` — roles and achievements; adjust `order` to reorder.
- `src/content/education/` — education, certificates, and independent study.
- `src/content/fermi/` — daily estimation questions; frontmatter contains the answer and assumptions, and the body contains the explanation.
- `src/content/blog/` — MDX blog posts.

To publish a post, copy `src/content/blog/_template.mdx` to a descriptive filename such as `better-ai-use-cases.mdx`, replace the content, set the publication date, and change `draft: true` to `draft: false`. Committing and pushing to `main` starts the deployment workflow. You can also create and edit these files through GitHub's web interface.

Site identity and public social links live in `src/config/site.ts`.

## Contact form

1. Create a form in Formspree and set its notification recipient in Formspree's dashboard.
2. Set `PUBLIC_FORMSPREE_ENDPOINT` to the provided `https://formspree.io/f/...` URL.
3. Keep Formspree's spam protection enabled.

Only the public form identifier ships in the static HTML. The destination inbox does not. Formspree's current free tier starts at 50 submissions per month.

## Global click counter

The Worker and its documentation are in `workers/click-counter/`.

```sh
cd workers/click-counter
npm install
npm test
npm run typecheck
npm run build
```

The Worker uses a SQLite-backed Durable Object, which is available on Cloudflare's free plan. Before deployment, set `ALLOWED_ORIGIN` in `wrangler.jsonc` to `https://akithelucky.github.io`, authenticate Wrangler, and run `npm run deploy`. Then set `PUBLIC_CLICK_COUNTER_URL` to the Worker URL. No database credential is sent to the browser.

Without the Worker URL, personal clicks still work and the interface clearly reports that global syncing is not connected.

## Fonts and licensing

The site uses **Maxitype Modelo** for the hero name and navigation only, with **Plus Jakarta Sans** for all other text.

Modelo is covered by Maxitype's free web-font license for sites under 100,000 monthly visitors, but the license does not permit publishing the raw font files in a public repository. Therefore:

- `public/fonts/modelo/` is git-ignored and must not be committed.
- For local development, keep the licensed `.woff2` files in that folder.
- For GitHub Actions, add these repository **secrets**:
  - `MODELO_FONT_LIGHT_BASE64`
  - `MODELO_FONT_REGULAR_BASE64`
  - `MODELO_FONT_BOLD_BASE64`
  - `MODELO_FONT_BLACK_BASE64`
- The workflow runs `npm run fonts:modelo` to decode those secrets into the build output before Astro builds.

Do not substitute the print font, modify the font files, or commit them to a public repository.

## Artwork and video

The mood and background images in `src/assets/art/` and video backgrounds in `src/assets/video/` were supplied by Akram. They are used as cropped background imagery for the hero, buttons, and contact panel. Backgrounds use `cover`, so source media is never stretched.

- **Light hero video:** `blue_crink.mp4`, compressed to 1080p.
- **Dark hero video:** `slide_across.mp4`, compressed to 1080p.
- Videos are muted, looping, inline, and removed under `prefers-reduced-motion`.
- Static posters and art remain as fallbacks.

Confirm usage rights before public commercial deployment.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys on pushes to `main` and on manual dispatch. In the repository's **Settings → Pages**, choose **GitHub Actions** as the source.

The site is configured for `https://akithelucky.github.io/portfolio/` in `astro.config.mjs`. If you add a custom domain, update `site`, remove or adjust `base`, and update `public/robots.txt`.

## Accessibility and motion

Core content is server-rendered HTML. The layout supports keyboard navigation, visible focus states, mobile-specific compositions, light/dark themes, and `prefers-reduced-motion`. The signature pinned scene becomes sequential static content on mobile and for reduced-motion users.
