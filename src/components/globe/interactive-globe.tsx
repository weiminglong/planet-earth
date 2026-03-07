"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars, useTexture } from "@react-three/drei";
import {
  DoubleSide,
  Group,
  MathUtils,
  Quaternion,
  Vector3,
  Vector2,
} from "three";
import type { FloraPreview } from "@/lib/flora-data";
import { createCloudTexture, createModernEarthTexture } from "@/lib/globe-geography";
import { getFloraPalette } from "@/lib/visual-theme";
import { useExploreStore } from "@/store/explore-store";

const SURFACE_RADIUS = 1.96;
const GLOBE_TEXTURE_ROTATION = -Math.PI / 2;
const MARKER_HEIGHT = 0.2;
const UP_VECTOR = new Vector3(0, 1, 0);

type InteractiveGlobeProps = {
  flora: FloraPreview[];
};

type TextureImageSource = CanvasImageSource & {
  width: number;
  height: number;
};

function hasTextureImageSource(image: unknown): image is TextureImageSource {
  return (
    typeof image === "object" &&
    image !== null &&
    "width" in image &&
    typeof image.width === "number" &&
    "height" in image &&
    typeof image.height === "number"
  );
}

useTexture.preload("/textures/earth_daymap.jpg");
useTexture.preload("/textures/earth_normal.jpg");

export function InteractiveGlobe({ flora }: InteractiveGlobeProps) {
  const [isWebGlAvailable] = useState<boolean>(() => detectWebGlSupport());
  const setSelectedSlug = useExploreStore((state) => state.setSelectedSlug);

  if (isWebGlAvailable === false) {
    return <NoWebGlFallback flora={flora} />;
  }

  return (
    <div className="h-full min-h-[32rem] bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.18),_transparent_52%),linear-gradient(180deg,_rgba(2,6,23,0.2),_rgba(2,6,23,0.8))]">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.15, 7.8], fov: 34 }}
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={() => setSelectedSlug(null)}
      >
        <SceneChrome />
        <Suspense fallback={<SceneFallback />}>
          <Scene flora={flora} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function SceneChrome() {
  return (
    <>
      <color attach="background" args={["#02040a"]} />
      <fog attach="fog" args={["#02040a", 9, 18]} />
      <ambientLight intensity={0.46} />
      <directionalLight position={[6, 4, 5]} intensity={2.1} color="#f8fbff" />
      <directionalLight position={[-4, -2, 3]} intensity={0.82} color="#60a5fa" />
      <pointLight position={[-6, -1, -4]} intensity={5.2} color="#22d3ee" />
      <pointLight position={[2, 4, -5]} intensity={4.4} color="#818cf8" />
      <hemisphereLight args={["#cffafe", "#050b14", 0.9]} />
      <Stars radius={80} depth={30} count={4200} factor={4} saturation={0} fade speed={0.35} />
    </>
  );
}

function SceneFallback() {
  return (
    <group position={[-0.45, 0.02, 0]}>
      <Sphere args={[SURFACE_RADIUS, 96, 96]}>
        <meshStandardMaterial color="#10263e" roughness={0.76} metalness={0.04} />
      </Sphere>
      <Sphere args={[SURFACE_RADIUS + 0.018, 64, 64]}>
        <meshBasicMaterial color="#bfe7ff" transparent opacity={0.04} side={DoubleSide} />
      </Sphere>
    </group>
  );
}

