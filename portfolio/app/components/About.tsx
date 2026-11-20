import { Boxes, Code2, Palette, type LucideIcon } from "lucide-react";
import { about, parseBody } from "@/lib/content";

const pillarIcons: LucideIcon[] = [Code2, Boxes, Palette];

export default function About() {
  const { intro, sections } = parseBody(about.content);
  const paragraphs = intro.split(/\n\s*\n/).filter(Boolean);
  const pillars = (sections.find((section) => section.title.toLowerCase() === "pillars")?.items ?? []).map((item) => {
    const [title, ...rest] = item.split(" - ");
    return { title: title.trim(), text: rest.join(" - ").trim() };
  });

  return (
    <section id="about" className="py-24">
      <div className="section-shell">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-violet-300">About</p>
        <h2 className="mb-12 max-w-3xl text-3xl font-bold text-white md:text-4xl">A builder with both engineering discipline and creative instincts</h2>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-300">
            {paragraphs.map((paragraph, index) => (
              <p key={`${paragraph.slice(0, 12)}-${index}`}>{paragraph}</p>
            ))}
          </div>

          <div className="space-y-4">
            {pillars.map((pillar, index) => {
              const Icon = pillarIcons[index % pillarIcons.length];
              return (
                <div key={pillar.title} className="glass-panel flex gap-4 rounded-2xl p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{pillar.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{pillar.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
