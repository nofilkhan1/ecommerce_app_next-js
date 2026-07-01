import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      primary: 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:bg-[#1e40af] focus-visible:outline-[#2563eb] shadow-sm hover:shadow-md',
      secondary: 'bg-white text-[#374151] border border-[#d1d5db] hover:bg-[#f9fafb] hover:border-[#9ca3af] active:bg-[#f3f4f6] focus-visible:outline-gray-400 shadow-sm',
      ghost: 'text-[#4b5563] hover:bg-[#f3f4f6] hover:text-[#111827] active:bg-[#e5e7eb] focus-visible:outline-gray-400',
      danger: 'bg-[#dc2626] text-white hover:bg-[#b91c1c] active:bg-[#991b1b] focus-visible:outline-[#dc2626] shadow-sm hover:shadow-md',
      success: 'bg-[#16a34a] text-white hover:bg-[#15803d] active:bg-[#14532d] focus-visible:outline-[#16a34a] shadow-sm hover:shadow-md',
      warning: 'bg-[#f59e0b] text-[#111827] hover:bg-[#d97706] active:bg-[#b45309] focus-visible:outline-[#f59e0b] shadow-sm hover:shadow-md',
    };

    const sizes = {
      sm: 'px-3.5 py-2 text-xs gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-sm gap-2',
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
