"use client";

import { useState } from "react";
import { X } from "lucide-react";

type MediaGalleryProps = {
  items: Array<{ name: string; path: string; type: "image" | "video" }>;
};

export default function MediaGallery({ items }: Readonly<MediaGalleryProps>) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-sm text-slate-400">
        No media uploaded yet. Add images or video files to the relevant creative work folder.
      </div>
    );
  }

  const visibleItems = items.slice(0, 3);
  const hasMore = items.length > visibleItems.length;
  const selectedItem = selectedIndex !== null ? items[selectedIndex] : null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleItems.map((item, index) => (
          <button
            key={`${item.name}-${index}`}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className="group overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-left transition hover:border-violet-400"
          >
            {item.type === "image" ? (
              <img
                src={item.path}
                alt={item.name}
                className="h-60 w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <video src={item.path} className="h-60 w-full object-cover" muted playsInline />
            )}
          </button>
        ))}
      </div>

      {hasMore && (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setGalleryOpen(true)}
            className="rounded-full border border-violet-400/40 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20"
          >
            View all {items.length} works
          </button>
        </div>
      )}

      {galleryOpen && (
        <div
          className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/95 p-4 backdrop-blur-md md:p-8"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          onClick={(event) => {
            if (event.target === event.currentTarget) setGalleryOpen(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setGalleryOpen(false);
          }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Creative gallery</p>
                <h4 className="mt-2 text-2xl font-semibold text-white">All {items.length} works</h4>
              </div>
              <button
                type="button"
                onClick={() => setGalleryOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-100"
                aria-label="Close gallery"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <button
                  key={`gallery-${item.name}-${index}`}
                  type="button"
                  onClick={() => {
                    setGalleryOpen(false);
                    setSelectedIndex(index);
                  }}
                  className="group overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-left transition hover:border-violet-400"
                >
                  {item.type === "image" ? (
                    <img src={item.path} alt={item.name} className="h-56 w-full object-cover transition duration-300 group-hover:scale-105" />
                  ) : (
                    <video src={item.path} className="h-56 w-full object-cover" muted playsInline />
                  )}
                  <span className="block truncate px-4 py-3 text-sm text-slate-200">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedItem && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 text-slate-100"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {selectedItem.type === "image" ? (
              <img src={selectedItem.path} alt={selectedItem.name} className="max-h-[80vh] w-full object-contain" />
            ) : (
              <video src={selectedItem.path} controls className="max-h-[80vh] w-full object-contain bg-black" />
            )}
          </div>
        </div>
      )}
    </>
  );
}
