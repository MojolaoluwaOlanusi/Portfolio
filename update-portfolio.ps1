# update-portfolio.ps1
# Run from the folder that contains both "portfolio" and "creative work":
#   cd "C:\Users\olanu\OneDrive\Documents\Mojola-Portfolio"
#   powershell -ExecutionPolicy Bypass -File .\update-portfolio.ps1
$ErrorActionPreference = "Continue"   # git/npm print progress on stderr; we check exit codes ourselves
$root = (Get-Location).Path
if (-not (Test-Path (Join-Path $root "portfolio\package.json"))) {
  throw "Run this from the Mojola-Portfolio folder (it must contain portfolio\package.json)."
}

function Write-File([string]$RelativePath, [string]$Content) {
  $full = [IO.Path]::Combine($root, $RelativePath)
  try {
    [void][IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($full))
    [IO.File]::WriteAllText($full, $Content.Replace("`r`n", "`n").TrimEnd() + "`n", (New-Object Text.UTF8Encoding($false)))
    Write-Host "  wrote $RelativePath"
  } catch { throw "Failed writing ${RelativePath}: $_" }
}

Write-Host "`n[1/7] Safety branch" -ForegroundColor Cyan
git checkout -B portfolio-v2
if ($LASTEXITCODE -ne 0) { throw "Could not create/switch to the portfolio-v2 branch." }

Write-Host "`n[2/7] Moving screenshots and cleaning media file names" -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "portfolio\projects" | Out-Null
if (Test-Path "projects") {
  Get-ChildItem "projects" -File -ErrorAction SilentlyContinue | ForEach-Object {
    Move-Item -LiteralPath $_.FullName -Destination "portfolio\projects\$($_.Name)" -Force
    Write-Host "  moved $($_.Name) -> portfolio\projects"
  }
}
if (Test-Path "creative work") {
  Get-ChildItem "creative work" -Recurse -File | Where-Object { $_.Name -ne "README.md" -and $_.BaseName -match '[\s.]' } | ForEach-Object {
    $new = ($_.BaseName -replace '[\s.]+', '-') + $_.Extension.ToLower()
    Rename-Item -LiteralPath $_.FullName -NewName $new
    Write-Host "  renamed '$($_.Name)' -> '$new'"
  }
}

Write-Host "`n[3/7] Removing duplicate and obsolete files" -ForegroundColor Cyan
Get-ChildItem "portfolio\content\creative-works\3d" -Filter *.md -File -ErrorAction SilentlyContinue | Remove-Item -Force
foreach ($old in @(
  "portfolio\app\components\MediaGallery.tsx",
  "portfolio\app\components\SocialProof.tsx",
  "portfolio\lib\social-proof.ts"
)) { if (Test-Path -LiteralPath $old) { Remove-Item -LiteralPath $old -Force; Write-Host "  removed $old" } }

Write-Host "`n[4/7] Writing the new portfolio files" -ForegroundColor Cyan
Write-File 'portfolio\.env.example' @'
# Public delivery base (no trailing slash, no /image/upload). Needed locally AND on Vercel.
NEXT_PUBLIC_CLOUDINARY_BASE_URL=https://res.cloudinary.com/YOUR_CLOUD_NAME

# Only used by `npm run media:upload` on your machine. Never prefix these with NEXT_PUBLIC_.
CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
'@

Write-File 'portfolio\CLOUDINARY.md' @'
# Media hosting (Cloudinary, free plan)

The site never serves media from your computer in production. Everything is delivered from Cloudinary, so a file only shows up when:

1. it is uploaded under the right public ID, and
2. `NEXT_PUBLIC_CLOUDINARY_BASE_URL` is set where the site is built (`.env.local` locally, Vercel for production).

## Public IDs (generated automatically by `npm run media:upload`)

| Local file | Cloudinary public ID |
| --- | --- |
| `../creative work/3d/models/Donut-01.png` | `creative-works/3d/models/Donut-01` |
| `../creative work/3d/models/Donut-animation-01.mp4` | `creative-works/3d/models/Donut-animation-01` |
| `projects/tudu.png` | `projects/tudu` |
| `certificates/my-cert.png` | `certificate/my-cert` |

File names must not contain spaces or dots (except the extension). Use `Chanel-No-5.png`, not `Chanel No.5.png`.

## Commands

```powershell
npm run media:sync     # link files in "creative work" to markdown entries (add --write via: node scripts/sync-creative.mjs --write)
npm run media:upload   # upload anything new to Cloudinary
npm run media:check    # verify every file referenced by your content is reachable
```

## Free plan limits

Images up to 10 MB and videos up to 100 MB per file. Compress anything larger (for example with `ffmpeg -i in.mp4 -vcodec libx264 -crf 28 -vf scale=1280:-2 out.mp4`).

## Project screenshots

`content/projects/<slug>.md` lists them in `screens: [tudu.png, tudu-2.png]`. Name the files exactly like that and upload them.
'@

Write-File 'portfolio\app\components\About.tsx' @'
import { Boxes, Code2, Palette, type LucideIcon } from "lucide-react";
import { about, parseBody } from "@/lib/content";

const pillarIcons: LucideIcon[] = [Code2, Boxes, Palette];

