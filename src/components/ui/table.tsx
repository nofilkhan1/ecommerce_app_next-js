'use client';

import { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export default function Table({ children, className = '' }: TableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function TableHeader({ children, className = '' }: TableProps) {
  return (
    <thead className={className}>
      <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
        {children}
      </tr>
    </thead>
  );
}

export function TableHead({ children, className = '' }: TableProps) {
  return (
    <th className={`text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wider px-5 py-3.5 ${className}`}>
      {children}
    </th>
  );
}

export function TableBody({ children }: TableProps) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children, className = '' }: TableProps) {
  return (
    <tr className={`border-b border-[#f3f4f6] last:border-0 hover:bg-[#f9fafb] transition-colors ${className}`}>
      {children}
    </tr>
  );
}

export function TableCell({ children, className = '' }: TableProps) {
  return (
    <td className={`px-5 py-4 text-sm ${className}`}>
      {children}
    </td>
  );
}
