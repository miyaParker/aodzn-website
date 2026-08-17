import { type SchemaTypeDefinition } from 'sanity'

import { projectType } from './documents/project'
import { journalArticleType } from './documents/journalArticle'
import { processStepType } from './documents/processStep'
import { siteSettingsType } from './singletons/siteSettings'
import { homePageType } from './singletons/homePage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [projectType, journalArticleType, processStepType, siteSettingsType, homePageType],
}
