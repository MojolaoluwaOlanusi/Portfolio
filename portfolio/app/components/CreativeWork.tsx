import { getVisibleCreativeWorks } from "@/lib/content";
import CreativeWorkExplorer, { type CreativeGroup } from "./CreativeWorkExplorer";

export const creativeSections = [
  { category: "3d", title: "3D work", subtitle: "Models, archviz, product renders and animations" },
  { category: "graphic-design", title: "Graphic design", subtitle: "Brand assets, visuals and concepts" },
  { category: "video-editing", title: "Video editing", subtitle: "Short-form edits, reels and motion storytelling" },
] as const;

export function getCreativeGroups(category: string): CreativeGroup[] {
  return getVisibleCreativeWorks(category).map((work) => ({
    key: `${work.category}-${work.group}-${work.slug}`,
    title: work.title,
    tag: work.group,
    items: work.media,
    detail: work,
  }));
}

export default function CreativeWork() {
  const sections = creativeSections.map((section) => ({
    title: section.title,
    subtitle: section.subtitle,
    groups: getCreativeGroups(section.category),
    previewOnly: true,
    viewAllHref: `/creative-works/${section.category}`,
  }));

  return (
    <section id="creative" className="py-24">
      <div className="section-shell">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">Creative work</p>
        <h2 className="mb-4 max-w-3xl text-3xl font-bold text-white md:text-4xl">Design, 3D craft and visual storytelling</h2>
        <p className="mb-12 max-w-2xl text-lg leading-8 text-slate-300">
          Outside the codebase I model, light and render in Blender, and design graphics and edit video. Open any piece to see it up close.
        </p>

        <CreativeWorkExplorer sections={sections} />
      </div>
    </section>
  );
}
