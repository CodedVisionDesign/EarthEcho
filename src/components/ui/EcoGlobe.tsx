"use client";

import { useEffect, useRef } from "react";
import type { GlobeInstance } from "globe.gl";

// Eco hotspots - cities with active green initiatives
const ECO_POINTS = [
  { lat: 51.5, lng: -0.1, label: "London", size: 0.6 },
  { lat: 48.9, lng: 2.35, label: "Paris", size: 0.5 },
  { lat: 40.7, lng: -74, label: "New York", size: 0.6 },
  { lat: 35.7, lng: 139.7, label: "Tokyo", size: 0.55 },
  { lat: -33.9, lng: 18.4, label: "Cape Town", size: 0.4 },
  { lat: -22.9, lng: -43.2, label: "Rio", size: 0.45 },
  { lat: 55.8, lng: -4.25, label: "Glasgow", size: 0.4 },
  { lat: 1.3, lng: 103.8, label: "Singapore", size: 0.45 },
  { lat: 28.6, lng: 77.2, label: "Delhi", size: 0.5 },
  { lat: -33.8, lng: 151.2, label: "Sydney", size: 0.45 },
  { lat: 59.3, lng: 18.1, label: "Stockholm", size: 0.5 },
  { lat: 52.5, lng: 13.4, label: "Berlin", size: 0.45 },
  { lat: 37.8, lng: -122.4, label: "San Francisco", size: 0.4 },
  { lat: 55.7, lng: 12.6, label: "Copenhagen", size: 0.55 },
  { lat: -36.8, lng: 174.8, label: "Auckland", size: 0.4 },
];

// Arcs connecting eco cities
const ECO_ARCS = [
  { startLat: 51.5, startLng: -0.1, endLat: 40.7, endLng: -74 },
  { startLat: 48.9, startLng: 2.35, endLat: 35.7, endLng: 139.7 },
  { startLat: 55.7, startLng: 12.6, endLat: 59.3, endLng: 18.1 },
  { startLat: -33.8, startLng: 151.2, endLat: 1.3, endLng: 103.8 },
  { startLat: 37.8, startLng: -122.4, endLat: -22.9, endLng: -43.2 },
  { startLat: 28.6, startLng: 77.2, endLat: -33.9, endLng: 18.4 },
  { startLat: 52.5, startLng: 13.4, endLat: 55.8, endLng: -4.25 },
  { startLat: 51.5, startLng: -0.1, endLat: 48.9, endLng: 2.35 },
];

// NASA imagery (public domain)
const EARTH_TEXTURE =
  "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg";
const EARTH_BUMP =
  "//unpkg.com/three-globe/example/img/earth-topology.png";
const NIGHT_TEXTURE =
  "//unpkg.com/three-globe/example/img/earth-night.jpg";

type GlobeRenderer = GlobeInstance & ((element: HTMLElement) => GlobeInstance);
type GlobeFactory = () => GlobeRenderer;

export default function EcoGlobe({ size = 280 }: { size?: number }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let destroyed = false;

    import("globe.gl").then(async (GlobeModule) => {
      if (destroyed || !mount) return;

      const Globe = GlobeModule.default as unknown as GlobeFactory;
      const globeRenderer = Globe()
        // Realistic Earth textures
        .globeImageUrl(EARTH_TEXTURE)
        .bumpImageUrl(EARTH_BUMP)
        .backgroundImageUrl("")
        .backgroundColor("rgba(0,0,0,0)")
        .width(size)
        .height(size)
        // Atmosphere
        .showAtmosphere(true)
        .atmosphereColor("#74c69d")
        .atmosphereAltitude(0.18)
        // Points
        .pointsData(ECO_POINTS)
        .pointAltitude(0.02)
        .pointRadius("size")
        .pointColor(() => "#ffc107")
        .pointsMerge(true)
        // Arcs
        .arcsData(ECO_ARCS)
        .arcColor(() => ["rgba(116,198,157,0.8)", "rgba(82,183,136,0.8)"])
        .arcAltitudeAutoScale(0.35)
        .arcStroke(0.6)
        .arcDashLength(0.5)
        .arcDashGap(0.25)
        .arcDashAnimateTime(2000)
        // Rings (pulsing at eco hotspot locations)
        .ringsData(ECO_POINTS.filter((_, i) => i % 3 === 0))
        .ringColor(() => "rgba(149,213,178,0.6)")
        .ringMaxRadius(3)
        .ringPropagationSpeed(1.5)
        .ringRepeatPeriod(1800) as GlobeRenderer;
      const globe = globeRenderer(mount);

      globeRef.current = globe;

      // Tweak globe material for a slightly green-tinted realistic look
      const globeMaterial = globe.globeMaterial() as {
        bumpScale: number;
        emissive: { set: (c: string) => void };
        emissiveIntensity: number;
        shininess: number;
      };
      globeMaterial.bumpScale = 10;
      globeMaterial.emissive.set("#1b4332");
      globeMaterial.emissiveIntensity = 0.08;
      globeMaterial.shininess = 25;

      // Add better lighting to the scene
      const scene = globe.scene();
      const THREE = await import("three");

      // Soft ambient light
      const ambient = new THREE.AmbientLight(0x95d5b2, 0.6);
      scene.add(ambient);

      // Directional "sun" light for realistic shading
      const sun = new THREE.DirectionalLight(0xffffff, 1.2);
      sun.position.set(5, 3, 5);
      scene.add(sun);

      // Auto-rotate
      const controls = globe.controls() as {
        autoRotate: boolean;
        autoRotateSpeed: number;
        enableZoom: boolean;
      };
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6;
      controls.enableZoom = false;

      // Set initial view - show Europe/Africa
      globe.pointOfView({ lat: 25, lng: 10, altitude: 2.0 });
    });

    return () => {
      destroyed = true;
      if (globeRef.current) {
        const renderer = globeRef.current.renderer();
        renderer.dispose();
        globeRef.current = null;
      }
      while (mount.firstChild) {
        mount.removeChild(mount.firstChild);
      }
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      className="cursor-grab active:cursor-grabbing"
      style={{ width: size, height: size }}
    />
  );
}
