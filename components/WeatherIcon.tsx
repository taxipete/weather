import React from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  CloudSun,
  CloudLightning,
} from "lucide-react";
import type { WeatherCondition } from "../types";

interface WeatherIconProps {
  condition: WeatherCondition;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  className = "w-16 h-16",
}) => {
  const iconProps = {
    className,
    strokeWidth: 1.5,
  };

  switch (condition) {
    case "Sunny":
      return <Sun {...iconProps} className={`${className} text-yellow-400`} />;
    case "Cloudy":
      return <Cloud {...iconProps} className={`${className} text-slate-300`} />;
    case "Partly Cloudy":
      return (
        <CloudSun {...iconProps} className={`${className} text-slate-300`} />
      );
    case "Rainy":
      return (
        <CloudRain {...iconProps} className={`${className} text-sky-400`} />
      );
    case "Snowy":
      return (
        <CloudSnow {...iconProps} className={`${className} text-slate-200`} />
      );
    case "Windy":
      return <Wind {...iconProps} className={`${className} text-slate-400`} />;
    case "Thunderstorm":
      return (
        <CloudLightning
          {...iconProps}
          className={`${className} text-yellow-400`}
        />
      );
    default:
      return <Cloud {...iconProps} className={`${className} text-slate-300`} />;
  }
};
