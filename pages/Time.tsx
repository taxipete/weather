import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const Time: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const showColon = currentTime.getSeconds() % 2 === 0;

  const hours = currentTime.getHours().toString().padStart(2, "0");
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const seconds = currentTime.getSeconds().toString().padStart(2, "0");

  const dayOfWeek = currentTime.toLocaleDateString("en-GB", {
    weekday: "long",
  });

  const dateString = currentTime.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-slate-100 font-sans flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>

      <div
        className={`relative text-center w-full max-w-7xl transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Decorative clock icon */}
        <div className="flex justify-center mb-8 opacity-30">
          <Clock
            className="w-12 h-12 text-cyan-400 animate-pulse"
            strokeWidth={1}
          />
        </div>

        {/* Subtle container with backdrop blur */}
        <div className="backdrop-blur-sm bg-slate-900/20 rounded-3xl border border-slate-700/30 p-8 md:p-12 lg:p-16 shadow-2xl">
          {/* Time display with glow effect */}
          <div
            className="text-[12vw] md:text-[15vw] lg:text-[18vw] font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 leading-none mb-2 font-mono transition-all duration-300"
            style={{
              textShadow:
                "0 0 30px rgba(34, 211, 238, 0.2), 0 0 60px rgba(34, 211, 238, 0.1)",
              filter: "drop-shadow(0 0 15px rgba(34, 211, 238, 0.25))",
            }}
          >
            {hours}
            <span
              className={`transition-opacity duration-200 ${
                showColon ? "opacity-100" : "opacity-0"
              }`}
            >
              :
            </span>
            {minutes}
          </div>

          {/* Seconds display - subtle and small */}
          <div className="text-2xl md:text-3xl font-light text-slate-500 tracking-widest mb-6 font-mono">
            {seconds}
          </div>

          {/* Decorative line */}
          <div className="flex items-center justify-center mb-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          </div>

          {/* Day of week - uppercase and bold */}
          <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-400 uppercase tracking-[0.3em] mb-3">
            {dayOfWeek}
          </div>

          {/* Date with better letter spacing */}
          <div className="text-[3.5vw] md:text-[4vw] lg:text-[4.5vw] font-light text-slate-400/80 leading-tight tracking-wide">
            {dateString}
          </div>
        </div>

        {/* Subtle footer */}
        <div className="mt-8 text-slate-600 text-sm tracking-widest">LIVE</div>
      </div>
    </div>
  );
};

export default Time;
