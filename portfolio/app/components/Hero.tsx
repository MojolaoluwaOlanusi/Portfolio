import { ArrowDown } from "lucide-react";
import { profile, safeText } from "@/lib/content";

export default function Hero() {
  const location = safeText(profile.location, "Ibadan, Nigeria");
  const status = safeText(profile.status, "Available for collaborations");
  const name = safeText(profile.name, "Mojolaoluwa Olanusi");
  const role = safeText(profile.role, "Full-Stack Developer");
  const headline = safeText(profile.headline, "I design and build digital products that are useful, memorable, and ready for real users.");

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24 text-center">
      <div className="grid-pattern absolute inset-0 opacity-30" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-violet-500/10 via-violet-500/5 to-transparent" />

      <div className="section-shell relative z-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            {status}
          </div>

          <h1 className="text-5xl font-black tracking-tight text-white md:text-7xl">
            {name}
          </h1>

          <p className="mt-4 text-2xl font-medium text-slate-300 md:text-3xl">
            <span className="text-gradient">{role}</span>
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 md:text-xl">
            {headline}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-300">
            <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5">{location}</span>
            <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5">Product-minded developer</span>
            <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5">Ready to collaborate</span>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#projects"
              className="rounded-full bg-violet-500 px-6 py-3 font-medium text-white transition hover:bg-violet-400"
            >
              View my work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-slate-600 bg-slate-900/60 px-6 py-3 font-medium text-slate-100 transition hover:border-violet-400 hover:text-violet-200"
            >
              Let&apos;s talk
            </a>
          </div>

          <div className="mt-16 flex justify-center text-slate-400">
            <ArrowDown className="h-6 w-6 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}