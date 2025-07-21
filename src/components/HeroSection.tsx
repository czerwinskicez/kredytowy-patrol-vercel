import React from 'react';

export function HeroSection() {
  return (
    <section className="bg-[#0a472e] text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-80">
        {/* <div className="absolute inset-0 bg-[url('/bg.png')] bg-cover bg-center"></div> */}
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/3 mb-8 lg:mb-0">
            <img src="/kredytowy_pies.png" alt="Financial illustration" className="max-w-full h-auto" />
          </div>
          <div className="lg:w-2/3 lg:pl-12 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#f0c14b] mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-[#f0c14b] mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-[#f0c14b] mr-2"></div>
                <span className="text-[#f0c14b] text-lg">
                  Porównaj, wybierz, oszczędź!
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Kredytowy Patrol na
              <br />
              tropie najlepszych okazji!
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto lg:mx-0 mb-8">
              Znajdź najlepsze oferty kredytowe i oszczędnościowe w Polsce! 
              Nasz ekspert - Kredytowy Patrol - przeanalizuje setki ofert banków 
              i pomoże Ci wybrać produkt idealny dla Twoich potrzeb. 
              Oszczędź czas, pieniądze i nerwy dzięki naszemu porównaniu.
            </p>
            
            {/* Interaktywne karty */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto lg:mx-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="text-[#f0c14b] text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  🔍
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-[#f0c14b] transition-colors duration-300">
                  Szybkie Porównanie
                </h3>
                <p className="text-gray-300 text-sm">
                  Porównaj oferty kredytów hipotecznych, gotówkowych i samochodowych w kilka sekund
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="text-[#f0c14b] text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  💰
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-[#f0c14b] transition-colors duration-300">
                  Oszczędności
                </h3>
                <p className="text-gray-300 text-sm">
                  Znajdź najlepsze lokaty, konta oszczędnościowe i inwestycje dla swoich pieniędzy
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="text-[#f0c14b] text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  📊
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-[#f0c14b] transition-colors duration-300">
                  Ekspercka Analiza
                </h3>
                <p className="text-gray-300 text-sm">
                  Skorzystaj z wiedzy naszych ekspertów i aktualnych porad finansowych
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}