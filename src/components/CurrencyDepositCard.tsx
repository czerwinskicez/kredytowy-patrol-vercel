"use client";
import React from 'react';
import Image from 'next/image';
import type { CalculatedCurrencyDepositOffer } from '@/types';

type CurrencyDepositCardProps = {
  deposit: CalculatedCurrencyDepositOffer;
  rank: number;
  isPromoted?: boolean;
};

const currencySymbols: { [key: string]: string } = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  CHF: 'Fr',
};

const currencyColors: { [key: string]: string } = {
  EUR: 'bg-blue-500 text-white',
  USD: 'bg-green-500 text-white', 
  GBP: 'bg-purple-500 text-white',
  CHF: 'bg-red-500 text-white',
};

export function CurrencyDepositCard({ deposit, rank, isPromoted = false }: CurrencyDepositCardProps) {

  const rankColors: { [key: number]: string } = {
    1: 'bg-[#f0c14b] text-[#0a472e]',
    2: 'bg-gray-300 text-gray-800',
    3: 'bg-yellow-700 text-white',
  };
  const rankColor = rankColors[rank] || 'bg-gray-200 text-gray-700';

  const currencySymbol = currencySymbols[deposit.currency] || deposit.currency;
  const currencyColor = currencyColors[deposit.currency] || 'bg-gray-500 text-white';

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col relative border ${isPromoted ? 'border-[#f0c14b]' : 'border-gray-100'}`}>
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

      {/* Currency Badge floating over top-right corner */}
      <div className={`absolute -top-3 -right-2 px-2 py-1 text-xs font-bold rounded-lg ${currencyColor} shadow-lg z-10 flex items-center space-x-1.5 border-2 border-white`}>
        <span className="text-sm">{deposit.currency}</span>
        <span className="text-base font-normal">{currencySymbol}</span>
      </div>
      
      <div className="p-6 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-10">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-shrink-0 w-40 h-16 md:w-24 md:h-10 flex items-center justify-center">
                <Image 
                  src={deposit.logo} 
                  alt={`${deposit.provider} logo`} 
                  width={160}
                  height={64}
                  priority={false}
                  className="max-h-full max-w-full object-contain"
                  sizes="(max-width: 768px) 160px, 96px"
                />
              </div>
              <div className="w-full">
                <div className="flex flex-col items-center space-y-1 md:flex-row md:items-baseline md:space-y-0 md:space-x-3">
                  <h3 className="font-bold text-lg text-gray-800">{deposit.provider}</h3>
                  <p className="text-sm text-gray-600">{deposit.name}</p>
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center md:text-left">
                  <div>
                    <p className="text-sm text-gray-500">Zysk</p>
                    <p className="text-xl font-bold text-[#0a472e]">{deposit.profit.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currencySymbol}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Oprocentowanie</p>
                    <p className="text-lg font-bold text-gray-800">{deposit.baseInterestRate.toFixed(2)} %</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Okres</p>
                    <p className="text-lg font-bold text-gray-800">{deposit.period} mies.</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Całkowity zwrot</p>
                    <p className="text-lg font-bold text-gray-800">{deposit.totalReturn.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currencySymbol}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col items-center md:items-end space-y-2">
            <a href={deposit.url} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto text-center bg-[#0a472e] hover:bg-[#0c5a3a] text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Wybierz
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
