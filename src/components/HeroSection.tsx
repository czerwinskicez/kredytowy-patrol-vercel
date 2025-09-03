import React from 'react';
import Link from 'next/link';
import { ProductCategories } from '@/components/ProductCategories';

export function HeroSection() {
  return (
    <section className="bg-[#0a472e] text-white pt-12 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-32">
        <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center"></div>
      </div>
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
                  Porównywarka kredytów, lokat, kont oszczędnościowych i firmowych
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Porównaj Oferty Kredytów:
              <br />
              Niska Rata, RRSO i Prowizja
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto lg:mx-0 mb-8">
              Skorzystaj z naszej porównywarki kredytów gotówkowych, hipotecznych i konsolidacyjnych. Znajdź najwyżej oprocentowane lokaty bankowe, konta oszczędnościowe i najlepsze konta firmowe. Nasz ekspert finansowy pomoże Ci wybrać najlepszą ofertę i zaoszczędzić pieniądze.
            </p>
          </div>
        </div>
      </div>
      
      <ProductCategories />
    </section>
  );
}