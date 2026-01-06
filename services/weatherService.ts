
import type { WeatherData, WeatherCondition, Weather, DayWeather } from '../types';

const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Maps WMO weather codes to our simplified WeatherCondition type.
 * @param code The WMO weather code from the API.
 * @returns A WeatherCondition string.
 */
const mapWeatherCodeToCondition = (code: number): WeatherCondition => {
    if (code === 0) return "Sunny";
    if (code >= 1 && code <= 2) return "Partly Cloudy";
    if (code === 3) return "Cloudy";
    if (code >= 45 && code <= 48) return "Cloudy"; // Fog
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "Rainy";
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "Snowy";
    if (code >= 95) return "Thunderstorm";
    return "Cloudy"; // Default case
};

/**
 * Fetches latitude and longitude for a given location name.
 * @param location The name of the location (e.g., "Basingstoke").
 * @returns An object with latitude and longitude.
 * @throws If the location cannot be found.
 */
const getCoordinatesForLocation = async (location: string): Promise<{ lat: number, lon: number }> => {
    const response = await fetch(`${GEOCODING_API_URL}?name=${encodeURIComponent(location)}&count=1`);
    if (!response.ok) {
        throw new Error("Failed to fetch location data.");
    }
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
        throw new Error(`Could not find location: "${location}". Please try a different name.`);
    }
    const { latitude, longitude } = data.results[0];
    return { lat: latitude, lon: longitude };
};

/**
 * Common function to fetch and process weather data from the API for a given set of coordinates.
 * @param lat Latitude
 * @param lon Longitude
 * @param currentDate The current date object
 * @returns A WeatherData object
 */
const fetchAndProcessWeatherData = async (lat: number, lon: number, currentDate: Date): Promise<WeatherData> => {
    const yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(currentDate.getDate() - 1);
    
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];
    const todayStr = currentDate.toISOString().split('T')[0];

    const params = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lon.toString(),
        start_date: yesterdayStr,
        end_date: todayStr,
        hourly: "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
        timezone: "auto",
    });

    const response = await fetch(`${WEATHER_API_URL}?${params}`);
    if (!response.ok) {
        throw new Error("Failed to fetch weather data from the API.");
    }

    const data = await response.json();
    if (!data.hourly || !data.hourly.time || data.hourly.time.length === 0) {
         throw new Error("Incomplete weather data received from API.");
    }
    
    const fullYesterdayHourly: Weather[] = [];
    const fullTodayHourly: Weather[] = [];

    for (let i = 0; i < data.hourly.time.length; i++) {
        const timeStr = data.hourly.time[i];
        const pointDate = new Date(timeStr);
        
        const weatherPoint: Weather = {
            time: pointDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }),
            temperature: data.hourly.temperature_2m[i],
            condition: mapWeatherCodeToCondition(data.hourly.weather_code[i]),
            humidity: data.hourly.relative_humidity_2m[i],
            windSpeed: data.hourly.wind_speed_10m[i],
        };

        if (timeStr.startsWith(yesterdayStr)) {
            fullYesterdayHourly.push(weatherPoint);
        } else if (timeStr.startsWith(todayStr)) {
            fullTodayHourly.push(weatherPoint);
        }
    }

    if (fullYesterdayHourly.length < 24) {
        throw new Error("Could not retrieve full historical data for yesterday.");
    }
     if (fullTodayHourly.length === 0 && new Date() < new Date(`${todayStr}T23:59:59`)) {
        throw new Error("Could not retrieve weather data for today.");
    }

    const yesterdaySummary = fullYesterdayHourly[14] || fullYesterdayHourly[fullYesterdayHourly.length - 1];
    const todaySummary = fullTodayHourly[14] || fullTodayHourly[fullTodayHourly.length - 1];
    
    if (!yesterdaySummary || !todaySummary) {
        throw new Error("Could not find representative weather data for the summary cards.");
    }

    const currentHour = currentDate.getHours();
    const getHour = (weatherPoint: Weather): number => parseInt(weatherPoint.time!.split(':')[0], 10);

    const filteredYesterdayHourly = fullYesterdayHourly.filter(h => getHour(h) >= currentHour);
    const filteredTodayHourly = fullTodayHourly.filter(h => getHour(h) >= currentHour);

    return {
        yesterday: { summary: yesterdaySummary, hourly: filteredYesterdayHourly },
        today: { summary: todaySummary, hourly: filteredTodayHourly },
    };
};

/**
 * Fetches weather data by location name.
 * @param location The name of the location.
 * @param currentDate The current date.
 * @returns A WeatherData object and coordinates.
 */
export const fetchWeatherDataForLocation = async (location: string, currentDate: Date): Promise<{data: WeatherData, coords: {lat: number, lon: number}}> => {
    const { lat, lon } = await getCoordinatesForLocation(location);
    const weatherData = await fetchAndProcessWeatherData(lat, lon, currentDate);
    return { data: weatherData, coords: { lat, lon } };
};

/**
 * Fetches weather data by geographic coordinates.
 * @param lat Latitude.
 * @param lon Longitude.
 * @param currentDate The current date.
 * @returns A WeatherData object and coordinates.
 */
export const fetchWeatherDataByCoords = async (lat: number, lon: number, currentDate: Date): Promise<{data: WeatherData, coords: {lat: number, lon: number}}> => {
    const weatherData = await fetchAndProcessWeatherData(lat, lon, currentDate);
    return { data: weatherData, coords: { lat, lon } };
};

/**
 * Fetches only today's weather data for refreshing.
 * @param lat Latitude.
 * @param lon Longitude.
 * @param currentDate The current date.
 * @returns A DayWeather object for today.
 */
export const fetchRefreshedTodayData = async (lat: number, lon: number, currentDate: Date): Promise<DayWeather> => {
    const todayStr = currentDate.toISOString().split('T')[0];

    const params = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lon.toString(),
        start_date: todayStr,
        end_date: todayStr,
        hourly: "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
        timezone: "auto",
    });

    const response = await fetch(`${WEATHER_API_URL}?${params}`);
    if (!response.ok) {
        throw new Error("Failed to fetch refreshed weather data from the API.");
    }

    const data = await response.json();
    if (!data.hourly || !data.hourly.time || data.hourly.time.length === 0) {
        throw new Error("Incomplete refreshed weather data received from API.");
    }

    const fullTodayHourly: Weather[] = [];

    for (let i = 0; i < data.hourly.time.length; i++) {
        const timeStr = data.hourly.time[i];
        const pointDate = new Date(timeStr);

        const weatherPoint: Weather = {
            time: pointDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }),
            temperature: data.hourly.temperature_2m[i],
            condition: mapWeatherCodeToCondition(data.hourly.weather_code[i]),
            humidity: data.hourly.relative_humidity_2m[i],
            windSpeed: data.hourly.wind_speed_10m[i],
        };
        fullTodayHourly.push(weatherPoint);
    }
    
    if (fullTodayHourly.length === 0) {
        throw new Error("Could not retrieve weather data for today during refresh.");
    }

    const todaySummary = fullTodayHourly[14] || fullTodayHourly[fullTodayHourly.length - 1];
    if (!todaySummary) {
        throw new Error("Could not find representative weather data for the summary cards.");
    }

    const currentHour = currentDate.getHours();
    const getHour = (weatherPoint: Weather): number => parseInt(weatherPoint.time!.split(':')[0], 10);
    const filteredTodayHourly = fullTodayHourly.filter(h => getHour(h) >= currentHour);

    return { summary: todaySummary, hourly: filteredTodayHourly };
};
