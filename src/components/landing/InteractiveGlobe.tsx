"use client";

import type React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import { Button } from "@/components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faRotateRight } from "@/lib/fontawesome";

interface GeoFeature {
  type: string;
  geometry: unknown;
  properties: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function interpolateProjection(raw0: any, raw1: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutate: any = d3.geoProjectionMutator((t: number) => (x: number, y: number) => {
    const [x0, y0] = raw0(x, y);
    const [x1, y1] = raw1(x, y);
    return [x0 + t * (x1 - x0), y0 + t * (y1 - y0)];
  });
  let t = 0;
  return Object.assign(mutate(t), {
    alpha(_: number) {
      if (arguments.length) return mutate((t = +_));
      return t;
    },
  });
}

export function InteractiveGlobe() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState([0]);
  const [worldData, setWorldData] = useState<GeoFeature[]>([]);
  const [rotation, setRotation] = useState([0, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState([0, 0]);

  const width = 800;
  const height = 500;

  useEffect(() => {
    const loadWorldData = async () => {
      try {
        const response = await fetch(
          "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
        );
        const world = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const countries = (feature(world, world.objects.countries) as any).features;
        setWorldData(countries as GeoFeature[]);
      } catch {
        setWorldData([
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]],
            },
            properties: {},
          },
        ]);
      }
    };
    loadWorldData();
  }, []);

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setLastMouse([event.clientX - rect.left, event.clientY - rect.top]);
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentMouse = [event.clientX - rect.left, event.clientY - rect.top];
    const dx = currentMouse[0] - lastMouse[0];
    const dy = currentMouse[1] - lastMouse[1];
    const sensitivity = progress[0] < 50 ? 0.5 : 0.25;

    setRotation((prev) => [
      prev[0] + dx * sensitivity,
      Math.max(-90, Math.min(90, prev[1] - dy * sensitivity)),
    ]);
    setLastMouse(currentMouse);
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (!svgRef.current || worldData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const t = progress[0] / 100;
    const alpha = Math.pow(t, 0.5);

    const scale = d3.scaleLinear().domain([0, 1]).range([200, 120]);

    const projection = interpolateProjection(
      d3.geoOrthographicRaw,
      d3.geoEquirectangularRaw
    )
      .scale(scale(alpha))
      .translate([width / 2, height / 2])
      .rotate([rotation[0], rotation[1]])
      .precision(0.1);

    projection.alpha(alpha);

    const path = d3.geoPath(projection);

    // Graticule
    try {
      const graticule = d3.geoGraticule();
      const graticulePath = path(graticule());
      if (graticulePath) {
        svg
          .append("path")
          .datum(graticule())
          .attr("d", graticulePath)
          .attr("fill", "none")
          .attr("stroke", "var(--color-forest)")
          .attr("stroke-width", 0.5)
          .attr("opacity", 0.15);
      }
    } catch {
      // skip graticule on error
    }

    // Countries
    svg
      .selectAll(".country")
      .data(worldData)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", (d) => {
        try {
          const pathString = path(d as d3.GeoPermissibleObjects);
          if (!pathString || pathString.includes("NaN") || pathString.includes("Infinity")) return "";
          return pathString;
        } catch {
          return "";
        }
      })
      .attr("fill", "var(--color-forest)")
      .attr("fill-opacity", 0.08)
      .attr("stroke", "var(--color-forest)")
      .attr("stroke-width", 0.8)
      .attr("stroke-opacity", 0.4)
      .style("visibility", function () {
        const pathData = d3.select(this).attr("d");
        return pathData && pathData.length > 0 && !pathData.includes("NaN") ? "visible" : "hidden";
      });

    // Sphere outline
    try {
      const sphereOutline = path({ type: "Sphere" } as d3.GeoPermissibleObjects);
      if (sphereOutline) {
        svg
          .append("path")
          .datum({ type: "Sphere" })
          .attr("d", sphereOutline)
          .attr("fill", "none")
          .attr("stroke", "var(--color-forest)")
          .attr("stroke-width", 1.5)
          .attr("opacity", 0.3);
      }
    } catch {
      // skip sphere on error
    }
  }, [worldData, progress, rotation]);

  const handleAnimate = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    const startProgress = progress[0];
    const endProgress = startProgress === 0 ? 100 : 0;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setProgress([startProgress + (endProgress - startProgress) * eased]);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    animate();
  }, [isAnimating, progress]);

  const handleReset = () => {
    setRotation([0, 0]);
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto rounded-2xl border border-forest/10 bg-white cursor-grab active:cursor-grabbing"
        preserveAspectRatio="xMidYMid meet"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button
          onClick={handleAnimate}
          variant="primary"
          size="sm"
          className="rounded-full shadow-lg"
        >
          <FontAwesomeIcon icon={faGlobe} className="h-3.5 w-3.5 mr-1.5" aria-hidden />
          {isAnimating ? "Animating..." : progress[0] === 0 ? "Unroll Globe" : "Roll to Globe"}
        </Button>
        <Button
          onClick={handleReset}
          variant="secondary"
          size="sm"
          className="rounded-full shadow-lg"
        >
          <FontAwesomeIcon icon={faRotateRight} className="h-3.5 w-3.5" aria-hidden />
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-slate">
        Click and drag to rotate. Explore our world interactively.
      </p>
    </div>
  );
}
