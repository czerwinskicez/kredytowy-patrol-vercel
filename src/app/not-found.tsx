import Link from 'next/link';
import Image from 'next/image';
import { PageWrapper } from '@/components/PageWrapper';

export default function NotFound() {
  return (
    <PageWrapper>
      <div className="h-full flex items-center justify-center text-center px-4 py-10">
        <div className="max-w-md">
          <Image
            src="/404.png"
            alt="Kredytowy Patrol - Strona nie została znaleziona"
            width={300}
            height={300}
            className="mx-auto mb-8"
            priority
          />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Błąd 404
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Niestety, strona, której szukasz, nie została znaleziona. Być może została przeniesiona lub usunięta.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#0a472e] text-white font-bold text-lg py-3 px-8 rounded-lg hover:bg-[#0c5a3a] transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Wróć na stronę główną
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
