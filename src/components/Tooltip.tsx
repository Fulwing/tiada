import React from 'react';

interface TooltipProps {
  text: string;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text, className = '' }) => {
  return (
    <div className={`absolute left-full ml-2 top-1/2 transform -translate-y-1/2 ${className}`}>
      <div className="relative bg-white p-3 rounded-md shadow-md inline-block">
        <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-white border-l border-b border-[#625AFA]"></div>
        <p className="text-[#625AFA] text-center font-semibold text-sm whitespace-nowrap">{text}</p>
      </div>
    </div>
  );
};

export default Tooltip;