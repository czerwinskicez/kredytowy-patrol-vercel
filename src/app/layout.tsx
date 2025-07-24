import type { Metadata } from "next";
import { 
  // Poppins, 
  // Ubuntu, 
  Sarala, 
  // Merriweather_Sans, 
  // Fira_Sans 
} from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Kredytowy Patrol - Porównywarka Kredytów i Oszczędności",
  description: "Znajdź najlepsze oferty kredytów hipotecznych, gotówkowych i oszczędności. Kredytowy Patrol - Twój przewodnik po świecie finansów. Porównaj, wybierz, oszczędź!",
  keywords: "kredyt hipoteczny, kredyt gotówkowy, lokaty, oszczędności, porównywarka kredytów, finanse, pożyczki, banki, stopy procentowe, blog finansowy",
  openGraph: {
    title: "Kredytowy Patrol - Twoja Porównywarka Finansowa",
    description: "Porównaj setki ofert kredytów i lokat. Znajdź najlepsze rozwiązanie dla siebie z Kredytowym Patrolem!",
    url: "https://kredytowy-patrol.vercel.app", // Zmień na swój docelowy URL
    siteName: "Kredytowy Patrol",
    images: [
      {
        url: "https://kredytowy-patrol.vercel.app/og-image.png", // Zmień na URL obrazka Open Graph
        width: 1200,
        height: 630,
        alt: "Kredytowy Patrol - logo",
      },
    ],
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kredytowy Patrol - Porównywarka Finansowa",
    description: "Znajdź najlepsze kredyty i lokaty w Polsce. Szybko, łatwo i bezpłatnie z Kredytowym Patrolem.",
    // creator: "@TwojTwitterHandle", // Opcjonalnie: dodaj swój Twitter handle
    images: ["https://kredytowy-patrol.vercel.app/twitter-image.png"], // Zmień na URL obrazka dla Twittera
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Opcjonalnie: ikony i manifest
  icons: {
    icon: "/favicon.ico",
    // shortcut: "/favicon-16x16.png",
    // apple: "/apple-touch-icon.png",
  },
  // manifest: "/site.webmanifest",
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
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@40,200,0,0" />
      </head>
      <body className="antialiased font-body">
        {children}
      </body>
    </html>
  );
}
