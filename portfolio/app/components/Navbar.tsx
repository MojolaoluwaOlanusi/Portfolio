"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

type NavLink = { label: string; href: string };

export default function Navbar({ links }: Readonly<{ links: NavLink[] }>) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const link of links) {
      const element = document.getElementById(link.href.replace("#", ""));
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [links]);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b transition ${
        scrolled || open ? "border-slate-800/80 bg-slate-950/85 backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <div className="section-shell flex items-center justify-between py-4">
        <a href="#top" className="flex items-center gap-2.5 text-lg font-bold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold tracking-tight text-white ring-1 ring-violet-300/40">
            MO
          </span>
          <span>
            Mojola<span className="text-gradient">oluwa</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 text-sm md:flex">
          {links.map((item) => {
            const isActive = active === item.href.replace("#", "");
            return (
              <a
                key={item.href}
                href={item.href}
                className={`rounded-full px-3.5 py-1.5 transition ${
                  isActive ? "bg-violet-500/15 text-violet-100" : "text-slate-300 hover:text-violet-200"
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <a href="#contact" className="ml-2 rounded-full bg-violet-500 px-4 py-1.5 font-medium text-white transition hover:bg-violet-400">
            Hire me
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-slate-100 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="section-shell flex flex-col gap-1 pb-4 md:hidden">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-slate-200 transition hover:bg-slate-900"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
