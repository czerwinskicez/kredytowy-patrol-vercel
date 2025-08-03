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
  expectedInflation: number
): CalculatedTreasuryBondOffer[] {
  return bondOffers.map(bond => {
    const duration = bondDurations[bond.symbol] || 1;
    let effectiveAnnualRate = bond.baseInterestRate / 100;

    if (['COI', 'EDO', 'ROS', 'ROD'].includes(bond.symbol)) {
      const inflationRate = expectedInflation / 100;
      let firstYearRate = 0;
      let margin = 0;

      switch (bond.symbol) {
        case 'COI':
          firstYearRate = 6 / 100;
          margin = 1.5 / 100;
          break;
        case 'EDO':
          firstYearRate = 6.25 / 100;
          margin = 2.0 / 100;
          break;
        case 'ROS':
            firstYearRate = 5.95 / 100;
            margin = 2.0 / 100;
            break;
        case 'ROD':
            firstYearRate = 6.5 / 100;
            margin = 2.5 / 100;
            break;
      }
      
      const subsequentRate = inflationRate + margin;
      effectiveAnnualRate = (firstYearRate + subsequentRate * (duration - 1)) / duration;
    }

    let profit: number;
    let totalReturn: number;

    if (bond.capitalization.includes('Kapitalizacja')) {
      totalReturn = amount * Math.pow(1 + effectiveAnnualRate, duration);
      profit = totalReturn - amount;
    } else {
      profit = amount * effectiveAnnualRate * duration;
      totalReturn = amount + profit;
    }

    return {
      ...bond,
      duration,
      profit,
      totalReturn,
      effectiveRate: effectiveAnnualRate * 100,
    };
  });
}
