import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { projects, safeText } from "@/lib/content";

export default function Projects() {
  return (
    <section id="projects" className="py-20">
      <div className="section-shell">
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-violet-300">Selected work</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Projects that show range and execution</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => {
            const stack = Array.isArray(project.stack) ? (project.stack as string[]) : [];
            const isFeatured = project.featured === true;
            const isLead = index === 0;

            return (
              <article
                key={project.slug}
                className={`glass-panel rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-400/60 ${
                  isLead ? "md:col-span-2 xl:col-span-2" : ""
                }`}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold tabular-nums text-violet-300/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-2xl font-semibold text-white">{safeText(project.title, "Project")}</h3>
                  </div>
                  {isFeatured && (
                    <span className="rounded-full bg-violet-500/15 px-2.5 py-1 text-xs font-medium text-violet-200">
                      Featured
                    </span>
                  )}
                </div>

                {safeText(project.picture) && (
                  <img
                    src={safeText(project.picture)}
                    alt={`${safeText(project.title, "Project")} preview`}
                    className={`mb-5 w-full rounded-2xl object-cover ${isLead ? "h-72 md:h-96" : "h-56"}`}
                  />
                )}

                <p className="mb-5 text-base leading-7 text-slate-300">{safeText(project.summary, "Project summary")}</p>

                <div className="mb-5 flex flex-wrap gap-2">
                  {stack.map((item) => (
                    <span
                      key={`${project.slug}-${item}`}
                      className="rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mb-4 space-y-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-300">
                  <p><span className="font-semibold text-white">Problem:</span> {safeText(project.problem, "The goal was to solve a real user problem with a practical product experience.")}</p>
                  <p><span className="font-semibold text-white">Process:</span> {safeText(project.process, "I worked through the workflow, design, and implementation in a structured way.")}</p>
                  <p><span className="font-semibold text-white">Result:</span> {safeText(project.result, "The product delivered a cleaner, smoother end-user experience.")}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {(typeof project.live === "string" && project.live) && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-violet-200 transition hover:text-violet-100"
                    >
                      <ExternalLink className="h-4 w-4" /> Live
                    </a>
                  )}

                  {(typeof project.github === "string" && project.github) && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-slate-200 transition hover:text-white"
                    >
                      <FaGithub className="h-4 w-4" aria-hidden="true" /> Code
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}