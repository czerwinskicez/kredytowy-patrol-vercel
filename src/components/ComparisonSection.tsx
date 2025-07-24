import { Ranking } from './Ranking';
import type { LoanOffer } from '@/types';

type ComparisonSectionProps = {
  initialLoanOffers: LoanOffer[];
};

export function ComparisonSection({ initialLoanOffers }: ComparisonSectionProps) {
  return (
    <Ranking 
      initialLoanOffers={initialLoanOffers} 
      title="Dopasuj kredyt do swoich potrzeb"
    />
  );
}