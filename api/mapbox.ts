// import React, { useEffect, useRef } from "react"
// import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';



// const MapBox = () => {
//     const mapboxToken = process.env.mapboxToken
//     const mapContainerRef = useRef<HTMLDivElement | null>(null);
//     const mapRef = useRef<mapboxgl.Map | null>(null);

//     useEffect(() => {
//         mapRef.current = new mapboxgl.Map ({
//             container: mapContainerRef.current,
//             center: [-74.5, 40], // starting point
//             zoom: 9 // starting zoom
//         });
//     }, []);
// }

//     return (
//         <div
//             ref={mapContainerRef},
//             style={{ 
//                 width:"500px"
//                 height:"500px"
//             }}> 
//         </div>
//     )

// }