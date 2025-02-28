import { fetchWeatherApi } from 'openmeteo';
import { useEffect, useState } from 'react';
	
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
    61: "Rain",
    63: "Rain",
    65: "Rain",
    71: "Snow",
    73: "Snow",
    75: "Snow",
    80: "Rain"
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
                        "pls work", 
                        // weatherData.daily.time[i].toISOString(),
                        weatherData.daily.weatherCode[i],
                        setWeather(weatherCodes[weatherData.daily.weatherCode[i]]),
                        console.log ('weather is', weather)
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
            <div className="border">
                <div>
                    SF weather: { weather }
                </div>
                Add weather component here
            </div>
        )
    }

export default Weather;