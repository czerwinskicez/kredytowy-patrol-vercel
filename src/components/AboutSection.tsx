import React from 'react';
import { ShieldCheckIcon, RefreshCwIcon, HeartHandshakeIcon, ArrowRightIcon } from 'lucide-react';

export function AboutSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center mb-16">
          <div className="lg:w-1/3 mb-12 lg:mb-0 flex justify-center">
            <img 
              src="/kredytowy_team.png" 
              alt="Ekspert finansowy Kredytowy Patrol" 
              className="max-w-md w-full h-auto rounded-lg"
              loading="lazy"
            />
          </div>
          <div className="lg:w-2/3 lg:pl-16">
            <div className="flex items-center mb-4">
              <span className="text-[#0a472e] text-lg font-semibold tracking-wide">O NAS</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Kredytowy Patrol: Twój strażnik najlepszych ofert finansowych.
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              W gąszczu ofert finansowych łatwo się zgubić. Dlatego stworzyliśmy Kredytowy Patrol – Twoje centrum rzetelnych, aktualnych i prostych w obsłudze porównywarek. Nasza misja jest prosta: oszczędzać Twój czas i pieniądze.
            </p>
            <a 
              href="/#rankingi"
              className="inline-flex items-center px-6 py-3 bg-[#0a472e] text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-300"
            >
              Zobacz rankingi <ArrowRightIcon className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-16 h-16 rounded-full bg-[#0a472e] flex items-center justify-center text-white mb-4">
              <ShieldCheckIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Rzetelne Porównania</h3>
            <p className="text-gray-600">Nasze rankingi opieramy wyłącznie na twardych danych i regularnie weryfikowanych informacjach.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-16 h-16 rounded-full bg-[#0a472e] flex items-center justify-center text-white mb-4">
              <RefreshCwIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Zawsze Aktualne Oferty</h3>
            <p className="text-gray-600">Monitorujemy rynek 24/7, aby dostarczać Ci najświeższe dane i najlepsze dostępne oferty.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-16 h-16 rounded-full bg-[#0a472e] flex items-center justify-center text-white mb-4">
              <HeartHandshakeIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Twoje Finansowe Bezpieczeństwo</h3>
            <p className="text-gray-600">Analizujemy, porównujemy i patrolujemy rynek, abyś mógł podejmować świadome i korzystne decyzje finansowe.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
