import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'accent';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors';

    const variants = {
      default: 'bg-slate-100 text-slate-700 border border-slate-200',
      success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      warning: 'bg-amber-50 text-amber-700 border border-amber-200',
      info: 'bg-brand-50 text-brand-700 border border-brand-200',
      accent: 'bg-slate-50 text-slate-700 border border-slate-200',
    };

    return (
      <span ref={ref} className={cn(baseStyles, variants[variant], className)} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
