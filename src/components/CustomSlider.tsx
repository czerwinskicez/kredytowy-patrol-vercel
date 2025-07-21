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

  return (
    <div className="relative w-full flex items-center">
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
  );
} 