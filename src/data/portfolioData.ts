import { Project, ProcessStep } from '../types';

// Project/case-study content now lives in Sanity — see src/sanity/lib/fetch.ts.

export const WORK_TYPES: Project['type'][] = ['Branding', 'Product Design'];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: 1,
    id: 'understand',
    title: 'UNDERSTAND',
    description: 'I dig deep into your goals, business metrics, and target audience needs through strategic discovery.',
    detail: 'Before drawing a single line, we audit existing product bottlenecks, conduct stakeholder interviews, analyze competitive landscapes, and formulate clear KPIs for success.',
    deliverables: ['User Research Insights', 'Product Requirement Blueprint', 'Competitive Matrix', 'KPI Strategy Map'],
    icon: 'understand',
  },
  {
    number: 2,
    id: 'design',
    title: 'DESIGN',
    description: 'Rapid wireframing, high-fidelity UI systems, and interactive prototypes crafted for elegance.',
    detail: 'Translating strategic insights into tangible wireframes, design systems, and responsive interfaces. Every color token, typography scale, and visual component is mathematically crafted.',
    deliverables: ['Design System Tokens', 'Figma Wireframes & Hi-Fi Components', 'Interactive Clickthrough Prototypes', 'Micro-interaction specs'],
    icon: 'design',
  },
  {
    number: 3,
    id: 'build',
    title: 'BUILD',
    description: 'Engineered with pixel perfection, modern web standards, and fluid 60fps GSAP physics animations.',
    detail: 'Transforming static mockups into production-ready frontends. Utilizing React, TypeScript, TailwindCSS, and custom GSAP animation pipelines to bring designs to life.',
    deliverables: ['Clean Production React Code', 'GSAP & ScrollTrigger Physics', 'Responsive Layout System', 'W3C Accessibility Compliance'],
    icon: 'build',
  },
  {
    number: 4,
    id: 'launch',
    title: 'LAUNCH',
    description: 'Comprehensive QA, performance optimization, and seamless deployment for maximum impact.',
    detail: 'Stress testing frame rates across mobile devices, optimizing media loading pipelines, implementing SEO schema, and ensuring zero layout shifts during page entry.',
    deliverables: ['Lighthouse 95+ Audits', 'CI/CD Deployment Pipelines', 'Asset CDN Optimization', 'Analytics Integration'],
    icon: 'launch',
  },
  {
    number: 5,
    id: 'create-impact',
    title: 'CREATE IMPACT',
    description: 'Post-launch analytics monitoring, iterative refinement, and driving real revenue & engagement growth.',
    detail: 'Measuring real user telemetry against key baseline metrics. Conducting A/B tests to optimize conversion funnels and continuously refining micro-experiences.',
    deliverables: ['Post-Launch Conversion Analytics', 'UX Heatmap Evaluation', 'Iterative Feature Upgrades', 'Design Token Handoff'],
    icon: 'impact',
  },
];
