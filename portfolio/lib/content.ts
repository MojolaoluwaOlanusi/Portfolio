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
};

export type CreativeWorkEntry = MarkdownEntry & {
  category: string;
};

export type ProjectCaseStudy = {
  problem: string;
  process: string;
  result: string;
  impact: string;
};

function cleanValue(value: string) {
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
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);

  if (!match) {
    return { data: {}, content: raw.trim() };
  }

  const lines = match[1].split(/\r?\n/);
  const data: Record<string, unknown> = {};

  for (const line of lines) {
    if (!line.includes(":")) continue;

    const separatorIndex = line.indexOf(":");
    const key = line.slice(0, separatorIndex).trim();
    const value = cleanValue(line.slice(separatorIndex + 1));

    if (key) {
      data[key] = value;
    }
  }

  return {
    data,
    content: match[2].trim(),
  };
}

export function safeText(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

export function safeArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function readMarkdownFile(filePath: string): MarkdownEntry {
  const absolutePath = path.join(/* turbopackIgnore: true */ process.cwd(), filePath);
  const fileContents = fs.readFileSync(absolutePath, "utf8");
  const { data, content } = parseFrontMatter(fileContents);

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

  if (!fs.existsSync(absoluteDirectory)) {
    return [];
  }

  return fs
    .readdirSync(absoluteDirectory)
    .filter((file) => file.endsWith(".md") || file.endsWith(".txt"))
    .sort()
    .map((file) => {
      const filePath = path.join(absoluteDirectory, file);
      const { data, content } = parseFrontMatter(fs.readFileSync(filePath, "utf8"));
      const slug = path.basename(file, path.extname(file));

      return {
        slug,
        title: String(data.title || slug.replace(/[-_]+/g, " ")),
        summary: String(data.summary || content.slice(0, 180).replace(/\s+/g, " ")),
        content,
        ...data,
      };
    });
}

function readMarkdownFilesRecursively(
  directory: string,
  entries: CreativeWorkEntry[] = [],
  category = "",
): CreativeWorkEntry[] {
  const absoluteDirectory = path.join(process.cwd(), "content", directory);

  if (!fs.existsSync(absoluteDirectory)) return entries;

  for (const entry of fs.readdirSync(absoluteDirectory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const entryPath = path.join(absoluteDirectory, entry.name);

    if (entry.isDirectory()) {
      readMarkdownFilesRecursively(path.join(directory, entry.name), entries, category || entry.name);
      continue;
    }

    if (!entry.name.endsWith(".md") && !entry.name.endsWith(".txt")) continue;

    const { data, content } = parseFrontMatter(fs.readFileSync(entryPath, "utf8"));
    const slug = path.basename(entry.name, path.extname(entry.name));

    entries.push({
      slug,
      title: safeText(data.title, slug.replace(/[-_]+/g, " ")),
      summary: safeText(data.summary, content.slice(0, 180).replace(/\s+/g, " ")),
      content,
      category,
      ...data,
    });
  }

  return entries;
}

export function normalizeMediaGroupName(fileName: string): string {
  const withoutExtension = fileName.replace(/\.[^/.]+$/, "");

  const normalized = withoutExtension
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/-(\d{1,3})$/i, "")
    .replace(/-(animation|motion|render|shot|still|preview|cover|thumbnail|detail|hero)$/i, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || withoutExtension;
}

export function groupMediaItemsByName(items: MediaItem[]) {
  const groups = new Map<string, MediaItem[]>();

  for (const item of items) {
    const key = normalizeMediaGroupName(item.name);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  }

  return [...groups.entries()]
    .map(([key, groupItems]) => ({
      key,
      title: key
        .split("-")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      items: groupItems.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

function collectMediaFiles(directory: string, mediaRoot: string, urlRoot: string, results: MediaItem[] = []): MediaItem[] {
  const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);
  const videoExtensions = new Set([".mp4", ".mov", ".webm", ".avi", ".m4v"]);

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      collectMediaFiles(entryPath, mediaRoot, urlRoot, results);
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();
    if (!imageExtensions.has(extension) && !videoExtensions.has(extension)) {
      continue;
    }

    results.push({
      name: entry.name,
      path: `${urlRoot}/${path.relative(mediaRoot, entryPath).replace(/\\/g, "/").split("/").map(encodeURIComponent).join("/")}`,
      type: imageExtensions.has(extension) ? "image" : "video",
    });
  }

  return results;
}

export function getMediaFilesForFolder(folderPath: string): MediaItem[] {
  const absoluteFolder = path.resolve(process.cwd(), "..", folderPath);

  if (!fs.existsSync(absoluteFolder)) {
    return [];
  }

  const mediaRoot = path.resolve(process.cwd(), "..", "creative work");
  return collectMediaFiles(absoluteFolder, mediaRoot, "/media").sort((a, b) => a.name.localeCompare(b.name));
}

export function getProjectMedia(projectSlug: string): MediaItem[] {
  const mediaRoot = path.resolve(process.cwd(), "projects");

  if (!fs.existsSync(mediaRoot)) return [];

  const files = collectMediaFiles(mediaRoot, mediaRoot, "/media/projects");
  return files
    .filter((item) => path.basename(item.name, path.extname(item.name)).toLowerCase() === projectSlug.toLowerCase())
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function readVisibleProjects(): Array<MarkdownEntry & { picture: string }> {
  return readMarkdownCollection("projects")
    .filter((project) => project.hidden !== true)
    .map((project) => ({ ...project, picture: getProjectMedia(project.slug)[0]?.path ?? "" }));
}

export const profile = readMarkdownFile("content/profile.md");
export const about = readMarkdownFile("content/about.md");
export const skills = readMarkdownFile("content/skills.md");
export const projects = readVisibleProjects();
export const allProjects = readMarkdownCollection("projects");
export const creativeWork = readMarkdownCollection("creative");
export const creativeWorks = readMarkdownFilesRecursively("creative-works");
export const certificates = readMarkdownCollection("certificates");
export const testimonials = readMarkdownCollection("testimonials");

export const socialProof = {
  projectsCompleted: Math.max(3, allProjects.length),
  yearsExperience: 2,
  creativeTracks: 6,
  collaborations: 8,
};
