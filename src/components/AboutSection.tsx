import React from 'react';
import { ArrowRightIcon, ShieldCheckIcon, TrendingUpIcon, UsersIcon } from 'lucide-react';

export function AboutSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/3 mb-12 lg:mb-0 flex justify-center">
            <img 
              src="/trust.jpg" 
              alt="Ekspert finansowy analizujący dane" 
              className="max-w-md w-full h-auto rounded-lg shadow-lg"
              loading="lazy"
            />
          </div>
          <div className="lg:w-2/3 lg:pl-16">
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#0a472e] mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-[#0a472e] mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-[#0a472e] mr-2"></div>
                <span className="text-[#0a472e] text-lg font-semibold">Kim jesteśmy?</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#0a472e]">
              Niezależna porównywarka finansowa — Twój przewodnik w świecie finansów
            </h2>
            <p className="text-gray-700 mb-8 text-lg">
              Kredytowy Patrol to Twoje zaufane centrum wiedzy o produktach finansowych. Naszą misją jest dostarczanie rzetelnych, aktualnych i bezstronnych informacji, które pomogą Ci podjąć najlepsze decyzje. Jako wiodąca porównywarka kredytów i lokat, każdego dnia analizujemy setki ofert, abyś mógł oszczędzić czas i pieniądze.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="flex flex-col items-center text-center p-4 rounded-lg">
                <ShieldCheckIcon className="w-12 h-12 text-[#0a472e] mb-3" />
                <h3 className="text-xl font-bold text-[#0a472e]">Bezstronność</h3>
                <p className="text-gray-600">Nasze rankingi są w 100% obiektywne i oparte na twardych danych.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg">
                <TrendingUpIcon className="w-12 h-12 text-[#0a472e] mb-3" />
                <h3 className="text-xl font-bold text-[#0a472e]">Aktualność</h3>
                <p className="text-gray-600">Codziennie monitorujemy rynek, by zapewnić Ci najświeższe informacje.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg">
                <UsersIcon className="w-12 h-12 text-[#0a472e] mb-3" />
                <h3 className="text-xl font-bold text-[#0a472e]">Dla Ciebie</h3>
                <p className="text-gray-600">Naszym celem jest Twoja satysfakcja i finansowy spokój.</p>
              </div>
            </div>
            <div className="text-center lg:text-left">
              <a 
                href="/kredyty/gotowkowy" 
                className="inline-flex items-center px-8 py-4 bg-[#f0c14b] text-[#0a472e] font-bold rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Sprawdź najlepsze kredyty <ArrowRightIcon className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
