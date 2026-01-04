import { HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export default function Card({
  children,
  className,
  hoverEffect = true,
  ...props
}: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'glass rounded-2xl p-6 transition-all duration-300',
          hoverEffect && 'hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.1)] hover:border-white/20',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}
