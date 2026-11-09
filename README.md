# Custom Website for Libra Masszázs Szalon

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Static Export](https://img.shields.io/badge/Static_Export-Zero_Runtime-6E4B1F?style=flat&logo=htmx&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?style=flat&logo=vercel&logoColor=white)
![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=flat)
![License](https://img.shields.io/badge/License-Proprietary-red?style=flat)

This repository contains the source code for the official website of **Libra Masszázs Szalon**, a massage studio in Budapest's 2nd district run by a certified medical masseuse.

The project replaces a legacy WordPress + Elementor installation. The content and the visual character were deliberately preserved; the technical foundation was rebuilt from scratch around a zero-runtime, accessibility-first architecture.

---

## 🚀 Live Production

**The application is deployed and accessible at:**
👉 **[https://libraszalon.hu](https://libraszalon.hu)**

---

## ✨ Key Engineering Features

* **Zero-Runtime Static Architecture:** The entire site is pre-rendered to plain HTML (`output: 'export'`), so there is no server, no database and no runtime dependency — the same `out/` directory runs on any static host.
* **Content–Presentation Separation:** Every piece of copy, price and opening hour lives in the typed `src/content/` layer rather than inside components, so editorial changes never touch markup.
* **Tone-Aware Design System:** One Tailwind CSS `@theme` holds the colours, fluid type scale, spacing, shadows and motion. Each surface declares a light or dark tone and accents, secondary text and focus rings follow it, so the shared primitives (`Section`, `SectionHeading`, `InfoCard`, `Button`, `ContactList`, …) work on any background without per-component colour props.
* **Automated Quality Gate:** A custom Playwright audit (`npm run verify`) serves the export with the production `vercel.json` headers and walks all six pages plus the 404 in nine viewport configurations. It enforces zero horizontal overflow, WCAG 1.4.10 reflow and 1.4.4 text resize, 44 px targets, a single `<h1>` with no skipped heading levels, a console free of errors and Content Security Policy violations, axe-core (WCAG 2.2 AA) and full no-JavaScript rendering, and drives the mobile menu, the notice dialog and the reviews carousel by keyboard.
* **Performance-First Assets:** Images are pre-processed at build time into responsive AVIF + WebP sets with intrinsic dimensions baked into a manifest, holding Cumulative Layout Shift at zero; they are served with a one-year immutable cache alongside the hashed `_next/static` bundles. Motion is CSS-only (no animation library) and honours `prefers-reduced-motion`.
* **Privacy-Conscious Delivery:** Self-hosted typefaces via `next/font` and cookieless Vercel Analytics mean the site loads no third-party scripts, fonts or trackers and needs no consent banner; the only external content is the lazily loaded Google Maps embed on the contact page.

---

## 🛠️ Technology Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router, static export)
* **Language:** [TypeScript](https://www.typescriptlang.org/) (Strictly typed for enterprise-grade reliability)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first design tokens)
* **Typography:** [next/font](https://nextjs.org/docs/app/api-reference/components/font) (Cormorant Garamond, Source Sans 3, Caveat — self-hosted)
* **Imaging:** [Sharp](https://sharp.pixelplumbing.com/) (Build-time AVIF/WebP pipeline)
* **Quality Gate:** [Playwright](https://playwright.dev/) + [axe-core](https://github.com/dequelabs/axe-core) (Responsive, accessibility & CSP auditing)
* **CI/CD:** [Vercel](https://vercel.com/) (Automated builds & deployments)

---

## ⚠️ Important Notice: Project Status

This repository is published **for portfolio and demonstration purposes only**.

This was a private, commercial project developed for a specific client. The intellectual property and all rights to the code belong to the client.

**This is not an open-source project.** You are strictly prohibited from copying, distributing, modifying, or using this code for any academic, commercial, or personal projects. Please see the `LICENSE.md` file for a detailed breakdown of these restrictions.

---

## 📦 Deployment

This project is configured for automated deployment via **Vercel**.
Any push to the `main` branch automatically triggers a new build and deployment.

| Environment | Status |
| :--- | :--- |
| **Production** | [![Vercel App](https://img.shields.io/badge/Visit-Live_App-success?style=for-the-badge&logo=vercel)](https://libraszalon.hu) |

### Caching

Headers live in `vercel.json` (Next's `headers()` is ignored by a static export). Vercel keeps every
deployment's static files in its edge cache for the lifetime of that deployment, so the rules only
decide what the *browser* may reuse:

| Path | `Cache-Control` | Why |
| :--- | :--- | :--- |
| `/_next/static/*`, `/images/*`, `/og/*` | `max-age=31536000, immutable` | `_next/static` is content-hashed; `/images` and `/og` are NOT hashed (slug + width), so a changed picture must get a new slug. |
| `/favicon.ico`, `/icon*.png`, `/apple-icon.png` | `max-age=604800` | Rarely change; the HTML links the hashed `?icon.<hash>` URLs. |
| `/manifest.webmanifest` | `max-age=86400` | Rarely changes, not hashed. |
| everything else (HTML, RSC payloads, `sitemap.xml`, `robots.txt`) | `max-age=0, must-revalidate` | Always revalidated (a cheap 304 from the edge), so a deploy is live on the next request. |

---

## 📄 License

Copyright (c) Hajdú Patrik Zsolt. All rights reserved.

Proprietary, commissioned work published for demonstration and portfolio purposes only. No rights to use, copy, modify or distribute it are granted. See [LICENSE.md](LICENSE.md) for the full terms.
