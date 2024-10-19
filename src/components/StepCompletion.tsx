// src/components/StepCompletion.tsx
import React from 'react';
import { Step } from '../types/test/result';

interface StepCompletionProps {
  steps: Step[];
}

export default function StepCompletion({ steps }: StepCompletionProps) {
  return (
    <div className="flex items-center relative">
      {steps.map((step, index) => (
        <React.Fragment key={step.stepNumber}>
          <div className="flex flex-col items-center" style={{ width: '60px', position: 'relative' }}>
            <div className="flex items-center justify-center" style={{ width: '60px', height: '20px' }}>
              {index > 0 && (
                <div
                  className={`h-0.5 absolute ${step.status === 'success' ? 'bg-[#02FF2B]' : 'bg-[#FF4848]'}`}
                  style={{
                    width: '60px',
                    left: '-30px',
                    top: '10px',
                    zIndex: 1
                  }}
                ></div>
              )}
              <div
                className={`w-3 h-3 rounded-full ${
                  step.status === 'success' ? 'bg-[#02FF2B]' : 'bg-[#FF4848]'
                }`}
              ></div>
            </div>
            <span
              className={`text-[13px] font-light ${
                step.status === 'success' ? 'text-[#7D7D7D]' : 'text-[#FF6666]'
              } transform -rotate-45 mt-4`}
              style={{
                whiteSpace: 'nowrap',
                position: 'absolute',
                top: '24px',
                left: '50%',
                transform: 'translateX(-50%) rotate(-45deg)'
              }}
            >
            {step.status === 'success' ? `Stage ${step.stepNumber}` : `Miss ${step.stepNumber}`}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
