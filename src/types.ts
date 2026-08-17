export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  type: 'Branding' | 'Product Design';
  domain: string;
  description: string;
  tags: string[];
  client: string;
  year: string;
  role: string;
  metrics: { label: string; value: string }[];
  image: string;
  logo?: string;
  primaryColor: string;
  accentColor: string;
  mockupType: 'twin-mobile' | 'desktop-tablet' | '3d-card';
  screens: {
    title: string;
    subtitle: string;
    type: 'wallet' | 'ride' | 'analytics' | 'ai-editor';
  }[];
  caseStudy: {
    overview: string;
    challengeHeadline: string;
    challenge: string;
    solutionHeadline: string;
    solution: string;
    quote: string;
    principle: string;
    growthHeadline: string;
    growth: string;
    outcomes: string[];
    features: string[];
    gallery: string[];
    video?: string;
  };
}

export interface ProcessStep {
  number: number;
  id: string;
  title: string;
  description: string;
  detail: string;
  deliverables: string[];
  icon: 'understand' | 'design' | 'build' | 'launch' | 'impact';
}

export type CursorMode = 'default' | 'hover' | 'drag' | 'view' | 'video' | 'hidden';

export interface JournalArticle {
  id: string;
  title: string;
  date: string;
  previewTitle: string;
  previewSubtitle: string;
  gradient: string;
}
