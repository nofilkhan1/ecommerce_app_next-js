'use client';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon = '📦', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-base font-semibold text-[#111] mb-1">{title}</h3>
      <p className="text-sm text-[#6b7280] text-center max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
