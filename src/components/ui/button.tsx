import { cn } from '@/lib/utils';
import * as React from 'react';

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?:
      | 'default'
      | 'destructive'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
  }
>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  return (
    <button
      className={cn(
        'focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow':
            variant === 'default',
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm':
            variant === 'destructive',
          'border-input bg-background hover:bg-accent hover:text-accent-foreground border shadow-sm':
            variant === 'outline',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm':
            variant === 'secondary',
          'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
          'text-primary underline-offset-4 hover:underline': variant === 'link',
        },
        {
          'h-9 px-4 py-2': size === 'default',
          'h-8 rounded-md px-3 text-xs': size === 'sm',
          'h-10 rounded-md px-8': size === 'lg',
          'h-9 w-9': size === 'icon',
        },
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';

export { Button };
