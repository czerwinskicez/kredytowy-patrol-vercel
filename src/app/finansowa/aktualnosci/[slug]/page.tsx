import { getPost } from "@/lib/sanity";
import { PostBody } from "@/components/PostBody";
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/lib/sanity';
import { SanityImage } from "@/types";
import { Metadata } from "next";
import Link from "next/link";
import { PageWrapper } from "@/components/PageWrapper";

const builder = imageUrlBuilder(client);
function urlFor(source: SanityImage) {
  return builder.image(source);
}

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      images: post.seo?.ogImage ? [urlFor(post.seo.ogImage).width(1200).height(630).url()] : (post.mainImage ? [urlFor(post.mainImage).width(1200).height(630).url()] : []),
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = params;
  const post = await getPost(slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <PageWrapper>
      <div className="bg-white py-12">
        <article className="container mx-auto px-4 lg:max-w-4xl">
          <header className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="flex items-center text-gray-600 text-sm space-x-4">
              <span>{new Date(post.publishedAt).toLocaleDateString('pl-PL')}</span>
              {post.author && <span>| {post.author.name}</span>}
              <div className="flex space-x-2">
                <span>| Kategorie:</span>
                {post.categories?.map((category) => (
                  <Link key={category._id} href={`/finansowa/kategorie/${category.slug.current}`} className="text-[#0a472e] hover:underline">
                    {category.title}
                  </Link>
                ))}
              </div>
            </div>
            {post.mainImage && (
              <img
                src={urlFor(post.mainImage).width(1200).height(630).url()}
                alt={post.title}
                className="w-full h-auto object-cover rounded-lg mt-6"
              />
            )}
          </header>
          <PostBody body={post.body} />
        </article>
      </div>
    </PageWrapper>
  );
}
