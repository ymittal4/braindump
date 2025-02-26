import { ComposableMap, Geographies, Geography, GeographyProps } from "react-simple-maps"
import { Feature, Geometry, GeoJsonProperties } from 'geojson'
import { useEffect, useState, useRef } from "react"
import useHover from "../hooks/hoverHook"
import gsap from "gsap"
import { TextPlugin } from "gsap/all"
import { useScramble } from "use-scramble"
gsap.registerPlugin(TextPlugin)

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

function makeRandomString(length:number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
}


export const TravelGrid = () => {
    // State to track which country is currently being hovered
    const [currentCountry, setCountry] = useState <string | null>(null);
    
    // Custom hook to handle hover interactions
    const [isHovered, hoverProps] = useHover({
        onMouseEnterCallback: (isHovered, hoveredCountry) => {
            setCountry(hoveredCountry ?? null)
            // console.log(`your mouse is in country, ${currentCountry}, hover state: ${isHovered}`)
        },
        onMouseLeaveCallback: (isHovered, hoveredCountry) => {
            setCountry(null)
            // console.log(`your mouse left ${currentCountry}, hover state: ${isHovered}`)
        } 
    });

    const countryRefs: { [key:string] : React.RefObject<HTMLDivElement> } = {
        "India" : useRef<HTMLDivElement>(null),
        "China" : useRef<HTMLDivElement>(null),
        "Japan" : useRef<HTMLDivElement>(null),
        "Spain" : useRef<HTMLDivElement>(null),
        "Kenya" : useRef<HTMLDivElement>(null),
    }

    const previousCountry = useRef(currentCountry);

    useEffect(() => {
        console.log('effect running with', isHovered, currentCountry);
        console.log ("previous country was", previousCountry)

        if (previousCountry.current && previousCountry.current != currentCountry) {
            gsap.to(countryRefs[previousCountry.current].current, {
                duration: 0.4,
                text:"_____",
                ease: "none",
            });
        }
        
        if (currentCountry) {
            gsap.to(countryRefs[currentCountry].current, {
                duration: 0.4,
                text: currentCountry,
                ease: "none",
              });
            }
        previousCountry.current = currentCountry
    },[currentCountry, isHovered]);
        
    return (
        
        <div className="map-container">
            <div className="relative grid grid-cols-4 h-[500px]">
                {countriesVisited.map((country) => {
                        return (
                            <div {...hoverProps} data-hoveredCountry = {country}> 
                                <ComposableMap
                                    style = {{ opacity : isHovered && currentCountry === country ? 0 : 1}}
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
                                <div 
                                    ref = {countryRefs[country]}
                                    style={{ 
                                        opacity : isHovered && currentCountry === country ? 1 : 0,
                                        fontWeight:'bold',
                                        fontSize:'2rem',
                                        position:'relative',
                                        top:'-35%',
                                        left:'90%',
                                        transform:'translate(-50%, -50%)'
                                    }}
                                > 
                                    { makeRandomString(country.length)}
                                </div>
                            </div>
                        );
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
