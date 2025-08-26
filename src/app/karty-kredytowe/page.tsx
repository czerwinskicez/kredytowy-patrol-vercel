import { NewsletterSection } from '@/components/NewsletterSection';
import { PageWrapper } from '@/components/PageWrapper';

// Placeholder data for credit cards
const creditCardOffers = [
  {
    bankName: 'Bank A',
    cardName: 'Karta Kredytowa Premium',
    interestRate: '12.5%',
    annualFee: '100 zł',
    benefits: ['Cashback 5%', 'Ubezpieczenie podróżne', 'Program lojalnościowy'],
    imageUrl: '/logos/alior.png',
    link: '#',
  },
  {
    bankName: 'Bank B',
    cardName: 'Karta Kredytowa Standard',
    interestRate: '15.0%',
    annualFee: '50 zł',
    benefits: ['Brak opłaty rocznej przy aktywnym korzystaniu', 'Rabaty u partnerów'],
    imageUrl: '/logos/bnpparibas.png',
    link: '#',
  },
  // Add more card offers as needed
];

export default function CreditCardsPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Najlepsze Karty Kredytowe - Ranking</h1>
        <p className="text-lg text-center text-gray-600 mb-12">
          Porównaj oferty kart kredytowych i wybierz tę, która najlepiej pasuje do Twoich potrzeb. Sprawdź oprocentowanie, opłaty i dodatkowe korzyści.
        </p>
        <div className="space-y-6">
          {creditCardOffers.map((card, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center bg-white p-6 rounded-lg shadow-md">
              <img src={card.imageUrl} alt={card.bankName} className="w-32 h-16 object-contain mb-4 md:mb-0 md:mr-6" />
              <div className="flex-grow">
                <h2 className="text-2xl font-semibold">{card.cardName}</h2>
                <p className="text-gray-500">{card.bankName}</p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Oprocentowanie</p>
                    <p className="text-lg font-bold">{card.interestRate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Opłata roczna</p>
                    <p className="text-lg font-bold">{card.annualFee}</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 mt-6 md:mt-0">
                <h3 className="text-lg font-semibold mb-2">Korzyści:</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {card.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
                <a 
                  href={card.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 inline-block bg-[#0a472e] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#0c5a3a] transition-colors duration-300 w-full text-center"
                >
                  Sprawdź ofertę
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <NewsletterSection />
    </PageWrapper>
  );
}
