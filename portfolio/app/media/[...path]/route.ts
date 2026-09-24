import fs from "fs/promises";
import path from "path";

const creativeMediaRoot = path.resolve(process.cwd(), "..", "creative work");
const projectMediaRoot = path.resolve(process.cwd(), "projects");

const contentTypes: Record<string, string> = {
  ".avi": "video/x-msvideo",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".m4v": "video/x-m4v",
  ".mov": "video/quicktime",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
  ".webp": "image/webp",
};

export async function GET(_request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await context.params;
  const isProjectMedia = segments[0] === "projects";
  const mediaRoot = isProjectMedia ? projectMediaRoot : creativeMediaRoot;
  const mediaSegments = isProjectMedia ? segments.slice(1) : segments;
  const requestedPath = path.resolve(mediaRoot, ...mediaSegments);

  if (requestedPath !== mediaRoot && !requestedPath.startsWith(`${mediaRoot}${path.sep}`)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await fs.readFile(requestedPath);
    const extension = path.extname(requestedPath).toLowerCase();

    return new Response(file, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentTypes[extension] ?? "application/octet-stream",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}