import fs from "fs";
import path from "path";

export type MarkdownEntry = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  [key: string]: unknown;
};

export type MediaItem = {
  name: string;
  path: string;
  type: "image" | "video";
  thumb?: string;
  poster?: string;
};

export type CreativeWorkEntry = MarkdownEntry & {
  category: string;
  group: string;
  tools: string[];
  media: MediaItem[];
};

export type ProjectEntry = MarkdownEntry & {
  picture: string;
  screens: MediaItem[];
};

export type BodySection = { title: string; text: string; items: string[] };

const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".webm", ".avi", ".m4v"]);

/* ----------------------------- markdown parsing ---------------------------- */

function cleanValue(value: string): string | boolean | string[] {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) return [];
    return inner
      .split(",")
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean);
  }
  return trimmed;
}

function parseFrontMatter(raw: string) {
  const text = raw.replace(/^\uFEFF/, "");
  const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { data: {} as Record<string, unknown>, content: text.trim() };

  const data: Record<string, unknown> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) continue;
    const key = line.slice(0, separatorIndex).trim();
    if (key) data[key] = cleanValue(line.slice(separatorIndex + 1));
  }
  return { data, content: match[2].trim() };
}

/** Splits a markdown body into an intro plus "## Heading" sections with bullet items. */
export function parseBody(content: string): { intro: string; sections: BodySection[] } {
  const parts = content.split(/^##\s+/m);
  const intro = (parts.shift() ?? "").trim();
  const bullet = /^\s*[-*]\s+/;
  const sections = parts.map((part) => {
    const [titleLine, ...rest] = part.split(/\r?\n/);
    const lines = rest.join("\n").trim().split(/\r?\n/);
    return {
      title: titleLine.trim(),
      items: lines.filter((line) => bullet.test(line)).map((line) => line.replace(bullet, "").trim()),
      text: lines.filter((line) => !bullet.test(line)).join(" ").trim(),
    };
  });
  return { intro, sections };
}

export function safeText(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

export function safeArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

export function readMarkdownFile(filePath: string): MarkdownEntry {
  const absolutePath = path.join(/* turbopackIgnore: true */ process.cwd(), filePath);
  const { data, content } = parseFrontMatter(fs.readFileSync(absolutePath, "utf8"));
  const slug = path.basename(filePath, path.extname(filePath));

  return {
    slug,
    title: safeText(data.title, slug.replace(/[-_]+/g, " ")),
    summary: safeText(data.summary, content.slice(0, 180).replace(/\s+/g, " ")),
    content,
    ...data,
  };
}

export function readMarkdownCollection(directory: string): MarkdownEntry[] {
  const absoluteDirectory = path.join(process.cwd(), "content", directory);
  if (!fs.existsSync(absoluteDirectory)) return [];

  return fs
    .readdirSync(absoluteDirectory)
    .filter((file) => file.endsWith(".md") || file.endsWith(".txt"))
    .sort()
    .map((file) => {
      const { data, content } = parseFrontMatter(fs.readFileSync(path.join(absoluteDirectory, file), "utf8"));
      const slug = path.basename(file, path.extname(file));
      return {
        slug,
        title: safeText(data.title, slug.replace(/[-_]+/g, " ")),
        summary: safeText(data.summary, content.slice(0, 180).replace(/\s+/g, " ")),
        content,
        ...data,
      };
    });
}

/* ------------------------------ media (Cloudinary) ------------------------------ */

export function cloudinaryBase(): string {
  return (process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL ?? "").trim().replace(/\/+$/, "");
}

function stripExtension(value: string) {
  return value.replace(/\.[^./]+$/, "");
}

function encodePath(value: string) {
  return value.split("/").filter(Boolean).map(encodeURIComponent).join("/");
}

export function isVideoFile(fileName: string) {
  return VIDEO_EXTENSIONS.has(path.extname(fileName).toLowerCase());
}

type CloudOptions = { width?: number; kind?: "poster" };

/**
 * Builds an optimised Cloudinary delivery URL (auto format + quality).
 * Public IDs are the file path WITHOUT its extension, e.g. creative-works/3d/models/Donut-01.
 */
export function cloudUrl(folder: string, publicPath: string, options: CloudOptions = {}): string {
  const base = cloudinaryBase();
  if (!base) return "";

  const id = encodePath(`${folder}/${stripExtension(publicPath)}`);

  if (isVideoFile(publicPath)) {
    return options.kind === "poster"
      ? `${base}/video/upload/so_0,f_jpg,q_auto,c_limit,w_900/${id}.jpg`
      : `${base}/video/upload/q_auto/${id}.mp4`;
  }

  const width = options.width ? `,c_limit,w_${options.width}` : "";
  return `${base}/image/upload/f_auto,q_auto${width}/${id}`;
}

export function getProjectScreens(slug: string, names: string[]): MediaItem[] {
  const files = names.length > 0 ? names : [`${slug}.png`];
  const items: MediaItem[] = [];

  for (const file of files) {
    const encoded = encodeURIComponent(file);
    if (fs.existsSync(path.join(process.cwd(), "projects", file))) {
      items.push({ name: file, path: `/media/projects/${encoded}`, type: "image" });
    } else if (fs.existsSync(path.join(process.cwd(), "public", "projects", file))) {
      items.push({ name: file, path: `/projects/${encoded}`, type: "image" });
    } else {
      const remote = cloudUrl("projects", file, { width: 1800 });
      if (remote) items.push({ name: file, path: remote, type: "image" });
    }
  }
  return items;
}

export function getCertificatePreview(certificateSlug: string, filename = `${certificateSlug}.png`): MediaItem {
  const encoded = encodeURIComponent(filename);
  if (fs.existsSync(path.join(process.cwd(), "certificates", filename))) {
    return { name: filename, path: `/media/certificates/${encoded}`, type: "image" };
  }
  return { name: filename, path: cloudUrl("certificate", filename, { width: 1600 }), type: "image" };
}

/* ------------------------------ content collections ------------------------------ */

function readCreativeWorks(directory: string, entries: CreativeWorkEntry[] = [], category = ""): CreativeWorkEntry[] {
  const absoluteDirectory = path.join(process.cwd(), "content", directory);
  if (!fs.existsSync(absoluteDirectory)) return entries;

  const children = fs.readdirSync(absoluteDirectory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));

  for (const child of children) {
    const childPath = path.join(absoluteDirectory, child.name);

    if (child.isDirectory()) {
      readCreativeWorks(path.join(directory, child.name), entries, category || child.name);
      continue;
    }
    if (!child.name.endsWith(".md") && !child.name.endsWith(".txt")) continue;

    const { data, content } = parseFrontMatter(fs.readFileSync(childPath, "utf8"));
    const slug = path.basename(child.name, path.extname(child.name));
    const mediaPaths = safeArray(data.media);
    const segments = mediaPaths[0]?.split("/") ?? [];

    entries.push({
      ...data,
      slug,
      title: safeText(data.title, slug.replace(/[-_]+/g, " ")),
      summary: safeText(data.summary, content.slice(0, 180).replace(/\s+/g, " ")),
      content,
      category,
      group: safeText(data.group, segments.length >= 3 ? segments[1] : ""),
      tools: safeArray(data.tools),
      media: mediaPaths.map((mediaPath): MediaItem => {
        const video = isVideoFile(mediaPath);
        return {
          name: path.basename(mediaPath),
          path: cloudUrl("creative-works", mediaPath, { width: 1800 }) || `/media/${encodePath(mediaPath)}`,
          thumb: video ? undefined : cloudUrl("creative-works", mediaPath, { width: 900 }) || undefined,
          poster: video ? cloudUrl("creative-works", mediaPath, { kind: "poster" }) || undefined : undefined,
          type: video ? "video" : "image",
        };
      }),
    });
  }
  return entries;
}

function entryOrder(entry: MarkdownEntry): number {
  const order = Number(entry.order);
  return Number.isFinite(order) ? order : Number.MAX_SAFE_INTEGER;
}

function readVisibleProjects(): ProjectEntry[] {
  return readMarkdownCollection("projects")
    .filter((project) => project.hidden !== true)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured === true ? -1 : 1;
      const difference = entryOrder(a) - entryOrder(b);
      return difference !== 0 ? difference : safeText(a.title).localeCompare(safeText(b.title));
    })
    .map((project) => {
      const screens = getProjectScreens(project.slug, safeArray(project.screens));
      return { ...project, screens, picture: screens[0]?.path ?? "" };
    });
}

export const profile = readMarkdownFile("content/profile.md");
export const about = readMarkdownFile("content/about.md");
export const skills = readMarkdownFile("content/skills.md");
export const projects = readVisibleProjects();
export const creativeWorks = readCreativeWorks("creative-works").sort((a, b) => {
  const difference = entryOrder(a) - entryOrder(b);
  return difference !== 0 ? difference : a.title.localeCompare(b.title);
});
export const certificates = readMarkdownCollection("certificates").filter((item) => item.hidden !== true);
export const testimonials = readMarkdownCollection("testimonials");

export function getVisibleCreativeWorks(category?: string) {
  return creativeWorks.filter(
    (work) => work.media.length > 0 && !work.slug.includes("template") && (!category || work.category === category),
  );
}

export function getSiteStats() {
  const technologies = new Set(
    Object.values(skills).filter(Array.isArray).flatMap((group) => group as string[]),
  );
  const since = Number(profile.since) || 2024;

  return {
    projects: projects.length,
    years: Math.max(1, new Date().getFullYear() - since),
    creative: getVisibleCreativeWorks().length,
    technologies: technologies.size,
  };
}
