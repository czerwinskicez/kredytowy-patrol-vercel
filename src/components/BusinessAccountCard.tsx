"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import type { BusinessAccountOffer } from '@/types';
import { InfoTooltip } from './InfoTooltip';
import { BusinessAccountDetailModal } from './BusinessAccountDetailModal';

type BusinessAccountCardProps = {
  account: BusinessAccountOffer;
  rank: number;
  isPromoted?: boolean;
};

export function BusinessAccountCard({ account, rank, isPromoted = false }: BusinessAccountCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const rankColors: { [key: number]: string } = {
    1: 'bg-[#f0c14b] text-[#0a472e]',
    2: 'bg-gray-300 text-gray-800',
    3: 'bg-yellow-700 text-white',
  };
  const rankColor = rankColors[rank] || 'bg-gray-200 text-gray-700';

  const formatFee = (min: number, max: number) => {
    if (min === 0 && max === 0) return 'Bezpłatne';
    if (min === max) return `${min} zł`;
    return `${min} - ${max} zł`;
  };

  const formatBonus = (bonus: number) => {
    if (bonus === 0) return 'Brak';
    return `${bonus.toLocaleString('pl-PL')} zł`;
  };

  return (
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

      {account.extraLabel && (
        <div className="absolute -top-3 -right-2 px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-500 text-white shadow-lg z-10 border-2 border-white">
          {account.extraLabel}
        </div>
      )}

      {/* Bonus badge */}
      {/* {account.bonus > 0 && (
        <div className="absolute top-4 right-4 flex flex-wrap gap-1">
          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            Bonus {account.bonus.toLocaleString('pl-PL')} zł
          </span>
        </div>
      )} */}
      
      <div className="p-6 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center min-h-[120px]">
          {/* Bank info and details */}
          <div className="md:col-span-10">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-shrink-0 w-40 h-16 md:w-24 md:h-10 flex items-center justify-center">
                <Image 
                  src={account.logo} 
                  alt={`${account.provider} logo`} 
                  width={160}
                  height={64}
                  priority={false}
                  className="max-h-full max-w-full object-contain"
                  sizes="(max-width: 768px) 160px, 96px"
                />
              </div>
              <div className="w-full">
                <div className="flex flex-col items-center md:items-start">
                  <h3 className="font-bold text-lg text-gray-800">{account.provider}</h3>
                  <p className="text-sm text-gray-600">Konto firmowe</p>
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center md:text-left">
                  <div className="flex flex-col justify-center">
                    <div className="text-sm text-gray-500 flex items-center justify-center md:justify-start">
                      <span>Prowadzenie konta</span>
                      <InfoTooltip 
                        content={account.accountFeeTooltip} 
                        fallback="Miesięczna opłata za prowadzenie rachunku firmowego"
                      />
                    </div>
                    <p className="text-lg font-bold text-[#0a472e]">{formatFee(account.accountFeeMin, account.accountFeeMax)}</p>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="text-sm text-gray-500 flex items-center justify-center md:justify-start">
                      <span>Karta płatnicza</span>
                      <InfoTooltip 
                        content={account.cardFeeTooltip} 
                        fallback="Miesięczna opłata za kartę płatniczą do konta firmowego"
                      />
                    </div>
                    <p className="text-lg font-bold text-gray-800">{formatFee(account.cardFeeMin, account.cardFeeMax)}</p>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="text-sm text-gray-500 flex items-center justify-center md:justify-start">
                      <span>Wypłata z bankomatu</span>
                      <InfoTooltip 
                        content={account.atmWithdrawalTooltip} 
                        fallback="Opłata za jedną wypłatę z bankomatu"
                      />
                    </div>
                    <p className="text-lg font-bold text-gray-800">{formatFee(account.atmWithdrawalMin, account.atmWithdrawalMax)}</p>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="text-sm text-gray-500 flex items-center justify-center md:justify-start">
                      <span>Bonus za założenie</span>
                      <InfoTooltip 
                        content="" 
                        fallback="Jednorazowy bonus za założenie konta firmowego"
                      />
                    </div>
                    <p className="text-lg font-bold text-green-600">{formatBonus(account.bonus)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="md:col-span-2 flex flex-col items-center md:items-end space-y-2">
            <a 
              href={account.url}
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
      
      <BusinessAccountDetailModal
        account={account}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
