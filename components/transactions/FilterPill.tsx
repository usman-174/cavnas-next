interface FilterPillProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function FilterPill({ label, active = false, onClick }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer ${
        active
          ? 'bg-white/10 text-white border border-white/20'
          : 'bg-white/[0.02] text-white/40 border border-white/5 hover:bg-white/[0.06] hover:text-white/60'
      }`}
    >
      {label}
    </button>
  );
}
