import { defineField, defineType } from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'overview', title: 'Overview', default: true },
    { name: 'caseStudy', title: 'Case Study' },
    { name: 'media', title: 'Media & Style' },
  ],
  fields: [
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first in the homepage scroller and Works grid.',
      validation: (rule) => rule.required(),
      group: 'overview',
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'overview',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
      description: 'Used in the case study URL: /works/{slug}',
      group: 'overview',
    }),
    defineField({ name: 'subtitle', type: 'text', rows: 2, group: 'overview' }),
    defineField({
      name: 'category',
      type: 'string',
      description: 'Small eyebrow label, e.g. "FEATURED PROJECT" or "FINTECH & LIQUIDITY"',
      group: 'overview',
    }),
    defineField({
      name: 'type',
      type: 'string',
      options: { list: ['Branding', 'Product Design'] },
      validation: (rule) => rule.required(),
      group: 'overview',
    }),
    defineField({ name: 'domain', type: 'string', group: 'overview' }),
    defineField({ name: 'description', type: 'text', rows: 3, group: 'overview' }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      group: 'overview',
    }),
    defineField({ name: 'client', type: 'string', group: 'overview' }),
    defineField({ name: 'year', type: 'string', group: 'overview' }),
    defineField({ name: 'role', type: 'string', group: 'overview' }),
    defineField({
      name: 'metrics',
      type: 'array',
      group: 'overview',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string' },
            { name: 'value', type: 'string' },
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
    }),
    defineField({
      name: 'screens',
      title: 'Screen previews',
      type: 'array',
      group: 'overview',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string' },
            { name: 'subtitle', type: 'string' },
            {
              name: 'type',
              type: 'string',
              options: { list: ['wallet', 'ride', 'analytics', 'ai-editor'] },
            },
          ],
          preview: { select: { title: 'title', subtitle: 'subtitle' } },
        },
      ],
    }),
    defineField({
      name: 'image',
      title: 'Card image',
      type: 'image',
      options: { hotspot: true },
      group: 'media',
    }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', group: 'media' }),
    defineField({ name: 'primaryColor', type: 'string', group: 'media' }),
    defineField({ name: 'accentColor', type: 'string', group: 'media' }),
    defineField({
      name: 'mockupType',
      type: 'string',
      options: { list: ['twin-mobile', 'desktop-tablet', '3d-card'] },
      group: 'media',
    }),
    defineField({
      name: 'caseStudy',
      type: 'object',
      group: 'caseStudy',
      fields: [
        defineField({ name: 'overview', type: 'text', rows: 3 }),
        defineField({ name: 'challengeHeadline', type: 'string' }),
        defineField({ name: 'challenge', type: 'text', rows: 3 }),
        defineField({ name: 'solutionHeadline', type: 'string' }),
        defineField({ name: 'solution', type: 'text', rows: 3 }),
        defineField({ name: 'quote', type: 'text', rows: 2 }),
        defineField({ name: 'principle', type: 'string' }),
        defineField({ name: 'growthHeadline', type: 'string' }),
        defineField({ name: 'growth', type: 'text', rows: 3 }),
        defineField({ name: 'outcomes', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'features', type: 'array', of: [{ type: 'string' }] }),
        defineField({
          name: 'gallery',
          type: 'array',
          of: [{ type: 'image', options: { hotspot: true } }],
          description: 'Images cycled through the case study gallery sections.',
        }),
        defineField({ name: 'video', type: 'file', options: { accept: 'video/*' } }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'subtitle', order: 'order', media: 'image' },
    prepare({ title, subtitle, order, media }) {
      return { title: `${order ?? '–'} · ${title}`, subtitle, media }
    },
  },
})
