// src/components/newResults/NewUserJourneyDetails.tsx
import React, { useState, useEffect } from 'react';
import { TestResult } from '../../types/test/result';

interface NewUserJourneyDetailsProps {
  journeyId: string;
  onClose: () => void;
}

const NewUserJourneyDetails: React.FC<NewUserJourneyDetailsProps> = ({ journeyId, onClose }) => {
  const [journey, setJourney] = useState<TestResult | null>(null);

  useEffect(() => {
    // In a real application, you would fetch the journey details here
    // For now, we'll use mock data
    setJourney({
      id: journeyId,
      taskCompletion: 'Success',
      steps: 5,
      name: 'John Doe',
      gender: 'Male',
      age: 30,
      occupation: 'Software Engineer',
      completionTime: 120000,
      stages: [
        { stepNumber: 1, status: 'success', description: 'Open application', image: '', userAction: 'Clicked on app icon', userExplanation: 'I saw the app icon on my home screen' },
        { stepNumber: 2, status: 'success', description: 'Navigate to login page', image: '', userAction: 'Clicked on login button', userExplanation: 'The login button was clearly visible' },
        { stepNumber: 3, status: 'success', description: 'Enter credentials', image: '', userAction: 'Typed username and password', userExplanation: 'I entered my pre-existing account details' },
        { stepNumber: 4, status: 'success', description: 'Submit login form', image: '', userAction: 'Clicked submit button', userExplanation: 'After entering my details, I submitted the form' },
        { stepNumber: 5, status: 'success', description: 'View dashboard', image: '', userAction: 'Observed dashboard', userExplanation: 'I was automatically taken to the dashboard after logging in' }
      ],
      generalFeedback: 'The login process was smooth and intuitive. I had no issues completing the task.',
      personaId: 'persona1',
      coreId: 'core1'
    });
  }, [journeyId]);

  if (!journey) return null;

  return (
    <div className="fixed top-0 right-0 w-1/2 h-full bg-[#333] p-6 overflow-y-auto">
      <button onClick={onClose} className="absolute top-4 right-4 text-white">&times;</button>
      <h2 className="text-2xl font-bold text-white mb-4">User Journey Details</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Journey Overview</h3>
          <div className="flex mb-4">
            {journey.stages.map((stage, index) => (
              <div key={stage.stepNumber} className="flex items-center">
                <div className={`w-4 h-4 rounded-full ${stage.status === 'success' ? 'bg-[#02FF2B]' : 'bg-[#FF4848]'}`}></div>
                {index < journey.stages.length - 1 && <div className="w-12 h-0.5 bg-[#444]"></div>}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Step Details</h3>
          {journey.stages.map((stage) => (
            <div key={stage.stepNumber} className="mb-4 p-3 bg-[#444] rounded">
              <h4 className={`font-semibold ${stage.status === 'success' ? 'text-[#02FF2B]' : 'text-[#FF4848]'}`}>
                Step {stage.stepNumber}: {stage.description}
              </h4>
              <p className="text-[#7D7D7D] mt-1">User Action: {stage.userAction}</p>
              <p className="text-[#7D7D7D] mt-1">User Explanation: {stage.userExplanation}</p>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">General Feedback</h3>
          <p className="text-[#7D7D7D]">{journey.generalFeedback}</p>
        </div>
      </div>
    </div>
  );
};

export default NewUserJourneyDetails;

