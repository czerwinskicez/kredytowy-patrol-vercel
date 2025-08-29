import { AboutSection } from '@/components/AboutSection';
import { HeroSection } from '@/components/HeroSection';
import { NewsletterSection } from '@/components/NewsletterSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { getLoanOffers } from '@/lib/google-sheets';
import PromotedLoansSection from '@/components/PromotedLoansSection';
import type { LoanOffer, CalculatedLoanOffer } from '@/types';
import { PageWrapper } from '@/components/PageWrapper';

function calculateOffer(loan: LoanOffer): CalculatedLoanOffer {
  const principal = loan.maxLoanValue;
  const months = loan.maxLoanTime;
  const commissionAmount = principal * (loan.commission / 100);
  const totalPrincipal = principal + commissionAmount;
  const monthlyInterestRate = loan.baseInterestRate / 100 / 12;
  
  const monthlyRate =
    totalPrincipal *
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
    (Math.pow(1 + monthlyInterestRate, months) - 1);

  const totalAmount = monthlyRate * months;

  return {
    ...loan,
    totalAmount: isFinite(totalAmount) ? totalAmount : 0,
    monthlyRate: isFinite(monthlyRate) ? monthlyRate : 0,
    // Poniżej znajdują się domyślne wartości, tak jak w komponencie Ranking.tsx
    acceptsBik: true,
    acceptsKrd: false,
    age: { min: 18, max: 80 },
    requiredDocuments: ["Dokument tożsamości", "Zaświadczenie o dochodach"],
  };
}

export default async function Home() {
  const [cashLoans, mortgageLoans, consolidationLoans] = await Promise.all([
    getLoanOffers('gotowkowy'),
    getLoanOffers('hipoteczny'),
    getLoanOffers('konsolidacyjny'),
  ]);

  const promotedCashLoans = cashLoans
    .filter(loan => loan.promoted && !loan.hidden);
  
  const promotedMortgageLoans = mortgageLoans
    .filter(loan => loan.promoted && !loan.hidden);

  const promotedConsolidationLoans = consolidationLoans
    .filter(loan => loan.promoted && !loan.hidden);

  return (
    <PageWrapper>
      <HeroSection />
      <PromotedLoansSection 
        promotedCashLoans={promotedCashLoans}
        promotedMortgageLoans={promotedMortgageLoans}
        promotedConsolidationLoans={promotedConsolidationLoans}
      />
      <AboutSection />
      {/* <TestimonialsSection/> */}
      <NewsletterSection />
    </PageWrapper>
  );
}
