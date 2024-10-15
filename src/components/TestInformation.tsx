'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface TestInformationProps {
  testName: string;
  setTestName: (name: string) => void;
  productType: string;
  setProductType: (type: string) => void;
  productDescription: string;
  setProductDescription: (description: string) => void;
  onSave: () => void;
  isMinimized: boolean;
}

const TestInformation: React.FC<TestInformationProps> = ({
  testName,
  setTestName,
  productType,
  setProductType,
  productDescription,
  setProductDescription,
  onSave,
  isMinimized,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  if (isMinimized) {
    return (
      <div className="flex items-center p-[27px_18px] gap-[15px] border-b border-[#444]">
        <Image src="/Box.svg" alt="Test Information" width={48} height={48} />
        <h2 className="text-[#D9D9D9] text-2xl font-bold leading-[120%] tracking-[-0.48px]">
          Test Information
        </h2>
        <span className="text-[#C9D1D9] text-sm ml-auto">{testName}</span>
        <Image src="/check-circle.svg" alt="Valid" width={16} height={16} />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-[27px_58px_40px_18px] gap-[15px] border-b border-[#444]">


      <div className="flex items-center gap-2">
        <Image src="/Box.svg" alt="Test Information" width={48} height={48} />
        <h2 className="text-[#D9D9D9] text-2xl font-bold leading-[120%] tracking-[-0.48px]">
          Test Information
        </h2>
      </div>
      <div className="w-[240px] relative">
        <label className="text-[#D9D9D9] text-sm mb-1 block">Test Name</label>
        <input
          type="text"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full p-2 bg-[#21262D] border border-[#505050] rounded-md text-[#C9D1D9]"
          placeholder="Enter test name"
        />
        {testName && !isFocused && (
          <Image
            src="/check-circle.svg"
            alt="Valid"
            width={16}
            height={16}
            className="absolute right-2 top-[70%] transform -translate-y-1/2"
          />
        )}
      </div>
      <div>
        <p className="text-[#D9D9D9] text-sm mb-1">Type of testing product</p>
        <div className="flex w-[230px]">
          <button
            className={`flex-1 py-1 px-4 text-sm ${
              productType === 'new'
                ? 'bg-[#625AFA] text-white'
                : 'bg-[#21262D] text-[#C9D1D9]'
            } rounded-l-md border border-[#505050]`}
            onClick={() => setProductType('new')}
          >
            New Product
          </button>
          <button
            className={`flex-1 py-1 px-4 text-sm ${
              productType === 'revised'
                ? 'bg-[#625AFA] text-white'
                : 'bg-[#21262D] text-[#C9D1D9]'
            } rounded-r-md border border-[#505050] border-l-0`}
            onClick={() => setProductType('revised')}
          >
            Revised Product
          </button>
        </div>
      </div>
      <div className="w-full">
        <label className="text-[#C9D1D9] text-sm mb-1 block">Description of the new product</label>
        <textarea
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          className="w-full min-h-[80px] p-2 bg-[#21262D] border border-[#505050] rounded-md text-[#C9D1D9] resize-none"
          placeholder="Briefly describe the product you are going to test"
        />
      </div>
    </div>
  );
};

export default TestInformation;

