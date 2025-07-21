import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  // icons: {
  //   icon: "/favicon.ico",
  //   shortcut: "/favicon-16x16.png",
  //   apple: "/apple-touch-icon.png",
  // },
  // manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
