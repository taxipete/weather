import React, { useState, useCallback, useEffect } from "react";
import { LocationInput } from "../components/LocationInput";
import { WeatherCard } from "../components/WeatherCard";
import { ComparisonSummary } from "../components/ComparisonSummary";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { AutoRefreshToggle } from "../components/AutoRefreshToggle";
import type { WeatherData, WeatherSummaryData, DayWeather } from "../types";
import { generateComparisonSummary } from "../services/geminiService";
import {
  fetchWeatherDataForLocation,
  fetchWeatherDataByCoords,
  fetchRefreshedTodayData,
} from "../services/weatherService";

const LAST_SEARCH_KEY = "weather-compare-last-location";
const AUTO_REFRESH_ENABLED_KEY = "weather-compare-auto-refresh-enabled";
const AUTO_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes

const Home: React.FC = () => {
  const [location, setLocation] = useState<string>("");
  const [yesterdayData, setYesterdayData] = useState<DayWeather | null>(null);
  const [todayData, setTodayData] = useState<DayWeather | null>(null);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [comparison, setComparison] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState<boolean>(
    () => {
      const saved = localStorage.getItem(AUTO_REFRESH_ENABLED_KEY);
      return saved === "true";
    }
  );
  const [minutesUntilRefresh, setMinutesUntilRefresh] = useState<number>(30);

  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  const runWeatherSearch = useCallback(
    async (
      searchFn: () => Promise<{
        data: WeatherData;
        coords: { lat: number; lon: number };
      }>,
      name: string
    ) => {
      setIsLoading(true);
      setError(null);
      setYesterdayData(null);
      setTodayData(null);
      setCoordinates(null);
      setComparison("");
      setIsExpanded(false);
      setLocation(name);

      try {
        const { data: realWeatherData, coords } = await searchFn();
        setYesterdayData(realWeatherData.yesterday);
        setTodayData(realWeatherData.today);
        setCoordinates(coords);

        // Save location on successful search, unless it's from geolocation
        if (name !== "Your Location") {
          localStorage.setItem(LAST_SEARCH_KEY, name);
        }

        const summaryData: WeatherSummaryData = {
          yesterday: realWeatherData.yesterday.summary,
          today: realWeatherData.today.summary,
        };
        const summary = await generateComparisonSummary(name, summaryData);
        setComparison(summary);
      } catch (err) {
        console.error(err);
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred.";
        setError(
          `Sorry, I couldn't get the weather for ${name}. ${errorMessage}`
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleFetchWeather = useCallback(
    (newLocation: string) => {
      if (!newLocation) {
        setError("Please enter a location.");
        return;
      }
      runWeatherSearch(
        () => fetchWeatherDataForLocation(newLocation, new Date()),
        newLocation
      );
    },
    [runWeatherSearch]
  );

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        runWeatherSearch(
          () =>
            fetchWeatherDataByCoords(
              position.coords.latitude,
              position.coords.longitude,
              new Date()
            ),
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
  }, [runWeatherSearch]);

  const handleRefresh = useCallback(async () => {
    if (!coordinates || !yesterdayData) {
      setError("Cannot refresh without initial data.");
      return;
    }

    setIsRefreshing(true);
    setError(null);
    setMinutesUntilRefresh(30); // Reset countdown

    try {
      const newTodayData = await fetchRefreshedTodayData(
        coordinates.lat,
        coordinates.lon,
        new Date()
      );
      setTodayData(newTodayData);

      const summaryData: WeatherSummaryData = {
        yesterday: yesterdayData.summary,
        today: newTodayData.summary,
      };
      const summary = await generateComparisonSummary(location, summaryData);
      setComparison(summary);
    } catch (err) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Sorry, I couldn't refresh the weather. ${errorMessage}`);
    } finally {
      setIsRefreshing(false);
    }
  }, [coordinates, yesterdayData, location]);

  const handleToggleAutoRefresh = () => {
    setIsAutoRefreshEnabled((prev) => {
      const newState = !prev;
      localStorage.setItem(AUTO_REFRESH_ENABLED_KEY, String(newState));
      if (newState) {
        setMinutesUntilRefresh(30); // Reset countdown when enabling
      }
      return newState;
    });
  };

  useEffect(() => {
    const lastLocation = localStorage.getItem(LAST_SEARCH_KEY);
    if (lastLocation && !location) {
      // Only run on initial load
      handleFetchWeather(lastLocation);
    }
  }, [handleFetchWeather, location]);

  useEffect(() => {
    // Set up auto-refresh only when there's data to refresh and it's enabled.
    if (!coordinates || !isAutoRefreshEnabled) {
      return;
    }

    const intervalId = setInterval(() => {
      handleRefresh();
    }, AUTO_REFRESH_INTERVAL);

    // Cleanup function to clear the interval
    return () => {
      clearInterval(intervalId);
    };
  }, [coordinates, handleRefresh, isAutoRefreshEnabled]);

  // Countdown timer for auto-refresh
  useEffect(() => {
    if (!isAutoRefreshEnabled || !coordinates) {
      return;
    }

    const countdownId = setInterval(() => {
      setMinutesUntilRefresh((prev) => {
        if (prev <= 1) {
          return 30; // Reset when it hits 0
        }
        return prev - 1;
      });
    }, 60000); // Update every minute

    return () => {
      clearInterval(countdownId);
    };
  }, [isAutoRefreshEnabled, coordinates]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-sky-900 text-slate-100 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Weather Compare
            </h1>
            {todayData && yesterdayData && !isLoading && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition duration-200 disabled:opacity-50 disabled:cursor-wait"
                aria-label="Refresh weather data"
                title="Refresh weather data"
              >
                {isRefreshing ? (
                  <svg
                    className="animate-spin h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0M2.985 19.644a8.25 8.25 0 0111.664 0m0 0l3.181-3.183m-3.181 3.183V19.644"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>
          <p className="text-slate-400 mt-2 text-lg">
            Yesterday vs. Today, powered by AI
          </p>
        </header>

        <main>
          <div className="flex items-center justify-end gap-3 mb-4">
            <label
              htmlFor="auto-refresh-toggle"
              className="text-slate-400 text-sm cursor-pointer select-none"
            >
              {isAutoRefreshEnabled
                ? `Auto-refresh in ${minutesUntilRefresh} mins`
                : "Auto-refresh every 30 mins"}
            </label>
            <AutoRefreshToggle
              id="auto-refresh-toggle"
              isEnabled={isAutoRefreshEnabled}
              onToggle={handleToggleAutoRefresh}
            />
          </div>

          <LocationInput
            initialLocation={location}
            onFetchWeather={handleFetchWeather}
            isLoading={isLoading || isRefreshing}
            onGeolocate={handleGeolocate}
          />

          {isLoading && <LoadingSpinner />}
          {error && (
            <ErrorMessage message={error} onClose={() => setError(null)} />
          )}

          {yesterdayData && todayData && !isLoading && (
            <div className="mt-8 animate-fade-in flex flex-col gap-8">
              {/* On mobile, cards are second (order-2). On desktop, they are first (md:order-1). */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 order-2 md:order-1">
                <div
                  onClick={toggleExpanded}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") toggleExpanded();
                  }}
                  aria-expanded={isExpanded}
                  aria-controls="hourly-forecast-yesterday"
                  className="cursor-pointer"
                >
                  <WeatherCard
                    day="Yesterday"
                    data={yesterdayData}
                    isExpanded={isExpanded}
                    date={
                      new Date(new Date().setDate(new Date().getDate() - 1))
                    }
                  />
                </div>
                <div
                  onClick={toggleExpanded}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") toggleExpanded();
                  }}
                  aria-expanded={isExpanded}
                  aria-controls="hourly-forecast-today"
                  className="cursor-pointer"
                >
                  <WeatherCard
                    day="Today"
                    data={todayData}
                    isExpanded={isExpanded}
                    date={new Date()}
                  />
                </div>
              </div>

              {/* On mobile, summary is first (order-1). On desktop, it's second (md:order-2). */}
              {comparison && (
                <div className="order-1 md:order-2">
                  <ComparisonSummary summary={comparison} />
                </div>
              )}
            </div>
          )}

          {!yesterdayData && !todayData && !isLoading && !error && (
            <div className="text-center mt-12 p-8 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-slate-400 text-lg">
                Enter a location or use the location button to see how the
                weather compares.
              </p>
            </div>
          )}
        </main>
      </div>
      <footer className="text-center mt-12 text-slate-500 text-sm">
        <p>Weather data provided by Open-Meteo. Summary generated by AI.</p>
      </footer>
    </div>
  );
};

export default Home;
