"use client";
import React from 'react';
import type { CalculatedTreasuryBondOffer } from '@/types';

type TreasuryBondCardProps = {
  bond: CalculatedTreasuryBondOffer;
  rank: number;
  isPromoted?: boolean;
};

const bondTypeColors: { [key: string]: string } = {
  OTS: 'bg-blue-500 text-white',
  ROR: 'bg-green-500 text-white',
  DOR: 'bg-purple-500 text-white',
  TOS: 'bg-yellow-600 text-white',
  COI: 'bg-red-500 text-white',
  EDO: 'bg-indigo-500 text-white',
  ROS: 'bg-pink-500 text-white',
  ROD: 'bg-gray-600 text-white',
};

export function TreasuryBondCard({ bond, rank, isPromoted = false }: TreasuryBondCardProps) {

  const rankColors: { [key: number]: string } = {
    1: 'bg-[#f0c14b] text-[#0a472e]',
    2: 'bg-gray-300 text-gray-800',
    3: 'bg-yellow-700 text-white',
  };
  const rankColor = rankColors[rank] || 'bg-gray-200 text-gray-700';
  const bondColor = bondTypeColors[bond.symbol] || 'bg-gray-500 text-white';

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pl-PL', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const isCapitalized = bond.capitalization.includes('Kapitalizacja');

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full relative border ${isPromoted ? 'border-[#f0c14b]' : 'border-gray-100'}`}>
      {!isPromoted && (
        <div 
          className={`absolute top-4 -left-1 px-3 py-1 text-xs font-bold rounded-r-md ${rankColor} shadow-sm z-10`}
        >
          #{rank}
        </div>
      )}

      {isPromoted && (
        <div className="absolute top-4 -left-1 px-3 py-1 text-xs font-bold rounded-r-md bg-[#f0c14b] text-[#0a472e] shadow-sm z-10">
          Promowane
        </div>
      )}

      {/* Bond Symbol Badge */}
      <div className={`absolute -top-3 -right-2 px-3 py-2 text-sm font-bold rounded-lg ${bondColor} shadow-lg z-10 border-2 border-white`}>
        {bond.symbol}
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start flex-grow">
          <div className="xl:col-span-10">
            <div className="flex flex-col space-y-4 h-full">
              {/* Nagłówek */}
              <div className="flex flex-col space-y-2">
                <h3 className="font-bold text-xl text-gray-800">{bond.interestDescription}</h3>
                <p className="text-sm text-gray-600">{bond.interestDescriptionV2}</p>
              </div>

              {/* Szczegóły oprocentowania */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 leading-relaxed">{bond.interestDescriptionV3}</p>
              </div>

              {/* Wszystkie metryki */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center md:text-left">
                <div>
                  <p className="text-sm text-gray-500">Zysk</p>
                  <p className="text-xl font-bold text-[#0a472e]">{formatCurrency(bond.profit)} zł</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Oprocentowanie</p>
                  <p className="text-lg font-bold text-gray-800">
                    {bond.baseInterestRate.toFixed(2)} %
                    {['COI', 'EDO', 'ROS', 'ROD'].includes(bond.symbol) && (
                      <span className="text-xs text-blue-600 ml-1">*inflacyjne</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Okres</p>
                  <p className="text-lg font-bold text-gray-800">{bond.duration} {bond.duration === 1 ? 'rok' : bond.duration < 5 ? 'lata' : 'lat'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Całkowity zwrot</p>
                  <p className="text-lg font-bold text-gray-800">{formatCurrency(bond.totalReturn)} zł</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kapitalizacja</p>
                  <p className="text-sm font-bold text-gray-800">{bond.capitalization.includes('Kapitalizacja') ? 'Tak' : 'Nie'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Wypłata odsetek</p>
                  <p className="text-sm font-bold text-gray-800">{bond.payday}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-2 flex flex-col items-center xl:items-end justify-end space-y-2">
            <a 
              href={bond.url !== '/#' ? bond.url : "https://www.gov.pl/web/finanse/skarb-panstwa-obligacje-skarbowe"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full xl:w-auto text-center bg-[#0a472e] hover:bg-[#0c5a3a] text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Kup online
            </a>
            <a 
              href={bond.url !== '/#' ? bond.url : "https://www.gov.pl/web/finanse/skarb-panstwa-obligacje-skarbowe"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full xl:w-auto text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors text-sm"
            >
              Szczegóły
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}