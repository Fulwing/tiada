import React from 'react';
import Image from 'next/image';

interface AnnotationControlsProps {
  onToolChange: (tool: string) => void;
  currentTool: string;
}

const AnnotationControls: React.FC<AnnotationControlsProps> = ({ onToolChange, currentTool }) => {
  return (
    <div className="flex justify-center bg-[#0D1117] p-2">
      <button 
        className={`p-2 ${currentTool === 'select' ? 'bg-[#625AFA]' : 'bg-[#21262D]'} rounded-l`}
        onClick={() => onToolChange('select')}
      >
        <Image src="/Mouse-pointer.svg" alt="Select" width={24} height={24} />
      </button>
      <button 
        className={`p-2 ${currentTool === 'rectangle' ? 'bg-[#625AFA]' : 'bg-[#21262D]'} border-l border-[#333]`}
        onClick={() => onToolChange('rectangle')}
      >
        <Image src="/Group-3730.svg" alt="Rectangle" width={24} height={24} />
      </button>
      <button 
        className={`p-2 ${currentTool === 'polygon' ? 'bg-[#625AFA]' : 'bg-[#21262D]'} border-l border-[#333]`}
        onClick={() => onToolChange('polygon')}
      >
        <Image src="/Group-3731.svg" alt="Polygon" width={24} height={24} />
      </button>
      <button 
        className={`p-2 ${currentTool === 'zoomIn' ? 'bg-[#625AFA]' : 'bg-[#21262D]'} border-l border-[#333]`}
        onClick={() => onToolChange('zoomIn')}
      >
        <Image src="/Zoom-in.svg" alt="Zoom In" width={24} height={24} />
      </button>
      <button 
        className={`p-2 ${currentTool === 'zoomOut' ? 'bg-[#625AFA]' : 'bg-[#21262D]'} border-l border-[#333]`}
        onClick={() => onToolChange('zoomOut')}
      >
        <Image src="/Zoom-out.svg" alt="Zoom Out" width={24} height={24} />
      </button>
      <button 
        className={`p-2 ${currentTool === 'move' ? 'bg-[#625AFA]' : 'bg-[#21262D]'} border-l border-[#333] rounded-r`}
        onClick={() => onToolChange('move')}
      >
        <Image src="/Move.svg" alt="Move" width={24} height={24} />
      </button>
    </div>
  );
};

export default AnnotationControls;