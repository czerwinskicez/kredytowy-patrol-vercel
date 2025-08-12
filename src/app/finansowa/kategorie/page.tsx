import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCategories } from "@/lib/sanity";
import Link from "next/link";

export default async function KategoriePage() {
  const categories = await getCategories();

  return (
    <div>
      <Header />
      <main className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 lg:max-w-6xl">
          <header className="mb-12 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">Kategorie Wpisów</h1>
            <p className="mt-4 text-lg text-gray-600">Przeglądaj wpisy według tematyki, która Cię interesuje.</p>
          </header>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link href={`/finansowa/kategorie/${category.title.toLowerCase().replace(/ /g, '-')}`} key={category.title}>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                  <h2 className="text-2xl font-bold text-gray-800">{category.title}</h2>
                  {category.description && (
                    <p className="mt-2 text-gray-600">{category.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
