import React from 'react';
import { ShieldCheckIcon, RefreshCwIcon, HeartHandshakeIcon } from 'lucide-react';

export function AboutSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Grafika i nagłówek z paragrafem na jednej wysokości */}
        <div className="flex flex-col lg:flex-row items-center mb-16">
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
              Kredytowy Patrol: Na straży najlepszych ofert
            </h2>
            <p className="text-gray-700 text-lg">
              W świecie finansów łatwo wpaść w pułapkę niekorzystnych ofert. Dlatego powołaliśmy Kredytowy Patrol. Naszą misją jest dostarczanie rzetelnych, aktualnych i bezstronnych informacji, które pomogą Ci podjąć najlepsze decyzje. Każdego dnia analizujemy setki ofert, abyś mógł zaoszczędzić czas i pieniądze. Z nami podejmowanie mądrych decyzji finansowych jest prostsze niż myślisz.
            </p>
          </div>
        </div>

        {/* Trzy karty inline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-[#0a472e] flex items-center justify-center text-white mb-4">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#0a472e]">Rzetelność</h3>
            <p className="text-gray-600">Nasze rankingi są w 100% oparte na twardych danych ze sprawdzonych źródeł.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-[#0a472e] flex items-center justify-center text-white mb-4">
              <RefreshCwIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#0a472e]">Aktualność</h3>
            <p className="text-gray-600">Automatycznie i cyklicznie monitorujemy zmiany, aktualizujemy dane i śledzimy rynek.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-[#0a472e] flex items-center justify-center text-white mb-4">
              <HeartHandshakeIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#0a472e]">Dla Ciebie</h3>
            <p className="text-gray-600">Patrolujemy, porównujemy i analizujemy, abyś Ty mógł spać spokojnie, wiedząc, że wybrałeś najlepszą ofertę.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
