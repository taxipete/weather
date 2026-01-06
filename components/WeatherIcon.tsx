
import React from 'react';
import type { WeatherCondition } from '../types';

interface WeatherIconProps {
  condition: WeatherCondition;
  className?: string;
}

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className}>
        <g className="animate-spin-slow">
            <circle cx="32" cy="32" r="12" className="fill-yellow-400" />
            <path d="M32 46c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1s-1 .45-1 1v6c0 .55.45 1 1 1z" className="fill-yellow-400" />
            <path d="M32 24c-.55 0-1 .45-1 1v-6c0-.55.45-1 1-1s1 .45 1 1v6c0-.55-.45-1-1-1z" transform="rotate(180 32 21)" className="fill-yellow-400" />
            <path d="M18 32c.55 0 1-.45 1-1h-6c0 .55.45 1 1 1h4z" transform="rotate(-90 15 32)" className="fill-yellow-400" />
            <path d="M52 32c-.55 0-1 .45-1 1h-6c0-.55.45-1 1-1h4z" transform="rotate(90 49 32)" className="fill-yellow-400" />
            <path d="M50.51 14.51c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-4.24 4.24c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.24-4.24z" className="fill-yellow-400" />
            <path d="M17.76 47.76c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.24-4.24c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-4.24 4.24z" className="fill-yellow-400" />
            <path d="M50.51 49.09c-.39.39-1.02.39-1.41 0l-4.24-4.24c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l4.24 4.24c.39.39.39 1.02 0 1.41z" className="fill-yellow-400" />
            <path d="M17.76 16.24c.39-.39 1.02-.39 1.41 0l4.24 4.24c.39.39.39 1.02 0 1.41-.39-.39-1.02-.39-1.41 0l-4.24-4.24c-.39-.39-.39-1.02 0-1.41z" className="fill-yellow-400" />
        </g>
    </svg>
);
const CloudIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className}>
        <path d="M46.68 26.34a16.34 16.34 0 00-30.43 4.24A12.21 12.21 0 0019.5 54h24.25a10.26 10.26 0 002.93-20.21.78.78 0 00.27-.67 10.18 10.18 0 00-.27-2.78z" className="fill-slate-300 animate-drift" />
    </svg>
);
const RainIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className}>
         <path d="M46.68 26.34a16.34 16.34 0 00-30.43 4.24A12.21 12.21 0 0019.5 54h24.25a10.26 10.26 0 002.93-20.21.78.78 0 00.27-.67 10.18 10.18 0 00-.27-2.78z" className="fill-slate-400 animate-drift" />
         <path d="M24.73 54.27a2 2 0 01-2-2v-4a2 2 0 014 0v4a2 2 0 01-2 2z" className="fill-sky-400 animate-drop-1" />
         <path d="M34.73 54.27a2 2 0 01-2-2v-4a2 2 0 014 0v4a2 2 0 01-2 2z" className="fill-sky-400 animate-drop-2" />
    </svg>
);
const SnowIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className}>
        <path d="M46.68 26.34a16.34 16.34 0 00-30.43 4.24A12.21 12.21 0 0019.5 54h24.25a10.26 10.26 0 002.93-20.21.78.78 0 00.27-.67 10.18 10.18 0 00-.27-2.78z" className="fill-slate-300 animate-drift" />
        <g className="fill-white" style={{ fontFamily: 'sans-serif' }}>
            <text x="24" y="56" className="animate-snow-1" style={{fontSize: '12px', textAnchor: 'middle', animationDelay: '0s'}}>&#10052;</text>
            <text x="35" y="56" className="animate-snow-2" style={{fontSize: '12px', textAnchor: 'middle', animationDelay: '1.5s'}}>&#10052;</text>
            <text x="44" y="56" className="animate-snow-1" style={{fontSize: '12px', textAnchor: 'middle', animationDelay: '2.5s'}}>&#10052;</text>
        </g>
    </svg>
);
const WindIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className}>
        <g className="animate-drift">
            <path d="M46.68 26.34a16.34 16.34 0 00-30.43 4.24A12.21 12.21 0 0019.5 54h24.25a10.26 10.26 0 002.93-20.21.78.78 0 00.27-.67 10.18 10.18 0 00-.27-2.78z" className="fill-slate-300" />
        </g>
        <g className="fill-slate-400">
            <path d="M14.5 40.5h-5a1 1 0 01-1-1v-2a1 1 0 011-1h5a1 1 0 011 1v2a1 1 0 01-1 1z" className="animate-wind" style={{ animationDelay: '0s' }} />
            <path d="M27.5 40.5h-5a1 1 0 01-1-1v-2a1 1 0 011-1h5a1 1 0 011 1v2a1 1 0 01-1 1z" className="animate-wind" style={{ animationDelay: '0.5s' }} />
            <path d="M22.5 48.5h-10a1 1 0 01-1-1v-2a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 01-1 1z" className="animate-wind" style={{ animationDelay: '0.2s' }} />
        </g>
    </svg>
);
const PartlyCloudyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className}>
        <g>
            <g className="animate-spin-slow">
              <circle cx="32" cy="32" r="12" className="fill-yellow-400" />
              <path d="M32 46c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1s-1 .45-1 1v6c0 .55.45 1 1 1z" className="fill-yellow-400" />
              <path d="M32 24c-.55 0-1 .45-1 1v-6c0-.55.45-1 1-1s1 .45 1 1v6c0-.55-.45-1-1-1z" transform="rotate(180 32 21)" className="fill-yellow-400" />
              <path d="M18 32c.55 0 1-.45 1-1h-6c0 .55.45 1 1 1h4z" transform="rotate(-90 15 32)" className="fill-yellow-400" />
              <path d="M52 32c-.55 0-1 .45-1 1h-6c0-.55.45-1 1-1h4z" transform="rotate(90 49 32)" className="fill-yellow-400" />
              <path d="M50.51 14.51c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-4.24 4.24c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.24-4.24z" className="fill-yellow-400" />
              <path d="M17.76 47.76c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.24-4.24c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-4.24 4.24z" className="fill-yellow-400" />
              <path d="M50.51 49.09c-.39.39-1.02.39-1.41 0l-4.24-4.24c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l4.24 4.24c.39.39.39 1.02 0 1.41z" className="fill-yellow-400" />
              <path d="M17.76 16.24c.39-.39 1.02-.39 1.41 0l4.24 4.24c.39.39.39 1.02 0 1.41-.39-.39-1.02-.39-1.41 0l-4.24-4.24c-.39-.39-.39-1.02 0-1.41z" className="fill-yellow-400" />
            </g>
            <path d="M46.68 26.34a16.34 16.34 0 00-30.43 4.24A12.21 12.21 0 0019.5 54h24.25a10.26 10.26 0 002.93-20.21.78.78 0 00.27-.67 10.18 10.18 0 00-.27-2.78z" className="fill-slate-300 animate-drift" />
        </g>
    </svg>
);
const ThunderstormIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className}>
      <path d="M46.68 26.34a16.34 16.34 0 00-30.43 4.24A12.21 12.21 0 0019.5 54h24.25a10.26 10.26 0 002.93-20.21.78.78 0 00.27-.67 10.18 10.18 0 00-.27-2.78z" className="fill-slate-500 animate-drift" />
      <path d="M33 38.45l-4.28 9.32a1 1 0 00.9 1.45h4.13a1 1 0 00.95-.68l3.1-6.81a1 1 0 00-.89-1.45h-3Z" className="fill-yellow-400 animate-flash" />
    </svg>
);


export const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, className }) => {
  switch (condition) {
    case 'Sunny':
      return <SunIcon className={className} />;
    case 'Cloudy':
      return <CloudIcon className={className} />;
    case 'Partly Cloudy':
      return <PartlyCloudyIcon className={className} />;
    case 'Rainy':
      return <RainIcon className={className} />;
    case 'Snowy':
      return <SnowIcon className={className} />;
    case 'Windy':
      return <WindIcon className={className} />;
    case 'Thunderstorm':
      return <ThunderstormIcon className={className} />;
    default:
      return <CloudIcon className={className} />;
  }
};
