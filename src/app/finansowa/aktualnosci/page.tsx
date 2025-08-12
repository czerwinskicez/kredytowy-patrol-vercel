import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPosts } from "@/lib/sanity";
import { PostCard } from "@/components/PostCard";

export default async function AktualnosciPage() {
  const posts = await getPosts();

  return (
    <div>
      <Header />
      <main className="bg-gray-50 py-12">
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
      </main>
      <Footer />
    </div>
  );
}
