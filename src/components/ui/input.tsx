import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[#374151]">
            {label}
            {props.required && <span className="text-[#ef4444] ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl transition-all duration-200 placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            error
              ? 'border-[#fca5a5] focus:ring-[#fecaca] focus:border-[#ef4444]'
              : 'border-[#e5e7eb] focus:ring-[#e5e7eb] focus:border-[#111]'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-[#ef4444]">{error}</p>}
        {hint && !error && <p className="text-xs text-[#9ca3af]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[#374151]">
            {label}
            {props.required && <span className="text-[#ef4444] ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl transition-all duration-200 placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-offset-0 resize-none ${
            error
              ? 'border-[#fca5a5] focus:ring-[#fecaca] focus:border-[#ef4444]'
              : 'border-[#e5e7eb] focus:ring-[#e5e7eb] focus:border-[#111]'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-[#ef4444]">{error}</p>}
        {hint && !error && <p className="text-xs text-[#9ca3af]">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, options, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[#374151]">
            {label}
            {props.required && <span className="text-[#ef4444] ml-0.5">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 appearance-none cursor-pointer ${
            error
              ? 'border-[#fca5a5] focus:ring-[#fecaca] focus:border-[#ef4444]'
              : 'border-[#e5e7eb] focus:ring-[#e5e7eb] focus:border-[#111]'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p className="text-xs text-[#ef4444]">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
