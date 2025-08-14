# Strategia SEO

Ten dokument opisuje strategię optymalizacji dla wyszukiwarek (SEO) w aplikacji Kredytowy Patrol, wykorzystującą najnowsze technologie Next.js 15 i App Router.

## 🎯 **Przegląd Strategii SEO**

Aplikacja Kredytowy Patrol została zaprojektowana z myślą o maksymalnej widoczności w wyszukiwarkach, wykorzystując zaawansowane techniki SEO i najnowsze funkcje Next.js 15.

### **Kluczowe Cele SEO**
- **Wysokie pozycje** dla kluczowych fraz finansowych
- **Lokalne SEO** dla rynku polskiego
- **Technical SEO** - optymalizacja techniczna
- **User Experience** - pozytywne sygnały dla Google

## 🚀 **Next.js 15 SEO Features**

### **App Router**
- **File-based Routing** - automatyczne generowanie URL-i
- **Server Components** - renderowanie po stronie serwera dla lepszego SEO
- **Static Generation** - pre-renderowane strony dla maksymalnej wydajności
- **Dynamic Routes** - automatyczne generowanie stron produktów

### **Metadata API**
```typescript
// src/lib/metadata.ts
export const baseMetadata: Metadata = {
  title: {
    default: 'Kredytowy Patrol - Porównanie Kredytów i Lokat',
    template: '%s | Kredytowy Patrol'
  },
  description: 'Porównaj najlepsze oferty kredytów, lokat i innych produktów finansowych. Aktualne rankingi i kalkulatory online.',
  keywords: ['kredyty', 'lokaty', 'finanse', 'porównanie', 'ranking'],
  authors: [{ name: 'Kredytowy Patrol' }],
  creator: 'Kredytowy Patrol',
  publisher: 'Kredytowy Patrol',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://kredytowypatrol.pl'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: 'https://kredytowypatrol.pl',
    title: 'Kredytowy Patrol - Porównanie Kredytów i Lokat',
    description: 'Porównaj najlepsze oferty kredytów, lokat i innych produktów finansowych.',
    siteName: 'Kredytowy Patrol',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kredytowy Patrol - Porównanie produktów finansowych',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kredytowy Patrol - Porównanie Kredytów i Lokat',
    description: 'Porównaj najlepsze oferty kredytów, lokat i innych produktów finansowych.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};
```

## 📱 **Dynamiczne Metadane**

### **Strony Produktów**
```typescript
// Przykład dla strony kredytu
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const loanOffers = await getLoanOffers(params.slug);
  
  return {
    title: `Kredyty ${getLoanTypeName(params.slug)} - Ranking i Porównanie`,
    description: `Porównaj najlepsze oferty kredytów ${getLoanTypeName(params.slug)}. Aktualne rankingi, stopy procentowe i kalkulatory online.`,
    keywords: [`kredyty ${getLoanTypeName(params.slug)}`, 'ranking kredytów', 'porównanie ofert'],
    openGraph: {
      title: `Kredyty ${getLoanTypeName(params.slug)} - Ranking i Porównanie`,
      description: `Porównaj najlepsze oferty kredytów ${getLoanTypeName(params.slug)}.`,
    },
  };
}
```

### **Strony Blogowe (FinanSowa)**
```typescript
// Przykład dla posta bloga
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      images: post.seo?.ogImage ? [post.seo.ogImage] : [post.mainImage],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}
```

## 🗺️ **Mapa Strony (Sitemap)**

### **Automatyczne Generowanie**
```typescript
// src/app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kredytowypatrol.pl';
  
  // Strony statyczne
  const staticPages = [
    '',
    '/kredyty/gotowkowy',
    '/kredyty/hipoteczny',
    '/kredyty/konsolidacyjny',
    '/lokata',
    '/lokaty-walutowe',
    '/konto-oszczednosciowe',
    '/obligacje-skarbowe',
    '/finansowa/aktualnosci',
  ].map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: page === '' ? 1 : 0.8,
  }));

  // Posty blogowe
  const posts = await getPosts();
  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/finansowa/${post.slug.current}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Kategorie blogowe
  const categories = await getCategories();
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/finansowa/kategorie/${category.slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages, ...categoryPages];
}
```

## 🤖 **Robots.txt**

### **Konfiguracja Crawlerów**
```typescript
// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://kredytowypatrol.pl/sitemap.xml',
    host: 'https://kredytowypatrol.pl',
  };
}
```

## 🏷️ **Dane Strukturalne (JSON-LD)**

### **Schema Markup**
```typescript
// src/components/StructuredData.tsx
export function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kredytowy Patrol',
    description: 'Porównanie produktów finansowych',
    url: 'https://kredytowypatrol.pl',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://kredytowypatrol.pl/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    sameAs: [
      'https://www.facebook.com/kredytowypatrol',
      'https://twitter.com/kredytowypatrol',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
```

### **Produkty Finansowe**
```typescript
// Przykład dla kredytu
const loanStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: loan.name,
  description: `Kredyt ${loan.type} oferowany przez ${loan.provider}`,
  provider: {
    '@type': 'FinancialService',
    name: loan.provider,
    url: loan.providerUrl,
  },
  interestRate: {
    '@type': 'QuantitativeValue',
    value: loan.baseInterestRate,
    unitText: 'PERCENT',
  },
  feesAndCommissionsSpecification: `${loan.commission}% prowizji`,
};
```

