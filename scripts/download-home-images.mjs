#!/usr/bin/env node
/**
 * Скачивает все фото /uploads/ из контента (до SYNC_MAX_IMAGES) для GitHub Pages.
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { collectAllUploadPaths, normalizeUpload } from "./collect-upload-paths.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const MAX = Number(process.env.SYNC_MAX_IMAGES || 220);
const CONCURRENCY = Number(process.env.SYNC_DL_CONCURRENCY || 6);

/** Приоритет: свежие пресс-релизы и главная. */
const PRIORITY = [
  "/uploads/2026/",
  "/uploads/2025/",
  "/uploads/2021/10/13/",
  "/uploads/2021/4/6/",
  "/uploads/2020/",
];

function sortPaths(paths) {
  return [...paths].sort((a, b) => {
    const pa = PRIORITY.findIndex((p) => a.includes(p));
    const pb = PRIORITY.findIndex((p) => b.includes(p));
    const scoreA = pa === -1 ? 99 : pa;
    const scoreB = pb === -1 ? 99 : pb;
    if (scoreA !== scoreB) return scoreA - scoreB;
    return b.localeCompare(a);
  });
}

async function downloadUpload(rel) {
  const normalized = normalizeUpload(rel);
  if (!normalized?.startsWith("/uploads/")) return false;

  const local = path.join(ROOT, "public", normalized);
  await fs.mkdir(path.dirname(local), { recursive: true });
  try {
    const st = await fs.stat(local);
    if (st.size > 500) return true;
  } catch {
    /* download */
  }

  const res = await fetch(`https://www.gov.kz${normalized}`, {
    headers: { "User-Agent": UA, "Accept-Language": "ru", Accept: "image/*" },
  });
  if (!res.ok) {
    console.log("fail", normalized, res.status);
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 200) {
    console.log("skip tiny", normalized, buf.length);
    return false;
  }
  await fs.writeFile(local, buf);
  console.log("ok", normalized, buf.length);
  return true;
}

async function runPool(items, worker) {
  let i = 0;
  let ok = 0;
  async function next() {
    while (i < items.length) {
      const idx = i++;
      if (await worker(items[idx])) ok++;
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => next()));
  return ok;
}

const all = sortPaths(await collectAllUploadPaths());
const list = all.slice(0, MAX);
console.log(`Downloading ${list.length} of ${all.length} unique uploads…`);

const ok = await runPool(list, downloadUpload);
console.log(`Done: ${ok}/${list.length} ok (max ${MAX}, total unique ${all.length})`);
