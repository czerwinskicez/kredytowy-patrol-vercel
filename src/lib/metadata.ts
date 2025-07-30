import { Metadata } from 'next';

const siteUrl = 'https://www.kredytowypatrol.pl';
const siteName = 'Kredytowy Patrol';
const siteDescription = 'Znajdź najlepsze oferty kredytów hipotecznych, gotówkowych, samochodowych i oszczędności w Polsce. Porównaj setki ofert banków i wybierz najkorzystniejszą. Kredytowy Patrol - Twój przewodnik po świecie finansów.';

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Porównywarka Kredytów i Oszczędności w Polsce`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'kredyt hipoteczny',
    'kredyt gotówkowy', 
    'kredyt samochodowy',
    'kredyt konsolidacyjny',
    'lokaty bankowe',
    'konta oszczędnościowe',
    'porównywarka kredytów',
    'porównywarka lokat',
    'najlepsze kredyty',
    'najlepsze lokaty',
    'oprocentowanie kredytu',
    'oprocentowanie lokaty',
    'banki w Polsce',
    'oferty bankowe',
    'kredyt online',
    'pożyczka',
    'finanse osobiste',
    'oszczędzanie',
    'inwestowanie',
    'stopy procentowe',
    'RRSO',
    'kredyt dla firm',
    'leasing'
  ],
  authors: [{ name: 'Kredytowy Patrol' }],
  creator: 'Kredytowy Patrol',
  publisher: 'Kredytowy Patrol',
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
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: siteUrl,
    siteName,
    title: `${siteName} - Najlepsze Kredyty i Lokaty w Polsce`,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${siteName} - Porównywarka finansowa`,
        type: 'image/png',
      },
      {
        url: `${siteUrl}/og-image-square.png`,
        width: 1200,
        height: 1200,
        alt: `${siteName} - Logo`,
        type: 'image/png',
      },
      {
        url: `${siteUrl}/screenshot_wide.jpg`,
        width: 1682,
        height: 985,
        alt: `${siteName} - Zrzut ekranu szeroki`,
        type: 'image/jpeg',
      },
      {
        url: `${siteUrl}/screenshot_narrow_vertical.jpg`,
        width: 551,
        height: 713,
        alt: `${siteName} - Zrzut ekranu wąski`,
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@kredytowypatrol', // Dodaj po utworzeniu konta Twitter
    creator: '@kredytowypatrol',
    title: `${siteName} - Porównywarka Finansowa`,
    description: 'Znajdź najlepsze kredyty i lokaty w Polsce. Szybko i łatwo.',
    images: [
      `${siteUrl}/screenshot_wide.jpg`,
      `${siteUrl}/screenshot_narrow_vertical.jpg`,
    ],
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'pl-PL': siteUrl,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#0a472e',
    'msapplication-TileImage': '/ms-icon-144x144.png',
    'theme-color': '#0a472e',
  },
};

// JSON-LD structured data
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteName,
  description: siteDescription,
  url: siteUrl,
  logo: `${siteUrl}/logo_male.png`,
  sameAs: [
    'https://www.tiktok.com/@kredytowypatrol',
    'https://www.facebook.com/kredytowypatrol',
    'https://x.com/kredytowypatrol',
    'https://www.linkedin.com/company/kredytowy-patrol',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'kontakt@kredytowy-patrol.pl',
    availableLanguage: 'Polish',
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'PL',
    addressLocality: 'Polska',
  },
  foundingDate: '2024',
  industry: 'Financial Services',
  numberOfEmployees: '1-10',
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  description: siteDescription,
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: siteName,
    logo: `${siteUrl}/logo_male.png`,
  },
};

export const financialServiceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: siteName,
  description: 'Porównywarka kredytów i produktów oszczędnościowych',
  url: siteUrl,
  serviceType: ['Loan Comparison', 'Financial Comparison', 'Banking Comparison'],
  areaServed: {
    '@type': 'Country',
    name: 'Poland',
  },
  availableLanguage: 'Polish',
  currenciesAccepted: 'PLN',
  paymentAccepted: 'Free',
  priceRange: 'Free',
};

export const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Strona główna',
      item: siteUrl,
    },
  ],
}; 