## 🔍 **Optymalizacja Treści**

### **Nagłówki (H1-H6)**
- **H1**: Tylko jeden na stronę, główny tytuł
- **H2**: Główne sekcje (np. "Ranking Kredytów", "Porównanie Ofert")
- **H3**: Podsekcje (np. "Kredyty Gotówkowe", "Kredyty Hipoteczne")
- **H4-H6**: Szczegóły i podkategorie

### **Struktura URL-i**
```
/kredyty/gotowkowy          # Kredyty gotówkowe
/kredyty/hipoteczny         # Kredyty hipoteczne
/lokata                     # Lokaty PLN
/lokaty-walutowe            # Lokaty walutowe
/finansowa/aktualnosci      # Blog - aktualności
/finansowa/kategorie/finanse # Blog - kategoria finanse
```

### **Optymalizacja Obrazów**
- **Alt Text**: Opisowe teksty alternatywne
- **Responsive Images**: Automatyczne generowanie różnych rozmiarów
- **Lazy Loading**: Obrazy ładowane tylko gdy są potrzebne
- **WebP/AVIF**: Nowoczesne formaty obrazów

## 📊 **Core Web Vitals**

### **LCP (Largest Contentful Paint)**
- **Cel**: < 2.5s
- **Optymalizacja**: 
  - Server-side rendering
  - Static generation
  - Image optimization
  - Critical CSS inlining

### **FID (First Input Delay)**
- **Cel**: < 100ms
- **Optymalizacja**:
  - Code splitting
  - Lazy loading
  - Minimal JavaScript bundle

### **CLS (Cumulative Layout Shift)**
- **Cel**: < 0.1
- **Optymalizacja**:
  - Fixed dimensions dla obrazów
  - Pre-allocated space
  - Stable layout

## 🌍 **Lokalne SEO (Polska)**

### **Geolokalizacja**
```typescript
// Konfiguracja dla rynku polskiego
export const viewport: Viewport = {
  themeColor: '#053320',
  colorScheme: 'light',
  locale: 'pl-PL',
};
```

### **Język i Lokalizacja**
- **Język**: Polski (pl)
- **Waluta**: PLN
- **Format daty**: DD.MM.YYYY
- **Separator dziesiętny**: przecinek (,)

### **Lokalne Słowa Kluczowe**
- **Kredyty**: gotówkowy, hipoteczny, konsolidacyjny
- **Lokaty**: terminowe, walutowe, strukturyzowane
- **Banki**: polskie instytucje finansowe
- **Regulacje**: KNF, RODO, polskie prawo

## 📱 **Mobile-First SEO**

### **Responsywność**
- **Mobile-first design**
- **Touch-friendly interface**
- **Fast loading na słabych łączach**
- **Progressive Web App features**

### **AMP (Accelerated Mobile Pages)**
- **Optymalizacja dla mobile**
- **Szybkie ładowanie**
- **Rich snippets w Google**

## 🔄 **Technical SEO**

### **Canonical URLs**
```typescript
// Automatyczne canonical URLs
export const metadata: Metadata = {
  alternates: {
    canonical: `https://kredytowypatrol.pl${pathname}`,
  },
};
```

### **Przekierowania 301**
```typescript
// next.config.ts
async redirects() {
  return [
    {
      source: '/kredyt',
      destination: '/kredyty/gotowkowy',
      permanent: true,
    },
    {
      source: '/lokaty',
      destination: '/lokata',
      permanent: true,
    },
  ];
}
```

### **Breadcrumbs**
```typescript
// Struktura breadcrumbs
const breadcrumbs = [
  { name: 'Strona główna', href: '/' },
  { name: 'Kredyty', href: '/kredyty' },
  { name: 'Gotówkowy', href: '/kredyty/gotowkowy' },
];
```

## 📈 **Monitoring SEO**

### **Google Search Console**
- **Performance**: Pozycje w wyszukiwarce
- **Coverage**: Indeksowanie stron
- **Core Web Vitals**: Metryki wydajności
- **Mobile Usability**: Użyteczność mobilna

### **Google Analytics 4**
- **Organic Traffic**: Ruch organiczny
- **User Behavior**: Zachowania użytkowników
- **Conversion Tracking**: Śledzenie konwersji
- **Page Performance**: Wydajność stron

### **Vercel Analytics**
- **Real User Metrics**: Rzeczywiste dane użytkowników
- **Performance Monitoring**: Monitoring wydajności
- **Error Tracking**: Śledzenie błędów

## 🚀 **SEO Checklist**

### **Przed Deployem**
- [ ] Wszystkie strony mają unikalne tytuły i opisy
- [ ] Dane strukturalne są poprawnie zaimplementowane
- [ ] Sitemap.xml jest aktualna
- [ ] Robots.txt jest skonfigurowany
- [ ] Obrazy mają alt text
- [ ] URL-e są przyjazne dla SEO

### **Po Deployem**
- [ ] Zgłoszono sitemap do Google Search Console
- [ ] Sprawdzono Core Web Vitals
- [ ] Przetestowano mobile usability
- [ ] Zweryfikowano structured data
- [ ] Sprawdzono page speed

---

**Kredytowy Patrol** - Optymalizacja SEO z Next.js 15 🏦 