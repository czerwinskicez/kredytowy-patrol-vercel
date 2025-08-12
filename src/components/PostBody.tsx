'use client'

import { PortableText } from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import { client } from '@/lib/sanity'
import { SanityImage } from '@/types'

const builder = imageUrlBuilder(client)

function urlFor(source: SanityImage) {
  return builder.image(source)
}

const components = {
  types: {
    image: ({ value }: { value: SanityImage }) => {
      return (
        <img
          src={urlFor(value).width(800).url()}
          alt={value.alt || ' '}
          loading="lazy"
          className="my-8 rounded-lg"
        />
      );
    },
  },
  block: {
    h1: ({ children }: any) => <h1 className="text-4xl font-bold my-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-3xl font-bold my-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl font-bold my-4">{children}</h3>,
    blockquote: ({ children }: any) => <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic">{children}</blockquote>,
  },
};

export function PostBody({ body }: { body: any[] }) {
  return (
    <div className="prose prose-lg max-w-none">
      <PortableText value={body} components={components} />
    </div>
  )
}
