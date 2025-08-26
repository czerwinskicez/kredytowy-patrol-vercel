import { SavingsAccountComparisonSection } from '@/components/SavingsAccountComparisonSection';
import { getSavingsAccountOffers } from '@/lib/google-sheets';
import { Metadata } from 'next';
import { PageWrapper } from '@/components/PageWrapper';

export const metadata: Metadata = {
  title: 'Najlepsze Konta Oszczędnościowe - Ranking i Porównywarka',
  description: 'Znajdź najlepsze konto oszczędnościowe. Porównaj oprocentowanie i warunki w różnych bankach. Nasz ranking kont oszczędnościowych pomoże Ci wybrać najkorzystniejszą ofertę.'
};

export default async function SavingsAccountPage() {
  const savingsAccountOffers = await getSavingsAccountOffers();

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12 lg:max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Ranking Kont Oszczędnościowych</h1>
        <p className="text-lg text-gray-600 mb-8">
          Chcesz, aby Twoje oszczędności pracowały? Sprawdź nasz ranking kont oszczędnościowych i wybierz ofertę z najlepszym oprocentowaniem.
        </p>
        <SavingsAccountComparisonSection
          initialOffers={savingsAccountOffers}
          title="Porównaj konta oszczędnościowe"
        />
      </div>
    </PageWrapper>
  );
}

