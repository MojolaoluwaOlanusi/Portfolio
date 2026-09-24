import fs from "fs";
import path from "path";

export type MarkdownEntry = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  [key: string]: unknown;
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

export const profile = readMarkdownFile("content/profile.md");
export const about = readMarkdownFile("content/about.md");
export const skills = readMarkdownFile("content/skills.md");
export const projects = readMarkdownCollection("projects");
export const creativeWork = readMarkdownCollection("creative");
export const certificates = readMarkdownCollection("certificates");
export const testimonials = readMarkdownCollection("testimonials");
