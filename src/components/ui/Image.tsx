"use client";

import NextImage, { type ImageProps as NextImageProps } from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type ImageProps = NextImageProps & {
  /** Swapped in if the primary source fails to load. */
  fallbackSrc?: NextImageProps["src"];
};

/**
 * Thin wrapper over `next/image` that adds graceful error handling on top of
 * Next's built-in AVIF/WebP negotiation, lazy loading, and responsive sizing.
 *
 * Callers still provide `width`/`height` (or `fill` + a sized parent) and a
 * `sizes` attribute — the wrapper deliberately doesn't guess those. `alt` is
 * required by the underlying type, keeping images accessible by construction.
 * For `fill` usage, give the parent `position: relative` and set `sizes`.
 */
export function Image({
  src,
  fallbackSrc,
  alt,
  onError,
  className,
  ...rest
}: ImageProps) {
  const [errored, setErrored] = useState(false);
  const showFallback = errored && fallbackSrc !== undefined;

  return (
    <NextImage
      src={showFallback ? fallbackSrc : src}
      alt={alt}
      className={cn("max-w-full", className)}
      onError={(event) => {
        setErrored(true);
        onError?.(event);
      }}
      {...rest}
    />
  );
}
