import { notFound } from "next/navigation";
import Link from "next/link";
import { creativeWorks } from "@/lib/content";
import CreativeWorkExplorer from "@/app/components/CreativeWorkExplorer";

const categories = {
  "3d": { title: "3D work", subtitle: "Models, archviz, product renders, and animations" },
  "graphic-design": { title: "Graphic design", subtitle: "Brand assets, visuals, and concepts" },
  "video-editing": { title: "Video editing", subtitle: "Short-form edits, reels, and motion storytelling" },
} as const;

export function generateStaticParams() {
  return Object.keys(categories).map((category) => ({ category }));
}

export default async function CreativeCategoryPage({ params }: PageProps<"/creative-works/[category]">) {
  const { category } = await params;
  const section = categories[category as keyof typeof categories];
  if (!section) notFound();

  const groups = creativeWorks
    .filter((work) => work.category === category && work.media.length > 0 && !work.slug.includes("template"))
    .map((work) => ({ key: work.slug, title: work.title, items: work.media, detail: work }));

  return (
    <main className="min-h-screen px-4 pb-20 pt-28">
      <div className="section-shell">
        <Link href="/#creative" className="mb-8 inline-flex items-center text-sm text-cyan-200 hover:text-white">← Back to portfolio</Link>
        <div className="mb-10">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-cyan-300">Creative work</p>
          <h1 className="text-4xl font-bold text-white">{section.title}</h1>
          <p className="mt-3 text-slate-300">{section.subtitle}</p>
        </div>
        <CreativeWorkExplorer sections={[{ ...section, categories: [], groups }]} />
      </div>
    </main>
  );
}
