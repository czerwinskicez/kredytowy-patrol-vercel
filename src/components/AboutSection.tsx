import React from 'react';
import { ArrowRightIcon } from 'lucide-react';
export function AboutSection() {
  return <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-center">
          <div className="lg:w-1/2 mb-8 lg:mb-0 flex justify-center">
            <img src="/trust.jpg" alt="Zaufany konsultant" className="max-w-xs md:max-w-sm h-auto rounded-lg" />
          </div>
          <div className="lg:w-1/2 lg:pl-12">
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#0a472e] mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-[#0a472e] mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-[#0a472e] mr-2"></div>
                <span className="text-[#0a472e] text-lg">O nas</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#0a472e]">
              Twój lojalny i zaufany partner w<br />
              zakresie finansów osobistych
            </h2>
            <p className="text-gray-700 mb-8">
              Asystujemy Ci krok po kroku dostosowując się do Twoich potrzeb
              finansowych w celu znalezienia pewnej i dostosowanej oferty.
            </p>
            <div className="grid grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="relative inline-block">
                  <svg className="w-24 h-24" viewBox="0 0 100 100">
                    <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                    <circle className="text-[#0a472e]" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" strokeDasharray="251.2" strokeDashoffset="0" />
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="text-xl font-bold text-[#0a472e]">
                      100%
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Satysfakcja klientów
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <svg className="w-24 h-24" viewBox="0 0 100 100">
                    <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                    <circle className="text-[#0a472e]" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" strokeDasharray="251.2" strokeDashoffset="0" />
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="text-xl font-bold text-[#0a472e]">
                      100%
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">Dostosowana oferta</p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <svg className="w-24 h-24" viewBox="0 0 100 100">
                    <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                    <circle className="text-[#0a472e]" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" strokeDasharray="251.2" strokeDashoffset="0" />
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="text-xl font-bold text-[#0a472e]">
                      100%
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">Porównanie ofert</p>
              </div>
            </div>
            <button className="bg-[#0a472e] text-white px-6 py-3 rounded-lg flex items-center hover:bg-opacity-90 transition-colors">
              Czytaj więcej
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </section>;
}