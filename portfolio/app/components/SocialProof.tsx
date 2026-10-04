"use client";

import { socialProof } from "@/lib/social-proof";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const metrics = [
  { label: "Projects shipped", value: socialProof.projectsCompleted },
  { label: "Years building", value: `${socialProof.yearsExperience}+` },
  { label: "Creative tracks", value: socialProof.creativeTracks },
  { label: "Collaborations", value: socialProof.collaborations },
];

export default function SocialProof() {
  const metricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!metricsRef.current) return;
    const counters = metricsRef.current.querySelectorAll<HTMLElement>("[data-count]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      counters.forEach((element) => { element.textContent = element.dataset.count ?? "0"; });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      counters.forEach((element) => {
        const target = Number(element.dataset.count);
        const counter = { value: 0 };
        gsap.to(counter, {
          value: target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 90%", once: true },
          onUpdate: () => { element.textContent = String(Math.round(counter.value)); },
        });
      });
    });

    return () => context.revert();
  }, []);

  return (
    <section className="py-20">
      <div className="section-shell">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-violet-300">Social proof</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Progress built from work, learning, and collaboration</h2>
        </div>

        <div ref={metricsRef} className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="glass-panel rounded-2xl p-6 text-center">
              <div className="text-4xl font-black text-white">
                <span data-count={Number.parseInt(String(metric.value), 10)} aria-label={String(metric.value)}>0</span>
                {String(metric.value).replace(/[\d]/g, "")}
              </div>
              <p className="mt-2 text-sm text-slate-300">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
