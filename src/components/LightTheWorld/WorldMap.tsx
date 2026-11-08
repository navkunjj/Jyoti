import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import countriesAtlas from 'world-atlas/countries-110m.json';
import { CountryStats, diyaService } from '../../services/diyaService';
import { detectUserLocation, UserLocation } from '../../services/geoService';

interface WorldMapProps {
  onSelectCountry?: (country: CountryStats) => void;
  selectedCountryId?: string | null;
}

interface StaticLightPoint {
  id: string;
  name: string;
  code: string;
  diyas: number;
  x: number;
  y: number;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  onSelectCountry,
  selectedCountryId,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [hoveredCountry, setHoveredCountry] = useState<CountryStats | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [countriesList, setCountriesList] = useState<CountryStats[]>(() => diyaService.getCountries());
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 1100,
    height: 560,
  });

  const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // 1. Detect user's location from public IP
  useEffect(() => {
    let isMounted = true;
    detectUserLocation().then((loc) => {
      if (isMounted && loc) {
        setUserLocation(loc);
        // Automatically default country selection to user's country if none selected
        if (!selectedCountryId && onSelectCountry) {
          const matchedCountry = diyaService.getCountryById(loc.countryId);
          if (matchedCountry) {
            onSelectCountry(matchedCountry);
          }
        }
      }
    }).catch((err) => {
      console.warn('Location detection fallback:', err);
    });

    return () => {
      isMounted = false;
    };
  }, [selectedCountryId, onSelectCountry]);

  // 2. Subscribe to real-time Firestore diya updates
  useEffect(() => {
    const handleUpdate = () => {
      setCountriesList(diyaService.getCountries());
    };
    const unsub = diyaService.subscribe(handleUpdate);
    window.addEventListener('jyoti:diya-updated', handleUpdate);

    return () => {
      unsub();
      window.removeEventListener('jyoti:diya-updated', handleUpdate);
    };
  }, []);

  // 3. Process GeoJSON features from TopoJSON
  const { geoData } = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const atlas = countriesAtlas as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const countries = topojson.feature(atlas, atlas.objects.countries) as any;
    return { geoData: countries };
  }, []);

  // 4. Setup D3 Projection & Path Generator (Natural Earth)
  const projection = useMemo(() => {
    return d3
      .geoNaturalEarth1()
      .scale(dimensions.width * 0.175)
      .translate([dimensions.width / 2, dimensions.height / 2 + 10]);
  }, [dimensions.width, dimensions.height]);

  const pathGenerator = useMemo(() => {
    return d3.geoPath().projection(projection);
  }, [projection]);

  // 5. Handle responsive dimensions
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

  // 7. Strictly Real Light Locations — Each real light location appears as one static, clearly visible glowing dot
  const staticRealLights: StaticLightPoint[] = useMemo(() => {
    const points: StaticLightPoint[] = [];

    countriesList.forEach((country) => {
      // Only countries with actual stored lights (> 0)
      if (country.diyas > 0) {
        const projected = projection([country.lng, country.lat]);
        if (projected) {
          points.push({
            id: country.id,
            name: country.name,
            code: country.code,
            diyas: country.diyas,
            x: projected[0],
            y: projected[1],
          });
        }
      }
    });

    return points;
  }, [countriesList, projection]);

  // 8. Projected User "YOU" Pin Location
  const userPinCoords = useMemo(() => {
    if (!userLocation) return null;
    const projected = projection([userLocation.lng, userLocation.lat]);
    if (!projected) return null;
    return {
      x: projected[0],
      y: projected[1],
      country: userLocation.country,
      code: userLocation.countryCode,
    };
  }, [userLocation, projection]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none border-y border-white/10 bg-[#0e0410]/80"
      style={{ minHeight: `${dimensions.height}px` }}
    >
      {/* Background subtle radial wash */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(40,16,42,0.4)_0%,rgba(14,4,16,0)_75%)]" />

      {/* Main SVG Vector Layer (Countries, Static Lights, and the "YOU" Pin) */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        style={{ height: `${dimensions.height}px` }}
      >
        <defs>
          {/* Static, high-clarity halo glow for real lit locations */}
          <radialGradient id="staticDiyaHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE29A" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#FDB863" stopOpacity="0.65" />
            <stop offset="70%" stopColor="#FF9800" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FF9800" stopOpacity="0" />
          </radialGradient>

          {/* User Location Distinctive Beacon Gradient */}
          <radialGradient id="userBeaconHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="30%" stopColor="#FFD182" stopOpacity="0.85" />
            <stop offset="65%" stopColor="#FF8833" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF8833" stopOpacity="0" />
          </radialGradient>

          {/* Soft shadow for YOU badge */}
          <filter id="youBadgeShadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.75" />
          </filter>
        </defs>

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
            const isUserCountry = userLocation?.countryId === id;

            return (
              <path
                key={id}
                d={pathGenerator(feature) || ''}
                className="transition-colors duration-200 cursor-pointer"
                fill={
                  isSelected
                    ? '#341538'
                    : isUserCountry
                    ? '#29112d'
                    : isHovered
                    ? '#220d25'
                    : '#150917'
                }
                stroke={
                  isSelected
                    ? '#FFE29A'
                    : isUserCountry
                    ? 'rgba(253, 184, 99, 0.75)'
                    : isHovered
                    ? 'rgba(255, 226, 154, 0.6)'
                    : 'rgba(255, 255, 255, 0.08)'
                }
                strokeWidth={isSelected ? 1.3 : isUserCountry ? 1.0 : isHovered ? 0.9 : 0.45}
                onMouseEnter={(e) => handleCountryHover(e, feature)}
                onMouseMove={(e) => handleCountryHover(e, feature)}
                onMouseLeave={handleCountryLeave}
                onClick={() => handleCountryClick(feature)}
              />
            );
          })}

          {/* ─── STATIC, CLEARLY VISIBLE GLOWING DOTS FOR REAL LIGHT LOCATIONS ─── */}
          {/* No repeatedly blinking or flickering effects: solid, crisp, luminous lights */}
          {staticRealLights.map((light) => (
            <g key={`light-${light.id}`} className="pointer-events-none">
              {/* Outer static halo */}
              <circle
                cx={light.x}
                cy={light.y}
                r={6.5}
                fill="url(#staticDiyaHalo)"
              />
              {/* Mid luminous ring */}
              <circle
                cx={light.x}
                cy={light.y}
                r={3.2}
                fill="#FDB863"
                opacity="0.9"
              />
              {/* Brilliant core spark */}
              <circle
                cx={light.x}
                cy={light.y}
                r={1.5}
                fill="#FFFFFF"
                opacity="1"
              />
            </g>
          ))}

          {/* ─── USER LOCATION PIN & "YOU" BADGE ─── */}
          {userPinCoords && (
            <g
              className="pointer-events-none"
              transform={`translate(${userPinCoords.x}, ${userPinCoords.y})`}
            >
              {/* Outer soft radiant aura */}
              <circle
                cx={0}
                cy={0}
                r={16}
                fill="url(#userBeaconHalo)"
                opacity="0.45"
              />

              {/* Distinctive golden beacon ring */}
              <circle
                cx={0}
                cy={0}
                r={7.5}
                fill="rgba(255, 136, 51, 0.25)"
                stroke="#FFE29A"
                strokeWidth="1.6"
              />

              {/* Incandescent pinpoint center */}
              <circle
                cx={0}
                cy={0}
                r={3.5}
                fill="#FF8833"
              />
              <circle
                cx={0}
                cy={0}
                r={1.8}
                fill="#FFFFFF"
              />

              {/* Floating "YOU" Marker Badge */}
              <g transform="translate(0, -20)" filter="url(#youBadgeShadow)">
                {/* Badge Container */}
                <rect
                  x={-20}
                  y={-17}
                  width={40}
                  height={17}
                  rx={8.5}
                  fill="#FDB863"
                  stroke="#FFF2CC"
                  strokeWidth="1"
                />
                {/* Pointer Tip */}
                <polygon
                  points="-4,-0.5 4,-0.5 0,3.5"
                  fill="#FDB863"
                />
                {/* Bold "YOU" Text */}
                <text
                  x={0}
                  y={-5}
                  textAnchor="middle"
                  fill="#150818"
                  fontSize="9.5"
                  fontWeight="800"
                  letterSpacing="0.14em"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  YOU
                </text>
              </g>
            </g>
          )}
        </g>
      </svg>

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
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-[11px] tracking-widest uppercase text-[#9E8D9F] font-sans">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FDB863] shadow-[0_0_6px_#FDB863]" />
            <span>Living Cartography</span>
            <span className="text-white/20">/</span>
            <span className="font-mono text-[10px] text-[#A898A7]">
              {staticRealLights.length > 0
                ? `${staticRealLights.length} ${staticRealLights.length === 1 ? 'nation' : 'nations'} active`
                : 'Awaiting offerings'}
            </span>
          </div>

          {userLocation && (
            <div className="flex items-center space-x-2 text-[#FFE29A]">
              <span className="text-white/20 hidden sm:inline">·</span>
              <span className="text-[10px] uppercase font-mono tracking-wider">
                Pinned: {userLocation.country} ({userLocation.countryCode})
              </span>
            </div>
          )}
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
              {userLocation?.countryId === hoveredCountry.id && (
                <span className="text-[9px] bg-[#FDB863] text-[#140716] font-bold px-1 py-0.2 rounded font-sans tracking-wide">
                  YOU
                </span>
              )}
            </div>
            <div className="mt-0.5 text-xs text-[#E6DACF] font-sans">
              <span className="font-serif italic text-sm text-[#FDB863] mr-1">
                {hoveredCountry.diyas.toLocaleString()}
              </span>
              <span className="text-[11px] text-[#9E8D9F]">
                {hoveredCountry.diyas === 1 ? 'diya kindled' : 'diyas kindled'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
