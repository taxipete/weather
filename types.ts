export type WeatherCondition = "Sunny" | "Cloudy" | "Rainy" | "Snowy" | "Partly Cloudy" | "Thunderstorm" | "Windy";

export interface Weather {
  temperature: number; // in Celsius
  condition: WeatherCondition;
  humidity: number; // percentage
  windSpeed: number; // in km/h
  time?: string; // Optional: for hourly forecast, e.g., "14:00"
}

// This is what the Gemini service will use for the summary
export interface WeatherSummaryData {
  yesterday: Weather;
  today: Weather;
}

// This contains the full data for the UI, including the hourly breakdown
export interface DayWeather {
    summary: Weather;
    hourly: Weather[];
}

export interface WeatherData {
  yesterday: DayWeather;
  today: DayWeather;
}
