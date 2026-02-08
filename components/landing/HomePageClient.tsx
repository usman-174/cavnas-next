"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Shield, Wallet, Globe, Github, Twitter, ArrowUpRight as ArrowUpRightIcon, ArrowDownLeft, Menu, X, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/glassmorphic/GlassCard";
import { PulsingDotGrid } from "@/components/shared/layouts/PulsingDotGrid";
import { CabLogo } from "@/components/shared/logo/CabLogo";
import { TierCapacity } from "@/components/landing";
import { TierCapacityInfo } from "@/types";
import { useState } from "react";

// Simple fade-in component for consistent animations
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface HomePageClientProps {
  initialTierData: TierCapacityInfo[];
}

export function HomePageClient({ initialTierData }: HomePageClientProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full min-h-screen bg-black text-white font-sans selection:bg-white/20"
    >
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-[#0a0a0a] to-black" />
        <PulsingDotGrid />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black pointer-events-none" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/20">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <CabLogo />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} className="text-white/80" /> : <Menu size={24} className="text-white/80" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/5 bg-black/40 backdrop-blur-xl">
              <div className="px-6 py-4 space-y-4">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-white/60 hover:text-white/90 transition-colors py-2"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-white/60 hover:text-white/90 transition-colors py-2"
                >
                  How It Works
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-white/60 hover:text-white/90 transition-colors py-2"
                >
                  Pricing
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/login");
                  }}
                  className="w-full px-5 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 backdrop-blur-xl text-sm text-white/90 hover:text-white transition-all duration-300 text-center"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-wider text-white/60">Now Live</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white/90 mb-6"
            >
              Build Your
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-white via-white/80 to-white/60">
                Wealth Empire
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              CAB2Wealth 🚕🚖 is your sophisticated asset management platform.
              Track, grow, and optimize your portfolio with powerful tools designed for the modern investor.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
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
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto"
            >
              <div>
                <div className="text-3xl md:text-4xl font-light text-white/90">1,000+</div>
                <div className="text-sm text-white/40 mt-1">Early Bird Capacity</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-light text-white/90">10,000+</div>
                <div className="text-sm text-white/40 mt-1">Total Capacity</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-light text-white/90">2 Tiers</div>
                <div className="text-sm text-white/40 mt-1">Investment Options</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section - Reservation Capacity */}
        <section id="features" className="py-32 px-6">
          <TierCapacity initialData={initialTierData} />
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-light text-white/90 mb-4">
                How It Works
              </h2>
              <p className="text-white/50 max-w-xl mx-auto">
                Get started in minutes and take control of your financial future.
              </p>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 }
                }
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid md:grid-cols-3 gap-8"
            >
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="text-6xl font-light text-white/10 mb-4">0{index + 1}</div>
                  <h3 className="text-xl font-medium text-white/90 mb-3">{step.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-4 right-0 w-8 h-px bg-linear-to-r from-white/20 to-transparent" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-light text-white/90 mb-4">
                Transparent Pricing
              </h2>
              <p className="text-white/50 max-w-xl mx-auto">
                Choose the plan that works best for your wealth-building journey.
              </p>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 }
                }
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
              {/* Early Bird Pricing */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
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
              </motion.div>

              {/* Regular Pricing */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.5 }}
              >
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
              </motion.div>
            </motion.div>

            {/* Important Note */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl mx-auto mt-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
                <Shield size={16} className="text-white/60" />
                <span className="text-sm text-white/70">
                  You pay nothing until we deposit newly built USD$ assets into your client account
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Compliance Disclosure Section */}
        <section className="py-20 px-6 bg-black/40 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto">
            <div className="border border-white/10 rounded-2xl p-8">
              <h3 className="text-lg font-medium text-white/90 mb-8">Legal Structure & Disclosure Notice</h3>
              <div className="text-sm text-white/60 space-y-6 leading-relaxed">

                {/* Legal Structure Notice */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-white/80">Legal Structure Notice</h4>
                  <p>
                    This opportunity is structured as a private, invitation-only joint venture and co-investment arrangement, offered under private contract.
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-2">
                      <span className="text-white/40 mt-1">•</span>
                      <span>This is not a public offering</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-white/40 mt-1">•</span>
                      <span>No general solicitation of securities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-white/40 mt-1">•</span>
                      <span>No promise of profit or passive income</span>
                    </li>
                  </ul>
                  <p className="text-white/70">All participation occurs pursuant to:</p>
                  <ul className="space-y-1 ml-4">
                    <li className="flex items-start gap-2">
                      <span className="text-white/40 mt-1">—</span>
                      <span>A Joint Venture Agreement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-white/40 mt-1">—</span>
                      <span>Co-Investment Terms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-white/40 mt-1">—</span>
                      <span>Private Participation Disclosures</span>
                    </li>
                  </ul>
                  <p className="text-white/70">
                    Participants are engaging in a collaborative asset-building partnership, not purchasing an investment product.
                  </p>
                </div>

                {/* Payment Timing Disclosure */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <h4 className="text-sm font-medium text-white/80">Payment Timing Disclosure</h4>
                  <p>
                    No monthly payments are due until assets are successfully deposited into the participant's account, as defined in the governing agreements. Financing options, where available, are subject to approval and contractual terms.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="py-32 px-6 relative overflow-hidden"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 z-0">
            <motion.div
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-white/5 rounded-full blur-3xl"
            />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/3 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/3 rounded-full blur-3xl" />
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            {/* Main CTA Card */}
            <div className="relative">
              {/* Animated border glow */}
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-px bg-white/10 rounded-3xl blur-sm opacity-50"
              />

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
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-0 left-0 w-20 h-20 border-l border-t border-white/20 rounded-tl-2xl"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="absolute top-0 right-0 w-20 h-20 border-r border-t border-white/20 rounded-tr-2xl"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="absolute bottom-0 left-0 w-20 h-20 border-l border-b border-white/20 rounded-bl-2xl"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="absolute bottom-0 right-0 w-20 h-20 border-r border-b border-white/20 rounded-br-2xl"
                  />

                  <div className="relative z-10">
                    {/* Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-8"
                    >
                      <span className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
                      <span className="text-xs uppercase tracking-wider text-white/70">Limited Spots Available</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="text-4xl md:text-6xl lg:text-7xl font-light text-white/90 mb-6"
                    >
                      Ready to Build
                      <span className="block text-white/80">
                        Your Wealth?
                      </span>
                    </motion.h2>

                    {/* Subtitle */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto"
                    >
                      Join thousands of investors who trust CAB2Wealth to build assets on their behalf through
                      <span className="text-white/70"> co-investment opportunities</span> and
                      <span className="text-white/70"> joint venture investments</span>.
                    </motion.p>

                    {/* Benefit Cards */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: { staggerChildren: 0.1 }
                        }
                      }}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="grid md:grid-cols-3 gap-4 mb-12"
                    >
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 15 },
                          visible: { opacity: 1, y: 0 }
                        }}
                        className="group p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <TrendingUp size={18} className="text-white/70" />
                        </div>
                        <div className="text-sm text-white/70">Passive Wealth Building</div>
                      </motion.div>
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 15 },
                          visible: { opacity: 1, y: 0 }
                        }}
                        className="group p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Shield size={18} className="text-white/70" />
                        </div>
                        <div className="text-sm text-white/70">Capital Protected</div>
                      </motion.div>
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 15 },
                          visible: { opacity: 1, y: 0 }
                        }}
                        className="group p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Wallet size={18} className="text-white/70" />
                        </div>
                        <div className="text-sm text-white/70">Expert Management</div>
                      </motion.div>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
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
                    </motion.div>

                    {/* Trust indicators */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-center gap-8 text-sm text-white/40"
                    >
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
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

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
    </motion.div>
  );
}

// Steps data
const steps = [
  {
    title: "Create Account",
    description: "Sign up and select your investment tier. Secure your reservation position."
  },
  {
    title: "Position Lock",
    description: "Your reservation number is assigned based on tier selection order."
  },
  {
    title: "Asset Building",
    description: "Once activated, we build USD assets on your behalf through co-investment."
  }
];
