import { defineField, defineType } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Shared by the navbar and footer.',
    }),
    defineField({ name: 'logoAlt', title: 'Logo alt text', type: 'string' }),
    defineField({
      name: 'navItems',
      title: 'Navbar items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string' },
            { name: 'href', type: 'string', description: 'Section anchor, e.g. #work' },
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    }),
    defineField({
      name: 'availabilityBadgeText',
      title: 'Availability badge text',
      type: 'string',
      description: 'Shown in the mobile nav drawer, e.g. "Available for New Projects"',
    }),
    defineField({
      name: 'navbarShowreelLabel',
      title: 'Mobile drawer: showreel button label',
      type: 'string',
      description: 'e.g. "Play Showreel"',
    }),
    defineField({
      name: 'navbarCtaLabel',
      title: 'Mobile drawer: contact button label',
      type: 'string',
      description: 'e.g. "LET\'S WORK TOGETHER"',
    }),
    defineField({
      name: 'footerMenuLinks',
      title: 'Footer menu links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string' },
            { name: 'href', type: 'string' },
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    }),
    defineField({
      name: 'footerLogoTagline',
      title: 'Footer: tagline under logo',
      type: 'string',
      description: 'e.g. "Abdulazees Olayinka Design"',
    }),
    defineField({ name: 'footerMenuColumnLabel', title: 'Footer: "Menu" column label', type: 'string' }),
    defineField({ name: 'footerContactColumnLabel', title: 'Footer: "Contact" column label', type: 'string' }),
    defineField({ name: 'footerSocialColumnLabel', title: 'Footer: "Social" column label', type: 'string' }),
    defineField({
      name: 'footerLegalLinks',
      title: 'Footer legal links',
      type: 'array',
      description: 'e.g. Privacy, Terms',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string' },
            { name: 'href', type: 'string' },
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              type: 'string',
              options: { list: ['Instagram', 'LinkedIn', 'Website'] },
            },
            { name: 'href', type: 'url' },
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    }),
    defineField({
      name: 'footerContactEmail',
      title: 'Footer contact email',
      type: 'string',
    }),
    defineField({
      name: 'projectContactEmail',
      title: 'Project inquiry email',
      type: 'string',
      description: 'Shown in the contact modal as the direct-email fallback.',
    }),
    defineField({ name: 'copyrightName', title: 'Copyright name', type: 'string' }),
  ],
  preview: {
    select: { media: 'logo' },
    prepare({ media }) {
      return { title: 'Site Settings', media }
    },
  },
})
