"use client";
import React, { useState } from 'react';

type InfoTooltipProps = {
  content: string | undefined;
  fallback?: string;
};

export function InfoTooltip({ content, fallback = "Brak szczegółów" }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  const tooltipText = content || fallback;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        <svg 
          className="w-4 h-4" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>
      
      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 text-sm text-white bg-gray-800 rounded-lg shadow-lg min-w-[300px] max-w-md">
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {tooltipText}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
}
