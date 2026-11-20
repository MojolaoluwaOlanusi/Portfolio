import type { MetadataRoute } from "next";

const siteUrl = "https://mojolaoluwa.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteUrl, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...["3d", "graphic-design", "video-editing"].map((category) => ({
      url: `${siteUrl}/creative-works/${category}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
