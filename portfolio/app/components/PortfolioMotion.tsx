"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type PortfolioMotionProps = Readonly<{ children: ReactNode }>;

export default function PortfolioMotion({ children }: PortfolioMotionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("section", containerRef.current).forEach((section, index) => {
        if (index === 0) return;
        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: { trigger: section, start: "top 90%", once: true },
          },
        );
      });
    }, containerRef);

    return () => context.revert();
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
