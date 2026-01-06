import { Button } from '@/components/ui/button';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export function ActionButton({ icon, label, onClick }: ActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      onClick={onClick}
      className="group flex flex-col items-center justify-center w-20 h-20 rounded-xl hover:bg-white/10 text-white/40 hover:text-white/90 transition-all duration-300 cursor-pointer"
    >
      <div className="mb-2 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-500 ease-out [&_svg]:size-5">
        {icon}
      </div>
      <span className="text-[10px] uppercase tracking-wider">
        {label}
      </span>
    </Button>
  );
}
