"use client";

import { useEffect, useRef } from "react";

type Stat = { label: string; value: number; suffix?: string };

export default function Stats({ stats }: Readonly<{ stats: Stat[] }>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const counters = container.querySelectorAll<HTMLElement>("[data-count]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          observer.unobserve(element);
          const target = Number(element.dataset.count);
          if (reduceMotion) {
            element.textContent = String(target);
            continue;
          }
          const start = performance.now();
          const duration = 1400;
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            element.textContent = String(Math.round(target * (1 - Math.pow(1 - progress, 3))));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.6 },
    );

    counters.forEach((counter) => observer.observe(counter));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="mx-auto grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-4 text-center">
          <div className="text-3xl font-black text-white">
            <span data-count={stat.value}>{stat.value}</span>
            {stat.suffix}
          </div>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
