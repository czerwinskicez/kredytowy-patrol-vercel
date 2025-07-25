import { DepositComparisonSection } from '@/components/DepositComparisonSection';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getDepositOffers } from '@/lib/google-sheets';

export default async function LokataPage() {
  const depositOffers = await getDepositOffers();

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-12 lg:max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Ranking Lokat</h1>
        <DepositComparisonSection 
          initialDepositOffers={depositOffers} 
          title="Porównaj lokaty"
        />
      </main>
      <Footer />
    </div>
  );
} 