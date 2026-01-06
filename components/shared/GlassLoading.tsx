export function GlassLoading() {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-black to-purple-900/5" />
      <div className="absolute inset-0 bg-noise" />

      {/* Animated glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '0.7s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />

      {/* Main loading animation */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Outer ring */}
        <div className="absolute w-20 h-20 rounded-full border border-white/5 animate-[spin_3s_linear_infinite]" />

        {/* Middle ring with glow */}
        <div className="absolute w-16 h-16 rounded-full border border-white/10 animate-[spin_2s_linear_infinite_reverse]"
          style={{
            boxShadow: '0 0 20px rgba(255,255,255,0.05), inset 0 0 20px rgba(255,255,255,0.02)',
          }}
        />

        {/* Inner ring */}
        <div className="absolute w-12 h-12 rounded-full border border-white/20 animate-[spin_1.5s_linear_infinite]" />

        {/* Pulsing core */}
        <div className="w-3 h-3 rounded-full bg-white/80 animate-pulse shadow-[0_0_30px_rgba(255,255,255,0.5)]" />

        {/* Orbiting dots */}
        <div className="absolute w-24 h-24 animate-[spin_4s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/60 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </div>
        <div className="absolute w-24 h-24 animate-[spin_3s_linear_infinite_reverse]">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/40" />
        </div>

        {/* Ripple effect */}
        <div className="absolute w-8 h-8 rounded-full border border-white/10 animate-ping" />
        <div className="absolute w-8 h-8 rounded-full border border-white/10 animate-ping" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Brand text */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="text-[10px] font-bold tracking-[0.3em] text-white/40 animate-pulse">
          VEO
        </div>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-white/30 animate-bounce" />
          <div className="w-1 h-1 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-1 h-1 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      {/* Scan line effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent animate-scan pointer-events-none" />
    </div>
  );
}
