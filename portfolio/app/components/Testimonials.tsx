import { Quote } from "lucide-react";
import { safeText, testimonials } from "@/lib/content";

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20">
      <div className="section-shell">
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
            Testimonials
          </p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">What people say</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.slug}
              className="glass-panel rounded-2xl p-6 text-left"
            >
              <Quote className="mb-4 h-8 w-8 text-violet-300" />
              <p className="mb-5 text-base leading-7 text-slate-200">“{safeText(item.quote, "A thoughtful and reliable collaborator.")}”</p>
              <div className="border-t border-slate-700 pt-4">
                <p className="font-semibold text-white">{safeText(item.name, "Client")}</p>
                <p className="text-sm text-slate-400">{safeText(item.role, "Project partner")}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