export default function About() {
  const { intro, sections } = parseBody(about.content);
  const paragraphs = intro.split(/\n\s*\n/).filter(Boolean);
  const pillars = (sections.find((section) => section.title.toLowerCase() === "pillars")?.items ?? []).map((item) => {
    const [title, ...rest] = item.split(" - ");
    return { title: title.trim(), text: rest.join(" - ").trim() };
  });

  return (
    <section id="about" className="py-24">
      <div className="section-shell">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-violet-300">About</p>
        <h2 className="mb-12 max-w-3xl text-3xl font-bold text-white md:text-4xl">A builder with both engineering discipline and creative instincts</h2>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-300">
            {paragraphs.map((paragraph, index) => (
              <p key={`${paragraph.slice(0, 12)}-${index}`}>{paragraph}</p>
            ))}
          </div>

          <div className="space-y-4">
            {pillars.map((pillar, index) => {
              const Icon = pillarIcons[index % pillarIcons.length];
              return (
                <div key={pillar.title} className="glass-panel flex gap-4 rounded-2xl p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{pillar.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{pillar.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
'@

Write-File 'portfolio\app\components\Certificates.tsx' @'
import { certificates, getCertificatePreview } from "@/lib/content";
import CertificateExplorer from "./CertificateExplorer";

export default function Certificates() {
  if (certificates.length === 0) return null;

  return (
    <section id="certificates" className="py-24">
      <div className="section-shell">
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-violet-300">Certificates</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Recognition & learning</h2>
        </div>

        <CertificateExplorer
          certificates={certificates.map((item) => ({
            ...item,
            preview: getCertificatePreview(item.slug, typeof item.picture === "string" && item.picture ? item.picture : `${item.slug}.png`).path,
          }))}
        />
      </div>
    </section>
  );
}
'@

Write-File 'portfolio\app\components\Contact.tsx' @'
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { profile, safeText } from "@/lib/content";

const secondary =
  "inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-900/80 px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-violet-400 hover:text-violet-200";

export default function Contact() {
  const email = safeText(profile.email, "olanusimojola@gmail.com");
  const github = safeText(profile.github);
  const linkedin = safeText(profile.linkedin);
  const whatsapp = safeText(profile.whatsapp);
  const x = safeText(profile.x);

  return (
    <section id="contact" className="py-24">
      <div className="section-shell">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/15 via-slate-950 to-slate-950 p-8 md:p-14">
          <div className="orb -right-20 -top-20 h-64 w-64 bg-violet-600" />
          <div className="relative">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-violet-300">Contact</p>
            <h2 className="mb-5 text-3xl font-bold text-white md:text-5xl">Let&apos;s build something meaningful together</h2>
            <p className="mb-8 max-w-2xl text-lg leading-8 text-slate-300">
              I&apos;m looking for an internship or junior developer role, and I&apos;m open to freelance projects and creative collaborations. The quickest way to reach me is email.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${email}?subject=Hello%20Mojolaoluwa`}
                className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition hover:bg-violet-400"
              >
                <Mail className="h-4 w-4" /> {email}
              </a>
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noreferrer" className={secondary}>
                  <FaLinkedinIn className="h-4 w-4" aria-hidden="true" /> LinkedIn
                </a>
              )}
              {github && (
                <a href={github} target="_blank" rel="noreferrer" className={secondary}>
                  <FaGithub className="h-4 w-4" aria-hidden="true" /> GitHub
                </a>
              )}
              {whatsapp && (
                <a href={whatsapp} target="_blank" rel="noreferrer" className={secondary}>
                  <FaWhatsapp className="h-4 w-4" aria-hidden="true" /> WhatsApp
                </a>
              )}
              {x && (
                <a href={x} target="_blank" rel="noreferrer" className={secondary}>
                  <FaXTwitter className="h-4 w-4" aria-hidden="true" /> X
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
'@

Write-File 'portfolio\app\components\CreativeWork.tsx' @'
import { getVisibleCreativeWorks } from "@/lib/content";
import CreativeWorkExplorer, { type CreativeGroup } from "./CreativeWorkExplorer";

export const creativeSections = [
  { category: "3d", title: "3D work", subtitle: "Models, archviz, product renders and animations" },
  { category: "graphic-design", title: "Graphic design", subtitle: "Brand assets, visuals and concepts" },
  { category: "video-editing", title: "Video editing", subtitle: "Short-form edits, reels and motion storytelling" },
] as const;

export function getCreativeGroups(category: string): CreativeGroup[] {
  return getVisibleCreativeWorks(category).map((work) => ({
    key: `${work.category}-${work.group}-${work.slug}`,
    title: work.title,
    tag: work.group,
    items: work.media,
    detail: work,
  }));
}

export default function CreativeWork() {
  const sections = creativeSections.map((section) => ({
    title: section.title,
    subtitle: section.subtitle,
    groups: getCreativeGroups(section.category),
    previewOnly: true,
    viewAllHref: `/creative-works/${section.category}`,
  }));

  return (
    <section id="creative" className="py-24">
      <div className="section-shell">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">Creative work</p>
        <h2 className="mb-4 max-w-3xl text-3xl font-bold text-white md:text-4xl">Design, 3D craft and visual storytelling</h2>
        <p className="mb-12 max-w-2xl text-lg leading-8 text-slate-300">
          Outside the codebase I model, light and render in Blender, and design graphics and edit video. Open any piece to see it up close.
        </p>

        <CreativeWorkExplorer sections={sections} />
      </div>
    </section>
  );
}
'@

Write-File 'portfolio\app\components\CreativeWorkExplorer.tsx' @'
"use client";

import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { CreativeWorkEntry, MediaItem } from "@/lib/content";

export type CreativeGroup = {
  key: string;
  title: string;
  tag: string;
  items: MediaItem[];
  detail: CreativeWorkEntry | null;
};

type Section = {
  title: string;
  subtitle: string;
  groups: CreativeGroup[];
  viewAllHref?: string;
  previewOnly?: boolean;
};

const PREVIEW_LIMIT = 6;

function tagLabel(tag: string) {
  return tag.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function MediaTile({ item, eager = false }: { item: MediaItem; eager?: boolean }) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-xs text-slate-500">
        Media unavailable
      </div>
    );
  }

  if (item.type === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.thumb ?? item.path}
        alt={item.name}
        loading={eager ? "eager" : "lazy"}
        onError={() => setBroken(true)}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <video
      src={item.poster ? item.path : `${item.path}#t=0.1`}
      poster={item.poster}
      preload="metadata"
      muted
      playsInline
      loop
      onError={() => setBroken(true)}
      onMouseEnter={(event) => void event.currentTarget.play().catch(() => undefined)}
      onMouseLeave={(event) => {
        event.currentTarget.pause();
        event.currentTarget.currentTime = 0;
      }}
      className="h-full w-full object-cover"
    />
  );
}

function SectionBlock({ section, onOpen }: { section: Section; onOpen: (group: CreativeGroup) => void }) {
  const [filter, setFilter] = useState("all");
  const tags = [...new Set(section.groups.map((group) => group.tag).filter(Boolean))];
  const filtered = filter === "all" ? section.groups : section.groups.filter((group) => group.tag === filter);
  const visible = section.previewOnly ? filtered.slice(0, PREVIEW_LIMIT) : filtered;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">{section.title}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{section.subtitle}</h3>
        </div>

        {tags.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {["all", ...tags].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setFilter(tag)}
                className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.15em] transition ${
                  filter === tag ? "border-cyan-300 bg-cyan-300/15 text-cyan-100" : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-cyan-300/60"
                }`}
              >
                {tag === "all" ? "All" : tagLabel(tag)}
              </button>
            ))}
          </div>
        )}
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((group) => {
            const cover = group.items.find((item) => item.type === "image") ?? group.items[0];
            const hasVideo = group.items.some((item) => item.type === "video");
            return (
              <button
                key={group.key}
                type="button"
                onClick={() => onOpen(group)}
                className="group overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-left transition hover:-translate-y-1 hover:border-cyan-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                  <div className="h-full w-full transition duration-500 group-hover:scale-105">
                    <MediaTile item={cover} />
                  </div>
                  {hasVideo && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-950/80 px-2.5 py-1 text-xs text-white backdrop-blur">
                      <Play className="h-3 w-3 fill-current" /> Animation
                    </span>
                  )}
                </div>
                <div className="p-4">
                  {group.tag && <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">{tagLabel(group.tag)}</p>}
                  <h4 className="mt-1 text-lg font-semibold text-white">{group.detail?.title ?? group.title}</h4>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-400">{group.detail?.summary}</p>
                  <span className="mt-4 inline-block text-xs uppercase tracking-[0.18em] text-cyan-300">
                    {group.items.length} {group.items.length === 1 ? "file" : "files"} · View work
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-6 text-sm text-slate-400">
          New work in this category is on the way.
        </div>
      )}

      {section.previewOnly && filtered.length > PREVIEW_LIMIT && section.viewAllHref && (
        <div className="mt-6">
          <Link
            href={section.viewAllHref}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-300/10 px-5 py-2.5 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/20"
          >
            View all {filtered.length} <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default function CreativeWorkExplorer({ sections }: Readonly<{ sections: Section[] }>) {
  const [selected, setSelected] = useState<CreativeGroup | null>(null);
  const [index, setIndex] = useState(0);

  const close = useCallback(() => {
    setSelected(null);
    setIndex(0);
  }, []);

  const step = useCallback(
    (direction: number) => {
      if (!selected) return;
      setIndex((current) => (current + direction + selected.items.length) % selected.items.length);
    },
    [selected],
  );

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [selected, close, step]);

  const current = selected?.items[index];

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <SectionBlock
          key={section.title}
          section={section}
          onOpen={(group) => {
            setSelected(group);
            setIndex(0);
          }}
        />
      ))}

      {selected && current && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/95 p-4 backdrop-blur-md md:p-8" role="dialog" aria-modal="true" aria-label={selected.detail?.title ?? selected.title}>
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{selected.tag ? tagLabel(selected.tag) : "Creative work"}</p>
                <h3 className="mt-2 text-3xl font-semibold text-white">{selected.detail?.title ?? selected.title}</h3>
              </div>
              <button type="button" onClick={close} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-slate-100" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
              <div>
                <div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-black">
                  {current.type === "video" ? (
                    <video key={current.path} src={current.path} poster={current.poster} controls autoPlay muted loop playsInline className="max-h-[70vh] w-full" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={current.path} src={current.path} alt={current.name} className="max-h-[70vh] w-full object-contain" />
                  )}

                  {selected.items.length > 1 && (
                    <>
                      <button type="button" onClick={() => step(-1)} aria-label="Previous" className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/90 text-white">
                        <ChevronLeft />
                      </button>
                      <button type="button" onClick={() => step(1)} aria-label="Next" className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/90 text-white">
                        <ChevronRight />
                      </button>
                    </>
                  )}
                </div>

                {selected.items.length > 1 && (
                  <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                    {selected.items.map((item, itemIndex) => (
                      <button
                        key={`${item.name}-${itemIndex}`}
                        type="button"
                        onClick={() => setIndex(itemIndex)}
                        aria-label={`Show ${item.name}`}
                        className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition ${itemIndex === index ? "border-cyan-300" : "border-slate-700 opacity-60 hover:opacity-100"}`}
                      >
                        <MediaTile item={item} />
                        {item.type === "video" && <Play className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 fill-white text-white" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-slate-300">
                {selected.detail?.summary && <p className="text-lg leading-8 text-white">{selected.detail.summary}</p>}
                {selected.detail?.content && <p className="mt-5 whitespace-pre-line leading-7">{selected.detail.content}</p>}
                {selected.detail && selected.detail.tools.length > 0 && (
                  <div className="mt-6">
                    <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">Made with</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.detail.tools.map((tool) => (
                        <span key={tool} className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'@

Write-File 'portfolio\app\components\Footer.tsx' @'
import { ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-800 py-10">
      <div className="section-shell flex flex-col items-center justify-between gap-4 text-sm text-slate-400 md:flex-row">
        <p>&copy; {new Date().getFullYear()} Mojolaoluwa Olanusi. Designed and built by me with Next.js and Tailwind CSS.</p>
        <a href="#top" className="inline-flex items-center gap-2 transition hover:text-white">
          Back to top <ArrowUp className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
}
'@

Write-File 'portfolio\app\components\Hero.tsx' @'
import { ArrowDown } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { getSiteStats, profile, safeArray, safeText, skills } from "@/lib/content";
import Stats from "./Stats";

export default function Hero() {
  const location = safeText(profile.location, "Ibadan, Nigeria");
  const status = safeText(profile.status, "Available for collaborations");
  const name = safeText(profile.name, "Mojolaoluwa Olanusi");
  const role = safeText(profile.role, "Full-Stack Developer");
  const headline = safeText(profile.headline);
  const github = safeText(profile.github);
  const linkedin = safeText(profile.linkedin);
  const stats = getSiteStats();

  const marquee = [...safeArray(skills.frontend), ...safeArray(skills.backend), ...safeArray(skills.data), ...safeArray(skills.creative)];

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-10 pt-28 text-center">
      <div className="grid-pattern absolute inset-0 opacity-40" />
      <div className="orb -left-24 top-24 h-80 w-80 bg-violet-600" />
      <div className="orb -right-24 bottom-32 h-72 w-72 bg-cyan-500" style={{ animationDelay: "-6s" }} />

      <div className="section-shell relative z-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {status}
          </div>

          <h1 className="text-5xl font-black tracking-tight text-white md:text-7xl">{name}</h1>

          <p className="mt-4 text-2xl font-medium md:text-3xl">
            <span className="text-gradient">{role}</span>
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">{headline}</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5">{location}</span>
            <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5">React · TypeScript · Node.js</span>
            <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5">Blender · 3D · Design</span>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#projects" className="rounded-full bg-violet-500 px-6 py-3 font-medium text-white shadow-lg shadow-violet-500/25 transition hover:bg-violet-400">
              View projects
            </a>
            <a href="#creative" className="rounded-full border border-slate-600 bg-slate-900/60 px-6 py-3 font-medium text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200">
              See creative work
            </a>
            {github && (
              <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub" className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 text-slate-200 transition hover:border-violet-400 hover:text-white">
                <FaGithub className="h-5 w-5" />
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 text-slate-200 transition hover:border-violet-400 hover:text-white">
                <FaLinkedinIn className="h-5 w-5" />
              </a>
            )}
          </div>

          <div className="mt-14">
            <Stats
              stats={[
                { label: "Production apps", value: stats.projects },
                { label: "Years building", value: stats.years, suffix: "+" },
                { label: "3D & design pieces", value: stats.creative },
                { label: "Technologies", value: stats.technologies, suffix: "+" },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="marquee-mask relative z-10 mt-14 w-full max-w-5xl overflow-hidden" aria-hidden="true">
        <div className="marquee-track gap-3">
          {[...marquee, ...marquee].map((item, index) => (
            <span key={`${item}-${index}`} className="mr-3 whitespace-nowrap rounded-full border border-slate-800 bg-slate-900/60 px-4 py-1.5 text-sm text-slate-400">
              {item}
            </span>
          ))}
        </div>
      </div>

      <ArrowDown className="relative z-10 mt-10 h-6 w-6 animate-bounce text-slate-500" />
    </section>
  );
}
'@

Write-File 'portfolio\app\components\Navbar.tsx' @'
"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

type NavLink = { label: string; href: string };

export default function Navbar({ links }: Readonly<{ links: NavLink[] }>) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const link of links) {
      const element = document.getElementById(link.href.replace("#", ""));
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [links]);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b transition ${
        scrolled || open ? "border-slate-800/80 bg-slate-950/85 backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <div className="section-shell flex items-center justify-between py-4">
        <a href="#top" className="flex items-center gap-2.5 text-lg font-bold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold tracking-tight text-white ring-1 ring-violet-300/40">
            MO
          </span>
          <span>
            Mojola<span className="text-gradient">oluwa</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 text-sm md:flex">
          {links.map((item) => {
            const isActive = active === item.href.replace("#", "");
            return (
              <a
                key={item.href}
                href={item.href}
                className={`rounded-full px-3.5 py-1.5 transition ${
                  isActive ? "bg-violet-500/15 text-violet-100" : "text-slate-300 hover:text-violet-200"
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <a href="#contact" className="ml-2 rounded-full bg-violet-500 px-4 py-1.5 font-medium text-white transition hover:bg-violet-400">
            Hire me
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-slate-100 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="section-shell flex flex-col gap-1 pb-4 md:hidden">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-slate-200 transition hover:bg-slate-900"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
'@

Write-File 'portfolio\app\components\PortfolioMotion.tsx' @'
"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type PortfolioMotionProps = Readonly<{ children: ReactNode }>;

export default function PortfolioMotion({ children }: PortfolioMotionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("section", containerRef.current).forEach((section, index) => {
        if (index === 0) return;
        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: { trigger: section, start: "top 90%", once: true },
          },
        );
      });
    }, containerRef);

    return () => context.revert();
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
'@

Write-File 'portfolio\app\components\ProjectShowcase.tsx' @'
"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

type ProjectShowcaseProps = Readonly<{
  title: string;
  live?: string;
  screens: string[];
}>;

function hostname(url?: string) {
  if (!url) return "preview";
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export default function ProjectShowcase({ title, live, screens }: ProjectShowcaseProps) {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const usable = screens.filter((src) => !failed.includes(src));
  const current = usable[Math.min(active, Math.max(usable.length - 1, 0))];

  const frame = current ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={`${title} screenshot`}
      loading="lazy"
      onError={() => setFailed((list) => [...list, current])}
      className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
    />
  ) : (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-violet-600/30 via-slate-900 to-cyan-600/20 text-center">
      <span className="text-6xl font-black text-white/90">{title.slice(0, 1)}</span>
      <span className="text-sm text-slate-300">Screenshot coming soon. Open the live app instead.</span>
    </div>
  );

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-violet-950/40">
        <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-950 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-3 truncate rounded-md bg-slate-900 px-3 py-1 text-xs text-slate-400">{hostname(live)}</span>
        </div>

        {live ? (
          <a href={live} target="_blank" rel="noreferrer" className="group relative block aspect-[16/10] overflow-hidden" aria-label={`Open ${title}`}>
            {frame}
            <span className="absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition group-hover:bg-slate-950/50 group-hover:opacity-100">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                Open live app <ArrowUpRight className="h-4 w-4" />
              </span>
            </span>
          </a>
        ) : (
          <div className="group aspect-[16/10] overflow-hidden">{frame}</div>
        )}
      </div>

      {usable.length > 1 && (
        <div className="mt-3 flex gap-3">
          {usable.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show screenshot ${index + 1}`}
              className={`h-16 w-24 overflow-hidden rounded-lg border transition ${
                index === active ? "border-violet-400" : "border-slate-700 opacity-60 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
'@

Write-File 'portfolio\app\components\Projects.tsx' @'
import { ArrowUpRight, Check } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { parseBody, projects, safeArray, safeText } from "@/lib/content";
import ProjectShowcase from "./ProjectShowcase";

export default function Projects() {
  return (
    <section id="projects" className="py-24">
      <div className="section-shell">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-violet-300">Selected work</p>
        <h2 className="mb-4 max-w-3xl text-3xl font-bold text-white md:text-4xl">Three production apps, built end to end</h2>
        <p className="mb-14 max-w-2xl text-lg leading-8 text-slate-300">
          Each project below is live, deployed and open to try. I designed the schema, built the API and the interface, wrote the tests and shipped it.
        </p>

        <div className="space-y-16">
          {projects.map((project, index) => {
            const { intro, sections } = parseBody(project.content);
            const highlights = sections.find((section) => section.title.toLowerCase() === "highlights")?.items ?? [];
            const engineering = sections.find((section) => section.title.toLowerCase() === "under the hood")?.items ?? [];
            const stack = safeArray(project.stack);
            const live = safeText(project.live);
            const github = safeText(project.github);
            const meta = [safeText(project.role), safeText(project.duration), safeText(project.status)].filter(Boolean);

            const story = [
              { label: "The problem", text: safeText(project.problem) },
              { label: "How I built it", text: safeText(project.process) },
              { label: "The outcome", text: safeText(project.result) },
            ].filter((item) => item.text);

            return (
              <article key={project.slug} className="glass-panel rounded-3xl p-6 md:p-10">
                <div className="grid items-start gap-10 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <ProjectShowcase title={safeText(project.title, "Project")} live={live || undefined} screens={project.screens.map((screen) => screen.path)} />
                  </div>

                  <div className="lg:col-span-5">
                    <p className="text-sm font-semibold tabular-nums text-violet-300/80">
                      {String(index + 1).padStart(2, "0")} · {safeText(project.kind, "Project")}
                    </p>
                    <h3 className="mt-2 text-4xl font-bold text-white">{safeText(project.title, "Project")}</h3>
                    <p className="mt-4 text-lg leading-8 text-slate-300">{safeText(project.summary)}</p>
                    {intro && <p className="mt-4 text-sm leading-7 text-slate-400">{intro}</p>}

                    {meta.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {meta.map((item) => (
                          <span key={item} className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-200">
                            {item}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-7 flex flex-wrap items-center gap-3">
                      {live && (
                        <a href={live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-400">
                          Live demo <ArrowUpRight className="h-4 w-4" />
                        </a>
                      )}
                      {github && (
                        <a href={github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-600 px-5 py-2.5 text-sm font-medium text-slate-100 transition hover:border-violet-400 hover:text-white">
                          <FaGithub className="h-4 w-4" aria-hidden="true" /> Source code
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {story.length > 0 && (
                  <div className="mt-10 grid gap-6 border-t border-slate-800 pt-8 lg:grid-cols-3">
                    {story.map((item, storyIndex) => (
                      <div key={item.label}>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                          {storyIndex + 1}. {item.label}
                        </p>
                        <p className="text-sm leading-7 text-slate-300">{item.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {(highlights.length > 0 || engineering.length > 0) && (
                  <div className="mt-10 grid gap-8 border-t border-slate-800 pt-8 lg:grid-cols-2">
                    {[
                      { title: "What it does", items: highlights },
                      { title: "Under the hood", items: engineering },
                    ]
                      .filter((group) => group.items.length > 0)
                      .map((group) => (
                        <div key={group.title}>
                          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">{group.title}</h4>
                          <ul className="space-y-3">
                            {group.items.map((item) => (
                              <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300">
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                )}

                {stack.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-800 pt-6">
                    {stack.map((item) => (
                      <span key={`${project.slug}-${item}`} className="rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-200">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
'@

Write-File 'portfolio\app\components\Stats.tsx' @'
"use client";

import { useEffect, useRef } from "react";

type Stat = { label: string; value: number; suffix?: string };

export default function Stats({ stats }: Readonly<{ stats: Stat[] }>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const counters = container.querySelectorAll<HTMLElement>("[data-count]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          observer.unobserve(element);
          const target = Number(element.dataset.count);
          if (reduceMotion) {
            element.textContent = String(target);
            continue;
          }
          const start = performance.now();
          const duration = 1400;
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            element.textContent = String(Math.round(target * (1 - Math.pow(1 - progress, 3))));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.6 },
    );

    counters.forEach((counter) => observer.observe(counter));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="mx-auto grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-4 text-center">
          <div className="text-3xl font-black text-white">
            <span data-count={stat.value}>{stat.value}</span>
            {stat.suffix}
          </div>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
'@

Write-File 'portfolio\app\components\TechStack.tsx' @'
import { safeArray, skills } from "@/lib/content";

const groups: Array<{ key: string; label: string; accent: string }> = [
  { key: "frontend", label: "Frontend", accent: "border-violet-400/30 bg-violet-500/10 text-violet-100" },
  { key: "backend", label: "Backend", accent: "border-cyan-400/30 bg-cyan-500/10 text-cyan-100" },
  { key: "data", label: "Data & storage", accent: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100" },
  { key: "quality", label: "Testing & tooling", accent: "border-amber-400/30 bg-amber-500/10 text-amber-100" },
  { key: "cloud", label: "Cloud & deployment", accent: "border-sky-400/30 bg-sky-500/10 text-sky-100" },
  { key: "creative", label: "Creative", accent: "border-pink-400/30 bg-pink-500/10 text-pink-100" },
];

export default function TechStack() {
  return (
    <section id="tech" className="py-24">
      <div className="section-shell">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">Tech stack</p>
        <h2 className="mb-12 max-w-3xl text-3xl font-bold text-white md:text-4xl">The tools I use to build, test, ship and design</h2>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => {
            const items = safeArray(skills[group.key]);
            if (items.length === 0) return null;
            return (
              <div key={group.key} className="glass-panel rounded-2xl p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">{group.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span key={item} className={`rounded-full border px-3 py-1.5 text-sm font-medium ${group.accent}`}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
'@

Write-File 'portfolio\app\creative-works\[category]\page.tsx' @'
import Link from "next/link";
import { notFound } from "next/navigation";
import CreativeWorkExplorer from "@/app/components/CreativeWorkExplorer";
import { creativeSections, getCreativeGroups } from "@/app/components/CreativeWork";

export function generateStaticParams() {
  return creativeSections.map((section) => ({ category: section.category }));
}

export async function generateMetadata({ params }: PageProps<"/creative-works/[category]">) {
  const { category } = await params;
  const section = creativeSections.find((item) => item.category === category);
  return { title: section ? section.title : "Creative work" };
}

export default async function CreativeCategoryPage({ params }: PageProps<"/creative-works/[category]">) {
  const { category } = await params;
  const section = creativeSections.find((item) => item.category === category);
  if (!section) notFound();

  return (
    <main className="min-h-screen px-4 pb-20 pt-28">
      <div className="section-shell">
        <Link href="/#creative" className="mb-8 inline-flex items-center text-sm text-cyan-200 hover:text-white">
          ← Back to portfolio
        </Link>
        <div className="mb-10">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-cyan-300">Creative work</p>
          <h1 className="text-4xl font-bold text-white">{section.title}</h1>
          <p className="mt-3 text-slate-300">{section.subtitle}</p>
        </div>
        <CreativeWorkExplorer sections={[{ title: section.title, subtitle: section.subtitle, groups: getCreativeGroups(section.category) }]} />
      </div>
    </main>
  );
}
'@

Write-File 'portfolio\app\globals.css' @'
@import "tailwindcss";
@tailwind utilities;

:root {
  --brand: #8b5cf6;
  --brand-soft: rgba(139, 92, 246, 0.12);
  --surface: rgba(15, 23, 42, 0.8);
  --line: rgba(148, 163, 184, 0.18);
}

html {
  scroll-behavior: smooth;
}

body {
  @apply bg-slate-950 text-slate-100 antialiased;
  background-image: radial-gradient(circle at top, rgba(139, 92, 246, 0.18), transparent 30%),
    radial-gradient(circle at bottom left, rgba(34, 211, 238, 0.12), transparent 30%);
  font-family: var(--font-geist-sans), sans-serif;
}

* {
  box-sizing: border-box;
}

::selection {
  background: rgba(139, 92, 246, 0.45);
  color: white;
}

section {
  position: relative;
}

section[id] {
  scroll-margin-top: 5rem;
}

.section-shell {
  @apply mx-auto max-w-6xl px-4 sm:px-6 lg:px-8;
}

.glass-panel {
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.34);
  backdrop-filter: blur(10px);
}

.text-gradient {
  background: linear-gradient(135deg, #c4b5fd 0%, #67e8f9 45%, #f9a8d4 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.grid-pattern {
  background-image: linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
}

.orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(80px);
  opacity: 0.35;
  animation: float 14s ease-in-out infinite;
}

.marquee-mask {
  mask-image: linear-gradient(90deg, transparent, black 12%, black 88%, transparent);
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 45s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

@keyframes float {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(30px, -40px, 0) scale(1.08); }
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .orb, .marquee-track { animation: none; }
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.35);
  border-radius: 9999px;
}
'@

Write-File 'portfolio\app\layout.tsx' @'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const siteUrl = "https://mojolaoluwa.vercel.app";
const description =
  "Portfolio of Mojolaoluwa Olanusi, a full-stack developer building real-time web apps with React, TypeScript, Node.js and PostgreSQL, plus 3D, graphic design and video work.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Mojolaoluwa Olanusi | Full-Stack Developer & 3D Artist", template: "%s | Mojolaoluwa Olanusi" },
  description,
  keywords: ["full-stack developer", "React", "TypeScript", "Node.js", "PostgreSQL", "Blender", "portfolio", "Nigeria"],
  authors: [{ name: "Mojolaoluwa Olanusi", url: siteUrl }],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Mojolaoluwa Olanusi",
    title: "Mojolaoluwa Olanusi | Full-Stack Developer & 3D Artist",
    description,
  },
  twitter: { card: "summary_large_image", title: "Mojolaoluwa Olanusi | Full-Stack Developer", description },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/icon.svg",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mojolaoluwa Olanusi",
  jobTitle: "Full-Stack Developer",
  url: siteUrl,
  address: { "@type": "PostalAddress", addressLocality: "Ibadan", addressCountry: "NG" },
  sameAs: ["https://github.com/MojolaoluwaOlanusi", "https://www.linkedin.com/in/mojolaoluwa-olanusi"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-slate-950 text-white">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        {children}
      </body>
    </html>
  );
}
'@

Write-File 'portfolio\app\page.tsx' @'
import About from "./components/About";
import Certificates from "./components/Certificates";
import Contact from "./components/Contact";
import CreativeWork from "./components/CreativeWork";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import PortfolioMotion from "./components/PortfolioMotion";
import Projects from "./components/Projects";
import TechStack from "./components/TechStack";
import { certificates } from "@/lib/content";

export default function Home() {
  const links = [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Stack", href: "#tech" },
    { label: "Creative", href: "#creative" },
    ...(certificates.length > 0 ? [{ label: "Certificates", href: "#certificates" }] : []),
    { label: "Contact", href: "#contact" },
  ];

  return (
    <main id="top" className="min-h-screen">
      <Navbar links={links} />
      <PortfolioMotion>
        <Hero />
        <About />
        <Projects />
        <TechStack />
        <CreativeWork />
        {certificates.length > 0 && <Certificates />}
        <Contact />
        <Footer />
      </PortfolioMotion>
    </main>
  );
}
'@

Write-File 'portfolio\app\robots.ts' @'
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://mojolaoluwa.vercel.app/sitemap.xml",
  };
}
'@

Write-File 'portfolio\app\sitemap.ts' @'
import type { MetadataRoute } from "next";

const siteUrl = "https://mojolaoluwa.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteUrl, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...["3d", "graphic-design", "video-editing"].map((category) => ({
      url: `${siteUrl}/creative-works/${category}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
'@

Write-File 'portfolio\content\about.md' @'
---
title: About Me
---
I'm a full-stack developer based in Ibadan, Nigeria, and I build products end to end: database schema, API, interface, tests and deployment. I've shipped three production apps on my own: a real-time social network, a Kanban workspace with AI-assisted planning, and a movie discovery platform.

I care about the layer users never see: caching and pub/sub so real-time features hold up under load, presigned uploads so media never touches the server, and test suites that stop fixed bugs from coming back. I'm just as particular about the layer they do see, like spacing, motion and hierarchy.

Away from the editor I model, light and render in Blender (with Adobe Substance 3D for materials), and I design graphics and edit video. That visual training shapes how I build interfaces, and it's why the creative work below sits next to the code.

I'm studying towards a BSc in Software Engineering at Obafemi Awolowo University and looking for an internship or junior role where I can contribute to a real codebase, as well as freelance and collaborative projects.

## Pillars
- Full-stack engineering - React, TypeScript, Node.js, PostgreSQL and MongoDB, from schema to deployment.
- Real-time systems - WebSockets, Redis pub/sub, background queues and web push notifications.
- Creative craft - 3D modelling and rendering, graphic design and video editing.
'@

Write-File 'portfolio\content\certificates\product-design.md' @'
---
hidden: true
title: Product Design Fundamentals
summary: Built a practical foundation in user-centered design, visual hierarchy, and product thinking.
issuer: Self-driven learning / personal mentorship
---
Set hidden to false (or delete that line) once you have a real certificate to show. Add `credentialUrl:` and `picture:` too.
'@

Write-File 'portfolio\content\creative-works\3d\archviz\backrooms.md' @'
---
title: Backrooms
summary: A liminal-space environment inspired by the "Backrooms" internet horror idea: endless rooms, flat fluorescent light and an uneasy sense of emptiness.
media: [3d/archviz/Backrooms.png]
tools: [Blender]
order: 10
---
An atmospheric study in how little it takes to make a space feel wrong. The scene leans on repetition, a monotone palette and harsh overhead lighting to create that familiar-yet-off liminal mood.

Focus: composition, lighting and mood rather than detail.
'@

Write-File 'portfolio\content\creative-works\3d\archviz\bathroom-scene.md' @'
---
title: Bathroom Scene
summary: An architectural visualisation study focused on space, materials and atmosphere.
media: [3d/archviz/Bathroom-scene-01.png]
tools: [Blender]
order: 14
---
An interior study centred on tile, glass and ceramic surfaces, where the challenge is getting reflections and soft light to feel physically convincing.
'@

Write-File 'portfolio\content\creative-works\3d\archviz\kitchen.md' @'
---
title: Kitchen
summary: An interior visualisation of a kitchen, focused on composition, natural lighting and believable materials.
media: [3d/archviz/Kitchen-01.png]
tools: [Blender]
order: 11
---
A clean interior scene built to practise realistic light behaviour and material response: reflective worktops, soft shadows and a composition that reads like an architectural photograph.
'@

Write-File 'portfolio\content\creative-works\3d\archviz\stair-scene.md' @'
---
title: Stair Scene
summary: An architectural study of a subway-station stairwell, presented from two camera angles.
media: [3d/archviz/Stair-Scene-01.png, 3d/archviz/Stair-Scene-02.png]
tools: [Blender]
order: 12
---
Two views of the same space to explore how camera position changes the feel of a scene. The stairwell's repeating forms, tiling and lighting make it a good test of perspective and material detail.
'@

Write-File 'portfolio\content\creative-works\3d\archviz\subway-corridor.md' @'
---
title: Subway Corridor
summary: A subway corridor environment focused on perspective, lighting and atmosphere, built while following a tutorial by Andrew Price.
media: [3d/archviz/Subway-corridor-01.png]
tools: [Blender]
order: 13
---
Built while following Andrew Price's (Blender Guru) tutorial to learn environment modelling, tiled materials and moody lighting. A study piece that sharpened the techniques used in the other archviz scenes.
'@

Write-File 'portfolio\content\creative-works\3d\models\donut.md' @'
---
title: Donut
summary: A classic 3D modelling and animation study exploring form, shading and motion.
media: [3d/models/Donut-01.png, 3d/models/Donut-animation-01.mp4]
tools: [Blender]
order: 24
---
The rite-of-passage donut: modelling, shading and a short animation, used to learn the fundamentals of the 3D pipeline from mesh to render.
'@

Write-File 'portfolio\content\creative-works\3d\models\ray-ban.md' @'
---
title: Ray-Ban Smart Glasses
summary: A product model inspired by Meta's Ray-Ban smart glasses, shown as a still render and a short animation.
media: [3d/models/Ray-Ban-01.png, 3d/models/Ray-Ban-animation-01.mp4]
tools: [Blender]
order: 20
---
A hard-surface product study: clean forms, accurate proportions and glossy frame materials, with a short animation to show the model from every side.
'@

Write-File 'portfolio\content\creative-works\3d\models\soborg-chair.md' @'
---
title: Soborg Chair
summary: A furniture modelling and rendering study focused on proportion, texture and presentation, with an animated turntable.
media: [3d/models/Soborg-Chair-01.png, 3d/models/Soborg-Chair-animation-01.mp4]
tools: [Blender]
order: 21
---
Recreating a classic chair design to practise proportion, curved forms and material realism, then presenting it as a still and an animation.
'@

Write-File 'portfolio\content\creative-works\3d\models\teddy-bear.md' @'
---
title: Teddy Bear
summary: A stylised 3D character modelling and material study.
media: [3d/models/Teddy-Bear-01.png]
tools: [Blender]
order: 23
---
A character-style model exploring organic shapes, soft fur-like materials and a friendly, readable silhouette.
'@

Write-File 'portfolio\content\creative-works\3d\models\zanotta-williams-couch.md' @'
---
title: Zanotta Williams Couch
summary: A furniture modelling and rendering study focused on proportion, soft forms and fabric texture.
media: [3d/models/Zanotta-Williams-Couch-01.png, 3d/models/Zanotta-Williams-Couch-02.png]
tools: [Blender]
order: 22
---
A sofa study where the main challenge is soft, believable upholstery: cushion shapes, stitching and fabric response to light. Shown from two angles.
'@

Write-File 'portfolio\content\creative-works\3d\product-renders\chanel-no-5.md' @'
---
title: Chanel No.5
summary: A product render study built around elegant composition, glass and metal materials and lighting.
media: [3d/product-renders/Chanel-No-5.png]
tools: [Blender]
order: 30
---
A luxury-product look: transparent glass, liquid, reflective highlights and controlled lighting, composed the way a fragrance advertisement would be.
'@

Write-File 'portfolio\content\creative-works\graphic-design\nike-edit.md' @'
---
title: Nike Shoe and Text Template
summary: A reusable poster layout that blends a product shot with oversized brand typography.
order: 40
---
A product-and-typography template: the shoe sits in and around the brand name so the two read as one composition. The background and lettering style can be swapped for any product or brand.
'@

Write-File 'portfolio\content\profile.md' @'
---
name: Mojolaoluwa Olanusi
role: Full-Stack Developer & 3D Artist
headline: I build real-time, production-ready web apps, and craft the 3D and visual work that makes them memorable.
location: Ibadan, Nigeria
since: 2024
email: olanusimojola@gmail.com
github: https://github.com/MojolaoluwaOlanusi
linkedin: https://www.linkedin.com/in/mojolaoluwa-olanusi
x: https://x.com/mojola1132811
whatsapp: https://wa.me/2348083759076
status: Open to internships, freelance work and collaborations
---
Full-stack developer with a creative edge: I own products end to end, from database schema and API to interface, tests and deployment.
'@

Write-File 'portfolio\content\projects\reeli.md' @'
---
title: Reeli
kind: Movie and TV discovery
summary: A fast movie, TV and anime discovery app with live search, trailers, watch-provider info and personalised regional picks, built on the TMDB API.
role: Solo full-stack developer
status: Live
live: https://reeli-movies.vercel.app
github: https://github.com/MojolaoluwaOlanusi/Reeli
screens: [reeli.png]
problem: Finding something to watch was a chore. Every streaming site wanted me to sign in before showing me a title, and the free ones buried search under ten navigation layers. I wanted the opposite: type a title, cast member or genre and see real results in under a second, with the trailer, cast, rating and where to watch already on the page instead of three tabs away.
process: I rebuilt my first movie app from scratch as a discovery product instead of a catalogue. I moved the TMDB calls behind an Express API layer so keys never reach the browser, kept the client on React and Vite for fast rendering, and used Appwrite for Google sign-in and a per-user interaction table protected by row-level security. Those interactions feed a weighted ranking that pushes what you actually watch above what is merely popular in your region, and it falls back to regional TMDB popularity until you have any history.
result: Reeli now answers "what should I watch next" in one screen. Live search covers titles, cast and crew, title pages are shareable at stable routes, and the regional Top Picks board personalises itself from real behaviour. The rewrite also fixed the caching and cold-start issues that made the old version feel sluggish on mobile data.
featured: false
order: 3
stack: [React, Vite, React Router, Tailwind CSS, Node.js, Express, TMDB API, AniList GraphQL, Appwrite, Vercel]
---
Reeli is a movie and TV discovery experience built around a single question: what should I watch next? It replaces browsing with searching, and puts the trailer, cast and where-to-watch on the same page.

## Highlights
- Live search across titles, cast and crew
- Personalised "Top Picks" that weight watch-provider clicks above page views and favour recent activity
- Genre shelves, shareable title routes, trailers and watch-provider details
- Anime enrichment through the AniList GraphQL API
- Light and dark themes with preferences saved in the browser

## Under the hood
- Express layer proxies TMDB server-side, keeping API credentials out of the browser bundle
- Google sign-in via Appwrite, with per-user data protected by row-level security
- Regional TMDB popularity as a fallback ranking for new users
- Static-friendly front end on Vercel with a thin API for the TMDB calls
'@

Write-File 'portfolio\content\projects\snitch.md' @'
---
title: Snitch
kind: Real-time social platform
summary: A full-stack social network with live chat, posts and reposts, push notifications, full-text search, media uploads and a separate admin dashboard, built to scale past a single server.
role: Solo full-stack developer
status: Live PWA
duration: About 6 months
live: https://snitch-social-frontend.vercel.app
github: https://github.com/MojolaoluwaOlanusi/Snitch
screens: [snitch.png]
problem: Social apps usually trade away the thing that makes them social. Every platform I used asked for my data before it showed me a conversation, and none of them held up when traffic arrived. I wanted to prove that a real-time social product could be built on infrastructure that scales without a monolith, and that messaging, publishing and moderation could share one backend cleanly.
process: The backend is Express and MongoDB Atlas, with Redis handling caching and pub/sub so WebSocket messages reach users on any backend instance without hammering the database. Media goes straight from the browser to Cloudflare R2 through presigned URLs, so large files bypass the server and cost nothing in egress, and BullMQ queues handle background jobs. Full-text search covers users, posts and hashtags, notifications use Web Push, and the admin dashboard lives as its own app. I deployed the front end and admin to Vercel and the API to Fly.io.
result: Snitch shipped as a working PWA that holds real-time messaging, posting, reposting and search together, with an admin dashboard for moderation and analytics. It is the project I point to when I talk about shipping production infrastructure, and it taught me to work faster with AI tooling while still reviewing everything I take from it.
featured: true
order: 2
stack: [React, TypeScript, Vite, Node.js, Express, MongoDB Atlas, Redis, Socket.IO, BullMQ, Cloudflare R2, Web Push, Tailwind CSS, Zustand, Framer Motion, Vercel, Fly.io]
---
Snitch is a full-stack social media PWA built around real-time conversation and content sharing. It is the largest project I have shipped, and the one that pushed me from writing features to designing the systems underneath them.

## Highlights
- Real-time chat with typing indicators, read receipts and reactions
- Posts, reposts, an algorithmic feed and user discovery
- Group conversations and rich media uploads
- Web Push notifications that reach users when the app is closed
- Full-text search across users, posts and hashtags
- Separate admin dashboard for user management, content moderation and platform analytics

## Under the hood
- Redis Pub/Sub keeps chat in sync across multiple backend instances
- Presigned Cloudflare R2 uploads: direct browser-to-storage, zero server bandwidth
- BullMQ queues for background jobs
- JWT authentication and rate limiting on the API
- Three apps (client, admin, API) with shared TypeScript conventions
- Frontend and admin on Vercel, API on Fly.io
'@

Write-File 'portfolio\content\projects\tudu.md' @'
---
title: Tudu
kind: Collaborative task workspace
summary: An open-source Kanban workspace on the PERN stack, with real-time sync, AI task breakdown, natural-language capture, a Pomodoro timer, analytics and a public REST API.
role: Solo full-stack developer
status: Live, open source (AGPL-3.0)
live: https://tudu-kanban.vercel.app
github: https://github.com/MojolaoluwaOlanusi/Tudu
screens: [tudu.png]
problem: Todo apps track tasks but they do not help you finish them. Mine either became a write-only list or a rigid tracker that broke the moment a task was not a single checkbox. I wanted a workspace where a rough idea could become an organised plan: type "ship the landing page friday 3pm #work" and have it parsed into a real task with a due date and priority, then move it across a board as I actually work.
process: I treated this as an engineering project rather than a CRUD exercise. The API is Express on PostgreSQL (raw SQL, no ORM) with JWT auth and Google and GitHub OAuth, and a Socket.IO server on the same HTTP server pushes updates into per-user rooms so a board updates on every open device instantly. The React and Vite client sits on TanStack Query and Zustand, with dnd-kit for the board and Chart.js for analytics. I wrote the tests as part of the build: Jest and Supertest on the API, Vitest on components, integration tests against a real Postgres instance, and Playwright end-to-end specs, including one that fails if the layout overflows at 320px.
result: Tudu became a real product rather than a demo. Real-time collaboration, shared lists and AI breakdown turn it into a team workspace, the analytics dashboard shows completion rate and time spent instead of a bare task count, and the Playwright suite guards the responsiveness and onboarding bugs I already fixed once. It is released under AGPL-3.0 with self-hosting docs.
featured: true
order: 1
stack: [React, TypeScript, Vite, Node.js, Express, PostgreSQL, Socket.IO, TanStack Query, Zustand, Tailwind CSS, dnd-kit, Chart.js, Zod, Playwright, Vitest, Jest, Vercel, Render, Neon]
---
Tudu is a Kanban task workspace with a brush-stroke aesthetic, built to show range across a full PERN stack: authentication, real-time collaboration, AI-assisted planning, focus tooling, analytics and a public API, with a test suite treated as part of the product rather than an afterthought.

## Highlights
- Drag-and-drop Kanban boards with multi-card dragging and live synchronisation across devices
- Natural-language quick capture: "ship the landing page friday 3pm #work" becomes a dated, prioritised task
- AI task breakdown into sub-tasks with pluggable providers (Gemini, Groq or local Ollama)
- Pomodoro timer that keeps counting in the background, plus an analytics dashboard with completion rate and time spent
- Shared lists, invitations by email and an activity log of every action
- Installable PWA with offline caching and browser push notifications

## Under the hood
- Public REST API (/api/v1) with personal access tokens, Zod validation and rate limiting
- Outbound webhooks with signature verification and a 6-attempt retry policy
- GitHub and Slack integrations and Paystack subscription billing
- Postgres connection pool with raw SQL, and Socket.IO layered onto the same HTTP server
- Unit, integration (real Postgres) and Playwright end-to-end tests
- Ed25519-signed offline licence verification for self-hosted installs
'@

Write-File 'portfolio\content\skills.md' @'
---
title: Core Skills
frontend: [React, Next.js, TypeScript, JavaScript, Vite, Tailwind CSS, Zustand, TanStack Query, Framer Motion]
backend: [Node.js, Express, REST APIs, Socket.IO, BullMQ, JWT & OAuth, Zod]
data: [PostgreSQL, MongoDB, Redis, Cloudflare R2, Cloudinary]
quality: [Vitest, Jest, Playwright, Supertest, Git & GitHub]
cloud: [Vercel, Render, Fly.io, Neon]
creative: [Blender, Adobe Substance 3D, Figma, Graphic Design, Video Editing]
---
'@

Write-File 'portfolio\lib\content.ts' @'
import fs from "fs";
import path from "path";

export type MarkdownEntry = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  [key: string]: unknown;
};

export type MediaItem = {
  name: string;
  path: string;
  type: "image" | "video";
  thumb?: string;
  poster?: string;
};

export type CreativeWorkEntry = MarkdownEntry & {
  category: string;
  group: string;
  tools: string[];
  media: MediaItem[];
};

export type ProjectEntry = MarkdownEntry & {
  picture: string;
  screens: MediaItem[];
};

export type BodySection = { title: string; text: string; items: string[] };

const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".webm", ".avi", ".m4v"]);

/* ----------------------------- markdown parsing ---------------------------- */

function cleanValue(value: string): string | boolean | string[] {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) return [];
    return inner
      .split(",")
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean);
  }
  return trimmed;
}

function parseFrontMatter(raw: string) {
  const text = raw.replace(/^\uFEFF/, "");
  const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { data: {} as Record<string, unknown>, content: text.trim() };

  const data: Record<string, unknown> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) continue;
    const key = line.slice(0, separatorIndex).trim();
    if (key) data[key] = cleanValue(line.slice(separatorIndex + 1));
  }
  return { data, content: match[2].trim() };
}

/** Splits a markdown body into an intro plus "## Heading" sections with bullet items. */
export function parseBody(content: string): { intro: string; sections: BodySection[] } {
  const parts = content.split(/^##\s+/m);
  const intro = (parts.shift() ?? "").trim();
  const bullet = /^\s*[-*]\s+/;
  const sections = parts.map((part) => {
    const [titleLine, ...rest] = part.split(/\r?\n/);
    const lines = rest.join("\n").trim().split(/\r?\n/);
    return {
      title: titleLine.trim(),
      items: lines.filter((line) => bullet.test(line)).map((line) => line.replace(bullet, "").trim()),
      text: lines.filter((line) => !bullet.test(line)).join(" ").trim(),
    };
  });
  return { intro, sections };
}

export function safeText(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

export function safeArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

export function readMarkdownFile(filePath: string): MarkdownEntry {
  const absolutePath = path.join(/* turbopackIgnore: true */ process.cwd(), filePath);
  const { data, content } = parseFrontMatter(fs.readFileSync(absolutePath, "utf8"));
  const slug = path.basename(filePath, path.extname(filePath));

  return {
    slug,
    title: safeText(data.title, slug.replace(/[-_]+/g, " ")),
    summary: safeText(data.summary, content.slice(0, 180).replace(/\s+/g, " ")),
    content,
    ...data,
  };
}

export function readMarkdownCollection(directory: string): MarkdownEntry[] {
  const absoluteDirectory = path.join(process.cwd(), "content", directory);
  if (!fs.existsSync(absoluteDirectory)) return [];

  return fs
    .readdirSync(absoluteDirectory)
    .filter((file) => file.endsWith(".md") || file.endsWith(".txt"))
    .sort()
    .map((file) => {
      const { data, content } = parseFrontMatter(fs.readFileSync(path.join(absoluteDirectory, file), "utf8"));
      const slug = path.basename(file, path.extname(file));
      return {
        slug,
        title: safeText(data.title, slug.replace(/[-_]+/g, " ")),
        summary: safeText(data.summary, content.slice(0, 180).replace(/\s+/g, " ")),
        content,
        ...data,
      };
    });
}

/* ------------------------------ media (Cloudinary) ------------------------------ */

export function cloudinaryBase(): string {
  return (process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL ?? "").trim().replace(/\/+$/, "");
}

function stripExtension(value: string) {
  return value.replace(/\.[^./]+$/, "");
}

function encodePath(value: string) {
  return value.split("/").filter(Boolean).map(encodeURIComponent).join("/");
}

export function isVideoFile(fileName: string) {
  return VIDEO_EXTENSIONS.has(path.extname(fileName).toLowerCase());
}

type CloudOptions = { width?: number; kind?: "poster" };

/**
 * Builds an optimised Cloudinary delivery URL (auto format + quality).
 * Public IDs are the file path WITHOUT its extension, e.g. creative-works/3d/models/Donut-01.
 */
export function cloudUrl(folder: string, publicPath: string, options: CloudOptions = {}): string {
  const base = cloudinaryBase();
  if (!base) return "";

  const id = encodePath(`${folder}/${stripExtension(publicPath)}`);

  if (isVideoFile(publicPath)) {
    return options.kind === "poster"
      ? `${base}/video/upload/so_0,f_jpg,q_auto,c_limit,w_900/${id}.jpg`
      : `${base}/video/upload/q_auto/${id}.mp4`;
  }

  const width = options.width ? `,c_limit,w_${options.width}` : "";
  return `${base}/image/upload/f_auto,q_auto${width}/${id}`;
}

export function getProjectScreens(slug: string, names: string[]): MediaItem[] {
  const files = names.length > 0 ? names : [`${slug}.png`];
  const items: MediaItem[] = [];

  for (const file of files) {
    const encoded = encodeURIComponent(file);
    if (fs.existsSync(path.join(process.cwd(), "projects", file))) {
      items.push({ name: file, path: `/media/projects/${encoded}`, type: "image" });
    } else if (fs.existsSync(path.join(process.cwd(), "public", "projects", file))) {
      items.push({ name: file, path: `/projects/${encoded}`, type: "image" });
    } else {
      const remote = cloudUrl("projects", file, { width: 1800 });
      if (remote) items.push({ name: file, path: remote, type: "image" });
    }
  }
  return items;
}

export function getCertificatePreview(certificateSlug: string, filename = `${certificateSlug}.png`): MediaItem {
  const encoded = encodeURIComponent(filename);
  if (fs.existsSync(path.join(process.cwd(), "certificates", filename))) {
    return { name: filename, path: `/media/certificates/${encoded}`, type: "image" };
  }
  return { name: filename, path: cloudUrl("certificate", filename, { width: 1600 }), type: "image" };
}

/* ------------------------------ content collections ------------------------------ */

function readCreativeWorks(directory: string, entries: CreativeWorkEntry[] = [], category = ""): CreativeWorkEntry[] {
  const absoluteDirectory = path.join(process.cwd(), "content", directory);
  if (!fs.existsSync(absoluteDirectory)) return entries;

  const children = fs.readdirSync(absoluteDirectory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));

  for (const child of children) {
    const childPath = path.join(absoluteDirectory, child.name);

    if (child.isDirectory()) {
      readCreativeWorks(path.join(directory, child.name), entries, category || child.name);
      continue;
    }
    if (!child.name.endsWith(".md") && !child.name.endsWith(".txt")) continue;

    const { data, content } = parseFrontMatter(fs.readFileSync(childPath, "utf8"));
    const slug = path.basename(child.name, path.extname(child.name));
    const mediaPaths = safeArray(data.media);
    const segments = mediaPaths[0]?.split("/") ?? [];

    entries.push({
      ...data,
      slug,
      title: safeText(data.title, slug.replace(/[-_]+/g, " ")),
      summary: safeText(data.summary, content.slice(0, 180).replace(/\s+/g, " ")),
      content,
      category,
      group: safeText(data.group, segments.length >= 3 ? segments[1] : ""),
      tools: safeArray(data.tools),
      media: mediaPaths.map((mediaPath): MediaItem => {
        const video = isVideoFile(mediaPath);
        return {
          name: path.basename(mediaPath),
          path: cloudUrl("creative-works", mediaPath, { width: 1800 }) || `/media/${encodePath(mediaPath)}`,
          thumb: video ? undefined : cloudUrl("creative-works", mediaPath, { width: 900 }) || undefined,
          poster: video ? cloudUrl("creative-works", mediaPath, { kind: "poster" }) || undefined : undefined,
          type: video ? "video" : "image",
        };
      }),
    });
  }
  return entries;
}

function entryOrder(entry: MarkdownEntry): number {
  const order = Number(entry.order);
  return Number.isFinite(order) ? order : Number.MAX_SAFE_INTEGER;
}

function readVisibleProjects(): ProjectEntry[] {
  return readMarkdownCollection("projects")
    .filter((project) => project.hidden !== true)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured === true ? -1 : 1;
      const difference = entryOrder(a) - entryOrder(b);
      return difference !== 0 ? difference : safeText(a.title).localeCompare(safeText(b.title));
    })
    .map((project) => {
      const screens = getProjectScreens(project.slug, safeArray(project.screens));
      return { ...project, screens, picture: screens[0]?.path ?? "" };
    });
}

export const profile = readMarkdownFile("content/profile.md");
export const about = readMarkdownFile("content/about.md");
export const skills = readMarkdownFile("content/skills.md");
export const projects = readVisibleProjects();
export const creativeWorks = readCreativeWorks("creative-works").sort((a, b) => {
  const difference = entryOrder(a) - entryOrder(b);
  return difference !== 0 ? difference : a.title.localeCompare(b.title);
});
export const certificates = readMarkdownCollection("certificates").filter((item) => item.hidden !== true);
export const testimonials = readMarkdownCollection("testimonials");

export function getVisibleCreativeWorks(category?: string) {
  return creativeWorks.filter(
    (work) => work.media.length > 0 && !work.slug.includes("template") && (!category || work.category === category),
  );
}

export function getSiteStats() {
  const technologies = new Set(
    Object.values(skills).filter(Array.isArray).flatMap((group) => group as string[]),
  );
  const since = Number(profile.since) || 2024;

  return {
    projects: projects.length,
    years: Math.max(1, new Date().getFullYear() - since),
    creative: getVisibleCreativeWorks().length,
    technologies: technologies.size,
  };
}
'@

Write-File 'portfolio\scripts\check-media.mjs' @'
// Verifies that every media file referenced by your content exists on Cloudinary.
//   npm run media:check
import fs from "node:fs";
import path from "node:path";

const base = (process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL ?? "").replace(/\/+$/, "");
if (!base || base.includes("YOUR_CLOUD_NAME")) {
  console.error("Set NEXT_PUBLIC_CLOUDINARY_BASE_URL in .env.local first (https://res.cloudinary.com/<cloud-name>).");
  process.exit(1);
}

const VIDEO = new Set([".mp4", ".mov", ".webm", ".m4v", ".avi"]);
const enc = (p) => p.split("/").filter(Boolean).map(encodeURIComponent).join("/");
const noExt = (p) => p.replace(/\.[^./]+$/, "");

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(md|txt)$/.test(entry.name)) yield full;
  }
}

function frontmatterList(file, key) {
  const text = fs.readFileSync(file, "utf8");
  const match = text.match(new RegExp(`^${key}:\\s*\\[(.*)\\]\\s*$`, "m"));
  return match ? match[1].split(",").map((s) => s.trim()).filter(Boolean) : [];
}

const checks = [];
for (const file of walk(path.join("content", "creative-works"))) {
  if (file.includes("template")) continue;
  for (const media of frontmatterList(file, "media")) {
    const isVideo = VIDEO.has(path.extname(media).toLowerCase());
    const url = `${base}/${isVideo ? "video" : "image"}/upload/${isVideo ? "" : "f_auto,q_auto/"}creative-works/${enc(noExt(media))}${isVideo ? ".mp4" : ""}`;
    checks.push({ label: `creative-works/${media}`, url });
  }
}
for (const file of walk(path.join("content", "projects"))) {
  const text = fs.readFileSync(file, "utf8");
  if (/^hidden:\s*true/m.test(text) || file.includes("template")) continue;
  const slug = path.basename(file, path.extname(file));
  const screens = frontmatterList(file, "screens");
  for (const screen of screens.length ? screens : [`${slug}.png`]) {
    checks.push({ label: `projects/${screen}`, url: `${base}/image/upload/f_auto,q_auto/projects/${enc(noExt(screen))}` });
  }
}

let missing = 0;
for (const { label, url } of checks) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    if (response.ok) console.log(`OK       ${label}`);
    else {
      console.log(`MISSING  ${label}  (HTTP ${response.status})`);
      missing++;
    }
  } catch (error) {
    console.log(`ERROR    ${label}  (${error.message})`);
    missing++;
  }
}
console.log(`\n${checks.length - missing}/${checks.length} files reachable.`);
if (missing) {
  console.log("Missing files: check the spelling/case matches exactly, then run: npm run media:upload");
  process.exitCode = 1;
}
'@

Write-File 'portfolio\scripts\sync-creative.mjs' @'
// Links your local "creative work" files to markdown entries, and creates entries for any file nothing points at.
//   node scripts/sync-creative.mjs          -> dry run (prints what it would do)
//   node scripts/sync-creative.mjs --write  -> applies the changes
import fs from "node:fs";
import path from "node:path";

const write = process.argv.includes("--write");
const root = process.cwd();
const mediaRoot = path.resolve(root, "..", "creative work");
const contentRoot = path.join(root, "content", "creative-works");
const MEDIA = /\.(png|jpe?g|webp|gif|mp4|mov|webm|m4v|avi)$/i;

if (!fs.existsSync(mediaRoot)) {
  console.log(`No "creative work" folder found at ${mediaRoot}. Nothing to sync.`);
  process.exit(0);
}

function* walk(dir, filter) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full, filter);
    else if (filter(entry.name)) yield full;
  }
}

