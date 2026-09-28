"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import type { MutableRefObject } from "react";

const BRASS = "#c6a15b";
const GRAPHITE = "#1c1a17";

interface TowerSpec {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
}

function makeSkyline(count: number, seed: number): TowerSpec[] {
  // Deterministic pseudo-random skyline so server/client (and repeat renders) match.
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const towers: TowerSpec[] = [];
  for (let i = 0; i < count; i++) {
    const spread = 16;
    towers.push({
      x: (i - count / 2) * (spread / count) + (rand() - 0.5) * 0.6,
      z: -rand() * 6 - 2,
      width: 0.6 + rand() * 0.9,
      depth: 0.6 + rand() * 0.9,
      height: 1.5 + rand() * rand() * 7,
    });
  }
  return towers;
}

function Tower({ spec, index }: { spec: TowerSpec; index: number }) {
  const geometry = useMemo(
    () => new THREE.BoxGeometry(spec.width, spec.height, spec.depth),
    [spec.width, spec.height, spec.depth],
  );
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  return (
    <group position={[spec.x, spec.height / 2 - 1.2, spec.z]}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={GRAPHITE}
          metalness={0.6}
          roughness={0.5}
        />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial
          color={BRASS}
          transparent
          opacity={index % 3 === 0 ? 0.9 : 0.35}
        />
      </lineSegments>
    </group>
  );
}

interface SkylineSceneProps {
  scrollProgress: MutableRefObject<number>;
  towerCount: number;
  sparkleCount: number;
  animate: boolean;
}

export function SkylineScene({
  scrollProgress,
  towerCount,
  sparkleCount,
  animate,
}: SkylineSceneProps) {
  const towers = useMemo(() => makeSkyline(towerCount, 42), [towerCount]);
  const rigRef = useRef<THREE.Group>(null);
  const displayed = useRef(0);
  const camTarget = useRef(new THREE.Vector3(0, 4, 18));
  const lookTarget = useRef(new THREE.Vector3(0, 1, -4));

  useFrame(({ camera }, delta) => {
    if (animate) {
      displayed.current +=
        (scrollProgress.current - displayed.current) * Math.min(1, delta * 2.2);
    } else {
      displayed.current = 0;
    }
    const p = displayed.current;

    camTarget.current.set(
      -2 + p * 4,
      4 - p * 2.3,
      18 - p * 10,
    );
    camera.position.lerp(camTarget.current, 0.15);

    lookTarget.current.set(0.5 * p, 1 - p * 0.3, -4);
    camera.lookAt(lookTarget.current);

    if (rigRef.current) {
      rigRef.current.rotation.y = p * 0.25;
    }
  });

  return (
    <group ref={rigRef}>
      <ambientLight intensity={0.35} color={"#7a6a4a"} />
      <directionalLight
        position={[6, 10, 4]}
        intensity={0.6}
        color={"#f0e6cf"}
      />
      <pointLight position={[-4, 3, 6]} intensity={0.5} color={BRASS} />

      {towers.map((spec, i) => (
        <Tower key={i} spec={spec} index={i} />
      ))}

      <Sparkles
        count={sparkleCount}
        scale={[18, 8, 10]}
        position={[0, 2, -2]}
        size={2.4}
        speed={animate ? 0.15 : 0}
        color={BRASS}
        opacity={0.6}
      />

      <fog attach="fog" args={[GRAPHITE, 10, 28]} />
    </group>
  );
}
