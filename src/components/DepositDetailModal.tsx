"use client";
import React from 'react';
import type { CalculatedDepositOffer } from '@/types';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

type DepositDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  deposit: CalculatedDepositOffer;
};

export function DepositDetailModal({ isOpen, onClose, deposit }: DepositDetailModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Zamknij"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="flex items-center mb-6">
          <img src={deposit.logo} alt={`${deposit.provider} logo`} width={160} height={64} loading="lazy" className="h-12 mr-6" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{deposit.provider}</h2>
            <p className="text-md text-gray-600">{deposit.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
            <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Całkowity zwrot</p>
                <p className="text-xl font-bold text-gray-800">{deposit.totalReturn.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
            </div>
            <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Zysk</p>
                <p className="text-2xl font-bold text-[#0a472e]">{deposit.profit.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
            </div>
            <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Oprocentowanie</p>
                <p className="text-xl font-bold text-gray-800">{deposit.baseInterestRate.toFixed(2)} %</p>
            </div>
            <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Okres</p>
                <p className="text-xl font-bold text-gray-800">{deposit.period} miesięcy</p>
            </div>
            <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Min. wpłata</p>
                <p className="text-lg font-bold text-gray-800">{deposit.minDepositValue.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
            </div>
            <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Max. wpłata</p>
                <p className="text-lg font-bold text-gray-800">{deposit.maxDepositValue.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Warunki</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                {deposit.new ? <FaCheckCircle className="text-green-500 mr-2" /> : <FaTimesCircle className="text-red-500 mr-2" />}
                <span className="text-sm text-gray-600">Dla nowych klientów</span>
              </div>
              <div className="flex items-center">
                {deposit.newMoney ? <FaCheckCircle className="text-green-500 mr-2" /> : <FaTimesCircle className="text-red-500 mr-2" />}
                <span className="text-sm text-gray-600">Dla nowych środków</span>
              </div>
              <div className="flex items-center">
                {deposit.accNeed ? <FaTimesCircle className="text-red-500 mr-2" /> : <FaCheckCircle className="text-green-500 mr-2" />}
                <span className="text-sm text-gray-600">{deposit.accNeed ? 'Wymaga konta' : 'Nie wymaga konta'}</span>
              </div>
              <div className="flex items-center">
                {deposit.brakeUp ? <FaCheckCircle className="text-green-500 mr-2" /> : <FaTimesCircle className="text-red-500 mr-2" />}
                <span className="text-sm text-gray-600">{deposit.brakeUp ? 'Można zerwać' : 'Nie można zerwać'}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Dostępność</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                {deposit.isOnline ? <FaCheckCircle className="text-green-500 mr-2" /> : <FaTimesCircle className="text-red-500 mr-2" />}
                <span className="text-sm text-gray-600">Dostępne online</span>
              </div>
              <div className="flex items-center">
                {deposit.inApp ? <FaCheckCircle className="text-green-500 mr-2" /> : <FaTimesCircle className="text-red-500 mr-2" />}
                <span className="text-sm text-gray-600">Dostępne w aplikacji</span>
              </div>
            </div>
            
            {deposit.capitalization && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-1">Kapitalizacja</h4>
                <p className="text-sm text-gray-600">{deposit.capitalization}</p>
              </div>
            )}
            
            {deposit.safety && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-1">Bezpieczeństwo</h4>
                <p className="text-sm text-gray-600">{deposit.safety}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-right">
            <button className="bg-[#f0c14b] hover:bg-[#e0b03b] text-[#0a472e] font-bold py-3 px-8 rounded-lg transition-colors">
              Przejdź do oferty
            </button>
        </div>
      </div>
    </div>
  );
} 