function stem(name) {
  let value = name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[\s._]+/g, "-");
  let previous;
  do {
    previous = value;
    value = value.replace(/-(\d{1,3})$/, "").replace(/-(animation|motion|render|shot|still|preview|cover|thumbnail|detail|hero)$/, "");
  } while (value !== previous);
  return value.replace(/^-+|-+$/g, "");
}

const files = [...walk(mediaRoot, (n) => MEDIA.test(n))].map((full) => path.relative(mediaRoot, full).split(path.sep).join("/"));

const entries = [...walk(contentRoot, (n) => n.endsWith(".md") && !n.includes("template"))].map((file) => {
  const text = fs.readFileSync(file, "utf8");
  const match = text.match(/^media:\s*\[(.*)\]\s*$/m);
  const title = (text.match(/^title:\s*(.+)$/m) ?? [])[1] ?? "";
  return { file, text, slug: path.basename(file, ".md"), title, media: match ? match[1].split(",").map((s) => s.trim()).filter(Boolean) : [] };
});

const referenced = new Set(entries.flatMap((entry) => entry.media));
const missingOnDisk = [...referenced].filter((media) => !files.includes(media));
missingOnDisk.forEach((media) => console.warn(`! Referenced but not found on disk: ${media}`));

// 1) Entries with no media: try to find files by name.
for (const entry of entries) {
  if (entry.media.length) continue;
  const keys = new Set([stem(entry.slug), stem(entry.title)]);
  const found = files.filter((file) => keys.has(stem(path.basename(file))) && !referenced.has(file)).sort();
  if (!found.length) {
    console.log(`? No files found for "${entry.slug}" (add a media: line by hand)`);
    continue;
  }
  console.log(`+ Link ${entry.slug}: ${found.join(", ")}`);
  found.forEach((file) => referenced.add(file));
  if (write) {
    const line = `media: [${found.join(", ")}]`;
    fs.writeFileSync(entry.file, entry.text.replace(/^(---\s*\n[\s\S]*?)(\n---)/, `$1\n${line}$2`));
  }
}

