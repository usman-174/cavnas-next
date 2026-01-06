import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: PAGE_METADATA.login.title,
  description: PAGE_METADATA.login.description,
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This is a simple layout for auth pages
  // In a real app, you'd check for session on the server side
  // For now, we'll handle auth redirects client-side in the login page
  return (
    <div className="min-h-screen bg-black">
      {children}
    </div>
  );
}
