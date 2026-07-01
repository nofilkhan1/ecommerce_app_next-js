'use client';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon = '📦', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-16 h-16 rounded-2xl bg-[#f3f4f6] flex items-center justify-center text-3xl mb-5">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-[#111827] mb-1.5">{title}</h3>
      <p className="text-sm text-[#6b7280] text-center max-w-sm mb-6 leading-relaxed">{description}</p>
      {action}
    </div>
  );
}
