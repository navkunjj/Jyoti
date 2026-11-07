import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import countriesAtlas from 'world-atlas/countries-110m.json';
import { CountryStats, diyaService } from '../../services/diyaService';

interface Particle {
  x: number;
  y: number;
  lng: number;
  lat: number;
  countryId: string;
  radius: number;
  phase: number;
  speed: number;
  color: string;
}

interface WorldMapProps {
  onSelectCountry?: (country: CountryStats) => void;
  selectedCountryId?: string | null;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  onSelectCountry,
  selectedCountryId,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [hoveredCountry, setHoveredCountry] = useState<CountryStats | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 1100,
    height: 560,
  });

  const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // 1. Process GeoJSON features from TopoJSON
  const { geoData, countriesFeatureMap } = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const atlas = countriesAtlas as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const countries = topojson.feature(atlas, atlas.objects.countries) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map = new Map<string, any>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    countries.features.forEach((f: any) => {
      map.set(String(f.id), f);
    });
    return { geoData: countries, countriesFeatureMap: map };
  }, []);

  // 2. Setup D3 Projection & Path Generator (Natural Earth)
  const projection = useMemo(() => {
    return d3
      .geoNaturalEarth1()
      .scale(dimensions.width * 0.175)
      .translate([dimensions.width / 2, dimensions.height / 2 + 10]);
  }, [dimensions.width, dimensions.height]);

  const pathGenerator = useMemo(() => {
    return d3.geoPath().projection(projection);
  }, [projection]);

  // 3. Generate distributed Diya particles inside countries
  const particles = useMemo(() => {
    const list: Particle[] = [];
    const countryStatsList = diyaService.getCountries();

    countryStatsList.forEach((stat) => {
      const feat = countriesFeatureMap.get(stat.id);
      if (!feat) return;

      const bounds = d3.geoBounds(feat);
      const [[minLng, minLat], [maxLng, maxLat]] = bounds;

      // Realistic particle density
      let pointCount = Math.min(130, Math.max(3, Math.floor(Math.sqrt(stat.diyas) * 0.17)));
      if (stat.id === '356') pointCount = 180; // India

      let accepted = 0;
      let attempts = 0;
      const maxAttempts = pointCount * 8;

      while (accepted < pointCount && attempts < maxAttempts) {
        attempts++;
        const testLng = minLng + Math.random() * (maxLng - minLng);
        const testLat = minLat + Math.random() * (maxLat - minLat);

        if (d3.geoContains(feat, [testLng, testLat])) {
          const projected = projection([testLng, testLat]);
          if (projected) {
            list.push({
              x: projected[0],
              y: projected[1],
              lng: testLng,
              lat: testLat,
              countryId: stat.id,
              radius: Math.random() * 1.3 + 0.9,
              phase: Math.random() * Math.PI * 2,
              speed: Math.random() * 1.5 + 0.7,
              color: Math.random() > 0.4 ? '#FDB863' : '#FFE29A',
            });
            accepted++;
          }
        }
      }

      if (accepted === 0) {
        const centroid = d3.geoCentroid(feat);
        const projected = projection(centroid);
        if (projected) {
          list.push({
            x: projected[0],
            y: projected[1],
            lng: centroid[0],
            lat: centroid[1],
            countryId: stat.id,
            radius: 1.4,
            phase: 0,
            speed: 1.1,
            color: '#FDB863',
          });
        }
      }
    });

    return list;
  }, [countriesFeatureMap, projection]);

  // 4. Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = Math.min(680, Math.max(420, width * 0.52));
        setDimensions({ width, height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 5. Canvas Animation Loop for 60fps glowing Diya lights
  const renderCanvas = useCallback(
    (transform: d3.ZoomTransform) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = dimensions.width * dpr;
      canvas.height = dimensions.height * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      ctx.save();
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.k, transform.k);

      const time = performance.now() * 0.0018;

      particles.forEach((p) => {
        const opacity = 0.35 + 0.55 * Math.sin(time * p.speed + p.phase);
        const currentRadius = p.radius * (0.85 + 0.25 * Math.sin(time * p.speed * 1.4 + p.phase));

        // Soft outer ambient halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius * 2.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(253, 184, 99, ${opacity * 0.28})`;
        ctx.fill();

        // Inner glowing core
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#FDB863';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.restore();
    },
    [dimensions.width, dimensions.height, particles]
  );

  // 6. Setup D3 Zoom on SVG
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .translateExtent([
        [-120, -100],
        [dimensions.width + 120, dimensions.height + 100],
      ])
      .on('zoom', (event) => {
        transformRef.current = event.transform;
        d3.select(svg).select('g.map-group').attr('transform', event.transform.toString());
      });

    zoomBehaviorRef.current = zoom;
    d3.select(svg).call(zoom);

    return () => {
      d3.select(svg).on('.zoom', null);
    };
  }, [dimensions.width, dimensions.height]);

  // 7. Continuous Animation Frame for Canvas Particles
  useEffect(() => {
    let active = true;

    const loop = () => {
      if (!active) return;
      renderCanvas(transformRef.current);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      active = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [renderCanvas]);

  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(350)
        .call(zoomBehaviorRef.current.scaleBy, 1.4);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(350)
        .call(zoomBehaviorRef.current.scaleBy, 0.71);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(450)
        .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCountryHover = (e: React.MouseEvent, feature: any) => {
    const id = String(feature.id);
    const country = diyaService.getCountryById(id);
    if (country) {
      setHoveredCountry(country);
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setTooltipPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  };

  const handleCountryLeave = () => {
    setHoveredCountry(null);
    setTooltipPos(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCountryClick = (feature: any) => {
    const id = String(feature.id);
    const country = diyaService.getCountryById(id);
    if (country && onSelectCountry) {
      onSelectCountry(country);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none border-y border-white/10 bg-[#0e0410]/80"
      style={{ minHeight: `${dimensions.height}px` }}
    >
      {/* Background subtle radial wash */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(40,16,42,0.4)_0%,rgba(14,4,16,0)_75%)]" />

      {/* SVG Vector Country Layer */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        style={{ height: `${dimensions.height}px` }}
      >
        <g className="map-group">
          {/* Delicate hairline graticules */}
          <path
            d={pathGenerator(d3.geoGraticule10()) || ''}
            fill="none"
            stroke="rgba(255, 255, 255, 0.035)"
            strokeWidth="0.5"
          />

          {/* Render all countries */}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {geoData.features.map((feature: any) => {
            const id = String(feature.id);
            const isHovered = hoveredCountry?.id === id;
            const isSelected = selectedCountryId === id;

            return (
              <path
                key={id}
                d={pathGenerator(feature) || ''}
                className="transition-colors duration-200 cursor-pointer"
                fill={
                  isSelected
                    ? '#301332'
                    : isHovered
                    ? '#250f28'
                    : '#150917'
                }
                stroke={
                  isSelected
                    ? '#FFE29A'
                    : isHovered
                    ? 'rgba(255, 226, 154, 0.6)'
                    : 'rgba(255, 255, 255, 0.08)'
                }
                strokeWidth={isSelected ? 1.2 : isHovered ? 0.9 : 0.45}
                onMouseEnter={(e) => handleCountryHover(e, feature)}
                onMouseMove={(e) => handleCountryHover(e, feature)}
                onMouseLeave={handleCountryLeave}
                onClick={() => handleCountryClick(feature)}
              />
            );
          })}
        </g>
      </svg>

      {/* Canvas Layer for 2,000+ Twinkling Diya Lights */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: `${dimensions.height}px` }}
      />

      {/* Minimalist Micro-Typographic Map Controls */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 flex items-center space-x-2 z-20">
        <div className="flex items-center text-xs tracking-wider text-[#A898A7] bg-[#140716]/90 backdrop-blur-md border border-white/10 px-1 py-0.5">
          <button
            onClick={handleZoomIn}
            className="px-2.5 py-1 hover:text-[#F5ECE3] hover:bg-white/5 transition-colors focus:outline-none"
            aria-label="Zoom in"
          >
            +
          </button>
          <span className="text-white/20">|</span>
          <button
            onClick={handleZoomOut}
            className="px-2.5 py-1 hover:text-[#F5ECE3] hover:bg-white/5 transition-colors focus:outline-none"
            aria-label="Zoom out"
          >
            −
          </button>
          <span className="text-white/20">|</span>
          <button
            onClick={handleResetZoom}
            className="px-2.5 py-1 hover:text-[#F5ECE3] hover:bg-white/5 transition-colors focus:outline-none text-[11px]"
            aria-label="Reset view"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Editorial Micro Caption at Bottom Left */}
      <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-20 pointer-events-none">
        <div className="flex items-center space-x-3 text-[11px] tracking-widest uppercase text-[#9E8D9F] font-sans">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FDB863] shadow-[0_0_6px_#FDB863]" />
          <span>Cartography of Living Flames</span>
          <span className="text-white/20">/</span>
          <span className="font-mono text-[10px] text-[#A898A7]">
            {particles.length.toLocaleString()} points lit
          </span>
        </div>
      </div>

      {/* Understated Editorial Country Tooltip */}
      {hoveredCountry && tooltipPos && (
        <div
          className="absolute z-30 pointer-events-none transition-transform duration-75 ease-out"
          style={{
            left: `${Math.min(dimensions.width - 240, Math.max(16, tooltipPos.x + 14))}px`,
            top: `${Math.min(dimensions.height - 90, Math.max(16, tooltipPos.y - 65))}px`,
          }}
        >
          <div className="px-4 py-2.5 bg-[#140716]/95 backdrop-blur-md border border-white/15 text-left shadow-2xl">
            <div className="flex items-baseline space-x-2">
              <span className="font-serif text-base text-[#F5ECE3]">
                {hoveredCountry.name}
              </span>
              <span className="text-[10px] tracking-widest text-[#9E8D9F] uppercase font-mono">
                {hoveredCountry.code}
              </span>
            </div>
            <div className="mt-0.5 text-xs text-[#E6DACF] font-sans">
              <span className="font-serif italic text-sm text-[#FDB863] mr-1">
                {hoveredCountry.diyas.toLocaleString()}
              </span>
              <span className="text-[11px] text-[#9E8D9F]">diyas kindled</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
