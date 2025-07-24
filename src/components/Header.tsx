"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const dropdowns = [
  {
    label: 'Kredyty',
    items: [
      { name: 'Kredyt Gotówkowy', href: '/kredyty/gotowkowy' },
      { name: 'Kredyt Hipoteczny', href: '/kredyty/hipoteczny' },
      { name: 'Kredyt Konsolidacyjny', href: '/kredyty/konsolidacyjny' },
    ],
  },
  {
    label: 'Oszczędności',
    items: [
      { name: 'Lokaty', href: '#' },
      { name: 'Konta oszczędnościowe', href: '#' },
      { name: 'Obligacje', href: '#' }
    ],
  },
  {
    label: 'FinanSowa',
    items: [
      { name: 'Blog finansowy', href: '#' },
      { name: 'Porady', href: '#' },
      { name: 'Aktualności', href: '#' },
    ],
    isBlog: true,
  },
];

export function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = (label: string) => {
    if (openDropdown === label) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(label);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpenDropdown(null);
    }
    
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (
      mobileMenuButton &&
      !mobileMenuButton.contains(event.target as Node) &&
      mobileMenu &&
      !mobileMenu.contains(event.target as Node)
    ) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return <header className="bg-[#053320] text-white py-4 px-4 relative z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo_male.png" alt="Logo" className="h-12 mr-3" />
            <span className="text-lg font-semibold">
              <span className="text-white">Kredytowy</span>
              <span className="text-[#f0c14b]"> Patrol</span>
            </span>
          </Link>
          <nav className="hidden md:flex space-x-6 text-sm">
            <Link href="/" className="text-[#f0c14b] hover:text-white">
              Strona Główna
            </Link>
            {dropdowns.map((dropdown) => (
              <div
                key={dropdown.label}
                className="relative"
                ref={openDropdown === dropdown.label ? dropdownRef : null}
              >
                <button
                  className="flex items-center hover:text-[#f0c14b] focus:outline-none"
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === dropdown.label}
                  onClick={() => handleToggle(dropdown.label)}
                >
                  {dropdown.label}
                  <svg
                    className={`ml-1 w-4 h-4 transition-transform duration-200 ${openDropdown === dropdown.label ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {/* Dropdown menu */}
                {openDropdown === dropdown.label && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-white text-[#0a472e] rounded-md shadow-lg z-20 animate-fadeIn">
                    <ul className="py-2">
                      {dropdown.items.map((item, idx) => (
                        <li key={idx}>
                          <Link
                            href={item.href}
                            className="block px-4 py-2 hover:bg-[#f0c14b] hover:text-[#0a472e] transition-colors duration-150"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            <a href="#" className="hover:text-[#f0c14b]">
              Polityka prywatności
            </a>
            <a href="#" className="hover:text-[#f0c14b]">
              Kontakt
            </a>
          </nav>
          <button 
            id="mobile-menu-button"
            className="md:hidden" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden absolute top-full left-0 w-full bg-[#053320] text-white py-4 px-4 animate-fadeIn"
        >
          <nav className="flex flex-col space-y-4 text-sm">
            <Link href="/" className="text-[#f0c14b] hover:text-white">
              Strona Główna
            </Link>
            {dropdowns.map((dropdown) => (
              <div key={dropdown.label} className="relative">
                <button
                  className="flex items-center justify-between w-full hover:text-[#f0c14b] focus:outline-none"
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === dropdown.label}
                  onClick={() => handleToggle(dropdown.label)}
                >
                  <span>{dropdown.label}</span>
                  <svg
                    className={`ml-1 w-4 h-4 transition-transform duration-200 ${openDropdown === dropdown.label ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === dropdown.label && (
                  <div 
                    className="mt-2 w-full bg-white text-[#0a472e] rounded-md shadow-lg z-20 animate-fadeIn"
                    ref={dropdownRef}
                  >
                    <ul className="py-2">
                      {dropdown.items.map((item, idx) => (
                        <li key={idx}>
                          <Link
                            href={item.href}
                            className="block px-4 py-2 hover:bg-[#f0c14b] hover:text-[#0a472e] transition-colors duration-150"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            <a href="#" className="hover:text-[#f0c14b]">
              Polityka prywatności
            </a>
            <a href="#" className="hover:text-[#f0c14b]">
              Kontakt
            </a>
          </nav>
        </div>
      )}
    </header>;
}