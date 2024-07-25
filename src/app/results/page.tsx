// src/app/results/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { SelectPersona } from '../../db/schema';
import { TestResult, Step } from '../../types/index';
import OverallEvaluation from '../../components/OverallEvaluation';
import PersonaDetails from '../../components/PersonaDetails';
import UserJourneyDetails from '../../components/UserJourneyDetails';
import StepDetailsPopup from '../../components/StepDetailsPopup';
import ChatWithPersona from '../../components/ChatWithPersona';

// Helper function to format time in minutes and seconds
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Component to show hover details of a step
function StepHover({ step }: { step: Step }) {
  const [showHover, setShowHover] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowHover(true)}
      onMouseLeave={() => setShowHover(false)}
    >
      <div
        className={`w-3 h-3 rounded-full ${step.status === 'success' ? 'bg-[#02FF2B]' : 'bg-[#FF4848]'
          }`}
      ></div>
      {showHover && (
        <div className="absolute z-10 w-[102px] h-[158px] -left-12 -top-20 bg-[#272728] border border-[#7D7D7D] rounded-[7px] flex flex-col items-center justify-center overflow-hidden">
          <Image
            src={step.image || '/rectangle-6.png'}
            alt={`Step ${step.stepNumber}`}
            width={90}
            height={128}
            className="rounded"
          />
          <span className={`mt-1 text-[8px] ${step.status === 'success' ? 'text-[#02FF2B]' : 'text-[#FF4848]'} font-normal`}>
            Step {step.stepNumber}
          </span>
        </div>
      )}
    </div>
  );
}

