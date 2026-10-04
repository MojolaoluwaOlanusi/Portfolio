import { PhoneCall, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { profile } from "@/lib/content";

export default function Contact() {
  const email = typeof profile.email === "string" ? profile.email : "olanusimojola@gmail.com";
  const github = typeof profile.github === "string" ? profile.github : "https://github.com/";
  const linkedin = typeof profile.linkedin === "string" ? profile.linkedin : "https://www.linkedin.com/";
  const whatsapp = "https://wa.me/2348083759076";
  const xProfile = "https://x.com/mojola1132811";

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
              <FaGithub className="h-4 w-4" aria-hidden="true" />
              GitHub
            </a>

            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-900/80 px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-violet-400 hover:text-violet-200"
            >
              <FaLinkedinIn className="h-4 w-4" aria-hidden="true" />
              LinkedIn
            </a>

            <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-900/80 px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-emerald-400 hover:text-emerald-200">
              <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
              WhatsApp · Mojola544
            </a>

            <a href="tel:+2348083759076" className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-900/80 px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-cyan-400 hover:text-cyan-200">
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
              Call
            </a>

            <a href={xProfile} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-900/80 px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-white hover:text-white">
              <FaXTwitter className="h-4 w-4" aria-hidden="true" />
             @mojola1132811
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}