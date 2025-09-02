"use client";
import React from 'react';
import Image from 'next/image';
import type { BusinessAccountOffer } from '@/types';

type BusinessAccountDetailModalProps = {
  account: BusinessAccountOffer;
  isOpen: boolean;
  onClose: () => void;
};

export function BusinessAccountDetailModal({ account, isOpen, onClose }: BusinessAccountDetailModalProps) {
  const formatFee = (min: number, max: number) => {
    if (min === 0 && max === 0) return 'Bezpłatne';
    if (min === max) return `${min} zł`;
    return `${min} - ${max} zł`;
  };

  const formatBonus = (bonus: number) => {
    if (bonus === 0) return 'Brak';
    return `${bonus.toLocaleString('pl-PL')} zł`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="relative w-16 h-16 mr-4">
              <Image
                src={account.logo}
                alt={`Logo ${account.provider}`}
                fill
                className="object-contain"
                sizes="64px"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{account.provider}</h2>
              <p className="text-gray-600">Konto firmowe - szczegóły</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Main fees list */}
          <div className="space-y-6 mb-6">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold text-[#0a472e]">Prowadzenie konta</h3>
                <p className="text-2xl font-bold text-[#0a472e] border-b border-gray-200 pb-1">{formatFee(account.accountFeeMin, account.accountFeeMax)}</p>
              </div>
              {account.accountFeeTooltip && (
                <p className="text-xs text-gray-600 leading-relaxed mt-2">{account.accountFeeTooltip}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold text-gray-800">Karta płatnicza</h3>
                <p className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-1">{formatFee(account.cardFeeMin, account.cardFeeMax)}</p>
              </div>
              {account.cardFeeTooltip && (
                <p className="text-xs text-gray-600 leading-relaxed mt-2">{account.cardFeeTooltip}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold text-gray-800">Wypłata z bankomatu</h3>
                <p className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-1">{formatFee(account.atmWithdrawalMin, account.atmWithdrawalMax)}</p>
              </div>
              {account.atmWithdrawalTooltip && (
                <p className="text-xs text-gray-600 leading-relaxed mt-2">{account.atmWithdrawalTooltip}</p>
              )}
            </div>

            {account.bonus > 0 && (
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-green-600">Bonus za założenie</h3>
                  <p className="text-2xl font-bold text-green-600 border-b border-gray-200 pb-1">{formatBonus(account.bonus)}</p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mt-2">Jednorazowy bonus za założenie konta firmowego</p>
              </div>
            )}
          </div>

          {/* Extra label */}
          {account.extraLabel && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Dodatkowe informacje</h3>
              <p className="text-blue-700">{account.extraLabel}</p>
            </div>
          )}

          {/* CTA */}
          <div className="flex gap-4">
            <a
              href={account.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#053320] hover:bg-[#0a472e] text-white font-bold py-3 px-6 rounded-lg transition-colors text-center"
            >
              Sprawdź ofertę w banku
            </a>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Zamknij
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
