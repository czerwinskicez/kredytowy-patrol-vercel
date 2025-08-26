
import { Metadata } from 'next';
import { Facebook, Instagram, Linkedin, Globe } from 'lucide-react';
import { FaXTwitter, FaTiktok } from 'react-icons/fa6';
import Link from 'next/link';
import { PageWrapper } from '@/components/PageWrapper';
import { NewsletterSection } from '@/components/NewsletterSection';

export const metadata: Metadata = {
  title: 'Kontakt - Kredytowy Patrol',
  description: 'Skontaktuj się z nami. Znajdziesz tutaj nasze dane firmowe oraz odnośniki do naszych mediów społecznościowych.',
  openGraph: {
    title: 'Kontakt - Kredytowy Patrol',
    description: 'Skontaktuj się z nami. Znajdziesz tutaj nasze dane firmowe oraz odnośniki do naszych mediów społecznościowych.',
    url: '/kontakt',
  },
  alternates: { canonical: '/kontakt' },
};

export default function KontaktPage() {
  return (
    <PageWrapper>
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 lg:max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Skontaktuj się z nami</h1>
            <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
              Masz pytania lub sugestie? Jesteśmy tutaj, aby pomóc. Poniżej znajdziesz nasze profile w mediach społecznościowych oraz formularz kontaktowy.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            {/* Karta z mediami społecznościowymi */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Globe className="mr-3 text-[#0a472e]" size={26} />
                Znajdź nas w sieci
              </h2>
              <div className="flex flex-wrap gap-x-6 gap-y-4">
                <a href="https://www.facebook.com/kredytowypatrol" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 font-medium hover:text-[#f0c14b] transition-colors" aria-label="Facebook Kredytowy Patrol" title="Facebook">
                  <Facebook size={24} />
                  <span>Facebook</span>
                </a>
                <a href="https://www.instagram.com/kredytowy_patrol/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 font-medium hover:text-[#f0c14b] transition-colors" aria-label="Instagram Kredytowy Patrol" title="Instagram">
                  <Instagram size={24} />
                  <span>Instagram</span>
                </a>
                <a href="https://x.com/kredytowypatrol" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 font-medium hover:text-[#f0c14b] transition-colors" aria-label="Profil X (Twitter)" title="X">
                  <FaXTwitter size={22} />
                  <span>X</span>
                </a>
                <a href="https://www.linkedin.com/company/kredytowy-patrol" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 font-medium hover:text-[#f0c14b] transition-colors" aria-label="LinkedIn Kredytowy Patrol" title="LinkedIn">
                  <Linkedin size={24} />
                  <span>LinkedIn</span>
                </a>
                <a href="https://www.tiktok.com/@kredytowypatrol" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 font-medium hover:text-[#f0c14b] transition-colors" aria-label="TikTok Kredytowy Patrol" title="TikTok">
                  <FaTiktok size={22} />
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </div>

          {/* Formularz kontaktowy */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Napisz do nas</h2>
              <form className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Imię i nazwisko</label>
                    <input required type="text" name="name" id="name" placeholder="Jan Kowalski" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#f0c14b] focus:border-[#0a472e]" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Adres e-mail</label>
                    <input required type="email" name="email" id="email" placeholder="jan.kowalski@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#f0c14b] focus:border-[#0a472e]" />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Temat</label>
                  <input required type="text" name="subject" id="subject" placeholder="Temat wiadomości" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#f0c14b] focus:border-[#0a472e]" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Wiadomość</label>
                  <textarea required name="message" id="message" rows={5} placeholder="Twoja wiadomość..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#f0c14b] focus:border-[#0a472e]"></textarea>
                </div>
                <div className="flex items-start gap-3">
                  <input id="consent" name="consent" type="checkbox" required className="mt-1 h-4 w-4 border-gray-300 rounded text-[#0a472e] focus:ring-[#f0c14b]" aria-required="true" />
                  <label htmlFor="consent" className="text-sm text-gray-700">
                    Wyrażam zgodę na przetwarzanie moich danych osobowych w celu kontaktu. Zapoznałem/am się z
                    {' '}<Link href="/polityka-prywatnosci" className="text-[#0a472e] underline hover:text-[#053320]">Polityką prywatności</Link>.
                  </label>
                </div>
                <div className="text-center">
                  <button type="submit" className="bg-[#0a472e] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#0c5a3a] transition-colors duration-300" aria-label="Wyślij wiadomość">
                    Wyślij wiadomość
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <NewsletterSection />
    </PageWrapper>
  );
}
