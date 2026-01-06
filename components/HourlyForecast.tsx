import React from 'react';
import type { Weather } from '../types';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
    hourlyData: Weather[];
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyData }) => {
    // Only show data if it exists and has items
    if (!hourlyData || hourlyData.length === 0) {
        return (
            <div className="bg-slate-900/50 p-4">
                <p className="text-center text-slate-400">No further hourly data available for this time period.</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-900/50 px-4 pt-2 pb-4">
            <div className="flex flex-col space-y-2">
                {hourlyData.map((hour, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 w-full">
                        <p className="font-semibold text-slate-300 text-sm w-16">{hour.time}</p>
                        <div className="w-8 h-8">
                            <WeatherIcon condition={hour.condition} />
                        </div>
                        <p className="font-bold text-white text-lg w-16 text-right">{Math.round(hour.temperature)}°C</p>
                    </div>
                ))}
            </div>
        </div>
    );
};