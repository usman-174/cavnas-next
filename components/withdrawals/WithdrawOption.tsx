import { ArrowUpRight } from 'lucide-react';

interface WithdrawOptionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}

export function WithdrawOption({ icon, title, subtitle, onClick }: WithdrawOptionProps) {
  return (
    <button
      onClick={onClick}
      className="w-full group flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 backdrop-blur-md transition-all duration-500 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/60 group-hover:text-white group-hover:scale-105 transition-all duration-500">
          {icon}
        </div>
        <div className="text-left">
          <h4 className="text-sm font-medium text-white/90 tracking-wide group-hover:text-white transition-colors">
            {title}
          </h4>
          <p className="text-xs text-white/40 tracking-wide">{subtitle}</p>
        </div>
      </div>
      <ArrowUpRight size={18} className="text-white/30 group-hover:text-white/60 transition-colors" />
    </button>
  );
}
