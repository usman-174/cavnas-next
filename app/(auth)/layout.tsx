import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Sign In | CAB2Wealth',
  description: 'Sign in to your CAB2Wealth account to access your dashboard and manage your wealth portfolio.',
  keywords: ['login', 'sign in', 'CAB2Wealth', 'wealth management'],
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
