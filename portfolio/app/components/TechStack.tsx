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
