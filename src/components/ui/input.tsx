import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[#374151]">
            {label}
            {props.required && <span className="text-[#dc2626] ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-4 py-3 text-sm bg-white border rounded-xl transition-all duration-200 placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            error
              ? 'border-[#fca5a5] focus:ring-[#fecaca] focus:border-[#dc2626]'
              : 'border-[#d1d5db] focus:ring-[#bfdbfe] focus:border-[#2563eb]'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-[#dc2626] font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-[#9ca3af]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[#374151]">
            {label}
            {props.required && <span className="text-[#dc2626] ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`w-full px-4 py-3 text-sm bg-white border rounded-xl transition-all duration-200 placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-offset-0 resize-none ${
            error
              ? 'border-[#fca5a5] focus:ring-[#fecaca] focus:border-[#dc2626]'
              : 'border-[#d1d5db] focus:ring-[#bfdbfe] focus:border-[#2563eb]'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-[#dc2626] font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-[#9ca3af]">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, hint, options, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[#374151]">
            {label}
            {props.required && <span className="text-[#dc2626] ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={`w-full px-4 py-3 text-sm bg-white border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 appearance-none cursor-pointer ${
              error
                ? 'border-[#fca5a5] focus:ring-[#fecaca] focus:border-[#dc2626]'
                : 'border-[#d1d5db] focus:ring-[#bfdbfe] focus:border-[#2563eb]'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
        {error && <p className="text-xs text-[#dc2626] font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-[#9ca3af]">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
