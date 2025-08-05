import type { TreasuryBondOffer, CalculatedTreasuryBondOffer } from '@/types';

// Mapowanie symboli na okresy w latach
const bondDurations: { [key: string]: number } = {
  OTS: 0.25, // 3 miesiące
  ROR: 1,    // 1 rok
  DOR: 2,    // 2 lata
  TOS: 3,    // 3 lata
  COI: 4,    // 4 lata
  ROS: 6,    // 6 lat
  EDO: 10,   // 10 lat
  ROD: 12,   // 12 lat
};

export function calculateTreasuryBondOffers(
  bondOffers: TreasuryBondOffer[],
  amount: number,
  expectedInflation: number,
  includeTax: boolean
): CalculatedTreasuryBondOffer[] {
  const taxRate = 0.19; // Podatek Belki

  return bondOffers.map(bond => {
    const duration = bondDurations[bond.symbol] || 1;
    let effectiveAnnualRate = bond.baseInterestRate / 100;
    let profitBeforeTax: number;
    let totalReturn: number;

    // Specjalna logika dla obligacji inflacyjnych
    if (['COI', 'EDO', 'ROS', 'ROD'].includes(bond.symbol)) {
      const inflationRate = expectedInflation / 100;
      let firstYearRate = 0;
      let margin = 0;

      // Ustawienia oprocentowania w zależności od typu obligacji
      switch (bond.symbol) {
        case 'COI':
          firstYearRate = 6.00 / 100; margin = 1.50 / 100; break;
        case 'EDO':
          firstYearRate = 6.25 / 100; margin = 2.00 / 100; break;
        case 'ROS':
          firstYearRate = 5.95 / 100; margin = 2.00 / 100; break;
        case 'ROD':
          firstYearRate = 6.50 / 100; margin = 2.50 / 100; break;
      }
      
      const subsequentRate = inflationRate + margin;
      effectiveAnnualRate = Math.pow((1 + firstYearRate) * Math.pow(1 + subsequentRate, duration - 1), 1 / duration) - 1;

      profitBeforeTax = amount * (Math.pow(1 + effectiveAnnualRate, duration) - 1);

    } else if (bond.capitalization.includes('Kapitalizacja')) {
      // Obligacje z kapitalizacją roczną (np. TOS)
      profitBeforeTax = amount * (Math.pow(1 + effectiveAnnualRate, duration) - 1);
    } else {
      // Obligacje o stałym oprocentowaniu bez kapitalizacji (np. OTS, ROR, DOR)
      profitBeforeTax = amount * effectiveAnnualRate * duration;
    }

    const tax = includeTax ? profitBeforeTax * taxRate : 0;
    const profit = profitBeforeTax - tax;
    totalReturn = amount + profit;

    return {
      ...bond,
      duration,
      profit,
      totalReturn,
      effectiveRate: effectiveAnnualRate * 100,
    };
  });
}
