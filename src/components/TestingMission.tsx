'use client';

import React from 'react';
import Image from 'next/image';

interface TestingMissionProps {
  isExpanded: boolean;
  taskDescription: string;
  setTaskDescription: (description: string) => void;
  taskInstruction: string;
  setTaskInstruction: (instruction: string) => void;
  onSave: () => void;
  isMinimized: boolean;
}

const TestingMission: React.FC<TestingMissionProps> = ({
  isExpanded,
  taskDescription,
  setTaskDescription,
  taskInstruction,
  setTaskInstruction,
  onSave,
  isMinimized,
}) => {
  if (!isExpanded) {
    return null;
  }

  if (isMinimized) {
    return (
      <div className="flex items-center p-[27px_18px] gap-[15px] border-b border-[#444]">
        <Image src="/Icon.svg" alt="Testing Mission" width={25} height={25} />
        <h2 className="text-[#D9D9D9] text-2xl font-bold leading-[120%] tracking-[-0.48px]">
          Testing Mission
        </h2>
        <Image src="/check-circle.svg" alt="Valid" width={16} height={16} className="ml-auto" />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-[27px_58px_27px_18px] gap-[15px] border-b border-[#444]">
      <div className="flex items-center gap-2">
        <Image src="/Icon.svg" alt="Testing Mission" width={25} height={25} />
        <h2 className="text-[#D9D9D9] text-2xl font-bold leading-[120%] tracking-[-0.48px]">
          Testing Mission
        </h2>
      </div>
      <div className="w-full">
        <label className="text-[#C9D1D9] text-sm mb-1 block">Task description</label>
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="w-full min-h-[120px] p-2 bg-[#21262D] border border-[#505050] rounded-md text-[#C9D1D9] resize-none"
          placeholder="Define the specific task or mission for the testers. Example tasks: 
-Verify whether the login process is friendly for new users.
-Test the create group chat user journey."
        />
      </div>
      <div className="w-full">
        <label className="text-[#C9D1D9] text-sm mb-1 block">Task Instruction</label>
        <textarea
          value={taskInstruction}
          onChange={(e) => setTaskInstruction(e.target.value)}
          className="w-full min-h-[120px] p-2 bg-[#21262D] border border-[#505050] rounded-md text-[#C9D1D9] resize-none"
          placeholder="Give a 1-2 sentence of instruction for the testers to follow. For example: Please create a group chat with 3 random contacts."
        />
      </div>
    </div>
  );
};

export default TestingMission;

