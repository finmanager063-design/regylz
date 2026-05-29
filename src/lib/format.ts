import { assetPath } from "./base-path";

const GOV_ORIGIN = "https://www.gov.kz";

function normalizeUpload(src: string): string {
  if (src.startsWith("http")) {
    const m = src.match(/(\/uploads\/[^\s"']+)/);
    return m ? m[1] : src;
  }
  if (src.startsWith("uploads/")) return `/${src}`;
  if (src.startsWith("/")) return src;
  return `/${src}`;
}

/** Локальный путь (public/uploads после sync), с учётом basePath. */
export function localMediaUrl(src?: string | null): string {
  if (!src) return "";
  if (src.startsWith("http")) {
    const m = src.match(/(\/uploads\/[^\s"']+)/);
    return m ? assetPath(m[1]) : src;
  }
  return assetPath(normalizeUpload(src));
}

/** Абсолютный URL на gov.kz (fallback для картинок). */
export function govMediaUrl(src?: string | null): string {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  const path = normalizeUpload(src);
  return `${GOV_ORIGIN}${path}`;
}

/** @deprecated используйте localMediaUrl / govMediaUrl */
export function mediaUrl(src?: string | null): string {
  return localMediaUrl(src) || govMediaUrl(src);
}

export function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function rewriteGovHtml(html: string): string {
  const localUploads = assetPath("/uploads/");
  const govUploads = `${GOV_ORIGIN}/uploads/`;
  return html
    .replace(/src="\/uploads\//g, `src="${govUploads}`)
    .replace(/src="https:\/\/www\.gov\.kz\/uploads\//g, `src="${govUploads}`)
    .replace(/href="\/uploads\//g, `href="${localUploads}`)
    .replace(/href="https:\/\/www\.gov\.kz\/uploads\//g, `href="${localUploads}`)
    .replace(
      /<img(?![^>]*\bloading=)/gi,
      '<img loading="lazy" decoding="async" ',
    );
}