// 2) Files nothing points at: create new entries.
const orphans = files.filter((file) => !referenced.has(file));
const groups = new Map();
for (const file of orphans) {
  const key = `${path.dirname(file)}/${stem(path.basename(file))}`;
  groups.set(key, [...(groups.get(key) ?? []), file]);
}

for (const [key, group] of groups) {
  const [category] = group[0].split("/");
  const dir = path.dirname(group[0]);
  const slug = path.basename(key);
  const title = slug.split("-").filter(Boolean).map((p) => p[0].toUpperCase() + p.slice(1)).join(" ");
  const target = path.join(contentRoot, ...dir.split("/"), `${slug}.md`);
  console.log(`+ New entry ${path.relative(root, target)} <- ${group.join(", ")}`);
  if (write && !fs.existsSync(target)) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `---\ntitle: ${title}\nsummary: Add a one-line description of ${title} here.\nmedia: [${group.sort().join(", ")}]\n---\nAdd the brief, your process, the tools you used and the final result here.\n`);
  }
  void category;
}

console.log(write ? "\nApplied. Review with: git diff" : "\nDry run only. Re-run with --write to apply.");
'@

Write-File 'portfolio\scripts\upload-media.mjs' @'
// Uploads local media to Cloudinary using the exact public IDs the site expects.
//   npm run media:upload            -> uploads anything not already on Cloudinary
//   npm run media:upload -- --force -> re-uploads everything
import fs from "node:fs";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_URL } = process.env;
if (!CLOUDINARY_URL && !(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET)) {
  console.error("Missing credentials. Fill CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env.local");
  process.exit(1);
}
if (!CLOUDINARY_URL) {
  cloudinary.config({ cloud_name: CLOUDINARY_CLOUD_NAME, api_key: CLOUDINARY_API_KEY, api_secret: CLOUDINARY_API_SECRET });
}
cloudinary.config({ secure: true });

