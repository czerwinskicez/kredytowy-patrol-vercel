export type LoanOffer = {
  provider: string;
  logo: string;
  name: string;
  baseInterestRate: number;
  commission: number;
  rrso: number;
  maxLoanValue: number;
  maxLoanTime: number;
  representativeExample: string;
  promoted: boolean;
  hidden: boolean;
  extraLabel: string;
};

export type Logo = {
  provider: string;
  logoURL: string;
};

export type CalculatedLoanOffer = {
  provider: string;
  logo: string;
  name: string;
  totalAmount: number;
  commission: number;
  rrso: number;
  monthlyRate: number;
  representativeExample: string;
  promoted: boolean;
  hidden: boolean;
  extraLabel: string;
  acceptsBik: boolean;
  acceptsKrd: boolean;
  age: {
    min: number;
    max: number;
  };
  requiredDocuments: string[];
}; 

export type DepositOffer = {
  provider: string;
  logo: string;
  name: string;
  baseInterestRate: number;
  minDepositValue: number;
  maxDepositValue: number;
  period: number;
  new: boolean;
  newMoney: boolean;
  isOnline: boolean;
  inApp: boolean;
  accNeed: boolean;
  capitalization: string;
  brakeUp: boolean;
  safety: string;
  promoted: boolean;
  hidden: boolean;
};

export type CurrencyDepositOffer = {
  provider: string;
  currency: 'EUR' | 'USD' | 'GBP' | 'CHF';
  baseInterestRate: number;
  name: string;
  minDepositValue: number;
  maxDepositValue: number;
  period: number;
  capitalization: number;
  url: string;
  logo: string;
  promoted: boolean;
  hidden: boolean;
};

export type CalculatedCurrencyDepositOffer = CurrencyDepositOffer & {
  totalReturn: number;
  profit: number;
};

export type CalculatedDepositOffer = {
  provider: string;
  logo: string;
  name: string;
  baseInterestRate: number;
  minDepositValue: number;
  maxDepositValue: number;
  period: number;
  new: boolean;
  newMoney: boolean;
  isOnline: boolean;
  inApp: boolean;
  accNeed: boolean;
  capitalization: string;
  brakeUp: boolean;
  safety: string;
  totalReturn: number;
  profit: number;
  promoted: boolean;
  hidden: boolean;
};

export type TreasuryBondOffer = {
  symbol: string;
  baseInterestRate: number;
  interestDescription: string;
  interestDescriptionV2: string;
  interestDescriptionV3: string;
  capitalization: string;
  payday: string;
  url: string;
  promoted?: boolean;
  hidden?: boolean;
};

export type CalculatedTreasuryBondOffer = TreasuryBondOffer & {
  totalReturn: number;
  profit: number;
  duration: number; // w latach
}; 