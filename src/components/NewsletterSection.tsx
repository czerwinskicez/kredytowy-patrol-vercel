// src/components/NewsletterSection.tsx
'use client';

import React, { useState } from 'react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setMessage(null);
    
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Adres e-mail jest wymagany' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: 'Nieprawidłowy format adresu e-mail' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: 'info', text: 'Zapisywanie do newslettera...' });

    try {
      const clientMetadata = {
        userAgent: navigator.userAgent,
        referer: document.referrer || window.location.href,
        origin: window.location.origin,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
      };
      
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(),
          clientMetadata 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Dziękujemy! Zostałeś zapisany do newslettera.' });
        setEmail('');
        setFirstName('');
      } else {
        if (response.status === 409) {
          setMessage({ type: 'error', text: 'Ten adres e-mail jest już zapisany do newslettera.' });
        } else {
          setMessage({ type: 'error', text: data.error || 'Wystąpił błąd podczas zapisywania.' });
        }
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setMessage({ type: 'error', text: 'Wystąpił błąd połączenia. Spróbuj ponownie.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="bg-gray-100 rounded-xl p-8 md:p-12 max-w-4xl mx-auto shadow-sm text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Bądź na bieżąco z najlepszymi ofertami!
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Zapisz się do naszego newslettera, aby otrzymywać cotygodniowe podsumowanie 
            najkorzystniejszych kredytów i lokat prosto na Twoją skrzynkę mailową.
          </p>
          
          {message && (
            <div className={`mb-6 p-4 rounded-lg transition-all duration-300 ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : message.type === 'error'
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              <div className="flex items-center gap-2">
                {message.type === 'success' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {message.type === 'error' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                {message.type === 'info' && (
                  <svg className="w-5 h-5 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4z"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                )}
                <span>{message.text}</span>
              </div>
            </div>
          )}

          <form className="flex flex-col gap-4 justify-center max-w-lg mx-auto" onSubmit={handleSubmit} noValidate>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
              placeholder="Wpisz swoje imię (opcjonalnie)"
              aria-label="Imię"
              className="w-full px-5 py-2 rounded-lg border-2 border-gray-300 focus:border-[#0a472e] focus:ring-0 transition-colors bg-white"
              disabled={isSubmitting}
            />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="Wpisz swój adres e-mail"
              aria-label="Adres e-mail"
              className="w-full px-5 py-2 rounded-lg border-2 border-gray-300 focus:border-[#0a472e] focus:ring-0 transition-colors bg-white"
              required
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0a472e] hover:bg-[#0c5a3a] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 text-lg rounded-lg transition-colors"
              aria-label="Zapisz się do newslettera"
            >
              {isSubmitting ? 'Zapisywanie...' : 'Zapisz się'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
