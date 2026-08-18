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

export type CursorMode = 'default' | 'hover' | 'drag' | 'view' | 'video' | 'hidden';

export interface JournalArticle {
  id: string;
  title: string;
  date: string;
  previewTitle: string;
  previewSubtitle: string;
  gradient: string;
  category?: string;
  heroImage?: string;
  body?: string;
}

export interface ProcessStepContent {
  number: string;
  title: string;
  description: string;
  phase: string;
  gradient: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: 'Instagram' | 'LinkedIn' | 'X' | 'Website';
  href: string;
}

export interface SiteSettings {
  logo: string;
  logoAlt: string;
  navItems: NavLink[];
  availabilityBadgeText: string;
  navbarShowreelLabel: string;
  navbarCtaLabel: string;
  footerMenuLinks: NavLink[];
  footerLogoTagline: string;
  footerMenuColumnLabel: string;
  footerContactColumnLabel: string;
  footerSocialColumnLabel: string;
  footerLegalLinks: NavLink[];
  socialLinks: SocialLink[];
  footerContactEmail: string;
  projectContactEmail: string;
  copyrightName: string;
}

export interface HomePageContent {
  loader: { cyclingWords: string[]; backgroundWords: string[] };
  hero: {
    topWordLeft: string;
    topWordRight: string;
    bottomWord: string;
    tagline: string;
    ctaLabel: string;
    video: string;
    sticker: string;
  };
  processTimeline: { headingLines: string[]; illustrations: string[] };
  processSection: { eyebrowLabel: string; heading: string };
  portfolioSection: {
    eyebrowLabel: string;
    introText: string;
    viewAllLabel: string;
    caseStudyCtaLabel: string;
    clientLabel: string;
  };
  journalSection: { eyebrowLabel: string; sectionTitle: string };
  footerCta: { heading: string; headingHighlight: string; subtext: string; ctaLabel: string };
  contactModal: {
    eyebrow: string;
    heading: string;
    introText: string;
    projectTypes: string[];
    budgets: string[];
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    projectScopeLabel: string;
    budgetLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
    successHeading: string;
    successMessage: string;
  };
  showreelModal: { title: string; video: string; posterImage: string };
}
