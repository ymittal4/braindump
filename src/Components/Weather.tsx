import { fetchWeatherApi } from 'openmeteo';
	
type weatherResponse = {
    wmoCode: number | null;
}

const params = {
	"latitude": 52.52,
	"longitude": 13.41,
	"daily": "weather_code",
	"timezone": "America/Los_Angeles",
	"forecast_days": 1
};
const url = "https://api.open-meteo.com/v1/forecast";
const responses = await fetchWeatherApi(url, params);

// Helper function to form time ranges
const range = (start: number, stop: number, step: number) =>
	Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

// Process first location. Add a for-loop for multiple locations or weather models
const response = responses[0];

// Attributes for timezone and location
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
	console.log(
		weatherData.daily.time[i].toISOString(),
		weatherData.daily.weatherCode[i]
	);
}



export const Weather = () => {
    return (
        <div className="border">
            <div>

            </div>
            Add weather component here
        </div>
    )
}