// Verifies that every media file referenced by your content exists on Cloudinary.
//   npm run media:check
import fs from "node:fs";
import path from "node:path";

const base = (process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL ?? "").replace(/\/+$/, "");
if (!base || base.includes("YOUR_CLOUD_NAME")) {
  console.error("Set NEXT_PUBLIC_CLOUDINARY_BASE_URL in .env.local first (https://res.cloudinary.com/<cloud-name>).");
  process.exit(1);
}

const VIDEO = new Set([".mp4", ".mov", ".webm", ".m4v", ".avi"]);
const enc = (p) => p.split("/").filter(Boolean).map(encodeURIComponent).join("/");
const noExt = (p) => p.replace(/\.[^./]+$/, "");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(md|txt)$/.test(entry.name)) yield full;
  }
}

function frontmatterList(file, key) {
  const text = fs.readFileSync(file, "utf8");
  const match = text.match(new RegExp(`^${key}:\\s*\\[(.*)\\]\\s*$`, "m"));
  return match ? match[1].split(",").map((s) => s.trim()).filter(Boolean) : [];
}

const checks = [];
for (const file of walk(path.join("content", "creative-works"))) {
  if (file.includes("template")) continue;
  for (const media of frontmatterList(file, "media")) {
    const isVideo = VIDEO.has(path.extname(media).toLowerCase());
    const url = `${base}/${isVideo ? "video" : "image"}/upload/${isVideo ? "" : "f_auto,q_auto/"}creative-works/${enc(noExt(media))}${isVideo ? ".mp4" : ""}`;
    checks.push({ label: `creative-works/${media}`, url });
  }
}
for (const file of walk(path.join("content", "projects"))) {
  const text = fs.readFileSync(file, "utf8");
  if (/^hidden:\s*true/m.test(text) || file.includes("template")) continue;
  const slug = path.basename(file, path.extname(file));
  const screens = frontmatterList(file, "screens");
  for (const screen of screens.length ? screens : [`${slug}.png`]) {
    checks.push({ label: `projects/${screen}`, url: `${base}/image/upload/f_auto,q_auto/projects/${enc(noExt(screen))}` });
  }
}

async function probe(url) {
  let lastError = "";
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(15000) });
      return { status: response.status };
    } catch (error) {
      lastError = error?.cause?.code ?? error?.message ?? "network error";
      await sleep(1500 * attempt);
    }
  }
  return { error: lastError };
}

let missing = 0;
let network = 0;
for (const { label, url } of checks) {
  const result = await probe(url);
  if (result.error) {
    console.log(`NETWORK  ${label}  (${result.error}, could not reach Cloudinary, try again)`);
    network++;
  } else if (result.status >= 200 && result.status < 300) {
    console.log(`OK       ${label}`);
  } else {
    console.log(`MISSING  ${label}  (HTTP ${result.status})`);
    missing++;
  }
}

console.log(`\n${checks.length - missing - network}/${checks.length} reachable, ${missing} missing, ${network} network errors.`);
if (missing) console.log("Missing files: run npm run media:upload (finished files are skipped).");
if (network) console.log("Network errors mean your connection dropped, not that files are missing. Run the check again.");
if (missing || network) process.exitCode = 1;