// Component to display the step completion timeline
function StepCompletion({ steps }: { steps: Step[] }) {
  let missCount = 0;
  return (
    <div className="flex items-center relative">
      {steps.map((step, index) => {
        if (step.status === 'miss') missCount++;
        return (
          <div key={step.stepNumber} className="flex flex-col items-center" style={{ width: '60px', position: 'relative' }}>
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
              <StepHover step={step} />
            </div>
            <span
              className={`text-[13px] font-light ${step.status === 'success' ? 'text-[#7D7D7D]' : 'text-[#FF6666]'} transform -rotate-45 mt-4`}
              style={{ whiteSpace: 'nowrap', position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%) rotate(-45deg)' }}
            >
              {step.status === 'success' ? `Stage ${step.stepNumber}` : `Miss ${missCount}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Helper function to calculate the number of errors in the steps
const calculateErrors = (steps: Step[]) => {
  return steps.filter(step => step.status === 'miss').length;
};

// Component to display the user journey and its details
function UserJourney({ result, onShowPersona, onShowJourneyDetails }: { result: TestResult; onShowPersona: (persona: SelectPersona) => void; onShowJourneyDetails: (steps: Step[], generalFeedback: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const errors = calculateErrors(result.stages);

  const handleStepClick = (step: Step) => {
    setSelectedStep(step);
  };

  const handleStepChange = (direction: 'prev' | 'next') => {
    if (selectedStep) {
      const currentIndex = result.stages.findIndex(s => s.stepNumber === selectedStep.stepNumber);
      const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex >= 0 && newIndex < result.stages.length) {
        setSelectedStep(result.stages[newIndex]);
      }
    }
  };

  const handleShowPersona = () => {
    setSelectedStep(null);
    onShowPersona(result.persona);
  };

  const handleShowJourneyDetails = () => {
    setSelectedStep(null);
    onShowJourneyDetails(result.stages, result.generalFeedback);
  };

  return (
    <div className="bg-[#333333] rounded-lg mb-4">
      <div className="flex cursor-pointer p-4 items-center" onClick={() => setExpanded(!expanded)}>
        <span className={`w-[15%] ${result.taskCompletion === 'Success' ? 'text-[#02FF2B]' : 'text-[#FF4848]'}`}>{result.taskCompletion}</span>
        <span className="w-[10%] text-[#7D7D7D]">{result.steps}</span>
        <span className="w-[15%] text-[#7D7D7D]">{formatTime(result.completionTime)}</span>
        <span className={`w-[15%] ${errors > 0 ? 'text-[#FF4848]' : 'text-[#02FF2B]'}`}>{errors} Errors</span>
        <span className="w-[15%] text-[#7D7D7D]">{result.persona.name}</span>
        <span className="w-[10%] text-[#7D7D7D]">{result.persona.age}</span>
        <span className="w-[15%] text-[#7D7D7D]">{result.persona.occupation}</span>
        <Image src="/navigation-ic-list-arrow-down.svg" alt="Expand" width={24} height={24} className={`ml-auto transform ${expanded ? 'rotate-180' : ''}`} />
      </div>
      {expanded && (
        <div className="bg-[#2D2D2D] p-4 rounded-b-lg">
          <div className="text-[#FFFFFFCC] mb-2">Steps Overview</div>
          <div className="flex items-center mb-4">
            {result.stages.map((step, index) => (
              <React.Fragment key={step.stepNumber}>
                <div className="flex flex-col items-center cursor-pointer" onClick={() => handleStepClick(step)}>
                  <div className={`w-3 h-3 rounded-full ${step.status === 'success' ? 'bg-[#02FF2B]' : 'bg-[#FF4848]'}`}></div>
                  <span className={`text-xs mt-1 ${step.status === 'success' ? 'text-[#02FF2B]' : 'text-[#FF6666]'}`}>{step.stepNumber}</span>
                </div>
                {index < result.stages.length - 1 && (
                  <div className={`h-0.5 w-8 ${result.stages[index + 1].status === 'success' ? 'bg-[#02FF2B]' : 'bg-[#FF4848]'}`} style={{ marginTop: '-20px' }}></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex">
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
      {selectedStep && (
        <StepDetailsPopup
          isOpen={!!selectedStep}
          onClose={() => setSelectedStep(null)}
          step={selectedStep}
          prevStep={result.stages[selectedStep.stepNumber - 2]}
          nextStep={result.stages[selectedStep.stepNumber]}
          onStepChange={handleStepChange}
        />
      )}
      <ChatWithPersona
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        personaName={result.persona.name}
      />
    </div>
  );
}

// Main ResultsPage component
export default function ResultsPage() {
  const [data, setData] = useState<TestResult[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedPersona, setSelectedPersona] = useState<SelectPersona | null>(null);
  const [selectedJourneyDetails, setSelectedJourneyDetails] = useState<{ steps: Step[], generalFeedback: string } | null>(null);
  const [openSideMenu, setOpenSideMenu] = useState<'persona' | 'journey' | null>(null);

  const fetchData = useCallback(async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('No userId found in localStorage');
      return;
    }

    try {
      const response = await fetch(`/api/results?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data) && data.every(isTestResult)) {
        setData(data);
      } else {
        throw new Error('Invalid data structure received from API');
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setLoading(false);
    }
  }, []);

  // Helper function to validate TestResult object
  function isTestResult(obj: any): obj is TestResult {
    return obj && typeof obj === 'object'
      && 'id' in obj
      && 'taskCompletion' in obj
      && 'steps' in obj
      && 'completionTime' in obj
      && 'persona' in obj
      && 'stages' in obj
      && 'generalFeedback' in obj
      && Array.isArray(obj.stages);
  }

  // Fetch data from the API when the component mounts
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Function to calculate overall evaluation metrics
  const calculateMetrics = (results: TestResult[]) => {
    const totalPersonas = results.length;
    const completedPersonas = results.filter(r => r.taskCompletion === 'Success').length;
    const taskCompletionRatio = Math.round((completedPersonas / totalPersonas) * 100);
    const totalSteps = results.reduce((sum, r) => sum + r.steps, 0);
    const averageSteps = Math.round(totalSteps / totalPersonas);
    const totalCompletionTime = results.reduce((sum, r) => sum + r.completionTime, 0);
    const averageCompletionTime = Math.round(totalCompletionTime / totalPersonas);

    return { taskCompletionRatio, totalPersonas, completedPersonas, averageSteps, averageCompletionTime };
  };

  // Function to sort the data based on the number of failures
  const sortData = () => {
    if (data) {
      const sortedData = [...data].sort((a, b) => {
        const aFailures = a.stages.filter(step => step.status === 'miss').length;
        const bFailures = b.stages.filter(step => step.status === 'miss').length;
        return sortOrder === 'asc' ? aFailures - bFailures : bFailures - aFailures;
      });
      setData(sortedData);
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    }
  };

  if (loading) return <p className="p-6 text-[#7D7D7D]">Loading...</p>;
  if (error) return <p className="p-6 text-[#FF4848]">Error: {error}</p>;

  const metrics = data ? calculateMetrics(data) : { taskCompletionRatio: 0, totalPersonas: 0, completedPersonas: 0, averageSteps: 0, averageCompletionTime: 0 };

  const handleShowPersona = (persona: SelectPersona) => {
    setSelectedPersona(persona);
    setOpenSideMenu('persona');
  };

  const handleClosePersona = () => {
    setSelectedPersona(null);
    setOpenSideMenu(null);
  };

  const handleShowJourneyDetails = (steps: Step[], generalFeedback: string) => {
    setSelectedJourneyDetails({ steps, generalFeedback });
    setOpenSideMenu('journey');
  };

  const handleCloseJourneyDetails = () => {
    setSelectedJourneyDetails(null);
    setOpenSideMenu(null);
  };

  return (
    <div className="min-h-screen bg-[#272728] text-[#7D7D7D] flex pt-16">
      <main className="flex-1 p-6">
        <OverallEvaluation {...metrics} />
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Image src="/flag.svg" alt="Flag" width={24} height={24} className="mr-2" />
              <h2 className="text-xl font-semibold text-[#FFFFFF]">Task completion</h2>
            </div>
            <button onClick={sortData}>
              <Image src="/sort.svg" alt="Sort" width={20} height={24} />
            </button>
          </div>
          <div className="flex items-center text-[#7D7D7D] p-4 rounded-md mb-4 bg-[#272728]">
            <span className="w-[15%] font-medium">Task Completion</span>
            <span className="w-[10%] font-medium">Steps</span>
            <span className="w-[15%] font-medium">Time Used</span>
            <span className="w-[15%] font-medium">Errors Made</span>
            <span className="w-[15%] font-medium">Name</span>
            <span className="w-[10%] font-medium">Age</span>
            <span className="w-[15%] font-medium">Occupation</span>
            <Image src="/settings-ic-settings.svg" alt="Settings" width={24} height={24} className="ml-auto" />
          </div>
        </div>
        {data && data.map((result) => (
          <UserJourney
            key={result.id}
            result={result}
            onShowPersona={handleShowPersona}
            onShowJourneyDetails={handleShowJourneyDetails}
          />
        ))}
      </main>
      <div className="w-1/4 p-4">
        <div className="flex items-center mt-2">
          <span className="mr-2 text-[18px] text-[#FFFFFF]">Suggestions for user testing</span>
          <Image src="/help-message.svg" alt="Chat" width={24} height={24} />
        </div>
        {/* Add content for suggestions here */}
      </div>
      <PersonaDetails
        persona={selectedPersona}
        isOpen={openSideMenu === 'persona'}
        onClose={handleClosePersona}
      />

      <UserJourneyDetails
        isOpen={openSideMenu === 'journey'}
        onClose={handleCloseJourneyDetails}
        steps={selectedJourneyDetails?.steps || []}
        generalFeedback={selectedJourneyDetails?.generalFeedback || ''}
      />
    </div>
  );
}
