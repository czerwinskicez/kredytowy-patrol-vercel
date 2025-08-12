// Import necessary types from Sanity
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'author',
  title: 'Autor',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Imię i nazwisko (lub pseudonim)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Link (slug)',
      type: 'slug',
      description: 'Unikalny identyfikator autora w linku URL. Kliknij "Generate".',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Zdjęcie (awatar)',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Tekst alternatywny (ALT)',
          description: 'np. "Zdjęcie profilowe Jan Kowalski". Ważne dla SEO.',
          validation: (Rule) => Rule.required(),
        }
      ]
    }),
    defineField({
      name: 'bio',
      title: 'Notka biograficzna',
      description: 'Krótki opis autora, który może pojawić się na stronie pod jego wpisami.',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})
