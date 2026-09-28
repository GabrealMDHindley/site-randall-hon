"use client";

import type { MutableRefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { SkylineScene } from "./SkylineScene";
import { useIsSmallViewport, usePrefersReducedMotion } from "./useWebGLAvailable";

interface HeroCanvasProps {
  scrollProgress: MutableRefObject<number>;
}

// Default export so `next/dynamic` can lazy-load this client-only bundle.
export default function HeroCanvas({ scrollProgress }: HeroCanvasProps) {
  const small = useIsSmallViewport();
  const reduced = usePrefersReducedMotion();

  return (
    <Canvas
      dpr={small ? [1, 1] : [1, 1.5]}
      camera={{ position: [-2, 4, 18], fov: 45, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: false }}
      className="!absolute inset-0"
    >
      <color attach="background" args={["#14120f"]} />
      <SkylineScene
        scrollProgress={scrollProgress}
        towerCount={small ? 9 : 16}
        sparkleCount={small ? 40 : 90}
        animate={!reduced}
      />
    </Canvas>
  );
}
