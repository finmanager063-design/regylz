#!/usr/bin/env node
/** Все уникальные /uploads/ из data/content.json и статей. */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const UPLOAD_RE = /\/uploads\/[^\s"'<>]+\.(?:jpg|jpeg|png|gif|webp|JPG|JPEG|PNG|GIF|WEBP)/gi;

export function normalizeUpload(rel) {
  if (!rel) return null;
  if (rel.startsWith("http")) {
    const m = rel.match(/(\/uploads\/[^\s"']+)/);
    return m ? m[1] : null;
  }
  return rel.startsWith("/") ? rel : `/${rel}`;
}

export async function collectAllUploadPaths() {
  const paths = new Set();
  const contentPath = path.join(ROOT, "data/content.json");
  const raw = await fs.readFile(contentPath, "utf8");
  for (const m of raw.matchAll(UPLOAD_RE)) {
    const n = normalizeUpload(m[0]);
    if (n) paths.add(n);
  }

  try {
    const featuredPath = path.join(ROOT, "src/lib/featured-articles.ts");
    const featured = await fs.readFile(featuredPath, "utf8");
    for (const m of featured.matchAll(UPLOAD_RE)) {
      const n = normalizeUpload(m[0]);
      if (n) paths.add(n);
    }
  } catch {
    /* optional */
  }

  return [...paths];
}

