'use client';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`skeleton rounded-xl ${className}`} />
  );
}

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-4 p-5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className={`h-4 rounded-lg ${j === 0 ? 'w-10 h-10 rounded-xl' : j === 1 ? 'w-12' : 'flex-1'}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 space-y-4">
      <Skeleton className="h-4 w-28 rounded-lg" />
      <Skeleton className="h-9 w-20 rounded-lg" />
      <Skeleton className="h-3 w-36 rounded-lg" />
    </div>
  );
}
