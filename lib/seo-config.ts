// SEO Configuration for CAB2Wealth

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cab2wealth.com';

// Primary SEO Keywords - Core intent
const PRIMARY_KEYWORDS = [
  'private equity firm',
  'private investment firm',
  'co-investment opportunities',
  'joint venture investments',
  'alternative investments firm',
  'private capital investment',
  'asset management firm',
  'wealth building firm',
];

// Secondary Keywords - Desire-driven
const SECONDARY_KEYWORDS = [
  'how to build wealth',
  'how to make money without working',
  'passive wealth strategies',
  'grow money through investments',
  'invest capital for high returns',
  'long term wealth creation',
  'private investing opportunities',
];

// Long-tail Keywords - High intent
const LONG_TAIL_KEYWORDS = [
  'private equity firm for individuals',
  'co investment opportunities for investors',
  'how to invest money passively',
  'firms that build assets for you',
  'how wealthy people invest privately',
  'joint venture investing for passive income',
  'alternative investment opportunities for high net worth',
  'private firms that manage investments',
];

// Authority / Trust Keywords
const AUTHORITY_KEYWORDS = [
  'institutional investment strategies',
  'private capital management',
  'asset acquisition strategy',
  'portfolio growth firm',
  'capital deployment firm',
  'private wealth structuring',
];

export const DEFAULT_METADATA = {
  title: {
    default: 'CAB2Wealth - Connoisseur Asset Builder | Private Equity & Wealth Management',
    template: '%s | CAB2Wealth',
  },
  description: 'CAB2Wealth is a private equity and asset management firm that builds assets on your behalf. We offer co-investment opportunities, joint venture investments, and passive wealth strategies for long-term wealth creation. Private investments structured for high returns.',
  keywords: [
    ...PRIMARY_KEYWORDS,
    ...SECONDARY_KEYWORDS,
    ...LONG_TAIL_KEYWORDS,
    ...AUTHORITY_KEYWORDS,
    'CAB2Wealth',
    'Connoisseur Asset Builder',
  ],
  authors: [{ name: 'CAB2Wealth' }],
  creator: 'CAB2Wealth',
  publisher: 'CAB2Wealth',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'CAB2Wealth',
    title: 'CAB2Wealth - Private Equity & Asset Management Firm',
    description: 'We build assets on your behalf. Capital working while you don\'t. Private equity access without institutional barriers.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CAB2Wealth - Private Equity & Wealth Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CAB2Wealth - Private Equity & Asset Management',
    description: 'We build assets on your behalf. Capital working while you don\'t. Private investments, structured for long-term wealth.',
    images: ['/og-image.png'],
    creator: '@cab2wealth',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

// Page-specific metadata
export const PAGE_METADATA = {
  home: {
    title: 'Home',
    description: 'CAB2Wealth - Your private equity and asset management partner. We build assets on your behalf through co-investment opportunities and joint venture investments.',
  },
  login: {
    title: 'Login',
    description: 'Access your CAB2Wealth account securely. Manage your private investments and portfolio.',
  },
  dashboard: {
    title: 'Dashboard',
    description: 'View your portfolio, balance, and recent transactions.',
    noindex: true, // Dashboard pages should not be indexed
  },
  transactions: {
    title: 'Transactions',
    description: 'View your account activity and transaction history.',
    noindex: true,
  },
  deposits: {
    title: 'Asset Deposits',
    description: 'Manage your deposited assets and investments.',
    noindex: true,
  },
  withdraw: {
    title: 'Withdraw',
    description: 'Initiate withdrawals from your account.',
    noindex: true,
  },
  settings: {
    title: 'Settings',
    description: 'Manage your account settings and preferences.',
    noindex: true,
  },
};

// Landing page copy themes for SEO + conversion
export const LANDING_PAGE_THEMES = [
  'We build assets on your behalf',
  'Capital working while you don\'t',
  'Private investments, structured for long-term wealth',
  'Joint ventures designed to grow capital',
  'Private equity access without institutional barriers',
  'How to earn without trading time for money',
];

// Structured Data (JSON-LD) - Organization Schema
export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: 'CAB2Wealth',
  alternateName: 'Connoisseur Asset Builder',
  description: 'Private equity and asset management firm that builds assets on behalf of clients through co-investment opportunities, joint venture investments, and passive wealth strategies.',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: [
    'https://twitter.com/cab2wealth',
    'https://linkedin.com/company/cab2wealth',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-800-CAB-WEALTH',
    contactType: 'customer service',
    availableLanguage: 'English',
  },
  areaServed: 'Global',
  knowsAbout: [
    'private equity',
    'asset management',
    'wealth building',
    'co-investment',
    'joint venture investments',
    'passive income strategies',
    'alternative investments',
    'private capital management',
  ],
};

// Structured Data (JSON-LD) - FAQ Schema for SEO
export const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is private equity investing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Private equity investing involves capital investment made into companies that are not publicly traded on a stock exchange. CAB2Wealth provides access to private equity opportunities for individual investors.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I build wealth passively?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Passive wealth building involves investments that generate returns without active daily involvement. CAB2Wealth builds assets on your behalf through co-investment opportunities and joint venture investments.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are co-investment opportunities?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Co-investment opportunities allow investors to invest alongside private equity firms in specific deals. CAB2Wealth offers exclusive access to these opportunities for qualified investors.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do joint venture investments work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Joint venture investments involve pooling capital with other investors to fund specific projects or acquisitions. CAB2Wealth structures these investments for optimal returns and risk management.',
      },
    },
  ],
};

// Structured Data (JSON-LD) - Service Schema
export const SERVICE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: 'Private Equity & Asset Management Services',
  description: 'Comprehensive wealth management services including private equity access, co-investment opportunities, joint venture investments, and passive wealth building strategies.',
  provider: {
    '@type': 'Organization',
    name: 'CAB2Wealth',
    url: SITE_URL,
  },
  serviceType: [
    'Private Equity Investments',
    'Co-Investment Opportunities',
    'Joint Venture Investments',
    'Asset Management',
    'Wealth Building Strategies',
    'Passive Income Investments',
    'Capital Deployment',
    'Portfolio Growth',
  ],
};
