import { DepositComparisonSection } from '@/components/DepositComparisonSection';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getDepositOffers } from '@/lib/google-sheets';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Najlepsze Lokaty Bankowe - Porównywarka i Ranking Lokat',
  description: 'Znajdź najlepsze lokaty bankowe. Porównaj oprocentowanie lokat terminowych i online. Nasz ranking lokat pomoże Ci wybrać najkorzystniejszą ofertę i zmaksymalizować zyski.'
};

export default async function LokataPage() {
  const depositOffers = await getDepositOffers();

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-12 lg:max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Ranking Lokat Bankowych</h1>
        <p className="text-lg text-gray-600 mb-8">
          Skorzystaj z naszej porównywarki, aby znaleźć najwyżej oprocentowane lokaty terminowe i online. Wybierz najlepszą ofertę i zacznij oszczędzać!
        </p>
        <DepositComparisonSection
          initialDepositOffers={depositOffers}
          title="Porównaj lokaty"
        />
      </main>
      <Footer />
    </div>
  );
} 