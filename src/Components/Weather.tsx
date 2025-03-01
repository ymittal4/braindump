import { fetchWeatherApi } from 'openmeteo';
import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX || '';

	
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

const Weather = () => {
    const [ isLoading, setLoading ] = useState <boolean | null> (true)
    const [ errorMessage, setError ] = useState <string | null> (null)
    const [ weather, setWeather ] = useState<string | null>(null)
    
    const params = {
        "latitude": 52.52,
        "longitude": 13.41,
        "daily": "weather_code",
        "timezone": "America/Los_Angeles",
        "forecast_days": 1
    };

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    console.log("mapbox token isss", process.env.REACT_APP_MAPBOX)


    useEffect(() => {        
        if  (mapContainerRef.current != null) {
            mapRef.current = new mapboxgl.Map ({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/dark-v11',
                center: [-122.4232, 37.7415],
                zoom: 9
            });
            console.log("new map is", mapRef.current)
        }
    }, []);
    
    const url = "https://api.open-meteo.com/v1/forecast";
    
    useEffect(() => {
        async function fetchWeatherData (){
            try {
                const responses = await fetchWeatherApi(url, params);
                console.log ("does responses? ", responses)
                // Process first location. Add a for-loop for multiple locations or weather models
                const response = responses[0];
                console.log("first response is", response)
                // Attributes for timezone and location
                const utcOffsetSeconds = response.utcOffsetSeconds();
                const timezone = response.timezone();
                const timezoneAbbreviation = response.timezoneAbbreviation();
                const latitude = response.latitude();
                const longitude = response.longitude();
    
                const daily = response.daily()!;
                console.log ("daily response is", daily)
    
                // Note: The order of weather variables in the URL query and the indices below need to match!
                const weatherData = {
                    daily: {
                        time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                            (t) => new Date((t + utcOffsetSeconds) * 1000)
                        ),
                        weatherCode: daily.variables(0)!.valuesArray()!,
                    },
                };

                console.log ("Weather data is", weatherData)
    
                // `weatherData` now contains a simple structure with arrays for datetime and weather data
                for (let i = 0; i < weatherData.daily.time.length; i++) {
                    console.log( 
                        // weatherData.daily.time[i].toISOString(),
                        weatherData.daily.weatherCode[i],
                        setWeather(weatherCodes[weatherData.daily.weatherCode[i]]),
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
            <div className="border width-[150px]">
                <div className='flex'>
                    <div>
                       weather is { weather }
                    </div>
                    <div>
                        San Francisco, USA
                    </div>
                    <div
                        ref={mapContainerRef}
                        style={{ 
                            width:"500px",
                            height:"500px"
                        }}> 
                    </div>
                </div>
                Add weather component here
            </div>
        )
    }

export default Weather;