// Uploads local media to Cloudinary using the exact public IDs the site expects.
//   npm run media:upload            -> uploads anything not already on Cloudinary
//   npm run media:upload -- --force -> re-uploads everything
// Files over the free-plan limits are compressed automatically (images with sharp, videos with ffmpeg).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { v2 as cloudinary } from "cloudinary";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_URL } = process.env;
if (!CLOUDINARY_URL && !(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET)) {
  console.error("Missing credentials. Fill CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env.local");
  process.exit(1);
}
if (!CLOUDINARY_URL) {
  cloudinary.config({ cloud_name: CLOUDINARY_CLOUD_NAME, api_key: CLOUDINARY_API_KEY, api_secret: CLOUDINARY_API_SECRET });
}
cloudinary.config({ secure: true });

const force = process.argv.includes("--force");
const root = process.cwd();
const MB = 1024 * 1024;
const IMAGE_LIMIT = 9.5 * MB; // free plan: 10 MB
const VIDEO_LIMIT = 95 * MB; // free plan: 100 MB
const MAX_PIXELS = 24_000_000; // free plan: 25 MP
const IMAGE = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const VIDEO = new Set([".mp4", ".mov", ".webm", ".m4v", ".avi"]);
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-media-"));

const sources = [
  { dir: path.resolve(root, "..", "creative work"), folder: "creative-works" },
  { dir: path.join(root, "projects"), folder: "projects" },
  { dir: path.join(root, "certificates"), folder: "certificate" },
];

let sharp = null;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.warn("(sharp is not installed, so oversized images cannot be compressed. Run: npm i -D sharp)");
}
const ffmpegOk = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" }).status === 0;
if (!ffmpegOk) console.warn("(ffmpeg not found, so oversized videos cannot be compressed. Install it with: winget install --id Gyan.FFmpeg -e  then reopen the terminal)");

const errText = (error) => {
  const inner = error?.error ?? error;
  if (typeof inner === "string") return inner;
  return inner?.message ?? JSON.stringify(inner);
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function withRetry(label, fn, tries = 4) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= tries) throw error;
      const wait = attempt * 4000;
      console.log(`  ...retry ${attempt}/${tries - 1} for ${label} in ${wait / 1000}s (${errText(error)})`);
      await sleep(wait);
    }
  }
}

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

/** true = already there, false = definitely missing, null = could not tell (network) */
async function exists(publicId, resourceType) {
  try {
    const response = await fetch(cloudinary.url(publicId, { resource_type: resourceType, secure: true }), {
      method: "HEAD",
      signal: AbortSignal.timeout(15000),
    });
    if (response.ok) return true;
    return response.status === 404 ? false : null;
  } catch {
    return null;
  }
}

async function prepareImage(file, size) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".gif") return size <= IMAGE_LIMIT ? { file } : null;
  if (!sharp) return size <= IMAGE_LIMIT ? { file } : null;

  const meta = await sharp(file).metadata();
  const width0 = meta.width ?? 4096;
  const pixels = width0 * (meta.height ?? 0);
  if (size <= IMAGE_LIMIT && pixels <= MAX_PIXELS) return { file };

  let maxWidth = width0;
  if (pixels > MAX_PIXELS) maxWidth = Math.floor(width0 * Math.sqrt(MAX_PIXELS / pixels) * 0.97);

  for (const width of [maxWidth, 3840, 3200, 2560, 2048, 1600].filter((w) => w <= maxWidth)) {
    for (const quality of [92, 85, 78, 70]) {
      const out = path.join(tmpDir, `${Date.now()}-${path.basename(file, ext)}.webp`);
      await sharp(file).rotate().resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(out);
      const outSize = fs.statSync(out).size;
      if (outSize <= IMAGE_LIMIT) {
        return { file: out, note: `compressed ${(size / MB).toFixed(1)} MB -> ${(outSize / MB).toFixed(1)} MB (webp ${width}px, q${quality})` };
      }
    }
  }
  return null;
}

function prepareVideo(file, size) {
  if (size <= VIDEO_LIMIT) return { file };
  if (!ffmpegOk) return null;

  const attempts = [
    { crf: 26, height: 1080 },
    { crf: 30, height: 1080 },
    { crf: 30, height: 720 },
    { crf: 34, height: 720 },
    { crf: 36, height: 540 },
  ];
  for (const { crf, height } of attempts) {
    const out = path.join(tmpDir, `${Date.now()}-${path.basename(file, path.extname(file))}.mp4`);
    console.log(`  compressing video (crf ${crf}, max ${height}p)...`);
    const result = spawnSync(
      "ffmpeg",
      ["-y", "-i", file, "-vf", `scale=-2:'min(${height},ih)'`, "-c:v", "libx264", "-preset", "medium", "-crf", String(crf), "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", out],
      { stdio: "ignore" },
    );
    if (result.status === 0 && fs.existsSync(out) && fs.statSync(out).size <= VIDEO_LIMIT) {
      return { file: out, note: `compressed ${(size / MB).toFixed(1)} MB -> ${(fs.statSync(out).size / MB).toFixed(1)} MB` };
    }
  }
  return null;
}

const problems = [];
let uploaded = 0;
let skipped = 0;

for (const { dir, folder } of sources) {
  for (const file of walk(dir)) {
    const ext = path.extname(file).toLowerCase();
    const isVideo = VIDEO.has(ext);
    if (!isVideo && !IMAGE.has(ext)) continue;

    const rel = path.relative(dir, file).split(path.sep).join("/");
    const base = path.basename(rel, path.extname(rel));
    const publicId = `${folder}/${rel.slice(0, rel.length - path.extname(rel).length)}`;
    const resourceType = isVideo ? "video" : "image";

    if (/[\s.]/.test(base)) {
      console.warn(`! RENAME FIRST (spaces/dots in name): ${rel}`);
      problems.push(rel);
      continue;
    }

    if (!force) {
      const present = await exists(publicId, resourceType);
      if (present === true) {
        console.log(`- skip     ${publicId}`);
        skipped++;
        continue;
      }
    }

    try {
      const size = fs.statSync(file).size;
      const prepared = isVideo ? prepareVideo(file, size) : await prepareImage(file, size);
      if (!prepared) {
        console.warn(`! Could not shrink under the free limit: ${rel}`);
        problems.push(rel);
        continue;
      }
      if (prepared.note) console.log(`  ${prepared.note}`);

      const options = { public_id: publicId, resource_type: resourceType, overwrite: true, invalidate: true, use_filename: false, unique_filename: false, timeout: 180000 };
      const finalSize = fs.statSync(prepared.file).size;
      await withRetry(publicId, () =>
        isVideo && finalSize > 20 * MB
          ? cloudinary.uploader.upload_large(prepared.file, { ...options, chunk_size: 6 * MB })
          : cloudinary.uploader.upload(prepared.file, options),
      );
      console.log(`+ uploaded ${publicId}`);
      uploaded++;
      if (prepared.file !== file) fs.rmSync(prepared.file, { force: true });
    } catch (error) {
      console.error(`x FAILED   ${publicId}: ${errText(error)}`);
      problems.push(rel);
    }
  }
}

fs.rmSync(tmpDir, { recursive: true, force: true });
console.log(`\nDone. uploaded ${uploaded}, skipped ${skipped}, problems ${problems.length}.`);
if (problems.length) {
  console.log("Problems:\n  " + problems.join("\n  "));
  console.log("\nIf these were network errors, just run the same command again: finished files are skipped.");
  process.exitCode = 1;
} else {
  console.log("Next: npm run media:check");
}
