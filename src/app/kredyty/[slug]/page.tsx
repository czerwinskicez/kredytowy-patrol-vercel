import { Ranking } from '@/components/Ranking';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getLoanOffers } from '@/lib/google-sheets';
import type { LoanOffer } from '@/types';

const loanTypeNames: { [key: string]: string } = {
  'gotowkowy': 'Kredyt Gotówkowy',
  'hipoteczny': 'Kredyt Hipoteczny',
  'konsolidacyjny': 'Kredyt Konsolidacyjny',
}

export default async function KredytPage({ params }: { params: { slug: string } }) {
  const loanOffers = await getLoanOffers(params.slug);
  const loanTypeName = loanTypeNames[params.slug] || 'Ranking Kredytów';

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-12 lg:max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 font-heading">{loanTypeName}</h1>
        <Ranking 
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