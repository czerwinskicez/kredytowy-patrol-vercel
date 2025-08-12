import { createClient } from 'next-sanity'
import type { Post, Category } from '@/types'
import groq from 'groq'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-06-10'
const token = process.env.SANITY_API_READ_TOKEN

if (!projectId || !dataset) {
  throw new Error('Missing Sanity project ID or dataset. Check your .env.local file.')
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  token,
  // perspektiv: 'published', // Use 'published' to ensure only published documents are returned
})

export async function getPosts(): Promise<Post[]> {
  // UWAGA: Tymczasowo dodano status 'draft', aby ułatwić dewelopment.
  // Docelowo zapytanie powinno pobierać tylko status 'published'.
  const query = groq`*[_type == "post" && (status == 'published' || status == 'draft')] | order(publishedAt desc) {
    _id,
    title,
    slug,
    author->{name, slug, image},
    mainImage,
    categories[]->{title},
    publishedAt,
    excerpt,
    body,
  }`;
  return client.fetch(query);
}

export async function getCategories(): Promise<Category[]> {
  const query = groq`*[_type == "category"] {
    _id,
    title,
    description
  }`;
  return client.fetch(query);
}

export async function getPostsByCategory(categoryId: string): Promise<Post[]> {
  const query = groq`*[_type == "post" && status == 'published' && references($categoryId)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    author->{name, slug, image},
    mainImage,
    categories[]->{title},
    publishedAt,
    excerpt,
  }`;
  return client.fetch(query, { categoryId });
}

export async function getPost(slug: string): Promise<Post> {
  const query = groq`*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    author->{name, slug, image},
    mainImage,
    categories[]->{title},
    publishedAt,
    excerpt,
    body,
    seo
  }`;
  return client.fetch(query, { slug });
}
