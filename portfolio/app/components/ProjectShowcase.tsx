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
