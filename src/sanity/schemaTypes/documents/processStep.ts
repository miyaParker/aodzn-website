import { defineField, defineType } from 'sanity'

export const processStepType = defineType({
  name: 'processStep',
  title: 'Process Step',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stepNumber',
      title: 'Step number',
      type: 'string',
      description: 'Display value, e.g. "01"',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({
      name: 'phase',
      type: 'string',
      description: 'Short tag shown in the hover preview, e.g. "DEFINE"',
    }),
    defineField({
      name: 'gradient',
      type: 'string',
      description: 'Raw CSS background value (gradient) for the hover preview.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'phase', order: 'order' },
    prepare({ title, subtitle, order }) {
      return { title: `${order ?? '–'} · ${title}`, subtitle }
    },
  },
})
