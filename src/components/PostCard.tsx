import Link from 'next/link';
import Image from 'next/image';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/lib/sanity';
import type { Post } from '@/types';

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group md:flex">
      {post.mainImage && (
        <div className="relative h-48 w-full md:w-1/3 md:h-auto">
          <Link href={`/finansowa/aktualnosci/${post.slug.current}`} className="block h-full">
            <Image
              src={urlFor(post.mainImage).width(400).height(400).url()}
              alt={`Obrazek wyróżniający dla posta ${post.title}`}
              fill
              style={{objectFit: "cover"}}
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>
      )}
      <div className="p-6 md:w-2/3 flex flex-col">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 group-hover:text-[#0a472e] transition-colors duration-300">
            <Link href={`/finansowa/aktualnosci/${post.slug.current}`}>{post.title}</Link>
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {new Date(post.publishedAt).toLocaleDateString('pl-PL')}
            {post.author && ` by ${post.author.name}`}
          </p>
          <p className="mt-4 text-gray-700 flex-grow">{post.excerpt}</p>
        </div>
        <div className="mt-6">
          <Link href={`/finansowa/aktualnosci/${post.slug.current}`} className="inline-block bg-[#f0c14b] text-[#0a472e] font-bold py-2 px-6 rounded-lg hover:bg-[#0a472e] hover:text-white transition-colors duration-300">
            Czytaj dalej
          </Link>
        </div>
      </div>
    </article>
  );
}
