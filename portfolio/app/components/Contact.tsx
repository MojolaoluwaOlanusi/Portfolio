import { Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { profile, safeText } from "@/lib/content";

const secondary =
  "inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-900/80 px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-violet-400 hover:text-violet-200";

export default function Contact() {
  const email = safeText(profile.email, "olanusimojola@gmail.com");
  const github = safeText(profile.github);
  const linkedin = safeText(profile.linkedin);
  const whatsapp = safeText(profile.whatsapp);
  const x = safeText(profile.x);

  return (
    <section id="contact" className="py-24">
      <div className="section-shell">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/15 via-slate-950 to-slate-950 p-8 md:p-14">
          <div className="orb -right-20 -top-20 h-64 w-64 bg-violet-600" />
          <div className="relative">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-violet-300">Contact</p>
            <h2 className="mb-5 text-3xl font-bold text-white md:text-5xl">Let&apos;s build something meaningful together</h2>
            <p className="mb-8 max-w-2xl text-lg leading-8 text-slate-300">
              I&apos;m looking for an internship or junior developer role, and I&apos;m open to freelance projects and creative collaborations. The quickest way to reach me is email.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${email}?subject=Hello%20Mojolaoluwa`}
                className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition hover:bg-violet-400"
              >
                <Mail className="h-4 w-4" /> {email}
              </a>
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noreferrer" className={secondary}>
                  <FaLinkedinIn className="h-4 w-4" aria-hidden="true" /> LinkedIn
                </a>
              )}
              {github && (
                <a href={github} target="_blank" rel="noreferrer" className={secondary}>
                  <FaGithub className="h-4 w-4" aria-hidden="true" /> GitHub
                </a>
              )}
              {whatsapp && (
                <a href={whatsapp} target="_blank" rel="noreferrer" className={secondary}>
                  <FaWhatsapp className="h-4 w-4" aria-hidden="true" /> WhatsApp
                </a>
              )}
              {x && (
                <a href={x} target="_blank" rel="noreferrer" className={secondary}>
                  <FaXTwitter className="h-4 w-4" aria-hidden="true" /> X
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
