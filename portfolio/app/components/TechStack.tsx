import { skills } from "@/lib/content";

export default function TechStack() {
  const skillList = Array.isArray(skills.items) ? (skills.items as string[]) : [];

  return (
    <section id="tech" className="py-20">
      <div className="section-shell">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">Tech stack</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Tools I use to build and design</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {skillList.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-100"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}