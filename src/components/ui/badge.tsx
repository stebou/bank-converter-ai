import { cn } from '@/lib/utils';
import * as React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'focus:ring-ring inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'bg-primary text-primary-foreground hover:bg-primary/80 border-transparent shadow':
            variant === 'default',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent':
            variant === 'secondary',
          'bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent shadow':
            variant === 'destructive',
          'text-foreground': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
