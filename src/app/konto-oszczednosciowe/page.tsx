import { SavingsAccountComparisonSection } from '@/components/SavingsAccountComparisonSection';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getSavingsAccountOffers } from '@/lib/google-sheets';

export default async function SavingsAccountPage() {
  const savingsAccountOffers = await getSavingsAccountOffers();

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-12 lg:max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Ranking Kont Oszczędnościowych</h1>
        <SavingsAccountComparisonSection 
          initialOffers={savingsAccountOffers} 
          title="Porównaj konta oszczędnościowe"
        />
      </main>
      <Footer />
    </div>
  );
}

