# Custom Website for Libra Masszázs Szalon

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-flat&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-flat&logo=tailwind-css&logoColor=white)
![Static Export](https://img.shields.io/badge/Static_Export-Zero_Runtime-6E4B1F?style=for-the-flat&logo=htmx&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?style=for-the-flat&logo=vercel&logoColor=white)
![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-flat)
![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-flat)

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
* **Automated Accessibility Gate:** A custom Playwright-driven audit (`npm run verify`) walks all six pages in eight configurations, enforcing WCAG 1.4.10 reflow, 1.4.4 text resize, 44 px target sizes, single-`<h1>` structure and full no-JavaScript rendering.
* **Performance-First Assets:** Images are pre-processed at build time into responsive AVIF + WebP sets with intrinsic dimensions baked into a manifest, holding Cumulative Layout Shift at zero.
* **Privacy-Conscious Delivery:** Self-hosted typefaces via `next/font` and cookieless Vercel Analytics mean the site issues no third-party requests and needs no consent banner.

---

## 🛠️ Technology Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router, static export)
* **Language:** [TypeScript](https://www.typescriptlang.org/) (Strictly typed for enterprise-grade reliability)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first design tokens)
* **Typography:** [next/font](https://nextjs.org/docs/app/api-reference/components/font) (Source Sans 3, Roboto, Caveat — self-hosted)
* **Imaging:** [Sharp](https://sharp.pixelplumbing.com/) (Build-time AVIF/WebP pipeline)
* **Quality Gate:** [Playwright](https://playwright.dev/) (Responsive & accessibility auditing)
* **CI/CD:** [Vercel](https://vercel.com/) + [GitHub Actions](https://github.com/features/actions) (Automated builds & deployments)

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
