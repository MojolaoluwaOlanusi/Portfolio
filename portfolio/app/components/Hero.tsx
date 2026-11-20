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
