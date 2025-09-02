import { ComparisonSection } from '@/components/ComparisonSection';
import { getLoanOffers } from '@/lib/google-sheets';
import type { LoanOffer } from '@/types';
import { Metadata } from 'next';
import { PageWrapper } from '@/components/PageWrapper';
import { Faq } from '@/components/Faq';

const loanTypeDetails: { [key: string]: { name: string; description: string, title: string } } = {
  'gotowkowy': {
    name: 'Kredyt Gotówkowy',
    title: 'Najlepsze Kredyty Gotówkowe - Porównywarka i Ranking',
    description: 'Znajdź najlepszy kredyt gotówkowy na dowolny cel. Porównaj oferty banków, sprawdź RRSO i wybierz najtańszy kredyt gotówkowy. Nasza porównywarka pomoże Ci podjąć właściwą decyzję.'
  },
  'hipoteczny': {
    name: 'Kredyt Hipoteczny',
    title: 'Kredyty Hipoteczne - Porównywarka i Kalkulator Zdolności',
    description: 'Porównaj kredyty hipoteczne z różnych banków. Sprawdź warunki, oprocentowanie i RRSO. Znajdź najkorzystniejszy kredyt na mieszkanie lub dom. Oferujemy również kredyt bez wkładu własnego.'
  },
  'konsolidacyjny': {
    name: 'Kredyt Konsolidacyjny',
    title: 'Kredyty Konsolidacyjne - Porównaj i Oblicz Ratę',
    description: 'Połącz swoje dotychczasowe zobowiązania w jeden tańszy kredyt konsolidacyjny. Obniż miesięczne raty i uporządkuj swoje finanse. Sprawdź ranking kredytów konsolidacyjnych.'
  },
};

