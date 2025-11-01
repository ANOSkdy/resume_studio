import { ArrowDown, ArrowRight } from 'lucide-react';
import { cn } from '@/components/ui/_cn';

type Step = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
};

type Props = {
  steps: Step[];
  direction?: 'horizontal' | 'vertical';
};

export default function ProcessFlow({ steps, direction = 'horizontal' }: Props) {
  const isHorizontal = direction === 'horizontal';
  return (
    <div className={cn('process-flow', isHorizontal ? 'horizontal' : 'vertical')}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <div key={index} className="process-step">
            {step.icon && <div className="icon-2px text-primary">{step.icon}</div>}
            <div>
              <div className="text-neutral-900" style={{ fontWeight: 600 }}>{step.title}</div>
              {step.description && <div className="text-neutral-600" style={{ fontSize: '0.9rem' }}>{step.description}</div>}
            </div>
            {!isLast && (
              <div className="step-arrow" aria-hidden>
                {isHorizontal ? <ArrowRight className="icon-2px" /> : <ArrowDown className="icon-2px" />}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
