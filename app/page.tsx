"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, TrendingUp, Shield, Zap, BarChart3, Wallet, Globe, Mail, Github, Twitter, Sparkles, ArrowUpRight as ArrowUpRightIcon, ArrowDownLeft } from "lucide-react";
import { GlassCard } from "@/components/shared/glassmorphic/GlassCard";
import { PulsingDotGrid } from "@/components/shared/layouts/PulsingDotGrid";
import { CabJsonLd } from "@/components/seo/CabJsonLd";
import { CabLogo } from "@/components/shared/logo/CabLogo";

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      {/* SEO Structured Data */}
      <CabJsonLd />

      <div className="relative w-full min-h-screen bg-black text-white font-sans selection:bg-white/20">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-[#0a0a0a] to-black" />
        <PulsingDotGrid />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black pointer-events-none" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <CabLogo />
            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm text-white/60 hover:text-white/90 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-white/60 hover:text-white/90 transition-colors">How It Works</a>
              <a href="#pricing" className="text-sm text-white/60 hover:text-white/90 transition-colors">Pricing</a>
              <button
                onClick={() => router.push("/login")}
                className="px-5 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 backdrop-blur-xl text-sm text-white/90 hover:text-white transition-all duration-300"
              >
                Sign In
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-wider text-white/60">Now Live</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white/90 mb-6 animate-slide-up">
              Build Your
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-white via-white/80 to-white/60">
                Wealth Empire
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/50 mb-10 max-w-2xl mx-auto animate-slide-up-delayed leading-relaxed">
              CAB2Wealth 🚕🚖 is your sophisticated asset management platform.
              Track, grow, and optimize your portfolio with powerful tools designed for the modern investor.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delayed">
              <button
                onClick={() => router.push("/login")}
                className="group px-8 py-4 rounded-xl bg-white text-black hover:bg-white/90 transition-all duration-300 font-medium"
              >
                <span className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <a
                href="#features"
                className="px-8 py-4 rounded-xl border border-white/20 hover:bg-white/5 backdrop-blur-xl transition-all duration-300 text-white/90 hover:text-white"
              >
                Learn More
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto animate-fade-in">
              <div>
                <div className="text-3xl md:text-4xl font-light text-white/90">$2.4B+</div>
                <div className="text-sm text-white/40 mt-1">Assets Managed</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-light text-white/90">50K+</div>
                <div className="text-sm text-white/40 mt-1">Active Users</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-light text-white/90">99.9%</div>
                <div className="text-sm text-white/40 mt-1">Uptime</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-light text-white/90 mb-4">
                Powerful Features
              </h2>
              <p className="text-white/50 max-w-xl mx-auto">
                Everything you need to manage and grow your wealth in one sophisticated platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <GlassCard
                  key={index}
                  variant="hover"
                  className="p-8 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-medium text-white/90 mb-3">{feature.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-light text-white/90 mb-4">
                How It Works
              </h2>
              <p className="text-white/50 max-w-xl mx-auto">
                Get started in minutes and take control of your financial future.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="text-6xl font-light text-white/10 mb-4">0{index + 1}</div>
                  <h3 className="text-xl font-medium text-white/90 mb-3">{step.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-4 right-0 w-8 h-px bg-linear-to-r from-white/20 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-light text-white/90 mb-4">
                Transparent Pricing
              </h2>
              <p className="text-white/50 max-w-xl mx-auto">
                Choose the plan that works best for your wealth-building journey.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Early Bird Pricing */}
              <div className="relative">
                {/* Limited Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-400 uppercase tracking-wider">
                    Limited Spots
                  </span>
                </div>

                <GlassCard variant="strong" className="p-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-medium text-white/90 mb-2">Early Bird</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-light text-white/90">$200</span>
                      <span className="text-sm text-white/50"> service fee</span>
                    </div>
                    <div className="space-y-3 text-left">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                        <span className="text-sm text-white/70">Financed at $20/mo</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                        <span className="text-sm text-white/70">FREE monthly subscription for life</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                        <span className="text-sm text-white/70">First 1K users only</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Regular Pricing */}
              <GlassCard variant="hover" className="p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-medium text-white/90 mb-2">Regular</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-light text-white/90">$2,500</span>
                    <span className="text-sm text-white/50"> service fee</span>
                  </div>
                  <div className="space-y-3 text-left">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-white/60 mt-2 flex-shrink-0" />
                      <span className="text-sm text-white/50">Service fee can be financed at $20/mo</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-white/60 mt-2 flex-shrink-0" />
                      <span className="text-sm text-white/50">$20/mo subscription</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-white/60 mt-2 flex-shrink-0" />
                      <span className="text-sm text-white/50">Total: $40/mo after financing</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Important Note */}
            <div className="max-w-2xl mx-auto mt-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
                <Shield size={16} className="text-white/60" />
                <span className="text-sm text-white/70">
                  You pay nothing until we deposit newly built USD$ assets into your client account
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Disclosure Section */}
        <section className="py-20 px-6 bg-black/40 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto">
            <div className="border border-white/10 rounded-2xl p-8">
              <h3 className="text-lg font-medium text-white/90 mb-6">Compliance & Disclosure Notice</h3>
              <div className="text-sm text-white/60 space-y-4 leading-relaxed">
                <p>
                  Participation in this program is provided pursuant to a private service agreement and joint venture/co-investment framework, not a public investment offering. Fees described above are service-related fees for administrative, structuring, and asset-building services and do not constitute the purchase of securities.
                </p>
                <p>
                  Any reference to "assets," "deposits," or "asset building" refers to internally structured, contract-based asset development activities performed on behalf of the client pursuant to executed agreements. No guarantees of profits, income, or specific financial outcomes are made. Timing, structure, and results may vary based on individual circumstances, participation status, and contractual performance milestones.
                </p>
                <p>
                  Deferred or financed fee options are subject to approval and separate agreement terms. "Pay nothing until assets are deposited" refers to the timing of service fee collection, not a guarantee of asset creation or financial return.
                </p>
                <p>
                  This program is not a bank account, brokerage account, investment fund, or publicly regulated financial product. Participation is limited and offered privately. Nothing herein constitutes legal, tax, or investment advice. Participants are encouraged to conduct independent due diligence and consult professional advisors prior to enrollment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-white/5 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/3 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/3 rounded-full blur-3xl" />
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            {/* Main CTA Card */}
            <div className="relative">
              {/* Animated border glow */}
              <div className="absolute -inset-px bg-white/10 rounded-3xl blur-sm opacity-50 animate-pulse-slow" />

              <div className="relative bg-black/60 backdrop-blur-2xl rounded-3xl p-1 md:p-1.5">
                <div className="bg-linear-to-br from-white/5 to-white/2 rounded-[20px] p-8 md:p-16 overflow-hidden border border-white/5">
                  {/* Animated grid pattern overlay */}
                  <div className="absolute inset-0 opacity-[0.02]">
                    <div className="w-full h-full" style={{
                      backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: '40px 40px',
                    }} />
                  </div>

                  {/* Animated corner accents */}
                  <div className="absolute top-0 left-0 w-20 h-20 border-l border-t border-white/20 rounded-tl-2xl animate-fade-in-delayed" />
                  <div className="absolute top-0 right-0 w-20 h-20 border-r border-t border-white/20 rounded-tr-2xl animate-fade-in-delayed" style={{ animationDelay: '0.2s' }} />
                  <div className="absolute bottom-0 left-0 w-20 h-20 border-l border-b border-white/20 rounded-bl-2xl animate-fade-in-delayed" style={{ animationDelay: '0.4s' }} />
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-r border-b border-white/20 rounded-br-2xl animate-fade-in-delayed" style={{ animationDelay: '0.6s' }} />

                  <div className="relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-8 animate-fade-in">
                      <span className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
                      <span className="text-xs uppercase tracking-wider text-white/70">Limited Spots Available</span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-white/90 mb-6 animate-slide-up">
                      Ready to Build
                      <span className="block text-white/80">
                        Your Wealth?
                      </span>
                    </h2>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto animate-slide-up-delayed">
                      Join thousands of investors who trust CAB2Wealth to build assets on their behalf through
                      <span className="text-white/70"> co-investment opportunities</span> and
                      <span className="text-white/70"> joint venture investments</span>.
                    </p>

                    {/* Benefit Cards */}
                    <div className="grid md:grid-cols-3 gap-4 mb-12 animate-fade-in-delayed">
                      <div className="group p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <TrendingUp size={18} className="text-white/70" />
                        </div>
                        <div className="text-sm text-white/70">Passive Wealth Building</div>
                      </div>
                      <div className="group p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Shield size={18} className="text-white/70" />
                        </div>
                        <div className="text-sm text-white/70">Capital Protected</div>
                      </div>
                      <div className="group p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Wallet size={18} className="text-white/70" />
                        </div>
                        <div className="text-sm text-white/70">Expert Management</div>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delayed">
                      <button
                        onClick={() => router.push("/login")}
                        className="group relative px-10 py-4 rounded-xl bg-white text-black hover:bg-white/90 font-medium text-lg transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-105"
                      >
                        <span className="flex items-center gap-2 justify-center">
                          Start Building Wealth
                          <ArrowUpRightIcon size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </span>
                      </button>
                      <a
                        href="#features"
                        className="px-8 py-4 rounded-xl border border-white/20 hover:bg-white/5 backdrop-blur-xl transition-all duration-300 text-white/90 hover:text-white flex items-center gap-2"
                      >
                        Learn More
                        <ArrowDownLeft size={18} className="rotate-90" />
                      </a>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-center gap-8 text-sm text-white/40 animate-fade-in">
                      <div className="flex items-center gap-2">
                        <Shield size={16} />
                        <span>Bank-Grade Security</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe size={16} />
                        <span>Global Access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap size={16} />
                        <span>Instant Setup</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-black/40 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="mb-4">
                  <CabLogo />
                </div>
                <p className="text-sm text-white/40 mb-6 max-w-xs">
                  Connoisseur Asset Builder — Sophisticated wealth management for the modern investor.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors">
                    <Twitter size={18} className="text-white/60" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors">
                    <Github size={18} className="text-white/60" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors">
                    <Globe size={18} className="text-white/60" />
                  </a>
                </div>
              </div>

              {/* Product */}
              <div>
                <h4 className="text-sm font-medium text-white/90 mb-4">Product</h4>
                <ul className="space-y-3">
                  <li><a href="#features" className="text-sm text-white/40 hover:text-white/70 transition-colors">Features</a></li>
                  <li><a href="#how-it-works" className="text-sm text-white/40 hover:text-white/70 transition-colors">How It Works</a></li>
                  <li><a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">Security</a></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-sm font-medium text-white/90 mb-4">Company</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">About</a></li>
                  <li><a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">Careers</a></li>
                  <li><a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">Blog</a></li>
                  <li><a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom */}
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-white/30">
                © 2025 CAB2Wealth. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-sm text-white/30 hover:text-white/50 transition-colors">Privacy</a>
                <a href="#" className="text-sm text-white/30 hover:text-white/50 transition-colors">Terms</a>
                <a href="#" className="text-sm text-white/30 hover:text-white/50 transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Decorative Glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-900/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-900/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
    </div>
    </>
  );
}

