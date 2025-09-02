"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import type { CalculatedDepositOffer } from '@/types';
import { DepositDetailModal } from './DepositDetailModal';

type DepositCardProps = {
  deposit: CalculatedDepositOffer;
  rank: number;
  isPromoted?: boolean;
};

export function DepositCard({ deposit, rank, isPromoted = false }: DepositCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const rankColors: { [key: number]: string } = {
    1: 'bg-[#f0c14b] text-[#0a472e]',
    2: 'bg-gray-300 text-gray-800',
    3: 'bg-yellow-700 text-white',
  };
  const rankColor = rankColors[rank] || 'bg-gray-200 text-gray-700';

  return (
    <>
      <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col relative border ${isPromoted ? 'border-[#f0c14b]' : 'border-gray-100'}`}>
        {!isPromoted && (
          <div 
            className={`absolute top-4 -left-1 px-3 py-1 text-xs font-bold rounded-r-md ${rankColor} shadow-sm`}
          >
            #{rank}
          </div>
        )}

        {isPromoted && (
          <div className="absolute top-4 -left-1 px-3 py-1 text-xs font-bold rounded-r-md bg-[#f0c14b] text-[#0a472e] shadow-sm">
            Promowane
          </div>
        )}

        {/* Badges for deposit features */}
        <div className="absolute top-4 right-4 flex flex-wrap gap-1">
          {deposit.new && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              Nowi klienci
            </span>
          )}
          {deposit.newMoney && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              Nowe środki
            </span>
          )}
          {deposit.isOnline && (
            <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              Online
            </span>
          )}
        </div>
        
        <div className="p-6 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

            {/* Combined Info and Details */}
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
                      <p className="text-xl font-bold text-[#0a472e]">{deposit.profit.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
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
                      <p className="text-lg font-bold text-gray-800">{deposit.totalReturn.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-2 flex flex-col items-center md:items-end space-y-2">
              <a 
                href={deposit.url !== '/#' ? deposit.url : '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full md:w-auto text-center bg-[#0a472e] hover:bg-[#0c5a3a] text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Wybierz
              </a>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto text-sm font-semibold text-[#0a472e] hover:underline"
              >
                Szczegóły oferty
              </button>
            </div>
          </div>
        </div>
      </div>
      <DepositDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} deposit={deposit} />
    </>
  );
} 