import { about } from "@/lib/content";

export default function About() {
  const paragraphs = about.content.split(/\n\s*\n/).filter(Boolean);

  return (
    <section id="about" className="py-20">
      <div className="section-shell">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-950/40 p-6 md:p-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-violet-300">About</p>
          <h2 className="mb-8 text-3xl font-bold text-white md:text-4xl">A builder with both code and creative instincts</h2>

          <div className="space-y-5 text-lg leading-8 text-slate-300">
            {paragraphs.map((paragraph, index) => (
              <p key={`${paragraph.slice(0, 12)}-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}