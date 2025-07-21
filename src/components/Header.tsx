"use client";
import React, { useState } from 'react';

const dropdowns = [
  {
    label: 'Kredyty',
    items: ['Kredyt hipoteczny', 'Kredyt gotówkowy', 'Kredyt samochodowy'],
  },
  {
    label: 'Oszczędności',
    items: ['Lokaty', 'Konta oszczędnościowe', 'Obligacje'],
  },
  {
    label: 'FinanSowa',
    items: ['Blog finansowy', 'Porady', 'Aktualności'],
    isBlog: true,
  },
];

export function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Obsługa najechania i opuszczenia
  const handleMouseEnter = (label: string) => setOpenDropdown(label);
  const handleMouseLeave = () => setOpenDropdown(null);
  // Obsługa kliknięcia (mobile)
  const handleToggle = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  return <header className="bg-[#0a472e] text-white py-4 px-4 relative">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo_male.png" alt="Logo" className="h-12 mr-3" />
            <span className="text-lg font-semibold">
              <span className="text-white">Kredytowy</span>
              <span className="text-[#f0c14b]"> Patrol</span>
            </span>
          </div>
          <nav className="hidden md:flex space-x-6 text-sm">
            <a href="#" className="text-[#f0c14b] hover:text-white">
              Strona Główna
            </a>
            {dropdowns.map((dropdown) => (
              <div
                key={dropdown.label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(dropdown.label)}
                onMouseLeave={handleMouseLeave}
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
                  <div className="absolute left-0 mt-2 w-48 bg-white text-[#0a472e] rounded-md shadow-lg z-20 animate-fadeIn">
                    <ul className="py-2">
                      {dropdown.items.map((item, idx) => (
                        <li key={idx}>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-[#f0c14b] hover:text-[#0a472e] transition-colors duration-150"
                          >
                            {item}
                          </a>
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
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
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
        <div className="md:hidden absolute top-full left-0 w-full bg-[#053320] text-white py-4 px-4 animate-fadeIn z-50">
          <nav className="flex flex-col space-y-4 text-sm">
            <a href="#" className="text-[#f0c14b] hover:text-white">
              Strona Główna
            </a>
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
                  <div className="mt-2 w-full bg-white text-[#0a472e] rounded-md shadow-lg z-20 animate-fadeIn">
                    <ul className="py-2">
                      {dropdown.items.map((item, idx) => (
                        <li key={idx}>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-[#f0c14b] hover:text-[#0a472e] transition-colors duration-150"
                          >
                            {item}
                          </a>
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