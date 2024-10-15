import React from 'react';
import Image from 'next/image';

interface BoundingToolPromptProps {
  onClose: () => void;
}

const BoundingToolPrompt: React.FC<BoundingToolPromptProps> = ({ onClose }) => (
  <div 
    className="absolute bg-white p-4 rounded-lg shadow-lg z-50" 
    style={{ 
      top: '200px',
      left: '43%',
      transform: 'translateX(-50%)'
    }}
  >
    <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
      <Image src="/close-icon.svg" alt="Close" width={16} height={16} />
    </button>
    <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white absolute -top-2 left-1/2 transform -translate-x-1/2"></div>
    <div className="text-[#625AFA] font-bold mb-2">Create a touch point</div>
    <div className="text-sm">
      Use bounding box to indicate<br />
      potential user touch point
    </div>
  </div>
);

export default BoundingToolPrompt;
