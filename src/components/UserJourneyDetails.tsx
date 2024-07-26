// src/components/UserJourneyDetails.tsx

// Import necessary modules from React and Next.js Image component
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Step } from '../types/index';

// Define the interface for UserJourneyDetailsProps
interface UserJourneyDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  steps: Step[];
  generalFeedback: string;
}

// Define the UserJourneyDetails functional component
const UserJourneyDetails: React.FC<UserJourneyDetailsProps> = ({ isOpen, onClose, steps, generalFeedback }) => {
  const [width, setWidth] = useState(463);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

    // Effect to handle mouse move and mouse up events for resizing the sidebar
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const newWidth = window.innerWidth - e.clientX;
      setWidth(Math.max(300, Math.min(newWidth, 800)));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

    // Return null if the sidebar is not open
  if (!isOpen) return null;

  return (
    <div
      ref={sidebarRef}
      className="fixed top-16 right-0 h-[calc(100vh-64px)] bg-[#333] border-l border-[#272728] flex flex-col font-['Almarai']"
      //className="fixed top-0 right-0 h-full bg-[#333] border-l border-[#272728] flex flex-col font-['Inter']"
      style={{ width: `${width}px` }}
    >
      <div className="flex items-center p-4 border-b border-[#272728]">
        <Image src="/view-grid.svg" alt="View Grid" width={20} height={20} />
        <span className="ml-4 text-white font-bold text-base">User Journey Details</span>
        <button onClick={onClose} className="ml-auto text-white">&times;</button>
      </div>
      <div className="bg-[#2B2B2B] p-4 overflow-x-auto">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.stepNumber}>
              <div className={`w-[102px] h-[158px] flex-shrink-0 rounded-[7px] border ${step.status === 'success' ? 'border-[#2AFF73]' : 'border-[#FF4848]'} bg-[#272728] flex flex-col items-center justify-center`}>
                <Image src={step.image} alt={`Step ${step.stepNumber}`} width={90} height={128} className="rounded" />
                <span className={`mt-1 text-sm ${step.status === 'success' ? 'text-[#2AFF73]' : 'text-[#FF4848]'} font-normal`}>
                  Step {step.stepNumber}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-[20.5px] h-[1px] mx-2 ${step.status === 'success' ? 'bg-[#14FF00]' : 'bg-[#FF2A2A]'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="p-4 overflow-y-auto flex-1">
        <div className="mb-4">
          {steps.map((step) => (
            <p key={step.stepNumber} className={`mb-1.5 ${step.status === 'success' ? 'text-[#52FF00]' : 'text-[#FF4848]'} text-lg font-normal`}>
              Step {step.stepNumber}: {step.description}
            </p>
          ))}
        </div>
        <div className="mt-4">
          <h3 className="text-white font-bold mb-2">General Feedback</h3>
          <p className="text-[#D0D0D0]">{generalFeedback}</p>
        </div>
      </div>
      <div
        className="absolute left-0 top-1/2 w-1.5 h-20 bg-[#4F4F4F] rounded-full cursor-ew-resize"
        onMouseDown={() => { isDragging.current = true; }}
      ></div>
    </div>
  );
};

// LINE 86: <FormattedFeedback feedback={generalFeedback} />

// Export the UserJourneyDetails component as the default export
export default UserJourneyDetails;