function Scene({ flora }: InteractiveGlobeProps) {
  const selectedSlug = useExploreStore((state) => state.selectedSlug);
  const hoveredSlug = useExploreStore((state) => state.hoveredSlug);
  const setSelectedSlug = useExploreStore((state) => state.setSelectedSlug);
  const setHoveredSlug = useExploreStore((state) => state.setHoveredSlug);
  const globeRef = useRef<Group>(null);
  const cloudRef = useRef<Group>(null);
  const idleRotation = useRef(-0.8);
  const [dayTexture, normalTexture] = useTexture([
    "/textures/earth_daymap.jpg",
    "/textures/earth_normal.jpg",
  ]);
  const cloudTexture = useMemo(() => createCloudTexture(), []);
  const modernDayTexture = useMemo(() => {
    if (!hasTextureImageSource(dayTexture.image)) {
      return null;
    }

    return createModernEarthTexture(dayTexture.image);
  }, [dayTexture.image]);

  const selectedFlora = useMemo(
    () => flora.find((item) => item.slug === selectedSlug) ?? null,
    [flora, selectedSlug],
  );

  useEffect(() => {
    return () => {
      modernDayTexture?.dispose();
      cloudTexture.dispose();
    };
  }, [cloudTexture, modernDayTexture]);

  useFrame((state, delta) => {
    if (!globeRef.current || !cloudRef.current) {
      return;
    }

    const selectedLat = selectedFlora?.primaryRegion?.lat ?? -18;
    const selectedLng = selectedFlora?.primaryRegion?.lng ?? 12;
    const targetX = selectedFlora
      ? MathUtils.degToRad(selectedLat) * 0.72
      : MathUtils.degToRad(-14);

    let targetY: number;

    if (selectedFlora) {
      targetY = -MathUtils.degToRad(selectedLng) - 0.26;
    } else {
      idleRotation.current += delta * 0.08;
      targetY = idleRotation.current;
    }

    globeRef.current.rotation.x = MathUtils.damp(
      globeRef.current.rotation.x,
      targetX,
      3,
      delta,
    );
    globeRef.current.rotation.y = dampAngle(
      globeRef.current.rotation.y,
      targetY,
      2.4,
      delta,
    );

    cloudRef.current.rotation.y += delta * 0.018;
    cloudRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.12) * 0.04;
  });

  return (
    <>
      <group ref={globeRef} position={[-0.45, 0.02, 0]}>
        <group rotation={[0, GLOBE_TEXTURE_ROTATION, 0]}>
          <Sphere args={[SURFACE_RADIUS, 128, 128]}>
            <meshStandardMaterial
              map={modernDayTexture ?? dayTexture}
              normalMap={normalTexture}
              normalScale={new Vector2(0.58, 0.58)}
              roughness={0.9}
              metalness={0.02}
              emissive="#04111f"
              emissiveIntensity={0.08}
            />
          </Sphere>

          <Sphere args={[SURFACE_RADIUS + 0.022, 96, 96]}>
            <meshBasicMaterial
              color="#a5dbff"
              transparent
              opacity={0.035}
              side={DoubleSide}
            />
          </Sphere>

          <group ref={cloudRef}>
            <Sphere args={[SURFACE_RADIUS + 0.08, 96, 96]}>
              <meshStandardMaterial
                map={cloudTexture}
                color="#ecfeff"
                transparent
                opacity={0.17}
                depthWrite={false}
                emissive="#d9f5ff"
                emissiveIntensity={0.08}
              />
            </Sphere>
          </group>
        </group>

        <Sphere args={[SURFACE_RADIUS + 0.13, 96, 96]}>
          <meshBasicMaterial
            color="#8fdcff"
            transparent
            opacity={0.045}
            side={DoubleSide}
          />
        </Sphere>

        <group>
          <Sphere args={[SURFACE_RADIUS + 0.2, 96, 96]}>
            <meshBasicMaterial
              color="#6ed6ff"
              transparent
              opacity={0.028}
              side={DoubleSide}
            />
          </Sphere>

          <Sphere args={[SURFACE_RADIUS + 0.28, 96, 96]}>
            <meshBasicMaterial
              color="#d7eeff"
              transparent
              opacity={0.014}
              side={DoubleSide}
            />
          </Sphere>
        </group>

        {flora.map((item) => (
          <Marker
            key={item.slug}
            flora={item}
            active={item.slug === selectedSlug}
            hovered={item.slug === hoveredSlug}
            onSelect={() => setSelectedSlug(item.slug)}
            onHoverStart={() => setHoveredSlug(item.slug)}
            onHoverEnd={() => setHoveredSlug(null)}
          />
        ))}
      </group>

      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.42}
        minDistance={6.4}
        maxDistance={9.6}
      />
    </>
  );
}

