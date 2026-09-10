import React from 'react';
import { Check } from 'lucide-react';

function StepProgress({ currentStep, totalSteps = 5 }) {
  const steps = [
    { number: 1, label: 'Instructions' },
    { number: 2, label: 'Event Details' },
    { number: 3, label: 'Description & Venue' },
    { number: 4, label: 'Rounds & Rules' },
    { number: 5, label: 'Items & Review' },
  ];

  return (
    <div className="w-full py-4 mb-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-md ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-gradient-to-r from-accent-orange to-accent-yellow text-white ring-4 ring-orange-200'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : step.number}
                </div>
                <span
                  className={`text-xs font-medium mt-2 hidden sm:block ${
                    isCurrent ? 'text-accent-orange font-bold' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default StepProgress;
