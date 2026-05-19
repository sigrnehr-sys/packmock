"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { makePouchGeometry, sceneHeight } from "@/lib/geometry/pouch";
import { computeLayout } from "@/lib/layout";
import { buildArtworkCanvas } from "@/lib/texture";
import type { BagSpec, BagType } from "@/lib/types";

function Pouch({
  spec,
  shape,
  image,
}: {
  spec: BagSpec;
  shape: BagType["shape"];
  image: HTMLImageElement | null;
}) {
  const geometry = useMemo(
    () => makePouchGeometry(spec, shape),
    [spec, shape]
  );

  const texture = useMemo(() => {
    const layout = computeLayout(spec);
    const canvas = buildArtworkCanvas({ layout, image });
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    t.needsUpdate = true;
    return t;
  }, [spec, image]);

  const frontMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.35,
        roughness: 0.38,
        side: THREE.DoubleSide,
      }),
    [texture]
  );

  const backMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#b9bdc0",
        metalness: 0.45,
        roughness: 0.32,
        side: THREE.DoubleSide,
      }),
    []
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      texture.dispose();
      frontMat.dispose();
      backMat.dispose();
    };
  }, [geometry, texture, frontMat, backMat]);

  return (
    <mesh geometry={geometry} material={[frontMat, backMat]} castShadow />
  );
}

export function BagViewer3D({
  spec,
  shape,
  image,
}: {
  spec: BagSpec;
  shape: BagType["shape"];
  image: HTMLImageElement | null;
}) {
  const h = sceneHeight(spec);
  const controls = useRef(null);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [h * 0.4, h * 0.15, h * 2.2], fov: 35 }}
    >
      <color attach="background" args={["#0f1115"]} />
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[3, 6, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, 2, -3]} intensity={0.6} />
      <Suspense fallback={null}>
        <Pouch spec={spec} shape={shape} image={image} />
        <ContactShadows
          position={[0, -h / 2 - 0.02, 0]}
          opacity={0.45}
          scale={h * 3}
          blur={2.5}
          far={h}
        />
      </Suspense>
      <OrbitControls
        ref={controls}
        enablePan={false}
        minDistance={h}
        maxDistance={h * 5}
      />
    </Canvas>
  );
}
