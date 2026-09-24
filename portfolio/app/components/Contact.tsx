import { GitBranch, Link, Mail } from "lucide-react";
import { profile } from "@/lib/content";

export default function Contact() {
  const email = typeof profile.email === "string" ? profile.email : "olanusimojola@gmail.com";
  const github = typeof profile.github === "string" ? profile.github : "https://github.com/";
  const linkedin = typeof profile.linkedin === "string" ? profile.linkedin : "https://www.linkedin.com/";

  return (
    <section id="contact" className="py-20">
      <div className="section-shell">
        <div className="mx-auto max-w-4xl rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-slate-950 to-slate-950 p-8 md:p-12">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-violet-300">Contact</p>
          <h2 className="mb-5 text-3xl font-bold text-white md:text-4xl">Let&apos;s build something meaningful together</h2>
          <p className="mb-8 max-w-2xl text-lg leading-8 text-slate-300">
            I&apos;m open to freelance work, product collaborations, creative partnerships, and opportunities where I can contribute with both technical depth and visual thinking.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-400"
            >
              <Mail className="h-4 w-4" />
              Email me
            </a>

            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-900/80 px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-violet-400 hover:text-violet-200"
            >
              <GitBranch className="h-4 w-4" />
              GitHub
            </a>

            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-900/80 px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-violet-400 hover:text-violet-200"
            >
              <Link className="h-4 w-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}