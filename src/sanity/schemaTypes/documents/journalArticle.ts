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
    defineField({
      name: 'category',
      type: 'string',
      description: 'Free-text tag shown on the article card and detail page, e.g. "Process".',
    }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Short keyword pills shown on the article card, e.g. "Systems", "Figma".',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
      description: 'Shown on the article card and as the detail page banner. Falls back to the gradient above when empty.',
    }),
    defineField({
      name: 'body',
      type: 'text',
      rows: 10,
      description:
        'Article body. Separate paragraphs with a blank line. Prefix a paragraph with "## " to render it as a section heading, or "> " to render it as a pull quote (optionally add " ~ Attribution" at the end — not an em dash, since those show up naturally inside quotes). Wrap words in ==double equals== to highlight them.',
    }),
    defineField({
      name: 'gallery',
      title: 'Body gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Optional pair of images dropped partway through the article body.',
      validation: (rule) => rule.max(2),
    }),
    defineField({
      name: 'galleryCaption',
      title: 'Gallery caption',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'previewSubtitle', order: 'order' },
    prepare({ title, subtitle, order }) {
      return { title: `${order ?? '–'} · ${title}`, subtitle }
    },
  },
})
