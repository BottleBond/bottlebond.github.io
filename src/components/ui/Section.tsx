import type { HTMLAttributes, ReactNode } from 'react';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: 'section' | 'div' | 'article';
  variant?: 'default' | 'alternate' | 'dark';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  container?: boolean;
}

function Section({
  children,
  as: Component = 'section',
  variant = 'default',
  padding = 'md',
  container = true,
  className = '',
  ...props
}: SectionProps) {
  const baseClass = 'section';
  const variantClass = `section-${variant}`;
  const paddingClass = padding !== 'none' ? `section-padding-${padding}` : '';

  const classes = [baseClass, variantClass, paddingClass, className].filter(Boolean).join(' ');

  const content = container ? <div className="container-luxury">{children}</div> : children;

  return (
    <Component className={classes} {...props}>
      {content}
    </Component>
  );
}

export default Section;
