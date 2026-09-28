"use client";

import { useSyncExternalStore } from "react";

const noSubscription = () => () => {};

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

let cachedWebGL: boolean | null = null;

/** Client-only, one-time capability check — never changes during a session. */
export function useWebGLAvailable(): boolean | null {
  return useSyncExternalStore(
    noSubscription,
    () => {
      if (cachedWebGL === null) cachedWebGL = detectWebGL();
      return cachedWebGL;
    },
    () => null,
  );
}

function subscribeMediaQuery(query: string) {
  return (onChange: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  };
}

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = subscribeMediaQuery(reducedMotionQuery);

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false,
  );
}

export function useIsSmallViewport(breakpoint = 768): boolean {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener("resize", onChange);
      return () => window.removeEventListener("resize", onChange);
    },
    () => window.innerWidth < breakpoint,
    () => false,
  );
}
