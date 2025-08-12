import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCategories } from "@/lib/sanity";
import Link from "next/link";
import Image from "next/image";
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/lib/sanity';
import type { SanityImage } from "@/types";

const builder = imageUrlBuilder(client);
function urlFor(source: SanityImage) {
  return builder.image(source);
}

export default async function KategoriePage() {
  const categories = await getCategories();

  return (
    <div>
      <Header />
      <main className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 lg:max-w-6xl">
          <header className="mb-12 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">Kategorie Artykułów</h1>
            <p className="mt-4 text-lg text-gray-600">Przeglądaj wpisy według tematyki, która Cię interesuje.</p>
          </header>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              category.slug && (
                <Link href={`/finansowa/kategorie/${category.slug.current}`} key={category._id} className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                  {category.image && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={urlFor(category.image).width(400).height(300).url()}
                        alt={`Obrazek dla kategorii ${category.title}`}
                        fill
                        style={{objectFit: "cover"}}
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 group-hover:text-[#0a472e] transition-colors duration-300">{category.title}</h2>
                    {category.description && (
                      <p className="mt-2 text-gray-600">{category.description}</p>
                    )}
                  </div>
                </Link>
              )
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
