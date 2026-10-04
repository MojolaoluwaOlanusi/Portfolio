"use client";

import { X } from "lucide-react";
import { useState } from "react";
import type { MarkdownEntry } from "@/lib/content";

type Certificate = MarkdownEntry & { preview: string };

type CertificateExplorerProps = { certificates: Certificate[] };

export default function CertificateExplorer({ certificates }: Readonly<CertificateExplorerProps>) {
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {certificates.map((certificate) => (
          <button
            key={certificate.slug}
            type="button"
            onClick={() => setSelected(certificate)}
            className="glass-panel rounded-2xl p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-violet-400/60"
          >
            <span className="mb-4 block text-xs uppercase tracking-[0.2em] text-violet-300">{String(certificate.issuer || "Professional learning")}</span>
            <span className="block text-xl font-semibold text-white">{certificate.title}</span>
            <span className="mt-3 block text-sm leading-6 text-slate-300">{certificate.summary}</span>
            <span className="mt-5 block text-xs uppercase tracking-[0.16em] text-violet-200">View certificate</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/95 p-4 backdrop-blur-md md:p-8" role="dialog" aria-modal="true" aria-labelledby="certificate-title">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Certificate</p>
                <h3 id="certificate-title" className="mt-2 text-3xl font-semibold text-white">{selected.title}</h3>
                <p className="mt-2 text-violet-200">{String(selected.issuer || "Professional learning")}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-100" aria-label="Close certificate details">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="flex min-h-72 items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
                {selected.preview ? (
                  <img src={selected.preview} alt={`${selected.title} certificate preview`} className="max-h-[70vh] w-full object-contain" />
                ) : (
                  <p className="p-8 text-center text-sm text-slate-400">Upload a preview to Cloudinary under `certificate/{selected.slug}.png`.</p>
                )}
              </div>
              <div className="text-slate-300">
                <p className="text-lg leading-8">{selected.summary}</p>
                <p className="mt-6 whitespace-pre-line leading-7">{selected.content}</p>
                {typeof selected.credentialUrl === "string" && selected.credentialUrl && (
                  <a href={selected.credentialUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex text-sm text-violet-200 hover:text-white">Verify certificate</a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
