"use client";

import { useEffect, useRef, useCallback } from "react";

// Color palettes the globe cycles through on click
const PALETTES = [
  { name: "forest", base: [80, 160, 120], ring: [82, 210, 154], glow: [82, 183, 136] },
  { name: "ocean", base: [60, 140, 200], ring: [70, 180, 220], glow: [27, 73, 101] },
  { name: "sunset", base: [200, 140, 60], ring: [255, 183, 3], glow: [251, 133, 0] },
  { name: "blossom", base: [180, 100, 160], ring: [210, 140, 200], glow: [180, 100, 170] },
  { name: "earth", base: [120, 160, 80], ring: [116, 198, 157], glow: [64, 145, 108] },
];

export function AnimatedGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  // Interaction state stored in refs to avoid re-renders
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const autoRotation = useRef({ x: 0, y: 0 });
  const lastMouse = useRef({ x: 0, y: 0 });

  // Color transition state
  const paletteIndex = useRef(0);
  const colorTransition = useRef(0); // 0 = fully current, 1 = fully next
  const isTransitioning = useRef(false);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    dragOffset.current.x += dx * 0.005;
    dragOffset.current.y += dy * 0.005;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleClick = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    colorTransition.current = 0;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gridChars = "░▒▓·•○◦◌";

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Pointer events
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointerleave", handlePointerUp);
    canvas.addEventListener("click", handleClick);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const lerpColor = (c1: number[], c2: number[], t: number) =>
      c1.map((v, i) => Math.round(lerp(v, c2[i], t)));

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Advance auto-rotation (pauses while dragging)
      if (!isDragging.current) {
        autoRotation.current.x += 0.015;
        autoRotation.current.y += 0.015;
        // Gently decay drag offset back toward zero
        dragOffset.current.x *= 0.995;
        dragOffset.current.y *= 0.995;
      }

      // Color transition
      if (isTransitioning.current) {
        colorTransition.current += 0.008; // slow transition
        if (colorTransition.current >= 1) {
          colorTransition.current = 0;
          paletteIndex.current = (paletteIndex.current + 1) % PALETTES.length;
          isTransitioning.current = false;
        }
      }

      const currentPalette = PALETTES[paletteIndex.current];
      const nextPalette = PALETTES[(paletteIndex.current + 1) % PALETTES.length];
      const ct = isTransitioning.current ? colorTransition.current : 0;
      const baseColor = lerpColor(currentPalette.base, nextPalette.base, ct);
      const ringColor = lerpColor(currentPalette.ring, nextPalette.ring, ct);
      const glowColor = lerpColor(currentPalette.glow, nextPalette.glow, ct);

      const rotY = autoRotation.current.x * 0.25 + dragOffset.current.x;
      const rotX = autoRotation.current.y * 0.1 + dragOffset.current.y;
      const time = autoRotation.current.x;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = Math.min(rect.width, rect.height) * 0.42;

      ctx.font = "11px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const points: { x: number; y: number; z: number; char: string }[] = [];

      for (let phi = 0; phi < Math.PI * 2; phi += 0.18) {
        for (let theta = 0; theta < Math.PI; theta += 0.18) {
          const x = Math.sin(theta) * Math.cos(phi + time * 0.4);
          const y = Math.sin(theta) * Math.sin(phi + time * 0.4);
          const z = Math.cos(theta);

          const newX = x * Math.cos(rotY) - z * Math.sin(rotY);
          const newZ = x * Math.sin(rotY) + z * Math.cos(rotY);

          const newY = y * Math.cos(rotX) - newZ * Math.sin(rotX);
          const finalZ = y * Math.sin(rotX) + newZ * Math.cos(rotX);

          const depth = (finalZ + 1) / 2;
          const charIndex = Math.floor(depth * (gridChars.length - 1));

          points.push({
            x: centerX + newX * radius,
            y: centerY + newY * radius,
            z: finalZ,
            char: gridChars[charIndex],
          });
        }
      }

      points.sort((a, b) => a.z - b.z);

      points.forEach((point) => {
        const alpha = 0.3 + (point.z + 1) * 0.45;
        const r = Math.floor(baseColor[0] + (point.z + 1) * 80);
        const g = Math.floor(baseColor[1] + (point.z + 1) * 70);
        const b = Math.floor(baseColor[2] + (point.z + 1) * 40);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fillText(point.char, point.x, point.y);
      });

      // Orbiting ring
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${ringColor[0]}, ${ringColor[1]}, ${ringColor[2]}, 0.35)`;
      ctx.lineWidth = 1.5;
      ctx.ellipse(centerX, centerY, radius * 1.15, radius * 0.3, time * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      // Pulse glow
      const glowAlpha = 0.08 + Math.sin(time * 2) * 0.04;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.2);
      gradient.addColorStop(0, `rgba(${glowColor[0]}, ${glowColor[1]}, ${glowColor[2]}, ${glowAlpha * 2})`);
      gradient.addColorStop(1, `rgba(${glowColor[0]}, ${glowColor[1]}, ${glowColor[2]}, 0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      frameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointerleave", handlePointerUp);
      canvas.removeEventListener("click", handleClick);
      cancelAnimationFrame(frameRef.current);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp, handleClick]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full touch-none"
      style={{ display: "block", cursor: "grab" }}
    />
  );
}
