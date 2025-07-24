"use client";
import React from 'react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { ComparisonSection } from '../components/ComparisonSection';
// import { ProductCategories } from '@/components/ProductCategories';
import { Footer } from '@/components/Footer';

export default function Page() {
  return (
    <div className="min-h-screen w-full">
      <Header />
      <HeroSection />
      {/* <ProductCategories /> */}
      <AboutSection />
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <ComparisonSection />
        </div>
      </div>
      <Footer />
    </div>
  );
}