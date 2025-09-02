import { getPosts } from "@/lib/sanity";
import { PostCard } from "@/components/PostCard";
import { PageWrapper } from "@/components/PageWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FinanSowa - Aktualności finansowe",
  description: "Najnowsze wpisy i analizy ze świata finansów. Sprawdź aktualne informacje o kredytach, lokatach, kontach oszczędnościowych i rynku finansowym w Polsce.",
  openGraph: {
    title: "FinanSowa - Aktualności finansowe | Kredytowy Patrol",
    description: "Najnowsze wpisy i analizy ze świata finansów. Sprawdź aktualne informacje o kredytach, lokatach, kontach oszczędnościowych i rynku finansowym w Polsce.",
    type: "website",
    url: "https://www.kredytowypatrol.pl/finansowa/aktualnosci",
    images: [
      {
        url: "https://www.kredytowypatrol.pl/og-image.png",
        width: 1200,
        height: 630,
        alt: "FinanSowa - Aktualności finansowe | Kredytowy Patrol",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FinanSowa - Aktualności finansowe | Kredytowy Patrol",
    description: "Najnowsze wpisy i analizy ze świata finansów. Sprawdź aktualne informacje o kredytach, lokatach, kontach oszczędnościowych i rynku finansowym w Polsce.",
    images: ["https://www.kredytowypatrol.pl/og-image.png"],
  },
  alternates: {
    canonical: "https://www.kredytowypatrol.pl/finansowa/aktualnosci",
  },
};

export default async function AktualnosciPage() {
  const posts = await getPosts();

  return (
    <PageWrapper>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 lg:max-w-6xl">
          <header className="mb-12 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">FinanSowa - Aktualności</h1>
            <p className="mt-4 text-lg text-gray-600">Najnowsze wpisy i analizy ze świata finansów.</p>
          </header>

          <div className="space-y-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
