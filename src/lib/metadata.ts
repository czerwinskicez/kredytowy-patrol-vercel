import { Metadata } from 'next';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/lib/sanity';
import type { SanityImage, Post } from '@/types';

const siteUrl = 'https://www.kredytowypatrol.pl';
const siteName = 'Kredytowy Patrol';
const siteDescription = 'Porównaj oferty kredytów z niskim RRSO i prowizją. Oblicz miesięczną ratę i całkowitą kwotę. Sprawdź promowane lokaty i konta. Kredytowy Patrol.';

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Porównywarka Kredytów, Lokat, Kont | ${siteName}`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
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
    title: `${siteName} - Porównywarka Kredytów i Produktów Finansowych`,
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
    title: `${siteName} - Porównywarka Kredytów i Produktów Finansowych`,
    description: siteDescription,
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
  description: 'Porównywarka kredytów hipotecznych, gotówkowych, konsolidacyjnych, lokat bankowych, kont oszczędnościowych i kart kredytowych.',
  url: siteUrl,
  serviceType: ['Loan Comparison', 'Financial Comparison', 'Banking Comparison', 'Mortgage Calculator', 'Credit Card Comparison'],
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

// Helper functions for OG images
const builder = imageUrlBuilder(client);

/**
 * Generates optimized Sanity image URL with proper OG dimensions
 * ZALECANE WYMIARY: 1200 x 630 pikseli (proporcja 1.91:1)
 * Te wymiary są optymalne dla Facebook, LinkedIn i większości platform społecznościowych
 */
export function getOptimizedOGImageUrl(image: SanityImage): string {
  if (!image || !image.asset) {
    console.warn('⚠️ Pusty lub nieprawidłowy obraz przekazany do getOptimizedOGImageUrl');
    return `${siteUrl}/screenshot_wide.jpg`;
  }

  try {
    return builder
      .image(image)
      .width(1200)
      .height(630)
      .fit('crop') // Zapewnia dokładne wymiary poprzez przycięcie
      .format('jpg') // JPG dla lepszej kompresji obrazów OG
      .quality(85) // Dobra jakość z rozsądną kompresją
      .url();
  } catch (error) {
    console.error('❌ Błąd podczas generowania URL obrazu OG:', error);
    return `${siteUrl}/screenshot_wide.jpg`;
  }
}

/**
 * Validates OG image and provides recommendations for users
 * UWAGA: Ta funkcja jest używana głównie do debugowania i logowania
 */
export function validateOGImage(image: SanityImage, context: string = 'nieznany'): boolean {
  if (!image || !image.asset) {
    console.warn(`📝 SANITY OG IMAGE: Brak obrazu OG dla: ${context}`);
    console.warn('💡 ZALECENIE: Dodaj dedykowany obraz OG o wymiarach 1200x630px w sekcji SEO');
    return false;
  }

  // Informacje dla deweloperów o tym że obraz zostanie zoptymalizowany
  console.log(`✅ SANITY OG IMAGE: Obraz znaleziony dla: ${context}`);
  console.log('🔧 AUTOMATYCZNA OPTYMALIZACJA: Obraz zostanie przeskalowany do 1200x630px');
  
  return true;
}

/**
 * Generates metadata for blog posts with proper OG image handling
 * Preferuje dedykowany obraz OG, fallback na mainImage, a na końcu domyślny obraz
 */
export function generatePostMetadata(post: Post): Metadata {
  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.excerpt;
  
  // Określanie obrazu OG w kolejności priorytetów z walidacją:
  // 1. Dedykowany obraz OG z Sanity (najwyższy priorytet)
  // 2. Główny obraz postu (mainImage)
  // 3. Domyślny obraz strony
  let ogImageUrl = `${siteUrl}/screenshot_wide.jpg`; // fallback domyślny
  let imageSource = 'domyślny';
  
  if (post.seo?.ogImage && validateOGImage(post.seo.ogImage, `Post: ${post.title} - dedykowany OG image`)) {
    // Użyj dedykowanego obrazu OG jeśli jest dostępny i prawidłowy
    ogImageUrl = getOptimizedOGImageUrl(post.seo.ogImage);
    imageSource = 'dedykowany OG';
  } else if (post.mainImage && validateOGImage(post.mainImage, `Post: ${post.title} - main image jako fallback`)) {
    // Fallback na główny obraz postu
    ogImageUrl = getOptimizedOGImageUrl(post.mainImage);
    imageSource = 'główny obraz postu';
  } else {
    console.warn(`⚠️ Post "${post.title}" nie ma obrazu OG ani głównego obrazu - używam domyślnego`);
    console.warn('💡 ZALECENIE: Dodaj dedykowany obraz OG (1200x630px) w sekcji SEO w Sanity');
  }
  
  console.log(`🖼️ OG IMAGE dla "${post.title}": używam ${imageSource}`);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${siteUrl}/finansowa/aktualnosci/${post.slug.current}`,
      siteName,
      locale: 'pl_PL',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} - ${siteName}`,
          type: 'image/jpeg',
        },
      ],
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author.name] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@kredytowypatrol',
    },
    alternates: {
      canonical: `${siteUrl}/finansowa/aktualnosci/${post.slug.current}`,
    },
  };
} 