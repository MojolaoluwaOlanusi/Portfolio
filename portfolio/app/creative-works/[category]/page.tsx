import Link from "next/link";
import { notFound } from "next/navigation";
import CreativeWorkExplorer from "@/app/components/CreativeWorkExplorer";
import { creativeSections, getCreativeGroups } from "@/app/components/CreativeWork";

export function generateStaticParams() {
  return creativeSections.map((section) => ({ category: section.category }));
}

export async function generateMetadata({ params }: PageProps<"/creative-works/[category]">) {
  const { category } = await params;
  const section = creativeSections.find((item) => item.category === category);
  return { title: section ? section.title : "Creative work" };
}

export default async function CreativeCategoryPage({ params }: PageProps<"/creative-works/[category]">) {
  const { category } = await params;
  const section = creativeSections.find((item) => item.category === category);
  if (!section) notFound();

  return (
    <main className="min-h-screen px-4 pb-20 pt-28">
      <div className="section-shell">
        <Link href="/#creative" className="mb-8 inline-flex items-center text-sm text-cyan-200 hover:text-white">
          Back to portfolio
        </Link>
        <div className="mb-10">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-cyan-300">Creative work</p>
          <h1 className="text-4xl font-bold text-white">{section.title}</h1>
          <p className="mt-3 text-slate-300">{section.subtitle}</p>
        </div>
        <CreativeWorkExplorer sections={[{ title: section.title, subtitle: section.subtitle, groups: getCreativeGroups(section.category) }]} />
      </div>
    </main>
  );
}
