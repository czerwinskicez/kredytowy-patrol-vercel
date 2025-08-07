"use client";
import React from 'react';
import * as Slider from '@radix-ui/react-slider';

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
        className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-[#0a472e] text-[#0a472e] hover:bg-[#0a472e] hover:text-white disabled:border-gray-300 disabled:text-gray-300 disabled:hover:bg-transparent disabled:hover:text-gray-300 transition-colors duration-200 flex items-center justify-center font-bold focus:outline-none focus:ring-2 focus:ring-[#0a472e] focus:ring-offset-2"
        aria-label="Zmniejsz wartość"
      >
        −
      </button>

      {/* Suwak Radix UI */}
      <div className="flex-grow relative">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={[value]}
          onValueChange={([newValue]) => onChange(newValue)}
          max={max}
          min={min}
          step={step}
        >
          <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
            <Slider.Range 
              className="absolute bg-[#0a472e] rounded-full h-full"
              style={{ width: `${percentage}%` }}
            />
          </Slider.Track>
          <Slider.Thumb 
            className="block w-5 h-5 bg-[#0a472e] border-2 border-white rounded-full shadow-lg hover:bg-[#0a472e]/90 focus:outline-none focus:ring-2 focus:ring-[#0a472e] focus:ring-offset-2 cursor-grab active:cursor-grabbing"
            aria-label="Suwak"
          />
        </Slider.Root>
      </div>

      {/* Przycisk plus */}
      <button
        type="button"
        onClick={handleIncrease}
        disabled={value >= max}
        className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-[#0a472e] text-[#0a472e] hover:bg-[#0a472e] hover:text-white disabled:border-gray-300 disabled:text-gray-300 disabled:hover:bg-transparent disabled:hover:text-gray-300 transition-colors duration-200 flex items-center justify-center font-bold focus:outline-none focus:ring-2 focus:ring-[#0a472e] focus:ring-offset-2"
        aria-label="Zwiększ wartość"
      >
        +
      </button>
    </div>
  );
} 