#!/usr/bin/env node
/** Скачать только картинки для главной (без полного sync). */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const UA = "Mozilla/5.0";
const MAX = Number(process.env.SYNC_MAX_IMAGES || 12);

const content = JSON.parse(
  await fs.readFile(path.join(ROOT, "data/content.json"), "utf8"),
);

const paths = new Set();
for (const n of content.news || []) {
  for (const m of (n.body || "").matchAll(/src="(\/uploads\/[^"]+)"/g)) {
    paths.add(m[1]);
    if (paths.size >= MAX) break;
  }
  if (paths.size >= MAX) break;
}
for (const p of content.projects || []) {
  if (p.icon) paths.add(p.icon);
}

for (const rel of paths) {
  const local = path.join(ROOT, "public", rel);
  await fs.mkdir(path.dirname(local), { recursive: true });
  try {
    await fs.access(local);
    console.log("skip", rel);
    continue;
  } catch {
    /* */
  }
  const res = await fetch(`https://www.gov.kz${rel}`, { headers: { "User-Agent": UA } });
  if (res.ok) {
    await fs.writeFile(local, Buffer.from(await res.arrayBuffer()));
    console.log("ok", rel);
  } else {
    console.log("fail", rel, res.status);
  }
}

console.log(`Done: ${paths.size} paths`);
