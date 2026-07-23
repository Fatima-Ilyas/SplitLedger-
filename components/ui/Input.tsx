import React, { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', id, required, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-slate-700 flex items-center gap-1">
            {label}
            {required && <span className="text-brand-500">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          type={type}
          required={required}
          className={cn(
            'h-9 px-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all hover:border-slate-300 shadow-2xs',
            error && 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-400',
            className
          )}
          {...props}
        />
        {error && <span className="text-[11px] text-rose-500 font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
