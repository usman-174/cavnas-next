// SEO Configuration for VEO Wealth

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://veowealth.com';

export const DEFAULT_METADATA = {
  title: {
    default: 'VEO Wealth - Private Banking',
    template: '%s | VEO Wealth',
  },
  description: 'Exclusive wealth management platform for private banking and investment services.',
  keywords: ['private banking', 'wealth management', 'investment services', 'VEO Wealth'],
  authors: [{ name: 'VEO Wealth' }],
  creator: 'VEO Wealth',
  publisher: 'VEO Wealth',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'VEO Wealth',
    title: 'VEO Wealth - Private Banking',
    description: 'Exclusive wealth management platform for private banking and investment services.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VEO Wealth - Private Banking',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VEO Wealth - Private Banking',
    description: 'Exclusive wealth management platform for private banking and investment services.',
    images: ['/og-image.png'],
    creator: '@veowealth',
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
  login: {
    title: 'Login',
    description: 'Access your VEO Wealth account securely.',
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

// Structured Data (JSON-LD)
export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: 'VEO Wealth',
  description: 'Exclusive wealth management platform for private banking and investment services.',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: [
    'https://twitter.com/veowealth',
    'https://linkedin.com/company/veowealth',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-800-VEO-WEALTH',
    contactType: 'customer service',
    availableLanguage: 'English',
  },
};
