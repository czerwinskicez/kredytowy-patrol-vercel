"use client";
import React, { useMemo } from 'react';
import { BusinessAccountCard } from './BusinessAccountCard';
import type { BusinessAccountOffer } from '@/types';

type BusinessAccountRankingProps = {
  initialOffers: BusinessAccountOffer[];
  title: string;
};

export function BusinessAccountRanking({ initialOffers, title }: BusinessAccountRankingProps) {
  const { promotedOffers, regularOffers } = useMemo(() => {
    const filtered = initialOffers.filter(offer => !offer.hidden);

    // Simple sorting: promoted first, then by bonus amount (highest first), then by account fee (lowest first)
    const sorted = filtered.sort((a, b) => {
      // Promoted offers first
      if (a.promoted && !b.promoted) return -1;
      if (!a.promoted && b.promoted) return 1;
      
      // Then by bonus (highest first)
      if (a.bonus !== b.bonus) return b.bonus - a.bonus;
      
      // Then by lowest account fee (using average)
      const avgFeeA = (a.accountFeeMin + a.accountFeeMax) / 2;
      const avgFeeB = (b.accountFeeMin + b.accountFeeMax) / 2;
      return avgFeeA - avgFeeB;
    });

    const promoted = sorted.filter(offer => offer.promoted);
    const regular = sorted.filter(offer => !offer.promoted);

    return { promotedOffers: promoted, regularOffers: regular };
  }, [initialOffers]);

  const allOffers = [...promotedOffers, ...regularOffers];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Znaleźliśmy {allOffers.length} {allOffers.length === 1 ? 'ofertę' : allOffers.length < 5 ? 'oferty' : 'ofert'} kont firmowych
        </h3>
        <p className="text-gray-600 text-sm">
          Oferty posortowane według bonusów i najniższych opłat za prowadzenie konta.
        </p>
      </div>

      {promotedOffers.length > 0 && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🔥</span>
            Polecane oferty
          </h4>
          <div className="space-y-4">
            {promotedOffers.map((offer, index) => (
              <BusinessAccountCard 
                key={`promoted-${offer.provider}-${index}`} 
                account={offer} 
                rank={index + 1}
                isPromoted={true}
              />
            ))}
          </div>
        </div>
      )}

      {regularOffers.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Wszystkie oferty
          </h4>
          <div className="space-y-4">
            {regularOffers.map((offer, index) => {
              const rank = promotedOffers.length + index + 1;
              return (
                <BusinessAccountCard 
                  key={`regular-${offer.provider}-${index}`} 
                  account={offer} 
                  rank={rank}
                  isPromoted={false}
                />
              );
            })}
          </div>
        </div>
      )}

      {allOffers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏦</div>
          <p className="text-gray-600 text-lg">
            Nie znaleźliśmy ofert kont firmowych.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Sprawdź ponownie później.
          </p>
        </div>
      )}
    </div>
  );
}
