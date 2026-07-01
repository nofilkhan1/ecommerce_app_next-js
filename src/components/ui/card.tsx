import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export default function Card({ className = '', hover = false, children, ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] ${hover ? 'hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:border-[#d1d5db] hover:-translate-y-0.5 transition-all duration-200' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 py-5 border-b border-[#f3f4f6] ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 py-5 ${className}`} {...props}>
      {children}
    </div>
  );
}
