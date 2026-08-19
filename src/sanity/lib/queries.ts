import { defineQuery } from 'next-sanity'

// Aliases slug.current -> id and resolves every image/file field down to a
// plain asset URL, so the fetched shape matches the Project type the
// frontend already expects (routes are /works/{id}).
const projectProjection = /* groq */ `{
  "id": slug.current,
  title,
  subtitle,
  category,
  type,
  domain,
  description,
  tags,
  client,
  year,
  role,
  metrics,
  "image": image.asset->url,
  "logo": logo.asset->url,
  primaryColor,
  accentColor,
  mockupType,
  screens,
  "caseStudy": {
    "overview": caseStudy.overview,
    "challengeHeadline": caseStudy.challengeHeadline,
    "challenge": caseStudy.challenge,
    "solutionHeadline": caseStudy.solutionHeadline,
    "solution": caseStudy.solution,
    "quote": caseStudy.quote,
    "principle": caseStudy.principle,
    "growthHeadline": caseStudy.growthHeadline,
    "growth": caseStudy.growth,
    "outcomes": caseStudy.outcomes,
    "features": caseStudy.features,
    "gallery": caseStudy.gallery[].asset->url,
    "video": caseStudy.video.asset->url
  }
}`

export const PROJECTS_QUERY = defineQuery(
  `*[_type == "project"] | order(order asc) ${projectProjection}`
)

export const PROJECT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "project" && slug.current == $slug][0] ${projectProjection}`
)

export const PROJECT_SLUGS_QUERY = defineQuery(
  `*[_type == "project"]{ "id": slug.current }`
)

// Shared field list between the list and by-slug queries, same
// shared-projection idea as projectProjection above — `body` is left out of
// the list view (never needed there) and appended only in the by-slug object.
const journalArticleFields = /* groq */ `
  "id": slug.current,
  title,
  date,
  previewTitle,
  previewSubtitle,
  gradient,
  category,
  tags,
  "heroImage": heroImage.asset->url
`

export const JOURNAL_ARTICLES_QUERY = defineQuery(
  `*[_type == "journalArticle"] | order(order asc) { ${journalArticleFields} }`
)

export const JOURNAL_ARTICLE_BY_SLUG_QUERY = defineQuery(
  `*[_type == "journalArticle" && slug.current == $slug][0] {
    ${journalArticleFields},
    body,
    "gallery": gallery[].asset->url,
    galleryCaption
  }`
)

export const JOURNAL_ARTICLE_SLUGS_QUERY = defineQuery(
  `*[_type == "journalArticle"]{ "id": slug.current }`
)

export const PROCESS_STEPS_QUERY = defineQuery(`
  *[_type == "processStep"] | order(order asc) {
    "number": stepNumber,
    title,
    description,
    phase,
    gradient
  }
`)

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    ...,
    "logo": logo.asset->url
  }
`)

export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage"][0]{
    ...,
    "hero": {
      ...hero,
      "video": hero.video.asset->url,
      "sticker": hero.sticker.asset->url
    },
    "processTimeline": {
      ...processTimeline,
      "illustrations": processTimeline.illustrations[].asset->url
    },
    "showreelModal": {
      ...showreelModal,
      "video": showreelModal.video.asset->url,
      "posterImage": showreelModal.posterImage.asset->url
    }
  }
`)
