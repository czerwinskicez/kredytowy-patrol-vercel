'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    consent: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Clear message when user starts typing (improve UX)
    if (message) {
      setMessage(null);
    }
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setMessage(null);
    
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setMessage({ type: 'error', text: 'Proszę wypełnić wszystkie wymagane pola.' });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'Nieprawidłowy format adresu e-mail.' });
      return;
    }

    // Validate consent
    if (!formData.consent) {
      setMessage({ type: 'error', text: 'Wymagana jest zgoda na przetwarzanie danych osobowych.' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: 'info', text: 'Wysyłanie wiadomości...' });

    try {
      const clientMetadata = {
        userAgent: navigator.userAgent,
        referer: document.referrer || window.location.href,
        origin: window.location.origin,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          consent: formData.consent,
          clientMetadata,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Dziękujemy! Twoja wiadomość została wysłana.' });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          consent: false,
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Wystąpił błąd podczas wysyłania wiadomości.' });
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setMessage({ type: 'error', text: 'Wystąpił błąd połączenia. Spróbuj ponownie.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-16">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Napisz do nas</h2>
        
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

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Imię i nazwisko <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Jan Kowalski"
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#f0c14b] focus:border-[#0a472e] transition-all duration-200 ${
                  isSubmitting ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                }`}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adres e-mail <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="jan.kowalski@example.com"
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#f0c14b] focus:border-[#0a472e] transition-all duration-200 ${
                  isSubmitting ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                }`}
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Numer telefonu (opcjonalnie)
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="123 456 789"
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#f0c14b] focus:border-[#0a472e] transition-all duration-200 ${
                  isSubmitting ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                }`}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Temat <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="subject"
                id="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Temat wiadomości"
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#f0c14b] focus:border-[#0a472e] transition-all duration-200 ${
                  isSubmitting ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                }`}
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Wiadomość <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              name="message"
              id="message"
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Twoja wiadomość..."
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#f0c14b] focus:border-[#0a472e] transition-all duration-200 ${
                isSubmitting ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
              }`}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex items-start gap-3">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              checked={formData.consent}
              onChange={handleInputChange}
              required
              className="mt-1 h-4 w-4 border-gray-300 rounded text-[#0a472e] focus:ring-[#f0c14b]"
              aria-required="true"
              disabled={isSubmitting}
            />
            <label htmlFor="consent" className="text-sm text-gray-700">
              Wyrażam zgodę na przetwarzanie moich danych osobowych w celu kontaktu. Zapoznałem/am się z
              {' '}<Link href="/polityka-prywatnosci" className="text-[#0a472e] underline hover:text-[#053320]">Polityką prywatności</Link>.
              <span className="text-red-500"> *</span>
            </label>
          </div>
          
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0a472e] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#0c5a3a] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
              aria-label="Wyślij wiadomość"
            >
              {isSubmitting ? 'Wysyłanie...' : 'Wyślij wiadomość'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
