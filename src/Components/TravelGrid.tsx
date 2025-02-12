import { ComposableMap, Geographies, Geography, GeographyProps } from "react-simple-maps"
import { Feature, Geometry, GeoJsonProperties } from 'geojson'


type RSMFeature = Feature<Geometry, GeoJsonProperties> & {
    rsmKey: string;
}



export const TravelGrid = () => {
    return (
    <div className="grid grid-cols-4 gap-12 border stroke-1">
        <ComposableMap
            projection = "geoEqualEarth"
            projectionConfig={{
                center: [78, 22],
                scale: 800
            }}
        >
            <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                {({ geographies } : { geographies : RSMFeature[] }) =>
                    geographies.map((geo: RSMFeature) => {
                        if (geo.properties && geo.properties.name === "India") {
                            console.log("Country", geo.properties);
                            return <Geography 
                            key={geo.rsmKey} 
                            geography={geo}
                            fill="none"
                            stroke="#000000"
                            strokeWidth={2} />
                        }
                        return null
                    })
                }
            </Geographies>
        </ComposableMap>
    </div>
)
}
