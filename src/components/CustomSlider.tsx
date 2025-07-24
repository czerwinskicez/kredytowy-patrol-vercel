"use client";
import React from 'react';

type CustomSliderProps = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
};

export function CustomSlider({ value, onChange, min, max, step }: CustomSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  const handleDecrease = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  return (
    <div className="relative w-full flex items-center gap-3">
      {/* Przycisk minus */}
      <button
        type="button"
        onClick={handleDecrease}
        disabled={value <= min}
        className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-[#0a472e] text-[#0a472e] hover:bg-[#0a472e] hover:text-white disabled:border-gray-300 disabled:text-gray-300 disabled:hover:bg-transparent disabled:hover:text-gray-300 transition-colors duration-200 flex items-center justify-center font-bold"
        aria-label="Zmniejsz wartość"
      >
        −
      </button>

      {/* Suwak */}
      <div className="flex-grow relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, #0a472e ${percentage}%, #e5e7eb ${percentage}%)`,
          }}
        />
      </div>

      {/* Przycisk plus */}
      <button
        type="button"
        onClick={handleIncrease}
        disabled={value >= max}
        className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-[#0a472e] text-[#0a472e] hover:bg-[#0a472e] hover:text-white disabled:border-gray-300 disabled:text-gray-300 disabled:hover:bg-transparent disabled:hover:text-gray-300 transition-colors duration-200 flex items-center justify-center font-bold"
        aria-label="Zwiększ wartość"
      >
        +
      </button>
    </div>
  );
} 