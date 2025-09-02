// Import necessary types from Sanity
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Artykuł',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tytuł wpisu',
      type: 'string',
      description: 'Główny tytuł artykułu, który będzie widoczny na stronie. Powinien być chwytliwy i zwięzły.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Link (slug)',
      type: 'slug',
      description: 'Automatycznie generowany, unikalny identyfikator wpisu w linku URL. Kliknij "Generate", aby go utworzyć na podstawie tytułu.',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'reference',
      description: 'Wybierz autora tego wpisu. Jeśli autora nie ma na liście, dodaj go w sekcji "Autorzy".',
      to: {type: 'author'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Główne zdjęcie wpisu',
      type: 'image',
      description: 'Główne zdjęcie artykułu wyświetlane na górze wpisu i na liście. Jeśli nie zostanie dodany dedykowany obraz OG w sekcji SEO, to zdjęcie będzie użyte do social media.',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Tekst alternatywny (ALT)',
          description: 'Krótki opis tego, co przedstawia obrazek. Kluczowe dla SEO i dostępności – nie pomijaj tego pola!',
          validation: (Rule) => Rule.required(),
        }
      ]
    }),
    defineField({
      name: 'categories',
      title: 'Kategorie',
      type: 'array',
      description: 'Przypisz wpis do jednej lub więcej kategorii. Ułatwia to użytkownikom nawigację.',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data publikacji',
      type: 'datetime',
      description: 'Ustaw datę i godzinę publikacji. Wpisy będą sortowane na stronie według tej daty.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Zajawka (excerpt)',
      type: 'text',
      rows: 4,
      description: 'Krótkie podsumowanie artykułu (1-2 zdania), które zachęci do przeczytania całości. Wyświetlane na listach wpisów.',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'body',
      title: 'Treść artykułu',
      type: 'array',
      description: 'Główna zawartość Twojego wpisu. Możesz tu formatować tekst, dodawać nagłówki, listy i zdjęcia.',
      of: [
        {type: 'block'},
        {
          type: 'image', 
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              title: 'Tekst alternatywny (ALT)',
              type: 'string',
              description: 'Krótki opis obrazka. Bardzo ważne dla SEO!',
              validation: (Rule) => Rule.required(),
            },
          ]
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'Ustawienia SEO (pozycjonowanie w Google)',
      type: 'object',
      description: 'Ustawienia wpływające na wyświetlanie artykułu w wynikach wyszukiwania Google i social media.',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Tytuł dla Google (Meta Title)',
          type: 'string',
          description: 'Ten tytuł zobaczą użytkownicy w Google. Powinien mieć ok. 60 znaków i zawierać najważniejsze słowo kluczowe.',
          validation: (Rule) => Rule.max(60).warning('Tytuł jest za długi! Staraj się nie przekraczać 60 znaków.'),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Opis dla Google (Meta Description)',
          type: 'text',
          rows: 3,
          description: 'Ten opis pojawi się pod tytułem w Google. Ma zachęcić do kliknięcia. Optymalna długość to ok. 155 znaków.',
          validation: (Rule) => Rule.max(160).warning('Opis jest za długi! Staraj się nie przekraczać 160 znaków.'),
        }),

        defineField({
          name: 'ogImage',
          title: 'Obrazek do social media (Open Graph)',
          type: 'image',
          description: 'Wymiary: 1200 × 630 pikseli (proporcja 1.91:1). Obraz wyświetlany przy udostępnianiu artykułu na social media. Jeśli nie zostanie dodany, użyte będzie główne zdjęcie wpisu.',
          options: {
            hotspot: true,
            accept: 'image/*'
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Tekst alternatywny dla OG Image',
              description: 'Krótki opis obrazka dla social media (opcjonalne, ale zalecane dla dostępności)',
            }
          ]
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `przez ${author}`}
    },
  },
})