const faqContent = {
  'gotowkowy': {
    title: 'Najczęściej zadawane pytania o kredyt gotówkowy',
    items: [
      { question: 'Czym jest kredyt gotówkowy i na co można go przeznaczyć?', answer: 'To kredyt konsumencki na dowolny cel niezwiązany z działalnością gospodarczą. Środki możesz wydać swobodnie.' },
      { question: 'Jaka jest maksymalna kwota kredytu gotówkowego i na jak długo?', answer: 'Zgodnie z ustawą o kredycie konsumenckim próg produktu to do 255 550 zł, ale realny limit wyznacza Twoja zdolność kredytowa i oferta banku. Okres spłaty zwykle do ok. 10 lat.' },
      { question: 'Jakie dokumenty są potrzebne do wniosku?', answer: 'Najczęściej: dowód tożsamości oraz potwierdzenie dochodu (zaświadczenie/oświadczenie, e-Teczka/PSD2). Listy wymaganych dokumentów banki publikują w poradnikach.' },
      { question: 'Ile czeka się na decyzję i wypłatę?', answer: 'Od kilkunastu minut online do kilku dni — zależy od banku i sposobu zawarcia umowy.' },
      { question: 'Co to jest RRSO i jak porównywać oferty?', answer: 'RRSO pokazuje całkowity koszt roczny (odsetki + prowizje + ubezpieczenia itd.) i jest najlepszą miarą porównawczą między bankami.' },
      { question: 'Co wpływa na zdolność kredytową?', answer: 'Dochody i ich stabilność, koszty życia, liczba zobowiązań, historia w BIK, wiek, gospodarstwo domowe itd.' },
      { question: 'Czy mogę spłacić kredyt wcześniej i odzyskać część kosztów?', answer: 'Tak. Przy wcześniejszej spłacie bank proporcjonalnie obniża koszty, w tym prowizję (art. 49 ustawy o kredycie konsumenckim).' },
      { question: 'Czy wniosek wpływa na mój BIK?', answer: 'Zapytania kredytowe mogą chwilowo obniżyć scoring, ale w przypadku kilku porównań tego samego produktu w krótkim czasie BIK traktuje je jak jedno. Terminowa spłata buduje pozytywną historię.' },
      { question: 'Czy można wziąć kredyt wspólnie z drugą osobą?', answer: 'Tak — współkredytobiorca zwykle zwiększa zdolność kredytową (łączone dochody).' },
      { question: 'Kredyt gotówkowy a kredyt konsumencki — czy to to samo?', answer: 'Kredyt gotówkowy jest rodzajem kredytu konsumenckiego; kredyt konsumencki to szersza kategoria regulowana tą samą ustawą.' },
    ],
  },
  'konsolidacyjny': {
    title: 'Najczęściej zadawane pytania o kredyt konsolidacyjny',
    items: [
      { question: 'Co to jest kredyt konsolidacyjny i jak działa?', answer: 'To kredyt celowy na spłatę Twoich dotychczasowych kredytów/pożyczek. Bank spłaca wierzycieli, a Ty masz jedną ratę zamiast kilku.' },
      { question: 'Jakie zobowiązania można połączyć?', answer: 'Zazwyczaj: gotówkowe, ratalne, karty kredytowe/limity, samochodowe, a nawet hipoteczne (w wariancie z zabezpieczeniem). Nie trzeba łączyć wszystkich.' },
      { question: 'Czy można skonsolidować „chwilówki”/pożyczki pozabankowe?', answer: 'Część ofert to dopuszcza (zależnie od banku i oceny ryzyka). Zdarzają się oferty wprost obejmujące chwilówki.' },
      { question: 'Czy przy konsolidacji dostanę dodatkową gotówkę?', answer: 'Często tak — banki umożliwiają dobranie środków na dowolny cel razem z konsolidacją. Pamiętaj, że zwiększa to kwotę i łączny koszt.' },
      { question: 'Czy rata będzie niższa, a koszt wyższy?', answer: 'Zwykle rata spada, bo wydłużasz okres spłaty; łączny koszt może wzrosnąć. To typowa „zamiana kilku rat na jedną niższą”.' },
      { question: 'Czy konsolidacja wymaga zdolności kredytowej?', answer: 'Tak — bank oceni dochody i historię spłaty. Wniosek warto złożyć zanim pojawią się opóźnienia.' },
      { question: 'Konsolidacja gotówkowa vs. hipoteczna — czym się różnią?', answer: 'Gotówkowa: szybciej, bez zabezpieczenia, krótszy okres i niższe kwoty. Hipoteczna: zabezpieczenie na nieruchomości, zwykle dłuższy okres, a formalności więcej (często kilka tygodni).' },
      { question: 'Jaki wpływ ma konsolidacja na BIK?', answer: 'Nowy kredyt to zapytanie w BIK, ale zamknięcie starych i terminowa spłata rat po konsolidacji mają potencjał poprawić historię.' },
      { question: 'Jakie dokumenty są potrzebne?', answer: 'Dowód tożsamości, potwierdzenie dochodów oraz dokumenty spłacanych zobowiązań (umowy/harmonogramy/zaświadczenia).' },
      { question: 'Ile trwa cały proces?', answer: 'Konsolidacja gotówkowa bywa szybka (online), hipoteczna — często kilka tygodni z uwagi na operat i wpis hipoteki.' },
    ],
  },
  'hipoteczny': {
    title: 'Najczęściej zadawane pytania o kredyt hipoteczny',
    items: [
        { question: 'Czym jest kredyt hipoteczny i czym różni się od „mieszkaniowego”?', answer: '„Mieszkaniowy” to jeden z rodzajów kredytu hipotecznego (cel stricte mieszkaniowy). Każdy hipoteczny ma zabezpieczenie na nieruchomości.' },
        { question: 'Jaki jest wymagany wkład własny?', answer: 'Standardowo 20% wartości nieruchomości. Część banków akceptuje 10% przy dodatkowym zabezpieczeniu (np. ubezpieczenie niskiego wkładu).' },
        { question: 'Stałe czy zmienne oprocentowanie — co wybrać?', answer: 'Stałe: rata nie zmienia się przez 5–7 lat. Zmienne: marża + wskaźnik referencyjny (np. WIBOR; w części ofert następcy typu WIRON/WIRF/POLSTR — zgodnie z zapisami umowy). Zmienna stopa oznacza ratę rosnącą/spadającą wraz z rynkiem.' },
        { question: 'Jakie dokumenty są zwykle potrzebne?', answer: 'Dowód, dokumenty dochodowe oraz dokumenty nieruchomości (np. umowa deweloperska/przedwstępna, odpis KW, operat, pozwolenie na budowę itp.).' },
        { question: 'Ile trwa proces uzyskania kredytu hipotecznego?', answer: 'Zwykle kilka tygodni (analiza zdolności, wycena, decyzja, zabezpieczenia/wpis).' },
        { question: 'Jak porównywać oferty — co wchodzi w koszt?', answer: 'Patrz na RRSO, marżę, prowizję, ubezpieczenia (nieruchomości, czasem życie, „niski wkład”), opłaty okołokredytowe.' },
        { question: 'Czy mogę spłacić wcześniej i jakie opłaty mogą się pojawić?', answer: 'Prawo pozwala na wcześniejszą spłatę; przy zmiennej stopie bank może pobrać rekompensatę tylko w pierwszych 3 latach (limit 3% i nie wyżej niż odsetki za 12 mies.). Przy stałej stopie rekompensata jest dopuszczalna wg kosztu banku.' },
        { question: 'Jak zwiększyć zdolność?', answer: 'Wyższe i stabilne dochody, ograniczenie limitów/kart, dłuższy okres, współkredytobiorca, pozytywna historia w BIK.' },
        { question: 'Czy mogę połączyć cele (mieszkanie + konsolidacja / dowolny cel)?', answer: 'Niektóre banki pozwalają łączyć cele w jednym kredycie hipotecznym (np. cel mieszkaniowy + spłata innych zobowiązań/dodatkowa kwota).' },
        { question: 'Jak zmiany stóp i wskaźnika referencyjnego wpływają na ratę?', answer: 'Przy zmiennej stopie rata rośnie, gdy rośnie wskaźnik (np. WIBOR), i spada przy spadkach; przy stałej stopie rata jest stała w okresie stałego oprocentowania.' },
    ]
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const details = loanTypeDetails[slug] || { name: 'Ranking Kredytów', description: 'Porównaj oferty kredytowe.', title: 'Ranking Kredytów' };

  return {
    title: details.title,
    description: details.description,
  };
}

export default async function KredytPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const loanOffers = await getLoanOffers(slug);
  const details = loanTypeDetails[slug] || { name: 'Ranking Kredytów', description: 'Porównaj oferty kredytowe.' };
  const faq = faqContent[slug as keyof typeof faqContent];

  // Ustal wartości inicjalizacyjne tak, aby wszystkie promowane oferty były widoczne
  const promoted = loanOffers.filter(o => o.promoted && !o.hidden);
  const initialAmount = promoted.length > 0
    ? Math.max(5000, Math.min(...promoted.map(o => o.maxLoanValue)))
    : 50000;
  const initialMonths = promoted.length > 0
    ? Math.max(12, Math.min(...promoted.map(o => o.maxLoanTime)))
    : 48;

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12 lg:max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{details.name}</h1>
        <p className="text-lg text-gray-600 mb-8">{details.description}</p>
        <ComparisonSection
          initialLoanOffers={loanOffers}
          title={`Porównaj ${details.name.toLowerCase()}`}
          initialAmount={initialAmount}
          initialMonths={initialMonths}
        />
      </div>
      {faq && <Faq title={faq.title} items={faq.items} />}
    </PageWrapper>
  );
}

export async function generateStaticParams() {
  return Object.keys(loanTypeDetails).map((slug) => ({
    slug,
  }));
} 