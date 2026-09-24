import { Award } from "lucide-react";
import { certificates, safeText } from "@/lib/content";

export default function Certificates() {
  return (
    <section id="certificates" className="py-20">
      <div className="section-shell">
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-violet-300">
            Certificates
          </p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Recognition & learning</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {certificates.map((item) => (
            <article
              key={item.slug}
              className="glass-panel rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-400/60"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">{safeText(item.title, "Certificate")}</h3>
              <p className="mb-3 text-sm text-violet-200">{safeText(item.issuer, "Professional learning")}</p>
              <p className="text-sm leading-6 text-slate-300">{safeText(item.summary, "Professional recognition and continued learning.")}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
