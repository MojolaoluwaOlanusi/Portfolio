import { creativeWorks } from "@/lib/content";
import CreativeWorkExplorer from "./CreativeWorkExplorer";

const creativeSections = [
  {
    title: "3D work",
    subtitle: "Models, archviz, product renders, and animations",
    categories: ["models", "archviz", "product-renders", "animations"],
  },
  {
    title: "Graphic design",
    subtitle: "Brand assets, visuals, and concepts",
    categories: [],
  },
  {
    title: "Video editing",
    subtitle: "Short-form edits, reels, and motion storytelling",
    categories: [],
  },
];

export default function CreativeWork() {
  const sections = creativeSections.map((section) => {
    const category = section.title === "3D work" ? "3d" : section.title.toLowerCase().replace(/\s+/g, "-");
    const groups = creativeWorks
      .filter((work) => work.category === category && work.media.length > 0 && !work.slug.includes("template"))
      .map((work) => ({
        key: work.slug,
        title: work.title,
        items: work.media,
        detail: work,
      }));

    return {
      ...section,
      groups,
      previewOnly: true,
      viewAllHref: `/creative-works/${category}`,
    };
  });

  return (
    <section id="creative" className="py-20">
      <div className="section-shell">
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">Creative work</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">A portfolio of design, 3D craft, and visual storytelling</h2>
        </div>

        <CreativeWorkExplorer sections={sections} />
      </div>
    </section>
  );
}