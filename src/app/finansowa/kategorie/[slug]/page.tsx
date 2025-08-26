import { getPostsByCategory, getCategories } from "@/lib/sanity";
import { PostCard } from "@/components/PostCard";
import { PageWrapper } from "@/components/PageWrapper";

export default async function KategoriaSlugPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const categories = await getCategories();
  const category = categories.find(cat => cat.slug && cat.slug.current === slug);
  
  if (!category) {
    // Można tu zwrócić 404
    return <div>Kategoria nie znaleziona</div>;
  }

  const posts = await getPostsByCategory(category._id);

  return (
    <PageWrapper>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 lg:max-w-6xl">
          <header className="mb-12 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">Kategoria: {category.title}</h1>
            {category.description && <p className="mt-4 text-lg text-gray-600">{category.description}</p>}
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
