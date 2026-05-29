"use client";

import { useState } from "react";
import { govMediaUrl, localMediaUrl } from "@/lib/format";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
};

/** Сначала локальный /uploads (если sync скачал), иначе CDN gov.kz. */
export function GovImage({ src, alt = "", className, loading = "lazy" }: Props) {
  const [useRemote, setUseRemote] = useState(false);
  const url = useRemote ? govMediaUrl(src) : localMediaUrl(src) || govMediaUrl(src);

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        if (!useRemote) setUseRemote(true);
      }}
    />
  );
}
