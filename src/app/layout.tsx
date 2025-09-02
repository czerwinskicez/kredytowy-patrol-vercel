import type { Metadata, Viewport } from "next";
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
import { SpeedInsights as VercelSpeedInsights} from '@vercel/speed-insights/next'
import { baseMetadata } from '@/lib/metadata';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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

export const viewport: Viewport = {
  themeColor: '#053320',
};

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
        <meta name="mylead-verification" content="976678ce69b37a1ee1ec89b1b20f7e9d" />
        {/* mylead-verification: 976678ce69b37a1ee1ec89b1b20f7e9d */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://scripts.clarity.ms" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@40,200,0,0" />
      </head>
      <body className="antialiased font-body">
        <ConsentProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <CookieBanner />
          </div>
          <VercelAnalytics/>
        </ConsentProvider>
        <AnalyticsScripts />
        <StructuredData />
        <PageSpeedOptimizer />
        <VercelAnalytics />
        <VercelSpeedInsights />
        <div dangerouslySetInnerHTML={{__html: '<!-- mylead-verification: 976678ce69b37a1ee1ec89b1b20f7e9d -->'}} />
      </body>
    </html>
  );
}
