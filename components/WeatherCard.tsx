import React from 'react';
import type { DayWeather } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { HourlyForecast } from './HourlyForecast';

interface WeatherCardProps {
  day: 'Yesterday' | 'Today';
  data: DayWeather;
  isExpanded: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ day, data, isExpanded }) => {
  return (
    <div className={`rounded-xl border ${day === 'Today' ? 'border-cyan-500/50 bg-sky-900/40' : 'border-slate-700 bg-slate-800/60'} shadow-xl backdrop-blur-sm overflow-hidden transition-all duration-500`}>
      <div className="p-6">
        <h2 className={`text-2xl font-bold ${day === 'Today' ? 'text-cyan-400' : 'text-slate-400'}`}>{day}</h2>
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20">
              <WeatherIcon condition={data.summary.condition} />
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-extrabold text-white">{Math.round(data.summary.temperature)}°C</p>
              <p className="text-slate-300 text-lg capitalize">{data.summary.condition}</p>
            </div>
          </div>
          <div className="w-full sm:w-auto text-center sm:text-right space-y-2 mt-4 sm:mt-0">
            <p className="text-sm text-slate-400">Humidity: <span className="font-semibold text-slate-200">{Math.round(data.summary.humidity)}%</span></p>
            <p className="text-sm text-slate-400">Wind: <span className="font-semibold text-slate-200">{Math.round(data.summary.windSpeed)} km/h</span></p>
          </div>
        </div>
      </div>

      {/* Expandable Hourly Forecast */}
      <div
        id={`hourly-forecast-${day.toLowerCase()}`}
        className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <HourlyForecast hourlyData={data.hourly} />
        </div>
      </div>
    </div>
  );
};