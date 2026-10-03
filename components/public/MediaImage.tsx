"use client";

import { useEffect, useRef } from "react";
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
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth === 0) {
      retryAlternateMediaHost(image);
    }
  }, [src]);

  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      className={className}
      onError={(event) => retryAlternateMediaHost(event.currentTarget)}
    />
  );
}