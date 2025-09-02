'use client';

import { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  items: FaqItem[];
  title: string;
}

export const Faq = ({ items, title }: FaqProps) => {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenIndices(prevIndices =>
      prevIndices.includes(index)
        ? prevIndices.filter(i => i !== index)
        : [...prevIndices, index]
    );
  };

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4 lg:max-w-6xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{title}</h2>
        <div className="space-y-4">
          {items.map((item, index) => {
            const isOpen = openIndices.includes(index);
            return (
              <div key={index} className="border-b border-gray-200 last:border-b-0">
                <button
                  className="w-full flex justify-between items-center text-left py-4 px-2"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                >
                  <h3 className="text-lg font-semibold text-gray-700">{item.question}</h3>
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    {/* Horizontal Bar */}
                    <span className="absolute h-0.5 w-4 bg-gray-700 rounded-full"></span>
                    {/* Vertical Bar */}
                    <span className={`absolute h-0.5 w-4 bg-gray-700 rounded-full transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-0' : 'rotate-90'}`}></span>
                  </div>
                </button>
                <div 
                  className={`grid overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-4 pt-2 px-2 text-gray-600">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
