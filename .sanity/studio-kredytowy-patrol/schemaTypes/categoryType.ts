// Import necessary types from Sanity
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Kategoria',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nazwa kategorii',
      type: 'string',
      description: 'Główna nazwa kategorii, np. "Kredyty hipoteczne" lub "Oszczędzanie".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Link (slug)',
      type: 'slug',
      description: 'Unikalny identyfikator kategorii w linku URL. Kliknij "Generate".',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Obrazek wyróżniający',
      type: 'image',
      description: 'Obrazek, który będzie reprezentował tę kategorię na liście.',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Tekst alternatywny (ALT)',
          description: 'Krótki opis obrazka, ważny dla SEO.',
          validation: (Rule) => Rule.required(),
        }
      ]
    }),
    defineField({
      name: 'description',
      title: 'Opis kategorii',
      type: 'text',
      description: 'Opcjonalny, krótki opis, który może wyjaśniać, czego dotyczą artykuły w tej kategorii.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
