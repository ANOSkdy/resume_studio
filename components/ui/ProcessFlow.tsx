import type { ReactNode } from "react";
import { ArrowDownIcon, ArrowRightIcon } from "./icons";

interface Step {
  title: string;
  description?: string;
  icon?: ReactNode;
}

interface ProcessFlowProps {
  steps: Step[];
  direction?: "horizontal" | "vertical";
}

export default function ProcessFlow({ steps, direction = "horizontal" }: ProcessFlowProps) {
  const isHorizontal = direction === "horizontal";

  return (
    <div className={isHorizontal ? "process-flow" : "process-flow vertical"}>
      {steps.map((step, index) => (
        <div key={step.title + index} className="process-flow-item">
          {step.icon && <div className="icon-2px text-primary" aria-hidden>{step.icon}</div>}
          <div>
            <div className="process-flow-item-title">{step.title}</div>
            {step.description && <div className="process-flow-item-description">{step.description}</div>}
          </div>
          {index < steps.length - 1 && (
            <span className="process-flow-arrow" aria-hidden>
              {isHorizontal ? <ArrowRightIcon className="icon-2px" width={20} height={20} /> : <ArrowDownIcon className="icon-2px" width={20} height={20} />}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
