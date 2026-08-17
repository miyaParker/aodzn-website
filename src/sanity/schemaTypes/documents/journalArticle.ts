import { defineField, defineType } from 'sanity'

export const journalArticleType = defineType({
  name: 'journalArticle',
  title: 'Journal Article',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'date', type: 'date', validation: (rule) => rule.required() }),
    defineField({
      name: 'previewTitle',
      type: 'string',
      description: 'Short title shown in the hover preview card.',
    }),
    defineField({
      name: 'previewSubtitle',
      type: 'string',
      description: 'One-line subtitle shown under the preview title.',
    }),
    defineField({
      name: 'gradient',
      type: 'string',
      description: 'Raw CSS background value (gradient) for the preview card.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'previewSubtitle', order: 'order' },
    prepare({ title, subtitle, order }) {
      return { title: `${order ?? '–'} · ${title}`, subtitle }
    },
  },
})
