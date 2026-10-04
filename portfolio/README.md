# Mojolaoluwa Olanusi — Portfolio

Personal portfolio built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4. Content is markdown-driven, so copy and case studies live in `content/` rather than in components.

- **Live site:** https://mojolaoluwa.vercel.app
- **Repository:** https://github.com/MojolaoluwaOlanusi/Portfolio
- **Owner:** Mojolaoluwa Olanusi

---

## Table of contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [Quick start](#quick-start)
4. [Environment variables](#environment-variables)
5. [Cloudinary setup (detailed)](#cloudinary-setup-detailed)
6. [Repository structure](#repository-structure)
7. [Content model](#content-model)
8. [Adding or editing a project](#adding-or-editing-a-project)
9. [Local media vs Cloudinary](#local-media-vs-cloudinary)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## Features

- Markdown-driven projects, creative works, certificates, testimonials and profile content.
- Deterministic project ordering with featured-first and `order` precedence.
- Project case studies rendered as Problem / Process / Result.
- Cloudinary-backed media delivery with a local-folder fallback for development.
- Custom `MO` monogram favicon served from `app/icon.svg`.
- Tailwind 4 styling with glass panels, gradient text and scroll-driven motion.

---

## Tech stack

| Layer     | Technology                           |
| --------- | ------------------------------------ |
| Framework | Next.js 16 (App Router)              |
| UI        | React 19, TypeScript                 |
| Styling   | Tailwind CSS 4, PostCSS              |
| Animation | Framer Motion, GSAP                  |
| Icons     | lucide-react, react-icons            |
| Media     | Cloudinary (production), local (dev) |
| Lint      | ESLint 9, eslint-config-next         |

---

## Quick start

> Requires **Node.js 20 or newer**.

```bash
git clone https://github.com/MojolaoluwaOlanusi/Portfolio.git
cd Portfolio/portfolio
npm install
cp .env.example .env.local     # Windows: copy .env.example .env.local
npm run dev
```

Open <http://localhost:3000>.

Available scripts:

```bash
npm run dev     # start the dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # run ESLint
```

---

## Environment variables

The app reads exactly one environment variable.

| Variable                          | Required | Purpose                                       |
| --------------------------------- | -------- | --------------------------------------------- |
| `NEXT_PUBLIC_CLOUDINARY_BASE_URL` | No       | Cloudinary delivery base for media in production |

`NEXT_PUBLIC_` variables are inlined into the client bundle at build time. **Never put your Cloudinary API secret in one.**

`.env.local` is git-ignored. `.env.example` is committed and safe to read.

If the variable is unset the app falls back to serving media from the local `projects/`, `certificates/` and `../creative work` folders, so local development works without Cloudinary.

---

## Cloudinary setup (detailed)

Cloudinary hosts the project screenshots, creative-work media and certificate previews in production. The image folders are git-ignored, so Cloudinary is the source of truth once deployed.

### Step 1 — Create the account and get your cloud name

1. Go to <https://cloudinary.com> and sign up (or sign in).
2. After signing in you land on the dashboard. The **Cloud name** is shown in the top-right account panel and also appears in the copied **base delivery URL**:

   ```text
   https://res.cloudinary.com/<YOUR_CLOUD_NAME>/image/upload/
   ```

3. Copy just the cloud name. You need `<YOUR_CLOUD_NAME>`, not the API key or secret.

### Step 2 — Add the delivery base URL locally

```bash
cp .env.example .env.local
```

Then set:

```env
NEXT_PUBLIC_CLOUDINARY_BASE_URL=https://res.cloudinary.com/YOUR_CLOUD_NAME
```

Important details:

- Use only the base shown above. Do **not** append `/image/upload`, a folder name, or a query string — the app appends the resource type and folder itself.
- Restart `npm run dev` after changing it. Next.js only reads env files at startup.

### Step 3 — Create the media folders

In the Cloudinary dashboard open **Media Library → Folders** and create:

```text
creative-works/
  3d/
    archviz/
    models/
    product-renders/
    animations/
  graphic-design/
  video-editing/
projects/
certificate/
```

Folder names are **case-sensitive** and must match the public IDs below exactly.

### Step 4 — Upload project screenshots

Project images are resolved by markdown slug, so the filename must match the slug.

| Project | Filename     | Upload to   | Source site                               |
| ------- | ------------ | ----------- | ----------------------------------------- |
| Snitch  | `snitch.png` | `projects/` | https://snitch-social-frontend.vercel.app |
| Tudu    | `tudu.png`   | `projects/` | https://tudu-kanban.vercel.app            |
| Reeli   | `reeli.png`  | `projects/` | https://reeli-movies.vercel.app           |

To capture a screenshot, open the live URL in a browser, then capture at roughly 1440px wide. Save as a `.png` under about 500KB and drag it into the `projects/` folder in Media Library.

Resulting delivery URLs:

```text
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/projects/snitch.png
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/projects/tudu.png
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/projects/reeli.png
```

### Step 5 — Upload creative works

Keep each work's media list in its markdown under `content/creative-works`, using paths relative to `creative-works` including subfolders and the extension:

```yaml
media: [3d/models/Donut-01.png, 3d/models/Donut-animation-01.mp4]
```

Upload those files to `creative-works/3d/models/`. Public IDs and filename capitalisation must match the markdown exactly. Upload videos as **video** assets.

### Step 6 — Upload certificates

Upload certificate previews to `certificate/` named `<certificate-slug>.png`. To use a different filename, add `picture: your-file-name.png` to that certificate's frontmatter.

### Step 7 — Configure the deployment environment

```bash
# Vercel CLI
vercel env add NEXT_PUBLIC_CLOUDINARY_BASE_URL production
```

Or in the Vercel dashboard: **Project → Settings → Environment Variables**, add it for Production, Preview and Development, then redeploy. Changing env vars requires a redeploy.

### Delivery URL format

```text
https://res.cloudinary.com/<CLOUD_NAME>/<resource_type>/upload/<folder>/<path>
```

- `resource_type` is `image` or `video`.
- Folder is `creative-works`, `projects` or `certificate`.

### Optional: optimise on delivery

Cloudinary transformation segments sit between `upload` and the folder. The app builds URLs without them. If you want them, either extend `getCloudinaryMediaUrl` in `lib/content.ts` to insert a segment, or set the base URL to include the transformation and drop it from the app.

### Security note

The app uses **unsigned delivery URLs only**. Never expose your API secret in a `NEXT_PUBLIC_` variable. Ensure uploaded media is publicly deliverable, or configure signed delivery separately before using restricted assets.

---

## Repository structure

```text
Portfolio/
├── .gitignore                  # ignores creative work + certificate media
├── creative work/              # local creative media (git-ignored)
│   ├── 3d/{archviz,models,product-renders,animations}
│   ├── graphic-design/
│   └── video-editing/
└── portfolio/                  # the Next.js app
    ├── app/
    │   ├── icon.svg            # MO monogram favicon
    │   ├── layout.tsx          # metadata + fonts
    │   ├── page.tsx
    │   ├── components/         # Hero, About, Projects, CreativeWork, ...
    │   ├── creative-works/[category]/page.tsx
    │   └── media/[...path]/route.ts   # local media fallback route
    ├── content/
    │   ├── profile.md
    │   ├── about.md
    │   ├── skills.md
    │   ├── projects/           # snitch.md, tudu.md, reeli.md
    │   ├── creative-works/
    │   ├── certificates/
    │   └── testimonials/
    ├── lib/
    │   ├── content.ts          # markdown parsing, Cloudinary URLs, ordering
    │   └── social-proof.ts
    ├── projects/               # local project screenshots (git-ignored)
    ├── certificates/           # local certificate images (git-ignored)
    ├── .env.example
    ├── CLOUDINARY.md
    └── README.md
```

---

## Content model

### Project frontmatter

```yaml
---
title: Tudu                     # display name
summary: One or two sentences.   # card blurb
live: https://tudu-kanban.vercel.app
github: https://github.com/MojolaoluwaOlanusi/Tudu
problem: What was broken and why it mattered.
process: How you built it, and what you learned.
result: What shipped and what changed.
featured: true                  # pins the card to the top group
order: 2                        # lower numbers come first
hidden: false                   # true removes it from the site
stack: [React, TypeScript, Vite]
---
Body paragraph shown on the project page.
```

### Ordering rules

`readVisibleProjects` in `lib/content.ts` sorts by:

1. `featured: true` before `featured: false`
2. then `order` ascending (files without `order` sort last)
3. then `title` alphabetically as a tiebreaker

Filesystem order no longer matters, so renaming a markdown file will not reshuffle the page.

---

## Adding or editing a project

1. Create `portfolio/content/projects/<slug>.md` using the frontmatter above.
2. The slug is the filename without `.md` and also drives the screenshot filename.
3. Upload `<slug>.png` to Cloudinary `projects/` (or drop it in `portfolio/projects/` for local-only work).
4. Set `order` so it lands in the right position.

---

## Local media vs Cloudinary

`getProjectMedia` and `getCertificatePreview` prefer the local file when it exists and fall back to Cloudinary otherwise:

```ts
if (fs.existsSync(localPath)) return `/media/projects/...`;
return remotePath;
```

This means:

- **Development:** drop PNGs into `portfolio/projects/` and `portfolio/certificates/` and they render through the `/media/[...path]` route.
- **Production:** those folders are empty (git-ignored), so every image resolves to Cloudinary.

Because these folders are ignored, use `git add -f` only if you ever intentionally need to commit a specific asset.

---

## Deployment

### Vercel (recommended)

1. Import the repository in Vercel and set the **Root Directory** to `portfolio`.
2. Framework preset: Next.js. Build `npm run build`, output default.
3. Add `NEXT_PUBLIC_CLOUDINARY_BASE_URL` under Environment Variables for all environments.
4. Deploy, then redeploy if you change the variable.

### Any Node host

```bash
npm run build
npm start
```

Set `NEXT_PUBLIC_CLOUDINARY_BASE_URL` in the host's secret settings. The `/media/[...path]` route reads from `process.cwd()/projects`, so run the server from the `portfolio` directory.

---

## Troubleshooting

**Images do not load in production**
Check `NEXT_PUBLIC_CLOUDINARY_BASE_URL` points at the delivery base only, confirm the file exists in the `projects/` folder, and verify the filename matches the slug exactly. Case matters.

**Images do not load locally**
Confirm the file is directly inside `portfolio/projects/` and named `<slug>.png`. Creative media lives in the repo root `creative work/` folder, not under `portfolio/`.

**Content changes do not appear**
Markdown is read from disk at build time. Restart `npm run dev`, or rebuild for production.

**Project order looks wrong**
Set `order` on each markdown file. Alphabetical filenames are irrelevant; the sort is explicit.

**Favicon does not update**
`app/icon.svg` is served at `/icon.svg`. Hard-refresh or clear the cache — browsers cache favicons aggressively.

**Build fails on `content.ts`**
Malformed frontmatter can break parsing. Each file must open and close with `---` and each key must be on its own line.

---

## License

Personal portfolio. All rights reserved unless a license is added.
