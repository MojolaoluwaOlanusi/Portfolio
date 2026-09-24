"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import type { CreativeWorkEntry, MediaItem } from "@/lib/content";

type CreativeGroup = {
  key: string;
  title: string;
  items: MediaItem[];
  detail: CreativeWorkEntry | null;
};

type CreativeWorkExplorerProps = {
  sections: Array<{
    title: string;
    subtitle: string;
    categories: string[];
    groups: CreativeGroup[];
  }>;
};

function MediaTile({ item, className = "" }: { item: MediaItem; className?: string }) {
  return item.type === "image" ? (
    <img src={item.path} alt={item.name} className={`h-full w-full object-cover ${className}`} />
  ) : (
    <video
      src={item.path}
      className={`h-full w-full object-cover ${className}`}
      muted
      playsInline
      onMouseEnter={(event) => {
        void event.currentTarget.play();
      }}
      onMouseLeave={(event) => {
        event.currentTarget.pause();
        event.currentTarget.currentTime = 0;
      }}
    />
  );
}

export default function CreativeWorkExplorer({ sections }: Readonly<CreativeWorkExplorerProps>) {
  const [selectedWork, setSelectedWork] = useState<CreativeGroup | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
  const [showAllMedia, setShowAllMedia] = useState(false);

  const closeWork = () => {
    setSelectedWork(null);
    setSelectedMediaIndex(null);
    setShowAllMedia(false);
  };

  const openMediaViewer = (index: number) => setSelectedMediaIndex(index);
  const selectedMedia = selectedWork && selectedMediaIndex !== null ? selectedWork.items[selectedMediaIndex] : null;

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <div key={section.title} className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 md:p-8">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">{section.title}</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{section.subtitle}</h3>
            </div>
            {section.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {section.categories.map((category) => (
                  <span key={category} className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.15em] text-slate-200">
                    {category}
                  </span>
                ))}
              </div>
            )}
          </div>

          {section.groups.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {section.groups.map((group) => (
                <button
                  key={group.key}
                  type="button"
                  onClick={() => setSelectedWork(group)}
                  className="group overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-left transition hover:-translate-y-1 hover:border-cyan-300"
                >
                  <div className="h-60 overflow-hidden">
                    <MediaTile item={group.items[0]} className="transition duration-300 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-white">{group.detail?.title || group.title}</h4>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-400">{group.detail?.summary || "Open this work to view its media and details."}</p>
                    <span className="mt-4 inline-block text-xs uppercase tracking-[0.18em] text-cyan-300">{group.items.length} media · View work</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-6 text-sm text-slate-400">
              This section is ready for your files. Add media into the creative work folder to showcase it here.
            </div>
          )}
        </div>
      ))}

      {selectedWork && !selectedMedia && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/95 p-4 backdrop-blur-md md:p-8" role="dialog" aria-modal="true">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Creative work</p>
                <h3 className="mt-2 text-3xl font-semibold text-white">{selectedWork.detail?.title || selectedWork.title}</h3>
                <p className="mt-2 max-w-2xl text-slate-300">{selectedWork.detail?.summary}</p>
              </div>
              <button type="button" onClick={closeWork} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-slate-100" aria-label="Close creative work">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div className="grid h-[28rem] grid-cols-2 grid-rows-2 gap-3">
                  {(showAllMedia ? selectedWork.items : selectedWork.items.slice(0, 3)).map((item, index) => (
                    <button
                      key={`${item.name}-${index}`}
                      type="button"
                      onClick={() => openMediaViewer(index)}
                      className={`group overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 ${index === 0 ? "row-span-2" : ""} ${showAllMedia && index > 2 ? "row-span-1" : ""}`}
                    >
                      <MediaTile item={item} className="transition duration-300 group-hover:scale-105" />
                    </button>
                  ))}
                </div>
                {selectedWork.items.length > 3 && (
                  <button type="button" onClick={() => setShowAllMedia((isOpen) => !isOpen)} className="mt-4 rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
                    {showAllMedia ? "Show featured media" : `View all ${selectedWork.items.length} media`}
                  </button>
                )}
              </div>
              <div className="prose prose-invert max-w-none text-slate-300">
                <p className="whitespace-pre-line leading-7">{selectedWork.detail?.content || "Add details for this creative work in its markdown file."}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedMedia && selectedWork && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-md" role="dialog" aria-modal="true">
          <button type="button" onClick={closeWork} className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white" aria-label="Close media viewer">
            <X className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => setSelectedMediaIndex((selectedMediaIndex! - 1 + selectedWork.items.length) % selectedWork.items.length)} className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/90 text-white md:left-8" aria-label="Previous media">
            <ChevronLeft />
          </button>
          <div className="max-h-[85vh] max-w-6xl overflow-hidden rounded-2xl">
            <MediaTile item={selectedMedia} className="max-h-[85vh] min-h-64 w-auto max-w-[85vw] object-contain" />
          </div>
          <button type="button" onClick={() => setSelectedMediaIndex((selectedMediaIndex! + 1) % selectedWork.items.length)} className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/90 text-white md:right-8" aria-label="Next media">
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
