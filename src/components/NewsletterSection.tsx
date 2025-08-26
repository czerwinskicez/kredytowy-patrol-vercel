// src/components/NewsletterSection.tsx
import React from 'react';

export function NewsletterSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="bg-gray-100 rounded-xl p-8 md:p-12 max-w-4xl mx-auto shadow-sm text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Bądź na bieżąco z najlepszymi ofertami!
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Zapisz się do naszego newslettera, aby otrzymywać cotygodniowe podsumowanie 
            najkorzystniejszych kredytów i lokat prosto na Twoją skrzynkę mailową.
          </p>
          <form className="flex flex-col gap-4 justify-center max-w-lg mx-auto" noValidate>
            <input
              type="text"
              name="firstName"
              autoComplete="given-name"
              placeholder="Wpisz swoje imię"
              aria-label="Imię"
              className="w-full px-5 py-2 rounded-lg border-2 border-gray-300 focus:border-[#0a472e] focus:ring-0 transition-colors bg-white"
              required
            />
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Wpisz swój adres e-mail"
              aria-label="Adres e-mail"
              className="w-full px-5 py-2 rounded-lg border-2 border-gray-300 focus:border-[#0a472e] focus:ring-0 transition-colors bg-white"
              required
            />
            <button
              type="submit"
              className="bg-[#0a472e] hover:bg-[#0c5a3a] text-white font-bold py-3 px-8 text-lg rounded-lg transition-colors"
              aria-label="Zapisz się do newslettera"
            >
              Zapisz się
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
