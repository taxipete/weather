
import React, { useState, useEffect } from 'react';

interface LocationInputProps {
  initialLocation: string;
  onFetchWeather: (location: string) => void;
  isLoading: boolean;
  onGeolocate: () => void;
}

export const LocationInput: React.FC<LocationInputProps> = ({ initialLocation, onFetchWeather, isLoading, onGeolocate }) => {
  const [location, setLocation] = useState(initialLocation);

  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFetchWeather(location);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="E.g., New York, NY"
        className="flex-grow bg-slate-800/70 border border-slate-700 rounded-md py-3 px-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200"
        disabled={isLoading}
      />
      <div className="flex gap-3">
        <button
            type="button"
            onClick={onGeolocate}
            disabled={isLoading}
            className="p-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-md transition duration-200 ease-in-out flex items-center justify-center shadow-lg"
            aria-label="Use my current location"
            title="Use my current location"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 0h24v24H0V0z" fill="none"/>
                <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
            </svg>
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-grow bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-md transition duration-200 ease-in-out flex items-center justify-center shadow-lg hover:shadow-cyan-500/30"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Comparing...
            </>
          ) : (
            'Compare Weather'
          )}
        </button>
      </div>
    </form>
  );
};
