import { defineField, defineType } from 'sanity'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'loader', title: 'Loader' },
    { name: 'hero', title: 'Hero', default: true },
    { name: 'processTimeline', title: 'Process Timeline' },
    { name: 'process', title: 'Process Section' },
    { name: 'portfolio', title: 'Portfolio Section' },
    { name: 'journal', title: 'Journal Section' },
    { name: 'footerCta', title: 'Footer CTA' },
    { name: 'contactModal', title: 'Contact Modal' },
    { name: 'showreelModal', title: 'Showreel Modal' },
  ],
  fields: [
    defineField({
      name: 'loader',
      type: 'object',
      group: 'loader',
      fields: [
        {
          name: 'cyclingWords',
          title: 'Cycling headline words',
          type: 'array',
          of: [{ type: 'string' }],
          description:
            'Warning: cycles through these on a fixed timer during the load screen — keep word lengths roughly similar so the layout doesn\'t jump.',
        },
        {
          name: 'backgroundWords',
          title: 'Scrolling background words',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Tiled marquee texture behind the loader. Any number of words works.',
        },
      ],
    }),
    defineField({
      name: 'hero',
      type: 'object',
      group: 'hero',
      fields: [
        {
          name: 'topWordLeft',
          title: 'Top-left word',
          type: 'string',
          description:
            'Warning: this word and "Top-right word" split around the showreel video card — changing length changes how the entrance animation balances. e.g. "DE"',
        },
        {
          name: 'topWordRight',
          title: 'Top-right word',
          type: 'string',
          description: 'e.g. "SIGN" — together with the top-left word this should read as one word (e.g. DE + SIGN = DESIGN).',
        },
        {
          name: 'bottomWord',
          title: 'Bottom word',
          type: 'string',
          description: 'Warning: sits alone on its own row opposite the featured video card. e.g. "INTENTIONALLY"',
        },
        { name: 'tagline', type: 'text', rows: 2 },
        { name: 'ctaLabel', type: 'string', description: 'e.g. "EXPLORE MY WORK"' },
        { name: 'video', title: 'Background video', type: 'file', options: { accept: 'video/*' } },
        {
          name: 'sticker',
          title: 'Sticker (overlaps bottom word)',
          type: 'image',
        },
      ],
    }),
    defineField({
      name: 'processTimeline',
      title: 'Process Timeline (first "FROM IMAGINATION..." section)',
      type: 'object',
      group: 'processTimeline',
      fields: [
        {
          name: 'headingLines',
          title: 'Heading lines',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Warning: each line animates in as its own row — expects exactly 3 lines.',
        },
        {
          name: 'illustrations',
          title: 'Illustrations',
          type: 'array',
          of: [{ type: 'image' }],
        },
      ],
    }),
    defineField({
      name: 'processSection',
      type: 'object',
      group: 'process',
      fields: [
        { name: 'eyebrowLabel', type: 'string', description: 'e.g. "My Process"' },
        { name: 'heading', type: 'string', description: 'e.g. "Five steps, and you decide at the third."' },
      ],
    }),
    defineField({
      name: 'portfolioSection',
      type: 'object',
      group: 'portfolio',
      fields: [
        { name: 'eyebrowLabel', type: 'string', description: 'e.g. "Featured Works"' },
        { name: 'introText', type: 'text', rows: 2 },
        {
          name: 'viewAllLabel',
          type: 'string',
          description: 'Mobile-only button, e.g. "View All Works"',
        },
        {
          name: 'caseStudyCtaLabel',
          type: 'string',
          description: 'Hover cursor / link label, e.g. "VIEW CASE STUDY"',
        },
        {
          name: 'clientLabel',
          type: 'string',
          description: 'Small label above the client name, e.g. "Client"',
        },
      ],
    }),
    defineField({
      name: 'journalSection',
      type: 'object',
      group: 'journal',
      fields: [
        { name: 'eyebrowLabel', type: 'string', description: 'e.g. "Latest Writing"' },
        { name: 'sectionTitle', type: 'string', description: 'e.g. "Journal"' },
      ],
    }),
    defineField({
      name: 'footerCta',
      type: 'object',
      group: 'footerCta',
      fields: [
        { name: 'heading', type: 'string', description: 'e.g. "LET\'S BUILD SOMETHING"' },
        { name: 'headingHighlight', type: 'string', description: 'e.g. "MEANINGFUL."' },
        { name: 'subtext', type: 'text', rows: 2 },
        { name: 'ctaLabel', type: 'string', description: 'e.g. "LET\'S CONNECT"' },
      ],
    }),
    defineField({
      name: 'contactModal',
      type: 'object',
      group: 'contactModal',
      fields: [
        { name: 'eyebrow', type: 'string', description: 'e.g. "START A CONVERSATION"' },
        { name: 'heading', type: 'string', description: 'e.g. "LET\'S DISCUSS YOUR PROJECT"' },
        { name: 'introText', type: 'text', rows: 2 },
        {
          name: 'projectTypes',
          title: 'Project type options',
          type: 'array',
          of: [{ type: 'string' }],
        },
        { name: 'budgets', title: 'Budget range options', type: 'array', of: [{ type: 'string' }] },
        { name: 'nameLabel', type: 'string', description: 'e.g. "Your Name"' },
        { name: 'namePlaceholder', type: 'string', description: 'e.g. "e.g. Alex Morgan"' },
        { name: 'emailLabel', type: 'string', description: 'e.g. "Your Email"' },
        { name: 'emailPlaceholder', type: 'string', description: 'e.g. "alex@company.com"' },
        { name: 'projectScopeLabel', type: 'string', description: 'e.g. "Project Scope / Type"' },
        { name: 'budgetLabel', type: 'string', description: 'e.g. "Target Budget (USD)"' },
        { name: 'messageLabel', type: 'string', description: 'e.g. "Project Overview & Timeline"' },
        { name: 'messagePlaceholder', type: 'text', rows: 2 },
        { name: 'submitLabel', type: 'string', description: 'e.g. "SEND INQUIRY"' },
        { name: 'successHeading', type: 'string' },
        { name: 'successMessage', type: 'text', rows: 2 },
      ],
    }),
    defineField({
      name: 'showreelModal',
      type: 'object',
      group: 'showreelModal',
      fields: [
        { name: 'title', type: 'string', description: 'e.g. "AODZN — CREATIVE SHOWREEL 2026"' },
        { name: 'video', title: 'Showreel video', type: 'file', options: { accept: 'video/*' } },
        { name: 'posterImage', title: 'Video poster image', type: 'image' },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Page' }
    },
  },
})
