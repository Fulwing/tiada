// src/components/OverallEvaluation.tsx
import React from 'react';
import Image from 'next/image';
import { formatTime } from '../lib/utils/helper/formatTime';

interface OverallEvaluationProps {
  taskCompletionRatio: number;
  totalPersonas: number;
  completedPersonas: number;
  averageSteps: number;
  averageCompletionTime: number;
}

const OverallEvaluation: React.FC<OverallEvaluationProps> = ({
  taskCompletionRatio,
  totalPersonas,
  completedPersonas,
  averageSteps,
  averageCompletionTime,
}) => {
  const getStatusBadge = (value: number, threshold: number) => {
    const isAcceptable = value >= threshold;
    return (
      <div className={`flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${isAcceptable ? 'bg-[#D7F7C2] text-[#006908]' : 'bg-[#FFE7F2] text-[#B3093C]'}`}>
        {isAcceptable ? 'Acceptable' : 'Below Expectation'}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-start gap-2.5 self-stretch mb-8">
      <div className="h-[30px] self-stretch flex items-center">
        <Image src="/fire.svg" alt="Fire" width={20} height={20} className="mr-2" />
        <span className="text-white font-bold text-base">Overall Evaluation</span>
      </div>
      <div className="flex w-full gap-4">
        <MetricWidget
          title="Task Completion Ratio"
          subtitle="Completion Rate"
          value={`${taskCompletionRatio}%`}
          subValue={`${completedPersonas}/${totalPersonas} Personas`}
          badge={getStatusBadge(taskCompletionRatio, 80)}
        />
        <MetricWidget
          title="Task Completion Time"
          subtitle="Avg. Completion Time"
          value={formatTime(averageCompletionTime)}
          subValue={`${totalPersonas} Personas`}
          badge={getStatusBadge(averageCompletionTime / 1000, 300)}
        />
        <MetricWidget
          title="Steps to Completion"
          subtitle="Avg. Total Steps"
          value={averageSteps.toString()}
          subValue={`${totalPersonas} Personas`}
          badge={getStatusBadge(averageSteps, 7)}
        />
      </div>
    </div>
  );
};

interface MetricWidgetProps {
  title: string;
  subtitle: string;
  value: string;
  subValue: string;
  badge: React.ReactNode;
}

const MetricWidget: React.FC<MetricWidgetProps> = ({ title, subtitle, value, subValue, badge }) => (
  <div className="flex-1 h-[122px] rounded-[5px] border border-[#505050] bg-[#333] p-3 flex flex-col justify-between">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2.5">
        <span className="text-white text-base font-semibold">{title}</span>
        <Image src="/core-ic-information.svg" alt="Info" width={18} height={18} />
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-white text-base font-semibold">{subtitle}</span>
      {badge}
    </div>
    <div className="flex justify-between items-end">
      <span className="text-white text-xl font-semibold">{value}</span>
      <span className="text-white text-sm">{subValue}</span>
    </div>
  </div>
);

export default OverallEvaluation;


