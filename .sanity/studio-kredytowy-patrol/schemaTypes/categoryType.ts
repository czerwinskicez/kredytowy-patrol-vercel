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
