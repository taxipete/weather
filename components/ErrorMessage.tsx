
import React from 'react';

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <div className="relative mt-8 p-4 pr-12 bg-red-900/50 border border-red-700 rounded-lg text-center text-red-300">
      <p className="font-semibold">Oops! Something went wrong.</p>
      <p>{message}</p>
      <button
        onClick={onClose}
        className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-red-300 hover:text-white hover:bg-red-700/50 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-red-900/50"
        aria-label="Close error message"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
