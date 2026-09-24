import { creativeWork } from "@/lib/content";

export default function CreativeWork() {
  return (
    <section id="creative" className="py-20">
      <div className="section-shell">
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">Creative work</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Design, motion, and 3D storytelling</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {creativeWork.map((item) => (
            <article key={item.slug} className="glass-panel rounded-3xl p-6">
              <div className="mb-4 h-48 rounded-2xl bg-gradient-to-br from-violet-500/25 via-sky-500/10 to-cyan-500/20 p-5">
                <div className="flex h-full items-end justify-between rounded-2xl border border-white/10 bg-slate-950/20 p-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-violet-200">Creative</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-200">
                    3D / Motion
                  </span>
                </div>
              </div>

              <p className="text-base leading-7 text-slate-300">{item.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}