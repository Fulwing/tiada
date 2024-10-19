import React, { useState } from 'react';
import { TestResult, Step } from '../../types/test/result';
import Image from 'next/image';

interface ExpandedUserJourneyProps {
  result: TestResult;
  onCheckPersonaInfo: (personaId: string) => void;
  onViewTestingDetails: (journeyId: string) => void;
  onTalkWithPersona: (personaId: string, personaName: string) => void;
}

const ExpandedUserJourney: React.FC<ExpandedUserJourneyProps> = ({ 
  result, 
  onCheckPersonaInfo, 
  onViewTestingDetails,
  onTalkWithPersona
}) => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const renderPopup = (step: Step) => {
    return (
      <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 rounded-md bg-[#2D2D2D] border ${step.status === 'success' ? 'border-[#3FB950]' : 'border-[#FF4242]'} z-10`}>
        <Image src={step.image || "/placeholder.png"} alt={`Step ${step.stepNumber}`} width={48} height={96} className="object-cover mb-1" />
        <p className="text-xs text-[#C9D1D9] w-20">{step.description}</p>
      </div>
    );
  };

  const getStepColor = (status: 'success' | 'miss') => {
    return status === 'success' ? 'bg-[#3FB950]' : 'bg-[#FF4848]';
  };

  const getTextColor = (status: 'success' | 'miss') => {
    return status === 'success' ? 'text-[#3FB950]' : 'text-[#FF4848]';
  };

  return (
    <tr>
      <td colSpan={12} className="p-4 bg-[#161B22]">
        <div className="mb-4 relative" style={{ height: '34px', width: '300px' }}>
          <div className="absolute top-[6px] left-0 right-0 h-0.5 bg-[#30363D]" />
          {result.stages.map((stage, index) => (
            <React.Fragment key={stage.stepNumber}>
              <div
                className={`absolute top-0 w-3 h-3 rounded-full ${getStepColor(stage.status)} z-10`}
                style={{ left: `${(index / (result.stages.length - 1)) * 300}px` }}
                onMouseEnter={() => setHoveredStep(stage.stepNumber)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {hoveredStep === stage.stepNumber && renderPopup(stage)}
              </div>
              <div
                className={`absolute top-[18px] text-xs ${getTextColor(stage.status)}`}
                style={{ left: `${(index / (result.stages.length - 1)) * 300}px`, transform: 'translateX(-50%)' }}
              >
                {stage.stepNumber}
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="space-y-2">
          {result.stages.map((stage) => (
            <div key={stage.stepNumber} className="flex">
              <div className={`font-bold w-16 ${getTextColor(stage.status)}`}>
                Step {stage.stepNumber}:
              </div>
              <div className="text-white">{stage.description}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button 
            className="px-3 py-1 bg-white text-black rounded text-sm"
            onClick={() => onCheckPersonaInfo(result.personaId)}
          >
            Check persona info
          </button>
          <button 
            className="px-3 py-1 bg-white text-black rounded text-sm"
            onClick={() => onViewTestingDetails(result.id!)}
          >
            View testing details
          </button>
          <button 
            className="px-3 py-1 bg-[#625AFA] text-white rounded text-sm"
            onClick={() => onTalkWithPersona(result.personaId, result.persona?.name || 'Persona')}
          >
            Talk with persona
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ExpandedUserJourney;
