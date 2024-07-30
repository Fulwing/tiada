// src/components/StepDetailsPopup.tsx

// Import necessary modules from React and Next.js Image component
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Step } from '../types/index';

// Define the interface for StepDetailsPopupProps
interface StepDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  step: Step;
  prevStep?: Step;
  nextStep?: Step;
  onStepChange: (direction: 'prev' | 'next') => void;
  images: string[];
}

// Define the StepDetailsPopup functional component
const StepDetailsPopup: React.FC<StepDetailsPopupProps> = ({
    isOpen,
    onClose,
    step,
    prevStep,
    nextStep,
    onStepChange,
    images,
}) => {
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
      style={{ width: `${width}px` }}
    >
      <div className="flex items-center p-4 border-b border-[#272728]">
        <Image src="/view-grid.svg" alt="View Grid" width={20} height={20} />
        <span className="ml-4 text-white font-bold text-base">Page Action Details</span>
        <button onClick={onClose} className="ml-auto text-white">&times;</button>
      </div>
      <div className="flex justify-between items-center p-4 h-[320px]">
        <div className="w-[120px] h-[180px] flex items-center justify-center">
          {prevStep && (
            <Image
              src={images[prevStep.stepNumber - 1]}
              alt="Previous Step"
              width={100}
              height={150}
              className="cursor-pointer opacity-50 object-contain"
              onClick={() => onStepChange('prev')}
            />
          )}
        </div>
        <div className="flex flex-col items-center">
          <div className="w-[220px] h-[280px] relative">
            <Image
              src={images[step.stepNumber - 1]}
              alt={`Step ${step.stepNumber}`}
              layout="fill"
              className="object-contain"
            />
          </div>
          <span className={`mt-2 text-sm ${step.status === 'success' ? 'text-[#02FF2B]' : 'text-[#FF4848]'}`}>
            Step {step.stepNumber}
          </span>
        </div>
        <div className="w-[120px] h-[180px] flex items-center justify-center">
          {nextStep && (
            <Image
              src={images[nextStep.stepNumber - 1]}
              alt="Next Step"
              width={100}
              height={150}
              className="cursor-pointer opacity-50 object-contain"
              onClick={() => onStepChange('next')}
            />
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-white font-bold mb-2">User Action</h3>
        <p className="text-[#FF4848]">{step.userAction}</p>
      </div>
      <div className="p-4">
        <h3 className="text-white font-bold mb-2">User Explanation</h3>
        <p className="text-[#D0D0D0]">{step.userExplanation}</p>
      </div>
      </div>
      <div
        className="absolute left-0 top-1/2 w-1.5 h-20 bg-[#4F4F4F] rounded-full cursor-ew-resize"
        onMouseDown={() => { isDragging.current = true; }}
      ></div>
    </div>
  );
};

// Export the StepDetailsPopup component as the default export
export default StepDetailsPopup;

