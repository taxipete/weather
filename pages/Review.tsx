import React, { useState, useEffect, useCallback } from "react";
import { LocationInput } from "../components/LocationInput";
import { DayWeatherCard } from "../components/DayWeatherCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import {
  fetchThreeWeeksWeather,
  fetchWeatherDataForLocation,
  fetchWeatherDataByCoords,
} from "../services/weatherService";
import type { Weather } from "../types";

const LAST_SEARCH_KEY = "weather-compare-last-location";

interface DayData {
  date: Date;
  weather: Weather;
}

const Review: React.FC = () => {
  const [location, setLocation] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [weatherData, setWeatherData] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = useCallback(
    async (lat: number, lon: number, locationName: string) => {
      setIsLoading(true);
      setError(null);
      setWeatherData([]);

      try {
        const data = await fetchThreeWeeksWeather(lat, lon, new Date());
        setWeatherData(data);
        setCoordinates({ lat, lon });
        setLocation(locationName);

        // Save location on successful search, unless it's from geolocation
        if (locationName !== "Your Location") {
          localStorage.setItem(LAST_SEARCH_KEY, locationName);
        }
      } catch (err) {
        console.error(err);
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred.";
        setError(
          `Sorry, I couldn't get the weather for ${locationName}. ${errorMessage}`
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleFetchWeather = useCallback(
    async (newLocation: string) => {
      if (!newLocation) {
        setError("Please enter a location.");
        return;
      }

      try {
        const { coords } = await fetchWeatherDataForLocation(
          newLocation,
          new Date()
        );
        await fetchWeatherData(coords.lat, coords.lon, newLocation);
      } catch (err) {
        console.error(err);
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred.";
        setError(
          `Sorry, I couldn't get the weather for ${newLocation}. ${errorMessage}`
        );
        setIsLoading(false);
      }
    },
    [fetchWeatherData]
  );

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await fetchWeatherData(
          position.coords.latitude,
          position.coords.longitude,
          "Your Location"
        );
      },
      (err) => {
        console.warn(`Geolocation error: ${err.message}`);
        setError(
          `Could not get your location. ${err.message}. Please search for a location manually.`
        );
        setIsLoading(false);
      }
    );
  }, [fetchWeatherData]);

  useEffect(() => {
    const lastLocation = localStorage.getItem(LAST_SEARCH_KEY);
    const defaultLocation = lastLocation || "Basingstoke";
    if (!location) {
      handleFetchWeather(defaultLocation);
    }
  }, [handleFetchWeather, location]);

  // Split data into 3 weeks starting from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastWeek = weatherData.slice(0, 7);
  const thisWeek = weatherData.slice(7, 14);
  const nextWeek = weatherData.slice(14, 21);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-sky-900 text-slate-100 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Weekly Review
          </h1>
          <p className="text-slate-400 mt-2 text-lg">3-Week Weather Overview</p>
        </header>

        <main>
          <LocationInput
            initialLocation={location}
            onFetchWeather={handleFetchWeather}
            isLoading={isLoading}
            onGeolocate={handleGeolocate}
          />

          {isLoading && <LoadingSpinner />}
          {error && (
            <ErrorMessage message={error} onClose={() => setError(null)} />
          )}

          {weatherData.length > 0 && !isLoading && (
            <div className="mt-8 space-y-4">
              {/* Last Week - Grey Tint */}
              <div className="-mb-4">
                <h2 className="text-xl font-semibold text-slate-300 mb-2">
                  Last Week
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {lastWeek.map((day, index) => (
                    <DayWeatherCard
                      key={`last-${index}`}
                      date={day.date}
                      weather={day.weather}
                      isGreyedOut={true}
                    />
                  ))}
                </div>
              </div>

              {/* This Week - Full Color */}
              <div>
                <h2 className="text-xl font-semibold text-cyan-400 mb-4">
                  This Week
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {thisWeek.map((day, index) => (
                    <DayWeatherCard
                      key={`this-${index}`}
                      date={day.date}
                      weather={day.weather}
                      isGreyedOut={false}
                    />
                  ))}
                </div>
              </div>

              {/* Next Week - Grey Tint */}
              <div className="-mb-4">
                <h2 className="text-xl font-semibold text-slate-300 mb-2">
                  Next Week
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {nextWeek.map((day, index) => (
                    <DayWeatherCard
                      key={`next-${index}`}
                      date={day.date}
                      weather={day.weather}
                      isGreyedOut={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {weatherData.length === 0 && !isLoading && !error && (
            <div className="text-center mt-12 p-8 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-slate-400 text-lg">
                Enter a location or use the location button to see a 3-week
                weather overview.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Review;
