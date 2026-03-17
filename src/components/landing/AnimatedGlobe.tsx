"use client";

import { useEffect, useRef } from "react";

export function AnimatedGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const leafChars = "🌿🍃🌱🌍♻️💧🌳☘️";
    const gridChars = "░▒▓·•○◦◌";
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = Math.min(rect.width, rect.height) * 0.42;

      ctx.font = "11px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const points: { x: number; y: number; z: number; char: string }[] = [];

      // Generate sphere points
      for (let phi = 0; phi < Math.PI * 2; phi += 0.18) {
        for (let theta = 0; theta < Math.PI; theta += 0.18) {
          const x = Math.sin(theta) * Math.cos(phi + time * 0.4);
          const y = Math.sin(theta) * Math.sin(phi + time * 0.4);
          const z = Math.cos(theta);

          // Rotate around Y axis
          const rotY = time * 0.25;
          const newX = x * Math.cos(rotY) - z * Math.sin(rotY);
          const newZ = x * Math.sin(rotY) + z * Math.cos(rotY);

          // Gentle X rotation
          const rotX = time * 0.1;
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

      // Sort by z for depth
      points.sort((a, b) => a.z - b.z);

      // Draw points with bright green/white tints for visibility on dark bg
      points.forEach((point) => {
        const alpha = 0.3 + (point.z + 1) * 0.45;
        const g = Math.floor(160 + (point.z + 1) * 70);
        const r = Math.floor(80 + (point.z + 1) * 80);
        ctx.fillStyle = `rgba(${r}, ${g}, 120, ${alpha})`;
        ctx.fillText(point.char, point.x, point.y);
      });

      // Draw orbiting ring
      ctx.beginPath();
      ctx.strokeStyle = `rgba(82, 210, 154, 0.35)`;
      ctx.lineWidth = 1.5;
      ctx.ellipse(centerX, centerY, radius * 1.15, radius * 0.3, time * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      // Pulse glow
      const glowAlpha = 0.08 + Math.sin(time * 2) * 0.04;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.2);
      gradient.addColorStop(0, `rgba(82, 183, 136, ${glowAlpha * 2})`);
      gradient.addColorStop(1, `rgba(82, 183, 136, 0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      time += 0.015;
      frameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
