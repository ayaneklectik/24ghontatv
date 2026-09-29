"use client";

import { retryAlternateMediaHost } from "@/lib/urls";

export default function MediaImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(event) => retryAlternateMediaHost(event.currentTarget)}
    />
  );
}