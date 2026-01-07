"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Background } from "@/components/shared/layouts/Background";
import { GlassCard } from "@/components/shared/glassmorphic/GlassCard";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden font-sans selection:bg-white/20">
      {/* Background Layer */}
      <Background showVideo={true} />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <GlassCard variant="strong" className="max-w-md w-full p-12 text-center animate-fade-in">
          {/* 404 Heading */}
          <h1 className="text-7xl md:text-8xl font-light tracking-tight text-white/90 mb-4">
            404
          </h1>

          {/* Error Message */}
          <h2 className="text-white/60 text-lg mb-2 font-medium">
            Page Not Found
          </h2>

          {/* Supporting Text */}
          <p className="text-white/40 text-sm mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved to a different location.
          </p>

          {/* Return Home Button */}
          <button
            onClick={() => router.push("/")}
            className="group px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-xl text-white/80 hover:text-white transition-all duration-500 cursor-pointer"
          >
            <span className="flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
              Return Home
            </span>
          </button>
        </GlassCard>
      </div>

      {/* Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-blue-900/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
    </div>
  );
}
