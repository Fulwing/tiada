import React from 'react';
import { TestResult } from '../../types/test/result';
import ExpandedUserJourney from './ExpandedUserJourney';

interface NewUserJourneyProps {
  result: TestResult;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onCheckPersonaInfo: (personaId: string) => void;
  onViewTestingDetails: (journeyId: string) => void;
  onTalkWithPersona: (personaId: string, personaName: string) => void;
}

const NewUserJourney: React.FC<NewUserJourneyProps> = ({ 
  result, 
  index, 
  isExpanded, 
  onToggleExpand,
  onCheckPersonaInfo,
  onViewTestingDetails,
  onTalkWithPersona
}) => {
  const errors = result.stages.filter(stage => stage.status === 'miss').length;

  return (
    <>
      <tr className="border-b border-[#30363D] hover:bg-[#161B22] text-white">
          <td className="p-2">
            <div className="flex items-center">
              <input type="checkbox" className="mr-2 bg-[#F5F5F5] rounded" />
              {index}
            </div>
          </td>
          <td className={`p-2 ${result.taskCompletion === 'Success' ? 'text-[#3FB950]' : 'text-[#FF4848]'}`}>
            {result.taskCompletion}
          </td>
          <td className="p-2">{result.steps}</td>
          <td className="p-2">{errors}</td>
          <td className="p-2">{result.name}</td>
          <td className="p-2">{result.persona?.characteristic || 'N/A'}</td>
          <td className="p-2">{result.age}</td>
          <td className="p-2">{result.gender}</td>
          <td className="p-2">{result.occupation}</td>
          <td className="p-2">{result.persona?.location || 'N/A'}</td>
          <td className="p-2">N/A</td>
          <td className="p-2">
            <button onClick={onToggleExpand} className="text-[#625AFA] hover:underline">
              {isExpanded ? 'Hide Details' : 'View Details'}
            </button>
          </td>
          </tr>
          {isExpanded && (
        <ExpandedUserJourney 
          result={result} 
          onCheckPersonaInfo={onCheckPersonaInfo}
          onViewTestingDetails={onViewTestingDetails}
          onTalkWithPersona={onTalkWithPersona}
        />
      )}
    </>
  );
};

export default NewUserJourney;


