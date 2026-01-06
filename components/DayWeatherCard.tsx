import React from "react";
import { WeatherIcon } from "./WeatherIcon";
import type { Weather } from "../types";

interface DayWeatherCardProps {
  date: Date;
  weather: Weather;
  isGreyedOut?: boolean;
}

export const DayWeatherCard: React.FC<DayWeatherCardProps> = ({
  date,
  weather,
  isGreyedOut = false,
}) => {
  const dayName = date.toLocaleDateString("en-GB", { weekday: "short" });
  const dateStr = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  return (
    <div
      className={`
        p-4 rounded-lg border transition-all
        ${
          isGreyedOut
            ? "bg-slate-800/30 border-slate-700/50 opacity-60"
            : "bg-slate-800/70 border-slate-600 shadow-lg"
        }
      `}
    >
      <div className="text-center">
        <div
          className={`font-semibold text-sm ${
            isGreyedOut ? "text-slate-400" : "text-slate-200"
          }`}
        >
          {dayName}
        </div>
        <div
          className={`text-xs ${
            isGreyedOut ? "text-slate-500" : "text-slate-400"
          } mb-2`}
        >
          {dateStr}
        </div>

        <div className="flex justify-center mb-2">
          <WeatherIcon condition={weather.condition} className="w-12 h-12" />
        </div>

        <div
          className={`text-2xl font-bold ${
            isGreyedOut ? "text-slate-400" : "text-cyan-400"
          } mb-1`}
        >
          {Math.round(weather.temperature)}°C
        </div>

        <div
          className={`text-xs ${
            isGreyedOut ? "text-slate-500" : "text-slate-400"
          } mb-1`}
        >
          {weather.condition}
        </div>

        <div
          className={`text-xs ${
            isGreyedOut ? "text-slate-600" : "text-slate-500"
          } space-y-0.5`}
        >
          <div>💧 {weather.humidity}%</div>
          <div>💨 {weather.windSpeed} km/h</div>
        </div>
      </div>
    </div>
  );
};
