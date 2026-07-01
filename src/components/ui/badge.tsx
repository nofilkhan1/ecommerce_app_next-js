interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export default function Badge({ variant = 'default', children, className = '', dot }: BadgeProps) {
  const variants = {
    default: 'bg-[#f3f4f6] text-[#4b5563] border-[#e5e7eb]',
    success: 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]',
    warning: 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]',
    danger: 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]',
    info: 'bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]',
    outline: 'bg-transparent text-[#6b7280] border-[#d1d5db]',
  };

  const dotColors = {
    default: 'bg-[#9ca3af]',
    success: 'bg-[#16a34a]',
    warning: 'bg-[#d97706]',
    danger: 'bg-[#dc2626]',
    info: 'bg-[#2563eb]',
    outline: 'bg-[#9ca3af]',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full border tracking-wide ${variants[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