const force = process.argv.includes("--force");
const root = process.cwd();
const IMAGE = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const VIDEO = new Set([".mp4", ".mov", ".webm", ".m4v", ".avi"]);
const MB = 1024 * 1024;

const sources = [
  { dir: path.resolve(root, "..", "creative work"), folder: "creative-works" },
  { dir: path.join(root, "projects"), folder: "projects" },
  { dir: path.join(root, "certificates"), folder: "certificate" },
];

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function exists(publicId, resourceType) {
  try {
    await cloudinary.api.resource(publicId, { resource_type: resourceType });
    return true;
  } catch {
    return false;
  }
}

let uploaded = 0, skipped = 0, failed = 0;

for (const { dir, folder } of sources) {
  for (const file of walk(dir)) {
    const ext = path.extname(file).toLowerCase();
    const isVideo = VIDEO.has(ext);
    if (!isVideo && !IMAGE.has(ext)) continue;

    const rel = path.relative(dir, file).split(path.sep).join("/");
    const base = path.basename(rel, path.extname(rel));
    const publicId = `${folder}/${rel.slice(0, rel.length - path.extname(rel).length)}`;
    const resourceType = isVideo ? "video" : "image";
    const size = fs.statSync(file).size;

    if (/[\s.]/.test(base)) {
      console.warn(`! RENAME FIRST (spaces/dots in name): ${rel}`);
      failed++;
      continue;
    }
    if (size > (isVideo ? 100 : 10) * MB) {
      console.warn(`! TOO BIG for the free plan (${(size / MB).toFixed(1)} MB), compress it first: ${rel}`);
      failed++;
      continue;
    }
    if (!force && (await exists(publicId, resourceType))) {
      console.log(`- skip   ${publicId}`);
      skipped++;
      continue;
    }

    try {
      const options = { public_id: publicId, resource_type: resourceType, overwrite: true, invalidate: true, use_filename: false, unique_filename: false };
      if (isVideo && size > 20 * MB) await cloudinary.uploader.upload_large(file, { ...options, chunk_size: 6 * MB });
      else await cloudinary.uploader.upload(file, options);
      console.log(`+ upload ${publicId}`);
      uploaded++;
    } catch (error) {
      console.error(`x FAILED ${publicId}: ${error?.message ?? error}`);
      failed++;
    }
  }
}

