import { creativeWorks, groupMediaItemsByName, normalizeMediaGroupName } from "@/lib/content";
import { getMediaFilesForFolder } from "@/lib/content";
import CreativeWorkExplorer from "./CreativeWorkExplorer";

const creativeSections = [
  {
    title: "3D work",
    subtitle: "Models, archviz, product renders, and animations",
    folder: "creative work/3d",
    categories: ["models", "archviz", "product-renders", "animations"],
  },
  {
    title: "Graphic design",
    subtitle: "Brand assets, visuals, and concepts",
    folder: "creative work/graphic-design",
    categories: [],
  },
  {
    title: "Video editing",
    subtitle: "Short-form edits, reels, and motion storytelling",
    folder: "creative work/video-editing",
    categories: [],
  },
];

export default function CreativeWork() {
  const sections = creativeSections.map((section) => {
    const groups = groupMediaItemsByName(getMediaFilesForFolder(section.folder)).map((group) => {
      const detail = creativeWorks.find((work) => {
        const groupKey = group.key.toLowerCase();
        return [work.slug, work.title]
          .map((value) => normalizeMediaGroupName(`${value}.png`).toLowerCase())
          .includes(groupKey);
      }) ?? null;

      return { ...group, detail };
    });

    return { ...section, groups };
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