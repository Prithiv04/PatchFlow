import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'glass rounded-xl shadow-lg border border-border bg-card',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
