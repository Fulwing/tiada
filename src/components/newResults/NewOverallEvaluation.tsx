// src/components/newResults/NewOverallEvaluation.tsx
import React from 'react';
import Image from 'next/image';
import { TestResult } from '../../types/test/result';
import { formatTime } from '../../lib/utils/helper/formatTime';

interface NewOverallEvaluationProps {
  results: TestResult[];
}

const NewOverallEvaluation: React.FC<NewOverallEvaluationProps> = ({ results }) => {
    const totalPersonas = results.length;
    const completedPersonas = results.filter(r => r.taskCompletion === 'Success').length;
    const taskCompletionRatio = Math.round((completedPersonas / totalPersonas) * 100);
    const totalSteps = results.reduce((sum, r) => sum + r.steps, 0);
    const averageSteps = Math.round(totalSteps / totalPersonas);
    const totalCompletionTime = results.reduce((sum, r) => sum + Math.floor(r.completionTime), 0);
    const averageCompletionTime = Math.floor(totalCompletionTime / totalPersonas);
    const heuristicsScore = 87; // This should be calculated or fetched from your data  

    return (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Image src="/star-fill-24.svg" alt="Star" width={24} height={24} className="mr-2" />
            <h2 className="text-xl font-semibold text-white">Overall Evaluation</h2>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <MetricCard
              title="Task Completion Ratio"
              value={`${taskCompletionRatio}%`}
              subtext={`${completedPersonas}/${totalPersonas} Personas`}
              subtitle="Completion Rate"
              isPercentage={true}
            />
            <MetricCard
              title="Steps Taken"
              value={averageSteps.toString()}
              subtext={`Ideal steps: ${averageSteps - 5}`}
              subtitle="Avg. Total Clicks"
            />
            <MetricCard
              title="Heuristics Evaluation Score"
              value={`${heuristicsScore}/100`}
              subtext=""
              subtitle=""
              showButton
              isScore={true}
            />
            <MetricCard
              title="What else?"
              value=""
              subtext=""
              subtitle=""
              showSuggestionButton
            />
          </div>
        </div>
      );
    };
    
    interface MetricCardProps {
      title: string;
      value: string;
      subtext: string;
      subtitle: string;
      showButton?: boolean;
      showSuggestionButton?: boolean;
      isPercentage?: boolean;
      isScore?: boolean;
    }
    
    const MetricCard: React.FC<MetricCardProps> = ({ 
      title, 
      value, 
      subtext, 
      subtitle, 
      showButton, 
      showSuggestionButton,
      isPercentage,
      isScore
    }) => {
      const getValueColor = () => {
        if (isPercentage || isScore) {
          const numericValue = parseInt(value);
          return numericValue >= 50 ? 'text-[#3FB950]' : 'text-[#FF4848]';
        }
        return 'text-white';
      };
    
      return (
        <div className="bg-[#1C1D1F] p-4 rounded-lg border border-[#505050] h-[110px] relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <Image src="/core-ic-information.svg" alt="Info" width={18} height={18} />
          </div>
          <p className={`text-2xl font-bold ${getValueColor()} mb-1`}>{value}</p>
          {subtitle && <p className="text-xs text-[#7D7D7D]">{subtitle}</p>}
          {subtext && (
            <p className="text-sm text-[#7D7D7D] absolute bottom-2 right-4">{subtext}</p>
          )}
          {showButton && (
            <button className="mt-2 bg-[#625AFA] text-white px-3 py-1 rounded text-sm absolute bottom-2 right-4">
              Check Details
            </button>
          )}
          {showSuggestionButton && (
            <button className="mt-2 bg-[#5C5C60] text-white px-3 py-1 rounded text-sm w-sm absolute bottom-2 left-4 right-4">
              Suggest us the metrics you want
            </button>
          )}
        </div>
      );
    };
    
    export default NewOverallEvaluation;
    
    