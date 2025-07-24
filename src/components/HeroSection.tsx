import React from 'react';
import Link from 'next/link';
import { ProductCategories } from '@/components/ProductCategories';

export function HeroSection() {
  return (
    <section className="bg-[#0a472e] text-white pt-12 relative overflow-hidden">
      {/* <div className="absolute inset-0 z-0 opacity-80">
        <div className="absolute inset-0 bg-[url('/bg.png')] bg-cover bg-center"></div>
      </div> */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/3 mb-8 lg:mb-0">
            <img src="/kredytowy_pies.png" alt="Financial illustration" className="w-64 md:max-w-sm h-auto mx-auto lg:w-auto lg:max-w-full lg:mx-0" />
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-heading">
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
          </div>
        </div>
      </div>
      
      <ProductCategories />
    </section>
  );
}