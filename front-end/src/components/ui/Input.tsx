import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-on-surface mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 border rounded-xl
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            transition-all duration-200
            ${error ? 'border-error focus:ring-error/20 focus:border-error' : 'border-outline-variant'}
            ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
