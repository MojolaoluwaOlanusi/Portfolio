import { socialProof } from "@/lib/content";

const metrics = [
  { label: "Projects shipped", value: socialProof.projectsCompleted },
  { label: "Years building", value: `${socialProof.yearsExperience}+` },
  { label: "Creative tracks", value: socialProof.creativeTracks },
  { label: "Collaborations", value: socialProof.collaborations },
];

export default function SocialProof() {
  return (
    <section className="py-20">
      <div className="section-shell">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-violet-300">Social proof</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Progress built from work, learning, and collaboration</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="glass-panel rounded-2xl p-6 text-center">
              <div className="text-4xl font-black text-white">{metric.value}</div>
              <p className="mt-2 text-sm text-slate-300">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
