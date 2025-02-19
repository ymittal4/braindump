import { ComposableMap, Geographies, Geography, GeographyProps } from "react-simple-maps"
import { Feature, Geometry, GeoJsonProperties } from 'geojson'
import { useEffect, useState } from "react"
import useHover from "../hooks/hoverHook"
import AnimatedText from "./AnimatedText"


type RSMFeature = Feature<Geometry, GeoJsonProperties> & {
    rsmKey: string;
}

type countryConfigs = {
    [key: string]: {
        center: [number, number];
        scale: number;
    }
}

const countriesVisited = ["India", "China", "Japan", "Spain", "Kenya"]

const countryConfigs: countryConfigs = {
    "India": {center:[78, 22], scale: 800},
    "China": { center: [105, 35], scale: 600 },
    "Japan": { center: [138, 38], scale: 1200 },
    "Spain": { center: [-3, 40], scale: 800 },
    "Kenya": { center: [37.9062, 0.0236], scale: 1000 },
}

export const TravelGrid = () => {


    const [currentCountry, setCountry] = useState <string | null>(null);
    const [isHovered, hoverProps] = useHover({
        onMouseEnterCallback: (isHovered, hoveredCountry) => {
            setCountry(hoveredCountry ?? null)
            console.log(`your mouse is in country, ${currentCountry}, hover state: ${isHovered}`)
        },
        onMouseLeaveCallback: (isHovered, hoveredCountry) => {
            setCountry(null)
            console.log(`your mouse left ${currentCountry}, hover state: ${isHovered}`)
        } 
    });

    return (
        
        <div className="map-container">
            <div>"you're hovering over" {currentCountry}</div>
            <div className="relative grid grid-cols-4 h-[500px]">
                {countriesVisited.map((country) => {
                    if (isHovered && currentCountry === country) {
                        console.log ("you just hovered over", {country})
                        return (
                            <div className="flex items-center h-full justify-center" {...hoverProps} > {currentCountry} & {isHovered.toString()}</div>
                        )
                    } 
                    else {
                        console.log ("you just hovered over no country dweeb")
                        return (
                            <ComposableMap
                                projection="geoEqualEarth"
                                projectionConfig={countryConfigs[country]}
                                {...hoverProps} 
                                data-hoveredCountry = {country}
                            >
                                <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                                {({ geographies } : { geographies : RSMFeature[] }) =>
                                        geographies.map((geo: RSMFeature) => {
                                            if (geo.properties && country.includes(geo.properties.name)) {
                                                    return <Geography 
                                                    key={geo.rsmKey} 
                                                    geography={geo}
                                                    fill="#000000"
                                                    stroke="#000000"
                                                    strokeWidth={2} 
                                                />
                                            }
                                            return null
                                        })
                                    }
                                </Geographies>
                            </ComposableMap>
                        );
                    }
                    
                    })}
                    <div>
                    <div className="absolute w-3 h-3 flex items-center justify-center transition-colors 
                    duration-200 text-gray-800 top-0 left-0 transform -translate-x-1/2 -translate-y-1/2">
                        +
                    </div>
                    <div className="absolute w-3 h-3 flex items-center justify-center transition-colors 
                    duration-200 text-gray-800 top-0 left-[25%] transform -translate-x-1/2 -translate-y-1/2">
                        +
                    </div>
                    <div className="absolute w-3 h-3 flex items-center justify-center transition-colors 
                    duration-200 text-gray-800 top-0 left-[50%] transform -translate-x-1/2 -translate-y-1/2">
                        +
                    </div>
                    <div className="absolute w-3 h-3 flex items-center justify-center transition-colors 
                    duration-200 text-gray-800 top-0 left-[75%] transform -translate-x-1/2 -translate-y-1/2">
                        +
                    </div>
                    <div className="absolute w-3 h-3 flex items-center justify-center transition-colors 
                    duration-200 text-gray-800 top-0 left-[100%] transform -translate-x-1/2 -translate-y-1/2">
                        +
                    </div>
                    <div className="absolute w-3 h-3 flex items-center justify-center transition-colors 
                    duration-200 text-gray-800 top-[50%] left-0 transform -translate-x-1/2 -translate-y-1/2">
                        +
                    </div>
                    <div className="absolute w-3 h-3 flex items-center justify-center transition-colors 
                    duration-200 text-gray-800 top-[50%] left-[25%] transform -translate-x-1/2 -translate-y-1/2">
                        +
                    </div>
                    <div className="absolute w-3 h-3 flex items-center justify-center transition-colors 
                    duration-200 text-gray-800 top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
                        +
                    </div>
                    <div className="absolute w-3 h-3 flex items-center justify-center transition-colors 
                    duration-200 text-gray-800 top-[50%] left-[75%] transform -translate-x-1/2 -translate-y-1/2">
                        +
                    </div>
                    <div className="absolute w-3 h-3 flex items-center justify-center transition-colors 
                    duration-200 text-gray-800 top-[50%] left-[100%] transform -translate-x-1/2 -translate-y-1/2">
                        +
                    </div>
                    <div className="absolute w-3 h-3 flex items-center justify-center transition-colors 
                    duration-200 text-gray-800 top-[100%] left-0 transform -translate-x-1/2 -translate-y-1/2">
                        +
                    </div>
                    <div className="absolute w-3 h-3 flex items-center justify-center transition-colors 
                    duration-200 text-gray-800 top-[100%] left-[25%] transform -translate-x-1/2 -translate-y-1/2">
                        +
                    </div>
                    <div className="absolute w-3 h-3 flex items-center justify-center transition-colors 
                    duration-200 text-gray-800 top-[100%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
                        +
                    </div>
                    <div className="absolute w-3 h-3 flex items-center justify-center transition-colors 
                    duration-200 text-gray-800 top-[100%] left-[75%] transform -translate-x-1/2 -translate-y-1/2">
                        +
                    </div>
                    <div className="absolute w-3 h-3 flex items-center justify-center transition-colors 
                    duration-200 text-gray-800 top-[100%] left-[100%] transform -translate-x-1/2 -translate-y-1/2">
                        +
                    </div>
                </div>
            </div>
        </div>
);
};
