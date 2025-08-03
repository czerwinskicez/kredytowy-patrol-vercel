'use client';

import Link from 'next/link';
import React from 'react';
import { useConsent } from '@/contexts/ConsentContext';

export function Footer() {
  const { showPreferences } = useConsent();

  return (
    <footer className="bg-[#053320] text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between mb-8">
          {/* Logo i opis */}
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <img src="/logo_male.png" alt="Logo" className="h-12 mr-3" />
              <span className="text-lg font-semibold">
                <span className="text-white">Kredytowy</span>
                <span className="text-[#f0c14b]"> Patrol</span>
              </span>
            </div>
            <p className="text-gray-300 text-sm mt-4">
              Twój zaufany partner w świecie finansów. Porównujemy setki ofert, abyś mógł wybrać najlepszą.
            </p>
          </div>

          {/* Linki */}
          <div className="w-full md:w-2/3 flex flex-wrap justify-between">
            <div className="w-1/2 md:w-1/3 mb-8 md:mb-0">
              <h4 className="font-semibold mb-4 text-[#f0c14b]">Kredyty</h4>
              <ul>
                <li className="mb-2"><a href="#" className="hover:text-[#f0c14b] transition-colors">Kredyt hipoteczny</a></li>
                <li className="mb-2"><a href="#" className="hover:text-[#f0c14b] transition-colors">Kredyt gotówkowy</a></li>
                <li className="mb-2"><a href="#" className="hover:text-[#f0c14b] transition-colors">Kredyt samochodowy</a></li>
                <li className="mb-2"><a href="#" className="hover:text-[#f0c14b] transition-colors">Kredyt konsolidacyjny</a></li>
              </ul>
            </div>
            <div className="w-1/2 md:w-1/3 mb-8 md:mb-0">
              <h4 className="font-semibold mb-4 text-[#f0c14b]">Oszczędności</h4>
              <ul>
                <li className="mb-2"><a href="/lokata" className="hover:text-[#f0c14b] transition-colors">Lokaty</a></li>
                <li className="mb-2"><a href="/lokata-walutowa" className="hover:text-[#f0c14b] transition-colors">Lokaty walutowe</a></li>
                <li className="mb-2"><a href="#" className="hover:text-[#f0c14b] transition-colors">Konta oszczędnościowe</a></li>
                <li className="mb-2"><a href="#" className="hover:text-[#f0c14b] transition-colors">Obligacje</a></li>
              </ul>
            </div>
            <div className="w-1/2 md:w-1/3">
              <h4 className="font-semibold mb-4 text-[#f0c14b]">Informacje</h4>
              <ul>
                <li className="mb-2"><a href="#" className="hover:text-[#f0c14b] transition-colors">O nas</a></li>
                <li className="mb-2"><a href="#" className="hover:text-[#f0c14b] transition-colors">Kontakt</a></li>
                <li className="mb-2"><Link href="/polityka-prywatnosci" className="hover:text-[#f0c14b] transition-colors">Polityka prywatności</Link></li>
                <li className="mb-2"><Link href="/regulamin" className="hover:text-[#f0c14b] transition-colors">Regulamin</Link></li>
                <li className="mb-2">
                  <button 
                    onClick={showPreferences}
                    className="hover:text-[#f0c14b] text-left transition-colors"
                  >
                    Ustawienia cookies
                  </button>
                </li>
                <li className="mb-2"><a href="#" className="hover:text-[#f0c14b] transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} Kredytowy Patrol. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
} 