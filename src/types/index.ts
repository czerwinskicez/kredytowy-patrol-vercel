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
}; 