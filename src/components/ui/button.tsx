import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-active shadow-sm hover:shadow-md',
      secondary: 'bg-white text-text-secondary border border-border hover:bg-surface-raised hover:border-text-faint active:bg-surface-overlay shadow-sm',
      ghost: 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary active:bg-border',
      danger: 'bg-danger text-white hover:bg-danger-hover active:bg-[#991b1b] shadow-sm hover:shadow-md',
      success: 'bg-success text-white hover:bg-success-hover active:bg-[#14532d] shadow-sm hover:shadow-md',
      warning: 'bg-warning text-text-primary hover:bg-warning-hover active:bg-[#b45309] shadow-sm hover:shadow-md',
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
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg 
            className="animate-spin h-4 w-4" 
            viewBox="0 0 24 24" 
            fill="none" 
            aria-hidden="true"
          >
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