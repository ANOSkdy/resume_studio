import { cn } from '@/components/ui/_cn';

type SectionProps = {
  title?: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
  pattern?: 'dots' | 'waves' | 'none';
};

export default function Section({ title, subtitle, className, children, pattern = 'none' }: SectionProps) {
  return (
    <section className={cn('section-card', className)}>
      {pattern !== 'none' && (
        <div
          aria-hidden
          className={cn(
            'section-pattern',
            pattern === 'dots' ? 'pattern-dots text-neutral-600' : undefined,
            pattern === 'waves' ? 'pattern-waves text-primary' : undefined,
          )}
        />
      )}
      {(title || subtitle) && (
        <header>
          {title && <h2>{title}</h2>}
          {subtitle && <p className="text-neutral-500">{subtitle}</p>}
        </header>
      )}
      <div className="section-content">{children}</div>
    </section>
  );
}
