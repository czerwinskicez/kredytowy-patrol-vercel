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
      description: 'Zdjęcie, które będzie wyświetlane na górze artykułu i na liście wpisów. Najważniejszy element wizualny.',
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
      name: 'status',
      title: 'Status publikacji',
      type: 'string',
      description: 'Wybierz "Szkic", jeśli wpis jest jeszcze w trakcie tworzenia. Zmień na "Opublikowany", aby pojawił się na stronie.',
      options: {
        list: [
          {title: 'Szkic', value: 'draft'},
          {title: 'Opublikowany', value: 'published'},
        ],
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'seo',
      title: 'Ustawienia SEO (pozycjonowanie w Google)',
      type: 'object',
      description: 'Te pola mają ogromny wpływ na to, jak Twój artykuł będzie wyglądał w wynikach wyszukiwania Google. Wypełnij je starannie!',
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
          description: 'Specjalny obrazek, który pojawi się, gdy ktoś udostępni link do tego artykułu na Facebooku, Twitterze itp. Jeśli go nie ustawisz, użyte zostanie główne zdjęcie wpisu.',
          options: {hotspot: true},
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
