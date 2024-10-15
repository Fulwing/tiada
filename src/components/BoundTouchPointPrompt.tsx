// BoundTouchPointPrompt.tsx

import React from 'react';
import Image from 'next/image';

interface BoundTouchPointPromptProps {
  onClose: () => void;
}

const BoundTouchPointPrompt: React.FC<BoundTouchPointPromptProps> = ({ onClose }) => (
  <div className="absolute bg-white p-4 rounded-lg shadow-lg z-50" style={{ top: '400px', left: '700px' }}>
    <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
      <Image src="/close-icon.svg" alt="Close" width={16} height={16} />
    </button>
    <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white absolute top-1/2 -left-2 transform -translate-y-1/2"></div>
    <div className="text-[#625AFA] text-center font-semibold mb-2">Bound the touch point</div>
    <div className="text-black text-xs">
      Where will the user tap on<br />
      regarding the given task?
    </div>
  </div>
);

export default BoundTouchPointPrompt;