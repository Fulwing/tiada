// src/components/UserJourney.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { TestResult, Step, TestPersona } from '../types/test/result';
import StepCompletion from './StepCompletion';
import { formatTime } from '../lib/utils/helper/formatTime';
import ChatWithPersona from './ChatWithPersona';

interface UserJourneyProps {
  result: TestResult;
  onShowPersona: (persona: TestPersona) => void;
  onShowJourneyDetails: (steps: Step[], generalFeedback: string) => void;
  images: string[];
  openSideMenu: 'persona' | 'journey' | 'step' | null;
  setOpenSideMenu: React.Dispatch<React.SetStateAction<'persona' | 'journey' | 'step' | null>>;
}

export default function UserJourney({
  result,
  onShowPersona,
  onShowJourneyDetails,
  images,
  openSideMenu,
  setOpenSideMenu
}: UserJourneyProps) {
  const [expanded, setExpanded] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const errors = result.stages.filter(step => step.status === 'miss').length;

  const handleShowPersona = () => {
    if (result.persona) {
      onShowPersona(result.persona);
    }
  };

  const handleShowJourneyDetails = () => {
    onShowJourneyDetails(result.stages, result.generalFeedback);
  };

  return (
    <div className="bg-[#333333] rounded-lg mb-4">
      <div className="flex cursor-pointer p-4 items-center" onClick={() => setExpanded(!expanded)}>
        <span className={`w-[15%] ${result.taskCompletion === 'Success' ? 'text-[#02FF2B]' : 'text-[#FF4848]'}`}>
          {result.taskCompletion}
        </span>
        <span className="w-[10%] text-[#7D7D7D]">{result.steps}</span>
        <span className="w-[15%] text-[#7D7D7D]">{formatTime(result.completionTime)}</span>
        <span className={`w-[15%] ${errors > 0 ? 'text-[#FF4848]' : 'text-[#02FF2B]'}`}>{errors} Errors</span>
        <span className="w-[15%] text-[#7D7D7D]">{result.persona?.name}</span>
        <span className="w-[10%] text-[#7D7D7D]">{result.persona?.age}</span>
        <span className="w-[15%] text-[#7D7D7D]">{result.persona?.occupation}</span>
        <Image 
          src="/navigation-ic-list-arrow-down.svg" 
          alt="Expand" 
          width={24} 
          height={24} 
          className={`ml-auto transform ${expanded ? 'rotate-180' : ''}`} 
        />
      </div>
      {expanded && (
        <div className="bg-[#2D2D2D] p-4 rounded-b-lg">
          <div className="text-[#FFFFFFCC] mb-2">Steps Overview</div>
          <StepCompletion steps={result.stages} />
          <div className="flex mt-4">
            <div className="flex-grow mr-4">
              {result.stages.filter(step => step.status === 'miss').map((step) => (
                <div key={step.stepNumber} className="bg-[#333] p-1 mb-1 rounded">
                  <span className="text-[#FF4848] font-bold">Step {step.stepNumber}:</span>
                  <span className="text-white ml-1">{step.description}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col space-y-2 w-[141px]">
              <button className="bg-white text-[#3C4257] px-2 py-1 rounded text-sm w-full" onClick={handleShowPersona}>
                Check Persona
              </button>
              <button className="bg-white text-[#3C4257] px-2 py-1 rounded text-sm w-full" onClick={handleShowJourneyDetails}>
                View full details
              </button>
              <button className="bg-[#625AFA] text-white px-2 py-1 rounded text-sm w-full" onClick={() => setChatOpen(true)}>
                Talk with Persona
              </button>
            </div>
          </div>
        </div>
      )}
      <ChatWithPersona
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        personaName={result.persona?.name ?? 'undefined'}
        personaId={result.personaId}
      />
    </div>
  );
}


