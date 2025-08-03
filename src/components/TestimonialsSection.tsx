import React from 'react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  savings: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Anna Kowalska",
    location: "Warszawa",
    rating: 5,
    comment: "Dzięki Kredytowemu Patrolowi znalazłam kredyt gotówkowy o 2% niższym oprocentowaniu niż w moim banku. Oszczędziłam ponad 3000 zł!",
    savings: "Oszczędność: 3000 zł"
  },
  {
    id: 2,
    name: "Piotr Nowak",
    location: "Kraków",
    rating: 5,
    comment: "Porównanie kredytów hipotecznych zajęło mi 5 minut zamiast tygodni szukania. Polecam każdemu!",
    savings: "Oszczędność: 15000 zł"
  },
  {
    id: 3,
    name: "Maria Wiśniewska",
    location: "Poznań",
    rating: 5,
    comment: "Kredytowy Patrol pomógł mi znaleźć najlepszą ofertę karty kredytowej. Teraz płacę mniejsze odsetki.",
    savings: "Oszczędność: 800 zł/rok"
  },
  {
    id: 4,
    name: "Tomasz Lewandowski",
    location: "Gdańsk",
    rating: 5,
    comment: "Refinansowanie kredytu przez Kredytowy Patrol to była najlepsza decyzja finansowa w tym roku.",
    savings: "Oszczędność: 5000 zł"
  },
  {
    id: 5,
    name: "Katarzyna Zielińska",
    location: "Wrocław",
    rating: 5,
    comment: "Szybko, profesjonalnie i konkretnie. Znaleźli mi kredyt na samochód z najlepszymi warunkami.",
    savings: "Oszczędność: 2000 zł"
  },
  {
    id: 6,
    name: "Marek Dąbrowski",
    location: "Łódź",
    rating: 5,
    comment: "Kredytowy Patrol to prawdziwy ekspert! Pomógł mi zaoszczędzić na kredycie konsolidacyjnym.",
    savings: "Oszczędność: 4000 zł"
  }
];

export function TestimonialsSection() {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4 lg:max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Co mówią o nas zadowoleni użytkownicy
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tysiące Polaków już oszczędziły dzięki naszemu porównaniu. 
            Dołącz do grona zadowolonych klientów!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              <p className="text-gray-700 mb-4 italic">
                "{testimonial.comment}"
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">
                    {testimonial.savings}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 