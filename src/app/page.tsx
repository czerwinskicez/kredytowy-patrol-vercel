"use client";
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { ProductCategories } from '../components/ProductCategories';
import { AboutSection } from '../components/AboutSection';
import { ComparisonSection, type LoanCategory } from '../components/ComparisonSection';

export default function Page() {
  const [activeCategory, setActiveCategory] = useState<LoanCategory>('mortgage');
  return <div className="min-h-screen w-full">
      <Header />
      <HeroSection />
      <ProductCategories />
      <AboutSection />
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <ComparisonSection activeCategory={activeCategory} />
        </div>
      </div>
    </div>;
}