import { SavingsAccountComparisonSection } from '@/components/SavingsAccountComparisonSection';
import { getSavingsAccountOffers } from '@/lib/google-sheets';
import { Metadata } from 'next';
import { PageWrapper } from '@/components/PageWrapper';
import { Faq } from '@/components/Faq';

export const metadata: Metadata = {
  title: 'Najlepsze Konta Oszczędnościowe - Ranking i Porównywarka',
  description: 'Znajdź najlepsze konto oszczędnościowe. Porównaj oprocentowanie i warunki w różnych bankach. Nasz ranking kont oszczędnościowych pomoże Ci wybrać najkorzystniejszą ofertę.'
};

const faqItems = [
    { question: 'Na czym polega konto oszczędnościowe (KO)?', answer: 'Rachunek z zmiennym oprocentowaniem i swobodnym dostępem do środków (często limity darmowych przelewów).' },
    { question: 'Czy bank może zmienić oprocentowanie KO w trakcie?', answer: 'Tak — KO zwykle ma zmienną stopę, bank może ją aktualizować (czasem powiązaną z WIBOR/WIRON).' },
    { question: 'Jak naliczane są odsetki?', answer: 'Najczęściej dziennie od salda i kapitalizacja miesięczna (dopisanie na koniec miesiąca).' },
    { question: 'Czy obowiązuje podatek Belki i kto go pobiera?', answer: 'Tak, 19%; bank pobiera go automatycznie — Ty nic nie dopisujesz w PIT.' },
    { question: 'Co oznacza „na nowe środki” i „okres promocji”?', answer: 'Promocyjne oprocentowanie zwykle dotyczy nadwyżki środków względem dnia bazowego i trwa np. 2–3 mies.; potem wraca stawka standardowa.' },
    { question: 'KO vs lokata — różnice?', answer: 'KO: elastyczny dostęp i zmienne oprocentowanie. Lokata: środki „zamknięte” na termin, stała stopa (zwykle wyższa).' },
    { question: 'Czy mogę mieć kilka kont oszczędnościowych?', answer: 'Tak — banki zwykle na to pozwalają; ważne są limity kwot i warunki promocji.' },
    { question: 'Co z przelewami z KO?', answer: 'Część banków pobiera opłaty za ponadlimitowe przelewy z KO (sprawdź TOiP). Mechanika zależy od banku.' },
    { question: 'Czy środki na KO są objęte BFG?', answer: 'Tak — jak inne depozyty do równowartości 100 000 EUR.' },
    { question: 'Jak porównywać KO?', answer: 'Patrz na oprocentowanie promocyjne vs standard, limit kwoty, czas promocji, wymogi (nowe środki, aktywność).' },
];

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
      <Faq title="Najczęściej zadawane pytania o konta oszczędnościowe" items={faqItems} />
    </PageWrapper>
  );
}

