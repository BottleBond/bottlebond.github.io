import { HTMLAttributes, forwardRef } from 'react';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'text',
      width,
      height,
      animation = 'pulse',
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const baseClass = 'skeleton';
    const variantClass = `skeleton-${variant}`;
    const animationClass = animation !== 'none' ? `skeleton-${animation}` : '';

    const classes = [baseClass, variantClass, animationClass, className].filter(Boolean).join(' ');

    const computedStyle = {
      ...style,
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
    };

    return <div ref={ref} className={classes} style={computedStyle} {...props} />;
  }
);

Skeleton.displayName = 'Skeleton';

export default Skeleton;
