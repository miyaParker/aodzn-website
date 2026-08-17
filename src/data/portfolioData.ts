import { Project, ProcessStep } from '../types';
import cinetripsLogo from '../../assets/cinetrips/logo.png';
import cinetripsChallenge1 from '../../assets/cinetrips/challenge-1.png';
import cinetripsPhonesMockup from '../../assets/cinetrips/frustrated.png';
import cinetripsBillboardMockup from '../../assets/cinetrips/outdoor-billboard-mockup.png';
import cinetripsScene from '../../assets/cinetrips/Scene.mp4';
import cinetripsIphoneMockup from '../../assets/cinetrips/iphone-mockup.png';

export const PROJECTS_DATA: Project[] = [
  {
    id: 'wakabeta',
    title: 'WAKABETA',
    subtitle: 'Redesigning everyday services for a seamless experience.',
    category: 'FEATURED PROJECT',
    type: 'Product Design',
    domain: 'Fintech',
    description: 'One app, many possibilities. Moving people, delivering value, powering everyday life across Nigeria.',
    tags: ['BRAND GUIDELINES', 'VISUAL IDENTITY', 'VERBAL IDENTITY', 'DESIGN SYSTEM', 'APP DEVELOPMENT', 'WEBSITE DESIGN'],
    client: 'WakaBeta Technologies Inc.',
    year: '2025 – 2026',
    role: 'Lead Product Designer & Design Systems Architect',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    primaryColor: '#4F46E5',
    accentColor: '#10B981',
    mockupType: 'twin-mobile',
    metrics: [
      { label: 'Active Users', value: '1.2M+' },
      { label: 'Completion Rate', value: '98.4%' },
      { label: 'App Rating', value: '4.9 ★' },
    ],
    screens: [
      { title: 'Ride & Delivery Hub', subtitle: 'Where to today?', type: 'ride' },
      { title: 'Fintech & Wallet', subtitle: 'N24,680.00 Available', type: 'wallet' },
    ],
    caseStudy: {
      overview: 'WakaBeta is West Africa’s premier super-app, consolidating ride-hailing, package logistics, digital payments, and utility settlement into a unified mobile ecosystem.',
      challengeHeadline: 'WakaBeta had outgrown the old idea of a ride app',
      challenge: 'Users faced fragmented multi-app workflows with slow bandwidth loading, leading to high drop-offs during payment authorization and transport booking.',
      solutionHeadline: 'We rebuilt the platform around one tap, any errand',
      solution: 'We engineered an adaptive modular micro-frontend design system with offline state fallback, streamlined single-tap quick actions, and dark-mode default interfaces tailored for modern OLED displays.',
      quote: 'WakaBeta no longer had to compete inside a single lane. It could stand for every errand a Nigerian city throws at you in one day.',
      principle: 'One app. Every errand handled.',
      growthHeadline: 'Launching a new era of everyday mobility',
      growth: 'Since relaunch, WakaBeta has expanded from ride-hailing into logistics, bills, and micro-savings — turning a single-purpose transport app into the daily utility layer for its cities.',
      outcomes: [
        'Reduced booking flow completion time from 42s to 12s',
        'Increased day-30 retention by 38% across major urban hubs',
        'Built 120+ component design system used across iOS, Android, and Web'
      ],
      features: [
        'Instant peer-to-peer wallet transfer with biometric confirmation',
        'Real-time GPS ride dispatching with live driver tracking',
        'Utility bill auto-pay with recurring cash-back rewards',
        'Low-bandwidth offline mode for weak cellular connections'
      ],
      gallery: [
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=1000&q=80'
      ]
    }
  },
  {
    id: 'paypulse',
    title: 'PAYPULSE',
    subtitle: 'Next-gen cross-border financial liquidity engine.',
    category: 'FINTECH & LIQUIDITY',
    type: 'Product Design',
    domain: 'Fintech',
    description: 'Empowering global remote talent with multi-currency virtual accounts, instant payout settlement, and automated tax reporting.',
    tags: ['PRODUCT DESIGN', 'FINTECH UI', 'DESIGN SYSTEM', 'MOTION ARCHITECTURE', 'WEB APP'],
    client: 'PayPulse Global Ltd.',
    year: '2025',
    role: 'Principal UI/UX Designer',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
    primaryColor: '#059669',
    accentColor: '#3B82F6',
    mockupType: 'desktop-tablet',
    metrics: [
      { label: 'Volume Processed', value: '$85M+' },
      { label: 'Payout Speed', value: '< 30s' },
      { label: 'CSAT Score', value: '99.1%' },
    ],
    screens: [
      { title: 'Liquidity Analytics', subtitle: 'Real-time FX rates & cashflows', type: 'analytics' },
      { title: 'Virtual Cards', subtitle: 'Instant multi-currency issue', type: 'wallet' },
    ],
    caseStudy: {
      overview: 'PayPulse enables freelancers and enterprises across emerging markets to hold balances in USD, EUR, and GBP with instant local currency liquidation.',
      challengeHeadline: 'PayPulse had outgrown the old idea of a payout tool',
      challenge: 'Traditional fintech dashboards overwhelmed non-financial users with complex ledger graphs and hidden FX fee conversion rates.',
      solutionHeadline: 'We rebuilt the platform around one clear balance',
      solution: 'Designed a crystal-clear financial canvas featuring dynamic currency swapping slider, transparent real-time rate ticker, and one-click invoice generation.',
      quote: 'PayPulse no longer had to speak in ledgers and spreads. It could speak in the one number that actually matters: what you can spend, right now.',
      principle: 'Every currency. One clear balance.',
      growthHeadline: 'Launching a new era of borderless payouts',
      growth: 'What started as a payout tool for freelancers is now the financial backbone for remote teams across three continents, settling in whichever currency their clients pay in.',
      outcomes: [
        'Scaled monthly transaction volume by 420% in first two quarters',
        'Awarded Site of the Day on Awwwards for interactive finance platform',
        'Zero friction onboarding with under 2-minute KYC verification'
      ],
      features: [
        'Multi-currency virtual Mastercards with customizable spend caps',
        'Automated invoice generator with live payment tracking link',
        'Institutional FX swap engine with zero hidden spread'
      ],
      gallery: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1607703703674-df96af81dffa?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1573167507387-6b4b98cb7c13?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80'
      ]
    }
  },
  {
    id: 'neura-ai',
    title: 'NEURA CREATIVE',
    subtitle: 'AI-assisted canvas for creative directors.',
    category: 'AI & CREATIVE TOOLS',
    type: 'Product Design',
    domain: 'Creative Tech',
    description: 'Transforming natural language prompts into responsive design systems, spatial moodboards, and production-ready vector assets in seconds.',
    tags: ['AI PRODUCT', 'CANVAS GRAPHICS', 'PROMPT SYSTEMS', 'DESIGN ENGINE', 'DARK UI'],
    client: 'Neura Labs Inc.',
    year: '2026',
    role: 'Design Director & AI Co-Creator',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    primaryColor: '#8B5CF6',
    accentColor: '#EC4899',
    mockupType: '3d-card',
    metrics: [
      { label: 'Design Velocity', value: '10x' },
      { label: 'Generated Assets', value: '4.5M+' },
      { label: 'Design Community', value: '250K+' },
    ],
    screens: [
      { title: 'Spatial Prompt Board', subtitle: 'Infinite node canvas', type: 'ai-editor' },
      { title: 'Vector Synthesizer', subtitle: 'Real-time asset generator', type: 'analytics' },
    ],
    caseStudy: {
      overview: 'Neura Creative is a spatial design environment where AI agents collaborate directly with creative directors on moodboarding, color harmony, and component variation.',
      challengeHeadline: 'Neura had outgrown the old idea of an AI tool',
      challenge: 'AI visual generation often felt unpredictable and detached from structured product design systems.',
      solutionHeadline: 'We rebuilt the canvas around structured collaboration',
      solution: 'Created an node-graph prompt interface connecting LLM intent directly with Figma tokens and SVG vector geometry.',
      quote: 'Neura no longer had to feel like a black box spitting out images. It could feel like a collaborator who understood the design system already.',
      principle: 'Everyone has a canvas worth building on.',
      growthHeadline: 'Launching a new era of AI-native design',
      growth: 'What began as a prompt-to-image experiment is now a structured co-creation environment, trusted by agencies to move from brief to production-ready system in a single sprint.',
      outcomes: [
        'Adopted by 50+ tier-1 design agencies across US and Europe',
        'Reduced design sprint concept phase from 2 weeks to 1 day',
        'Nominated for Apple Design Awards 2026'
      ],
      features: [
        'Infinite canvas with real-time multiplayer cursor collaboration',
        'AI token extractor matching client brand guidelines instantly',
        'Direct export to React Tailwind code and Figma library'
      ],
      gallery: [
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1508385082359-f38ae991e8f2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=1000&q=80'
      ]
    }
  },
  {
    id: 'cinetrips',
    title: 'CINETRIPS',
    subtitle: 'A simpler way to book cinema tickets and enjoy movies, anytime, anywhere.',
    category: 'ENTERTAINMENT & TICKETING',
    type: 'Product Design',
    domain: 'Entertainment',
    description: 'CineTrips reimagines cinema ticket booking as a mobile-first journey — discover films, browse cinemas, pick seats, and check out in just a few taps.',
    tags: ['MOBILE-FIRST DESIGN', 'UX/UI DESIGN', 'TICKET BOOKING', 'USER RESEARCH', 'DESIGN THINKING'],
    client: 'CineTrips',
    year: '2025',
    role: 'Lead UX/UI Designer & Brand Identity Designer',
    image: cinetripsPhonesMockup,
    logo: cinetripsLogo,
    primaryColor: '#D70A84',
    accentColor: '#40066E',
    mockupType: 'twin-mobile',
    metrics: [
      { label: 'User Interviews', value: '10' },
      { label: 'Pain Points Identified', value: '6' },
      { label: 'User Personas', value: '2' },
    ],
    screens: [
      { title: 'Film Discovery', subtitle: 'Personalized picks & trailers', type: 'analytics' },
      { title: 'Seat & Checkout', subtitle: 'Interactive seat map, one-tap pay', type: 'wallet' },
    ],
    caseStudy: {
      overview: 'CineTrips is a mobile-first cinema ticket booking app designed to modernize the movie-going experience — letting people discover films, browse cinemas, select seats, add concessions, and complete bookings in just a few taps.',
      challengeHeadline: 'CineTrips had outgrown the old idea of a booking form',
      challenge: 'Ten user interviews and a competitive audit of ODEON, Vue, and Cineworld surfaced the same friction everywhere: confusing booking flows, no personalized recommendations, rigid showtime filters, opaque pricing, and no easy way to coordinate a group booking with friends.',
      solutionHeadline: 'We rebuilt the journey around one seamless tap',
      solution: 'Working from two core personas and a full empathy map, we designed an interactive seat-selection system, a trust-first checkout with transparent pricing, and a personalized discovery feed — validated through high-fidelity Figma prototypes and iterative usability testing.',
      quote: 'CineTrips no longer had to feel like five different cinema apps stitched together. It could feel like one trip, from trailer to seat.',
      principle: 'Every seat, sorted in one tap.',
      growthHeadline: 'Shaping a smarter way to catch a movie',
      growth: 'What began as a deep-dive design thinking exercise — empathize, define, ideate, prototype, test — became a fully validated end-to-end product vision, with a clear roadmap for developer handoff and continued usability research.',
      outcomes: [
        'Conducted 10 qualitative user interviews across ages 18–55',
        'Audited 3 major competitors (ODEON, Vue, Cineworld) to surface unmet needs',
        'Delivered a complete high-fidelity prototype and design system in Figma'
      ],
      features: [
        'Real-time interactive seat selection with group booking support',
        'QR code ticketing for fast, contactless cinema entry',
        'Smart recommendations based on location and viewing history',
        'Transparent checkout with Apple Pay and Google Pay support'
      ],
      gallery: [
        cinetripsChallenge1,
        cinetripsPhonesMockup,
        cinetripsBillboardMockup,
        cinetripsIphoneMockup
      ],
      video: cinetripsScene
    }
  }
];

// Filter option sets for the Works page. Domains are a provisional first
// pass covering only the projects above — expected to grow as new case
// studies (fintech, food, etc.) get added.
export const WORK_TYPES: Project['type'][] = ['Branding', 'Product Design'];
export const WORK_DOMAINS: string[] = ['Fintech', 'Creative Tech', 'Entertainment'];

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
