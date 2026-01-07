"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';
import { Background } from './Background';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export function PageLayout({
  title,
  subtitle,
  children,
  showBackButton = true,
  showHomeButton = true,
}: PageLayoutProps) {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-hidden font-sans selection:bg-white/20">
      {/* Background */}
      <Background />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col px-6 py-12 md:py-20 max-w-md mx-auto md:max-w-2xl">

        {/* Header */}
        <header
          className={`w-full flex items-center gap-4 mb-8 transition-all duration-1000 ease-out transform ${loaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
        >
          {showBackButton && (
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-white/5 transition-colors duration-500 cursor-pointer"
            >
              <ArrowLeft size={20} className="text-white/80" />
            </button>
          )}
          {showHomeButton && (
            <button
              onClick={() => router.push('/')}
              className="p-2 rounded-full hover:bg-white/5 transition-colors duration-500 cursor-pointer"
            >
              <Home size={20} className="text-white/80" />
            </button>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-light tracking-tight text-white">{title}</h1>
            {subtitle && (
              <p className="text-xs text-white/40 mt-1">{subtitle}</p>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div
          className={`flex-1 transition-all duration-[1500ms] delay-200 ease-out transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          {children}
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-blue-900/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
    </div>
  );
}
