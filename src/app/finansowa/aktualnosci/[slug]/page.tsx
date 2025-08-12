import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPost } from "@/lib/sanity";
import { PostBody } from "@/components/PostBody";
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/lib/sanity';
import { SanityImage } from "@/types";
import { Metadata } from "next";

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
    <div>
      <Header />
      <main className="bg-white py-12">
        <article className="container mx-auto px-4 lg:max-w-4xl">
          <header className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="text-gray-600 text-sm">
              <span>{new Date(post.publishedAt).toLocaleDateString('pl-PL')}</span> / <span>by {post.author.name}</span>
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
      </main>
      <Footer />
    </div>
  );
}
