import { ComposableMap, Geographies, Geography, GeographyProps } from "react-simple-maps"
import { Feature, Geometry, GeoJsonProperties } from 'geojson'


type RSMFeature = Feature<Geometry, GeoJsonProperties> & {
    rsmKey: string;
}

type countryConfigs = {
    [key: string]: {
        center: [number, number];
        scale: number;
    }
}

const countriesVisited = ["India", "China", "Japan", "Spain"]

const countryConfigs: countryConfigs = {
    "India": {center:[78, 22], scale: 800},
    "China": { center: [105, 35], scale: 800 },
    "Japan": { center: [138, 38], scale: 1200 },
    "Spain": { center: [-3, 40], scale: 800 }
}


export const TravelGrid = () => {
    return (
    <div className="grid grid-cols-4 gap-12 border stroke-1">
        {countriesVisited.map((country) => (
            <ComposableMap
                projection="geoEqualEarth"
                projectionConfig={countryConfigs[country]}
            >
                <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                {({ geographies } : { geographies : RSMFeature[] }) =>
                        geographies.map((geo: RSMFeature) => {
                            if (geo.properties && country.includes(geo.properties.name)) {
                                console.log("Country", geo.properties);
                                return <Geography 
                                    key={geo.rsmKey} 
                                    geography={geo}
                                    fill="none"
                                    stroke="#000000"
                                    strokeWidth={2} 
                                />
                            }
                            return null
                        })
                    }
                </Geographies>
            </ComposableMap>
        ))}

    </div>
)
}
