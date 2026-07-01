interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-[#f3f4f6] text-[#374151] border-[#e5e7eb]',
    success: 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]',
    warning: 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]',
    danger: 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]',
    info: 'bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]',
    outline: 'bg-transparent text-[#6b7280] border-[#d1d5db]',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold rounded-full border tracking-wide ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
