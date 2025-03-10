import { fetchWeatherApi } from 'openmeteo';
import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useContext } from 'react';
import ThemeContext from "../context/ThemeContext";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX || '';

type WeatherProps = {
    className?: string
}

	
//setting up 
type weatherResponse = {
    weatherCode: number | null;
}

const weatherCodes: {[key:number]:string} = {
    0: "Clear sky",
    1: "Partly Cloudy",
    2: "Partly Cloudy",
    3: "Partly Cloudy",
    45: "Foggy",
    48: "Foggy",
    61: "Rainy",
    63: "Rainy",
    65: "Rainy",
    71: "Snowy",
    73: "Snowy",
    75: "Snowy",
    80: "Rainy"
}

const Weather = ( {className}: WeatherProps) => {
    const [ isLoading, setLoading ] = useState <boolean | null> (true)
    const [ errorMessage, setError ] = useState <string | null> (null)
    const [ weather, setWeather ] = useState<string | null>(null)
    const [ isHovered, setHovered] = useState<boolean | null> (false)

    const { isDark } = useContext(ThemeContext)
    
    const params = {
        "latitude": 52.52,
        "longitude": 13.41,
        "daily": "weather_code",
        "timezone": "America/Los_Angeles",
        "forecast_days": 1
    };

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {        
        if  (mapContainerRef.current != null) {
            mapRef.current = new mapboxgl.Map ({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/light-v11',
                center: [-122.4232, 37.7415],
                zoom: 9,
                interactive:false
            });
            // console.log("new map is", mapRef.current)
        }
    }, []);
    
    const url = "https://api.open-meteo.com/v1/forecast";
    
    useEffect(() => {
        async function fetchWeatherData (){
            try {
                const responses = await fetchWeatherApi(url, params);
                const response = responses[0];
                const utcOffsetSeconds = response.utcOffsetSeconds();
                const timezone = response.timezone();
                const timezoneAbbreviation = response.timezoneAbbreviation();
                const latitude = response.latitude();
                const longitude = response.longitude();
    
                const daily = response.daily()!;
    
                // Note: The order of weather variables in the URL query and the indices below need to match!
                const weatherData = {
                    daily: {
                        time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                            (t) => new Date((t + utcOffsetSeconds) * 1000)
                        ),
                        weatherCode: daily.variables(0)!.valuesArray()!,
                    },
                };
    
                // `weatherData` now contains a simple structure with arrays for datetime and weather data
                for (let i = 0; i < weatherData.daily.time.length; i++) {

                    setWeather(weatherCodes[weatherData.daily.weatherCode[i]])

                    console.log( 
                        weatherData.daily.time[i].toISOString(),
                        weatherData.daily.weatherCode[i],

                        console.log ('weather is', weatherData.daily.weatherCode[i])
                    );
                }
            }
            catch (error) {
                console.log ("error fetching data", error)
            } finally {
                setLoading(false)
            }
        }
        fetchWeatherData()
    }
    ,[])
    
    // Helper function to form time ranges
    const range = (start: number, stop: number, step: number) =>
        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

        return (
            <div className={`${className} transition-opacity duration-300`}>
                <div className={`w-1/4 h-auto border p-4 shadow-xl absolute ${isDark ? 'text-white bg-gray-900' : 'text:black bg-white'}`}>
                    <div className='flex justify-between items-center mb-4 px-2 border border-gray-700'>
                        <div className='font-semibold text-2xl opacity-75'>
                            { weather }
                        </div>
                        <div className='m-2'>
                            San Francisco
                        </div>
                    </div>
                    <div
                        ref={mapContainerRef}
                        className='w-full h-40 border border-dashed border-border-gray-700'
                    > 
                    </div>
                </div>
            </div>
        )
    }

export default Weather;