// Feature data
const features = [
  {
    icon: <TrendingUp size={24} className="text-white/80" />,
    title: "Real-Time Analytics",
    description: "Track your portfolio performance with live data and advanced charting tools."
  },
  {
    icon: <Shield size={24} className="text-white/80" />,
    title: "Bank-Grade Security",
    description: "Your assets are protected with enterprise-level encryption and security protocols."
  },
  {
    icon: <Zap size={24} className="text-white/80" />,
    title: "Instant Transfers",
    description: "Move funds instantly between accounts with zero fees and no waiting periods."
  },
  {
    icon: <BarChart3 size={24} className="text-white/80" />,
    title: "Smart Insights",
    description: "AI-powered recommendations help you make informed investment decisions."
  },
  {
    icon: <Wallet size={24} className="text-white/80" />,
    title: "Multi-Asset Support",
    description: "Manage stocks, crypto, real estate, and more in one unified dashboard."
  },
  {
    icon: <Globe size={24} className="text-white/80" />,
    title: "Global Access",
    description: "Access your portfolio from anywhere in the world with 24/7 availability."
  }
];

// Steps data
const steps = [
  {
    title: "Create Account",
    description: "Sign up in seconds with just your email. No complex paperwork required."
  },
  {
    title: "Connect Assets",
    description: "Link your existing accounts or start fresh with our integrated tools."
  },
  {
    title: "Start Growing",
    description: "Watch your wealth grow with automated investing and smart rebalancing."
  }
];
