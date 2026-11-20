import { ArrowUpRight, Check } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { parseBody, projects, safeArray, safeText } from "@/lib/content";
import ProjectShowcase from "./ProjectShowcase";

export default function Projects() {
  return (
    <section id="projects" className="py-24">
      <div className="section-shell">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-violet-300">Selected work</p>
        <h2 className="mb-4 max-w-3xl text-3xl font-bold text-white md:text-4xl">Three production apps, built end to end</h2>
        <p className="mb-14 max-w-2xl text-lg leading-8 text-slate-300">
          Each project below is live, deployed and open to try. I designed the schema, built the API and the interface, wrote the tests and shipped it.
        </p>

        <div className="space-y-16">
          {projects.map((project, index) => {
            const { intro, sections } = parseBody(project.content);
            const highlights = sections.find((section) => section.title.toLowerCase() === "highlights")?.items ?? [];
            const engineering = sections.find((section) => section.title.toLowerCase() === "under the hood")?.items ?? [];
            const stack = safeArray(project.stack);
            const live = safeText(project.live);
            const github = safeText(project.github);
            const meta = [safeText(project.role), safeText(project.duration), safeText(project.status)].filter(Boolean);

            const story = [
              { label: "The problem", text: safeText(project.problem) },
              { label: "How I built it", text: safeText(project.process) },
              { label: "The outcome", text: safeText(project.result) },
            ].filter((item) => item.text);

            return (
              <article key={project.slug} className="glass-panel rounded-3xl p-6 md:p-10">
                <div className="grid items-start gap-10 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <ProjectShowcase title={safeText(project.title, "Project")} live={live || undefined} screens={project.screens.map((screen) => screen.path)} />
                  </div>

                  <div className="lg:col-span-5">
                    <p className="text-sm font-semibold tabular-nums text-violet-300/80">
                      {String(index + 1).padStart(2, "0")} · {safeText(project.kind, "Project")}
                    </p>
                    <h3 className="mt-2 text-4xl font-bold text-white">{safeText(project.title, "Project")}</h3>
                    <p className="mt-4 text-lg leading-8 text-slate-300">{safeText(project.summary)}</p>
                    {intro && <p className="mt-4 text-sm leading-7 text-slate-400">{intro}</p>}

                    {meta.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {meta.map((item) => (
                          <span key={item} className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-200">
                            {item}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-7 flex flex-wrap items-center gap-3">
                      {live && (
                        <a href={live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-400">
                          Live demo <ArrowUpRight className="h-4 w-4" />
                        </a>
                      )}
                      {github && (
                        <a href={github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-600 px-5 py-2.5 text-sm font-medium text-slate-100 transition hover:border-violet-400 hover:text-white">
                          <FaGithub className="h-4 w-4" aria-hidden="true" /> Source code
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {story.length > 0 && (
                  <div className="mt-10 grid gap-6 border-t border-slate-800 pt-8 lg:grid-cols-3">
                    {story.map((item, storyIndex) => (
                      <div key={item.label}>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                          {storyIndex + 1}. {item.label}
                        </p>
                        <p className="text-sm leading-7 text-slate-300">{item.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {(highlights.length > 0 || engineering.length > 0) && (
                  <div className="mt-10 grid gap-8 border-t border-slate-800 pt-8 lg:grid-cols-2">
                    {[
                      { title: "What it does", items: highlights },
                      { title: "Under the hood", items: engineering },
                    ]
                      .filter((group) => group.items.length > 0)
                      .map((group) => (
                        <div key={group.title}>
                          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">{group.title}</h4>
                          <ul className="space-y-3">
                            {group.items.map((item) => (
                              <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300">
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                )}

                {stack.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-800 pt-6">
                    {stack.map((item) => (
                      <span key={`${project.slug}-${item}`} className="rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-200">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
