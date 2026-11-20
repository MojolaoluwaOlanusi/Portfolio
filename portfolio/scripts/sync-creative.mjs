// Links your local "creative work" files to markdown entries, and creates entries for any file nothing points at.
//   node scripts/sync-creative.mjs          -> dry run (prints what it would do)
//   node scripts/sync-creative.mjs --write  -> applies the changes
import fs from "node:fs";
import path from "node:path";

const write = process.argv.includes("--write");
const root = process.cwd();
const mediaRoot = path.resolve(root, "..", "creative work");
const contentRoot = path.join(root, "content", "creative-works");
const MEDIA = /\.(png|jpe?g|webp|gif|mp4|mov|webm|m4v|avi)$/i;

if (!fs.existsSync(mediaRoot)) {
  console.log(`No "creative work" folder found at ${mediaRoot}. Nothing to sync.`);
  process.exit(0);
}

function* walk(dir, filter) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full, filter);
    else if (filter(entry.name)) yield full;
  }
}

function stem(name) {
  let value = name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[\s._]+/g, "-");
  let previous;
  do {
    previous = value;
    value = value.replace(/-(\d{1,3})$/, "").replace(/-(animation|motion|render|shot|still|preview|cover|thumbnail|detail|hero)$/, "");
  } while (value !== previous);
  return value.replace(/^-+|-+$/g, "");
}

const files = [...walk(mediaRoot, (n) => MEDIA.test(n))].map((full) => path.relative(mediaRoot, full).split(path.sep).join("/"));

const entries = [...walk(contentRoot, (n) => n.endsWith(".md") && !n.includes("template"))].map((file) => {
  const text = fs.readFileSync(file, "utf8");
  const match = text.match(/^media:\s*\[(.*)\]\s*$/m);
  const title = (text.match(/^title:\s*(.+)$/m) ?? [])[1] ?? "";
  return { file, text, slug: path.basename(file, ".md"), title, media: match ? match[1].split(",").map((s) => s.trim()).filter(Boolean) : [] };
});

const referenced = new Set(entries.flatMap((entry) => entry.media));
const missingOnDisk = [...referenced].filter((media) => !files.includes(media));
missingOnDisk.forEach((media) => console.warn(`! Referenced but not found on disk: ${media}`));

// 1) Entries with no media: try to find files by name.
for (const entry of entries) {
  if (entry.media.length) continue;
  const keys = new Set([stem(entry.slug), stem(entry.title)]);
  const found = files.filter((file) => keys.has(stem(path.basename(file))) && !referenced.has(file)).sort();
  if (!found.length) {
    console.log(`? No files found for "${entry.slug}" (add a media: line by hand)`);
    continue;
  }
  console.log(`+ Link ${entry.slug}: ${found.join(", ")}`);
  found.forEach((file) => referenced.add(file));
  if (write) {
    const line = `media: [${found.join(", ")}]`;
    fs.writeFileSync(entry.file, entry.text.replace(/^(---\s*\n[\s\S]*?)(\n---)/, `$1\n${line}$2`));
  }
}

// 2) Files nothing points at: create new entries.
const orphans = files.filter((file) => !referenced.has(file));
const groups = new Map();
for (const file of orphans) {
  const key = `${path.dirname(file)}/${stem(path.basename(file))}`;
  groups.set(key, [...(groups.get(key) ?? []), file]);
}

for (const [key, group] of groups) {
  const [category] = group[0].split("/");
  const dir = path.dirname(group[0]);
  const slug = path.basename(key);
  const title = slug.split("-").filter(Boolean).map((p) => p[0].toUpperCase() + p.slice(1)).join(" ");
  const target = path.join(contentRoot, ...dir.split("/"), `${slug}.md`);
  console.log(`+ New entry ${path.relative(root, target)} <- ${group.join(", ")}`);
  if (write && !fs.existsSync(target)) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `---\ntitle: ${title}\nsummary: Add a one-line description of ${title} here.\nmedia: [${group.sort().join(", ")}]\n---\nAdd the brief, your process, the tools you used and the final result here.\n`);
  }
  void category;
}

console.log(write ? "\nApplied. Review with: git diff" : "\nDry run only. Re-run with --write to apply.");