function Marker({
  flora,
  active,
  hovered,
  onSelect,
  onHoverStart,
  onHoverEnd,
}: {
  flora: FloraPreview;
  active: boolean;
  hovered: boolean;
  onSelect: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const markerRef = useRef<Group>(null);
  const palette = getFloraPalette(flora);
  const position = useMemo(() => {
    const region = flora.primaryRegion;
    return latLngToVector3(region?.lat ?? 0, region?.lng ?? 0, SURFACE_RADIUS);
  }, [flora.primaryRegion]);
  const quaternion = useMemo(
    () => new Quaternion().setFromUnitVectors(UP_VECTOR, position.clone().normalize()),
    [position],
  );

  useFrame((state) => {
    if (!markerRef.current) {
      return;
    }

    const pulse = active
      ? 1.08 + Math.sin(state.clock.elapsedTime * 4.4) * 0.08
      : hovered
        ? 1.04 + Math.sin(state.clock.elapsedTime * 3.6) * 0.05
        : 1 + Math.sin(state.clock.elapsedTime * 2.4) * 0.03;

    markerRef.current.scale.setScalar(pulse);
  });

  const handlePointerOver = () => {
    document.body.style.cursor = "pointer";
    onHoverStart();
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "default";
    onHoverEnd();
  };

  return (
    <group position={position} quaternion={quaternion}>
      <group ref={markerRef}>
        <mesh position={[0, 0.012, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.07, 0.14, 32]} />
          <meshBasicMaterial
            color={palette.accent}
            transparent
            opacity={active || hovered ? 0.85 : 0.5}
            side={DoubleSide}
          />
        </mesh>

        <mesh position={[0, 0.005, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.08, 32]} />
          <meshBasicMaterial
            color={palette.glow}
            transparent
            opacity={active ? 0.32 : 0.16}
            side={DoubleSide}
          />
        </mesh>

        <mesh position={[0, MARKER_HEIGHT / 2, 0]}>
          <cylinderGeometry args={[0.016, 0.022, MARKER_HEIGHT, 14]} />
          <meshStandardMaterial
            color={palette.accent}
            emissive={palette.glow}
            emissiveIntensity={1.2}
          />
        </mesh>

        <FloraBloom flora={flora} active={active} hovered={hovered} />

        <mesh
          position={[0, MARKER_HEIGHT + 0.05, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.11, 0.19, 40]} />
          <meshBasicMaterial
            color={palette.accent}
            transparent
            opacity={active || hovered ? 0.78 : 0.42}
            side={DoubleSide}
          />
        </mesh>

        <mesh
          position={[0, MARKER_HEIGHT + 0.05, 0]}
          onClick={(event) => {
            event.stopPropagation();
            onSelect();
          }}
          onPointerOver={(event) => {
            event.stopPropagation();
            handlePointerOver();
          }}
          onPointerOut={(event) => {
            event.stopPropagation();
            handlePointerOut();
          }}
        >
          <sphereGeometry args={[0.24, 18, 18]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>
    </group>
  );
}

function FloraBloom({
  flora,
  active,
  hovered,
}: {
  flora: FloraPreview;
  active: boolean;
  hovered: boolean;
}) {
  const palette = getFloraPalette(flora);
  const bloomOpacity = active ? 1 : hovered ? 0.92 : 0.84;
  const bloomScale = active ? 1.18 : hovered ? 1.08 : 1;
  const topY = MARKER_HEIGHT + 0.065;

  if (flora.floraType === "Tree" || flora.floraType === "Palm") {
    return (
      <group position={[0, topY, 0]} scale={bloomScale}>
        <mesh position={[0, 0.07, 0]}>
          <sphereGeometry args={[0.12, 18, 18]} />
          <meshStandardMaterial
            color={palette.accentSoft}
            emissive={palette.glow}
            emissiveIntensity={1.9 * bloomOpacity}
          />
        </mesh>
        <mesh position={[0.08, 0.02, 0.04]} scale={[0.75, 0.75, 0.75]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={palette.accent}
            emissive={palette.glow}
            emissiveIntensity={1.4 * bloomOpacity}
          />
        </mesh>
        <mesh position={[-0.07, 0.01, -0.03]} scale={[0.72, 0.72, 0.72]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={palette.accent}
            emissive={palette.glow}
            emissiveIntensity={1.4 * bloomOpacity}
          />
        </mesh>
      </group>
    );
  }

  if (flora.floraType === "Aquatic") {
    return (
      <group position={[0, topY - 0.02, 0]} scale={bloomScale}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.16, 28]} />
          <meshStandardMaterial
            color="#7dd3fc"
            emissive={palette.glow}
            emissiveIntensity={0.7 * bloomOpacity}
          />
        </mesh>
        <PetalCluster palette={palette} opacity={bloomOpacity} />
      </group>
    );
  }

  if (flora.floraType === "Fern" || flora.floraType === "Succulent") {
    return (
      <group position={[0, topY, 0]} scale={bloomScale}>
        {[
          [0, 0, 0],
          [0.07, 0.02, 0.04],
          [-0.07, 0.02, -0.04],
          [0.05, 0.03, -0.06],
          [-0.05, 0.03, 0.06],
        ].map((offset, index) => (
          <mesh
            key={`${flora.slug}-cluster-${index}`}
            position={offset as [number, number, number]}
            scale={
              flora.floraType === "Fern"
                ? [0.38, 1.15, 0.22]
                : [0.48, 0.72, 0.48]
            }
          >
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? palette.accentSoft : palette.accent}
              emissive={palette.glow}
              emissiveIntensity={1.35 * bloomOpacity}
            />
          </mesh>
        ))}
      </group>
    );
  }

  return (
    <group position={[0, topY, 0]} scale={bloomScale}>
      <PetalCluster palette={palette} opacity={bloomOpacity} />
    </group>
  );
}

function PetalCluster({
  palette,
  opacity,
}: {
  palette: ReturnType<typeof getFloraPalette>;
  opacity: number;
}) {
  return (
    <>
      {[
        [0, 0.08, 0],
        [0.085, 0.03, 0.015],
        [-0.08, 0.03, -0.015],
        [0.02, 0.03, 0.082],
        [-0.02, 0.03, -0.082],
      ].map((offset, index) => (
        <mesh
          key={`petal-${index}`}
          position={offset as [number, number, number]}
          scale={[0.82, 1.08, 0.62]}
        >
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial
            color={index === 0 ? palette.accentSoft : palette.accent}
            emissive={palette.glow}
            emissiveIntensity={(index === 0 ? 2.3 : 1.5) * opacity}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={palette.glow}
          emissiveIntensity={1.55 * opacity}
        />
      </mesh>
    </>
  );
}

function NoWebGlFallback({ flora }: InteractiveGlobeProps) {
  return (
    <div className="flex h-full min-h-[32rem] flex-col justify-between gap-6 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.16),_transparent_40%),linear-gradient(180deg,_rgba(2,6,23,0.5),_rgba(2,6,23,0.92))] p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-white/42">
          WebGL fallback
        </p>
        <h2 className="mt-3 font-display text-4xl text-white">
          Explore the collection without 3D.
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-7 text-white/68">
          This device cannot render the immersive globe, so the first curated
          flora stories remain available as a graceful editorial browse path.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {flora.map((item) => {
          const palette = getFloraPalette(item);

          return (
            <Link
              key={item.slug}
              href={`/flora/${item.slug}`}
              className="rounded-[1.75rem] border p-4"
              style={{
                background: `linear-gradient(180deg, ${palette.surface}, rgba(15, 23, 42, 0.6))`,
                borderColor: palette.border,
              }}
            >
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                {item.primaryRegion?.name ?? "Featured flora"}
              </p>
              <h3 className="mt-4 font-display text-3xl text-white">
                {item.commonName}
              </h3>
              <p className="mt-2 text-sm text-white/62">{item.scientificName}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function latLngToVector3(lat: number, lng: number, radius: number) {
  const latRadians = MathUtils.degToRad(lat);
  const lngRadians = MathUtils.degToRad(lng);

  return new Vector3(
    radius * Math.cos(latRadians) * Math.sin(lngRadians),
    radius * Math.sin(latRadians),
    radius * Math.cos(latRadians) * Math.cos(lngRadians),
  );
}

function dampAngle(current: number, target: number, lambda: number, delta: number) {
  const difference = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + difference * (1 - Math.exp(-lambda * delta));
}

function detectWebGlSupport() {
  const canvas = document.createElement("canvas");

  return Boolean(
    window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
  );
}
