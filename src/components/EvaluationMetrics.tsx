'use client';

import React from 'react';
import Image from 'next/image';

interface EvaluationMetricsProps {
  isExpanded: boolean;
  isMinimized: boolean;
  selectedMetrics: string[];
  setSelectedMetrics: React.Dispatch<React.SetStateAction<string[]>>;
  sliderValue: number;
  setSliderValue: React.Dispatch<React.SetStateAction<number>>;
}

const EvaluationMetrics: React.FC<EvaluationMetricsProps> = ({
  isExpanded,
  isMinimized,
  selectedMetrics,
  setSelectedMetrics,
  sliderValue,
  setSliderValue
}) => {
  if (!isExpanded) {
    return null;
  }

  const metricsOptions = [
    {
      label: 'Task Completion Steps',
      description: 'Indicate the expected steps to complete the task. Ex, if the normal expectation is 10 steps of action, a maximum of 15 steps (150%) may be considered successful.',
    },
    {
      label: 'Task Ultimate Success',
      description: 'Can the user ultimately complete the task without considering the number of steps and time?',
    },
    {
      label: 'Completion Time',
      description: 'Estimate the time required to complete the task.',
    },
    {
      label: 'Users\' subjective feedback',
      description: 'Assess users\' subjective reactions and feedback during and after the task.',
    },
    {
      label: 'Heuristics Evaluation',
      description: 'A heuristics evaluation on the design provided by an AI UX expert.',
    },
  ];

  const toggleMetric = (label: string) => {
    setSelectedMetrics(prev =>
      prev.includes(label)
        ? prev.filter(m => m !== label)
        : [...prev, label]
    );
  };

  if (isMinimized) {
    return (
      <div className="flex items-center p-[27px_18px] gap-[15px] border-b border-[#444]">
        <Image src="/Icon (1).svg" alt="Evaluation Metrics" width={17} height={20} />
        <h2 className="text-[#D9D9D9] text-2xl font-bold leading-[120%] tracking-[-0.48px]">
          Evaluation Metrics
        </h2>
        <Image src="/check-circle.svg" alt="Valid" width={16} height={16} className="ml-auto" />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-[27px_58px_27px_18px] gap-[15px] border-b border-[#444]">
      <div className="flex items-center gap-2">
        <Image src="/Icon (1).svg" alt="Evaluation Metrics" width={17} height={20} />
        <h2 className="text-[#D9D9D9] text-2xl font-bold leading-[120%] tracking-[-0.48px]">
          Evaluation Metrics
        </h2>
      </div>
      <p className="text-[#C9D1D9] text-sm leading-[140%]">
        In order to provide you with a clear and meaningful insight on the testing result, we need you to define what item should be included in the evaluation.
      </p>
      <div className="flex flex-col gap-4">
        {metricsOptions.map((metric, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id={`metric-${index}`}
                checked={selectedMetrics.includes(metric.label)}
                onChange={() => toggleMetric(metric.label)}
                className="mt-1"
              />
              <div>
                <label htmlFor={`metric-${index}`} className="text-[#C9D1D9] text-sm font-medium">
                  {metric.label}
                </label>
                <p className="text-[#939CA5] text-xs mt-1">{metric.description}</p>
              </div>
            </div>
            {metric.label === 'Task Completion Steps' && selectedMetrics.includes(metric.label) && (
              <div className="ml-6 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#C9D1D9] text-sm">Maximum steps</span>
                  <span className="text-[#C9D1D9] text-sm">{sliderValue}%</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="200"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#625AFA] rounded-full mt-2 appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[#939CA5] text-sm mt-1">
                  <span>100%</span>
                  <span>200%</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvaluationMetrics;

