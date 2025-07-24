import { ComparisonSection } from '@/components/ComparisonSection';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getLoanOffers } from '@/lib/google-sheets';
import type { LoanOffer } from '@/types';

const loanTypeNames: { [key: string]: string } = {
  'gotowkowy': 'Kredyt Gotówkowy',
  'hipoteczny': 'Kredyt Hipoteczny',
  'konsolidacyjny': 'Kredyt Konsolidacyjny',
}

export default async function KredytPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loanOffers = await getLoanOffers(slug);
  const loanTypeName = loanTypeNames[slug] || 'Ranking Kredytów';

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-12 lg:max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">{loanTypeName}</h1>
        <ComparisonSection 
          initialLoanOffers={loanOffers} 
          title={`Porównaj ${loanTypeName.toLowerCase()}`}
        />
      </main>
      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(loanTypeNames).map((slug) => ({
    slug,
  }));
} 