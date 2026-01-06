import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface TransactionItemProps {
  title: string;
  subtitle: string;
  amount: string;
  date: string;
  isPositive: boolean;
  onClick?: () => void;
}

export function TransactionItem({ title, subtitle, amount, date, isPositive, onClick }: TransactionItemProps) {
  return (
    <div
      onClick={onClick}
      className="group flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 backdrop-blur-md transition-all duration-500 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 group-hover:text-white group-hover:scale-105 transition-all duration-500">
          {isPositive ? <ArrowDownLeft size={18} strokeWidth={1} /> : <ArrowUpRight size={18} strokeWidth={1} />}
        </div>
        <div>
          <h4 className="text-sm font-medium text-white/90 tracking-wide group-hover:text-white transition-colors">
            {title}
          </h4>
          <p className="text-xs text-white/40 tracking-wide">{subtitle}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={`block text-sm font-medium tracking-wide ${isPositive ? 'text-emerald-400/90' : 'text-white/90'}`}>
          {amount}
        </span>
        <span className="text-[10px] text-white/30 tracking-wider uppercase">{date}</span>
      </div>
    </div>
  );
}
