"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Feature, Geometry, GeoJsonProperties } from 'geojson';
import { useEffect, useState, useRef, useContext, useMemo } from "react";
import useHover from "../hooks/hoverHook";
import gsap from "gsap";
import { TextPlugin } from "gsap/all";
import ThemeContext from "../context/ThemeContext";

gsap.registerPlugin(TextPlugin);

type RSMFeature = Feature<Geometry, GeoJsonProperties> & {
    rsmKey: string;
};

interface CountryConfig {
    center: [number, number];
    scale: number;
}

type CountryConfigs = Record<string, CountryConfig>;

const COUNTRIES_VISITED = ["India", "China", "Japan", "Spain", "Kenya"] as const;

const COUNTRY_CONFIGS: CountryConfigs = {
    "India": { center: [78, 22], scale: 800 },
    "China": { center: [105, 35], scale: 600 },
    "Japan": { center: [138, 38], scale: 1200 },
    "Spain": { center: [-3, 40], scale: 800 },
    "Kenya": { center: [37.9062, 0.0236], scale: 1000 },
};

const GRID_POSITIONS = [
    { top: '0%', left: '0%' },
    { top: '0%', left: '25%' },
    { top: '0%', left: '50%' },
    { top: '0%', left: '75%' },
    { top: '0%', left: '100%' },
    { top: '50%', left: '0%' },
    { top: '50%', left: '25%' },
    { top: '50%', left: '50%' },
    { top: '50%', left: '75%' },
    { top: '50%', left: '100%' },
    { top: '100%', left: '0%' },
    { top: '100%', left: '25%' },
    { top: '100%', left: '50%' },
    { top: '100%', left: '75%' },
    { top: '100%', left: '100%' }
];

const generateRandomString = (length: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => 
        characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
};


export const TravelGrid = () => {
    const [currentCountry, setCountry] = useState<string | null>(null);
    const [hasMounted, setHasMounted] = useState(false);
    const [randomStrings, setRandomStrings] = useState<Record<string, string>>({});
    
    const { isDark } = useContext(ThemeContext);
    
    const [isHovered, hoverProps] = useHover({
        onMouseEnterCallback: (isHovered, hoveredCountry) => {
            setCountry(hoveredCountry ?? null);
            if (hoveredCountry && countryRefs[hoveredCountry]) {
                // Animate from random string to actual country name
                gsap.to(countryRefs[hoveredCountry].current, {
                    duration: 0.5,
                    text: hoveredCountry,
                    ease: "none"
                });
            }
        },
        onMouseLeaveCallback: (isHovered, hoveredCountry) => {
            setCountry(null);
            if (hoveredCountry && countryRefs[hoveredCountry] && randomStrings[hoveredCountry]) {
                // Animate back to random string
                gsap.to(countryRefs[hoveredCountry].current, {
                    duration: 0.5,
                    text: randomStrings[hoveredCountry],
                    ease: "none"
                });
            }
        } 
    });

    const indiaRef = useRef<HTMLDivElement>(null);
    const chinaRef = useRef<HTMLDivElement>(null);
    const japanRef = useRef<HTMLDivElement>(null);
    const spainRef = useRef<HTMLDivElement>(null);
    const kenyaRef = useRef<HTMLDivElement>(null);

    const countryRefs = useMemo(() => ({
        "India": indiaRef,
        "China": chinaRef,
        "Japan": japanRef,
        "Spain": spainRef,
        "Kenya": kenyaRef
    }), []);

    useEffect(() => {
        setHasMounted(true);
        const initialStrings: Record<string, string> = {};
        COUNTRIES_VISITED.forEach(country => {
            if (country && typeof country === 'string') {
                initialStrings[country] = generateRandomString(country.length);
            }
        });
        setRandomStrings(initialStrings);
    }, []);
    
    if (!hasMounted) {
        return (
            <div className="h-[500px] flex items-center justify-center text-gray-500">
                Loading travel map...
            </div>
        );
    }
        
    return (
        <div className="map-container">
            <div className="relative grid grid-cols-4 h-[500px]">
                {COUNTRIES_VISITED.map((country) => (
                    <div 
                        key={country} 
                        data-hovered-country={country}
                        className="relative flex-1 h-full"
                        {...hoverProps}
                    >
                        <ComposableMap
                            style={{
                                opacity: isHovered && currentCountry === country ? 0 : 1,
                                transition: 'opacity 0.3s ease'
                            }}
                            projection="geoEqualEarth"
                            projectionConfig={COUNTRY_CONFIGS[country]}
                        >
                            <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                                {({ geographies }: { geographies: RSMFeature[] }) =>
                                    geographies.map((geo: RSMFeature) => {
                                        if (geo.properties && country.includes(geo.properties.name)) {
                                            return (
                                                <Geography 
                                                    key={geo.rsmKey} 
                                                    geography={geo}
                                                    fill={isDark ? "#ffffff" : "#000000"}
                                                    strokeWidth={2} 
                                                />
                                            );
                                        }
                                        return null;
                                    })
                                }
                            </Geographies>
                        </ComposableMap>
                        <div 
                            ref={countryRefs[country]}
                            className="absolute inset-0 flex items-center justify-center font-bold text-2xl z-10 transition-opacity duration-300 pointer-events-none"
                            style={{
                                opacity: isHovered && currentCountry === country ? 1 : 0
                            }}
                        > 
                            {randomStrings[country] || '_'.repeat(country.length)}
                        </div>
                    </div>
                ))}
                {GRID_POSITIONS.map((position, index) => (
                    <div 
                        key={index}
                        className="absolute w-3 h-3 flex items-center justify-center transition-colors duration-200 text-gray-800 transform -translate-x-1/2 -translate-y-1/2"
                        style={{ top: position.top, left: position.left }}
                    >
                        +
                    </div>
                ))}
            </div>
        </div>
    );
};