console.log(`\nDone. uploaded ${uploaded}, skipped ${skipped}, problems ${failed}.`);
console.log("Next: npm run media:check");
'@

Write-Host "`n[5/7] Installing packages and adding media scripts" -ForegroundColor Cyan
Push-Location portfolio
npm install
if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
npm install --save-dev cloudinary
if ($LASTEXITCODE -ne 0) { throw "npm install cloudinary failed" }
npm pkg set "scripts.media:upload=node --env-file=.env.local scripts/upload-media.mjs"
npm pkg set "scripts.media:check=node --env-file=.env.local scripts/check-media.mjs"
npm pkg set "scripts.media:sync=node scripts/sync-creative.mjs"
if (-not (Test-Path ".env.local")) {
  Copy-Item ".env.example" ".env.local"
  Write-Host "  created portfolio\.env.local - fill in your Cloudinary values" -ForegroundColor Yellow
}

Write-Host "`n[6/7] Linking creative-work files to their markdown entries" -ForegroundColor Cyan
node scripts/sync-creative.mjs --write

Write-Host "`n[7/7] Test build" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "Build failed: copy the error above and send it to me." -ForegroundColor Red }
Pop-Location

Write-Host "`nDone. Next: fill portfolio\.env.local, then run: npm run media:upload ; npm run media:check ; npm run dev" -ForegroundColor Green