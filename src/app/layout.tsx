import type { Metadata } from "next";
import { 
  // Poppins, 
  // Ubuntu, 
  Sarala, 
  // Merriweather_Sans, 
  // Fira_Sans 
} from "next/font/google";
import "./globals.css";
import { ConsentProvider } from '@/contexts/ConsentContext';
import { CookieBanner } from '@/components/CookieBanner';
import { AnalyticsScripts } from '@/components/AnalyticsScripts';
import { StructuredData } from '@/components/StructuredData';
import { PageSpeedOptimizer } from '@/components/PageSpeedOptimizer';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { baseMetadata } from '@/lib/metadata';

// const fontHeading = Poppins({
//   subsets: ['latin'],
//   weight: ['400', '700'],
//   variable: '--font-heading',
// });

// const fontBody = Ubuntu({
//   subsets: ['latin'],
//   weight: ['400', '700'],
//   variable: '--font-body',
// });

const fontSarala = Sarala({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sarala',
});

// const fontMerriweatherSans = Merriweather_Sans({
//   subsets: ['latin'],
//   weight: ['400', '700'],
//   variable: '--font-merriweather-sans',
// });

// const fontFiraSans = Fira_Sans({
//   subsets: ['latin'],
//   weight: ['400', '700'],
//   variable: '--font-fira-sans',
// });

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`
      ${fontSarala.variable}
    `}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@40,200,0,0" />
      </head>
      <body className="antialiased font-body">
        <ConsentProvider>
          {children}
          <CookieBanner />
        </ConsentProvider>
        <AnalyticsScripts />
        <StructuredData />
        <PageSpeedOptimizer />
        <VercelAnalytics />
      </body>
    </html>
  );
}
