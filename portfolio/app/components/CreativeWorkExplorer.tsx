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
