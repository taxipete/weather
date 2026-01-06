
import React from 'react';

interface AutoRefreshToggleProps {
  id: string;
  isEnabled: boolean;
  onToggle: () => void;
}

export const AutoRefreshToggle: React.FC<AutoRefreshToggleProps> = ({ id, isEnabled, onToggle }) => {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={isEnabled}
      onClick={onToggle}
      className={`${
        isEnabled ? 'bg-cyan-600' : 'bg-slate-700'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900`}
      aria-label="Toggle automatic data refresh"
    >
      <span
        aria-hidden="true"
        className={`${
          isEnabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
};
