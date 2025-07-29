import { fetchWeatherApi } from 'openmeteo';
import { useEffect, useState, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useContext } from 'react';
import ThemeContext from "../context/ThemeContext";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX || '';

interface WeatherProps {
    className?: string;
}

const WEATHER_CODES: Record<number, string> = {
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
};

const WEATHER_API_PARAMS = {
    latitude: 37.7749,
    longitude: -122.4194,
    daily: "weather_code",
    timezone: "America/Los_Angeles",
    forecast_days: 1
};

const Weather = ({ className }: WeatherProps) => {
    const [isLoading, setLoading] = useState(true);
    const [errorMessage, setError] = useState<string | null>(null);
    const [weather, setWeather] = useState<string | null>(null);
    const { isDark } = useContext(ThemeContext);
    
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: isDark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11',
                center: [-122.4194, 37.7749],
                zoom: 9,
                interactive: false
            });
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [isDark]);
    
    const range = (start: number, stop: number, step: number) =>
        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    const fetchWeatherData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const responses = await fetchWeatherApi("https://api.open-meteo.com/v1/forecast", WEATHER_API_PARAMS);
            const response = responses[0];
            const utcOffsetSeconds = response.utcOffsetSeconds();
            const daily = response.daily()!;

            const weatherData = {
                daily: {
                    time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                        (t) => new Date((t + utcOffsetSeconds) * 1000)
                    ),
                    weatherCode: daily.variables(0)!.valuesArray()!,
                },
            };

            if (weatherData.daily.weatherCode.length > 0) {
                const todayWeatherCode = weatherData.daily.weatherCode[0];
                setWeather(WEATHER_CODES[todayWeatherCode] || "Unknown");
            }
        } catch (error) {
            console.error("Error fetching weather data:", error);
            // Don't show error state, just set a default weather
            setWeather("Clear sky");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWeatherData();
    }, [fetchWeatherData]);
    
    if (isLoading) {
        return (
            <div className={`${className} transition-opacity duration-300`}>
                <div className={`w-1/4 h-auto border p-4 shadow-xl absolute ${isDark ? 'text-white bg-gray-900' : 'text-black bg-white'}`}>
                    <div className="flex items-center justify-center h-32">
                        <div className="text-gray-500">Loading weather...</div>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className={`${className} transition-opacity duration-300`}>
            <div className={`w-1/4 h-auto border p-4 shadow-xl absolute ${isDark ? 'text-white bg-gray-900' : 'text-black bg-white'}`}>
                <div className="flex justify-between items-center mb-4 px-2 border border-gray-700">
                    <div className="font-semibold text-2xl opacity-75">
                        {weather || "--"}
                    </div>
                    <div className="m-2 text-sm">
                        San Francisco
                    </div>
                </div>
                <div
                    ref={mapContainerRef}
                    className="w-full h-40 border border-dashed border-gray-700"
                />
            </div>
        </div>
    );
}

export default Weather;