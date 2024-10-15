import React, { useState } from 'react';
import Image from 'next/image';
import Tooltip from './Tooltip';
import { Annotation, UploadedImage } from './FrontPage';

interface CustomAnnotationBoxProps {
  onSave: (annotation: Omit<Annotation, 'imageSrc'>) => void;
  onDiscard: () => void;
  availablePages: UploadedImage[];
  showTooltips: boolean;
  currentAnnotation: Partial<Annotation>;
}

const CustomAnnotationBox: React.FC<CustomAnnotationBoxProps> = ({
  onSave,
  onDiscard,
  availablePages,
  showTooltips,
  currentAnnotation,
}) => {
  const [name, setName] = useState(currentAnnotation.name || '');
  const [isTrue, setIsTrue] = useState(currentAnnotation.isTrue ?? true);
  const [navigateToId, setNavigateToId] = useState(currentAnnotation.navigateToId || '');
  const [nameError, setNameError] = useState('');

  const handleSave = () => {
    if (name.trim() === '') {
      setNameError('Name is required');
      return;
    }
    onSave({
      ...currentAnnotation,
      name,
      isTrue,
      navigateToId,
    } as Omit<Annotation, 'imageSrc'>);
  };

  return (
    <div className="flex flex-col w-[276px] p-[15px_17px] gap-[13px] rounded-[6px] border-[1.8px] border-[#625AFA] bg-[#2D2D2D] relative">
      <h3 className="text-white text-sm font-semibold w-[150px]">New Touch Point</h3>
      
      <div className="relative">
        <input
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
            setNameError('');
          }}
          placeholder="Touch point name"
          className="w-[234px] h-[35px] px-[13px] py-[6px] bg-[#010409] border border-[#757575] text-[#C9D1D9] rounded-[6px]"
        />
        {!nameError && name && (
          <Image
            src="/Check circle.svg"
            alt="Valid"
            width={20}
            height={20}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          />
        )}
        {showTooltips && (
          <Tooltip text="Name your touch point" />
        )}
      </div>
      {nameError && (
        <div className="flex items-start gap-[12px] bg-[#FF4848] bg-opacity-10 p-2 rounded">
          <Image src="/Info.svg" alt="Error" width={20} height={20} />
          <div>
            <p className="text-[#FF4848] text-sm font-semibold">Name has to be unique</p>
            <p className="text-[#FF4848] text-xs">Touch point with this name has already existed on this page</p>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="flex w-[179px] h-[33px]">
          <button
            onClick={() => setIsTrue(true)}
            className={`flex-1 rounded-l-md ${isTrue ? 'bg-[#238636]' : 'bg-[#21262D]'} text-[#C9D1D9] text-xs`}
          >
            True Point
          </button>
          <button
            onClick={() => setIsTrue(false)}
            className={`flex-1 rounded-r-md ${!isTrue ? 'bg-[#FF4848]' : 'bg-[#21262D]'} text-[#C9D1D9] text-xs`}
          >
            Wrong Point
          </button>
        </div>
        {showTooltips && (
          <Tooltip text="Is this the touch point we expect?" />
        )}
      </div>

      <div className="relative">
        <label className="text-[#C9D1D9] text-sm">Navigate to</label>
        <select
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNavigateToId(e.target.value)}
          value={navigateToId}
          className="w-full bg-[#21262D] text-[#C9D1D9] rounded-md mt-1 p-2"
        >
          <option value="">Select a page</option>
          {availablePages.map((page) => (
            <option key={page.id} value={page.id}>
              {page.name}
            </option>
          ))}
        </select>
        {showTooltips && (
          <Tooltip 
            text="Which page it will navigate to after click?" 
            className="top-[calc(100%+10px)] -translate-y-0"
          />
        )}
      </div>

      <div className="flex justify-end items-center gap-3 mt-2">
        <button onClick={onDiscard} className="text-[#C9D1D9] text-xs bg-transparent">
          Discard
        </button>
        <button onClick={handleSave} className="bg-[#625AFA] text-white text-xs px-5 py-1.5 rounded">
          Save
        </button>
      </div>
    </div>
  );
};

export default CustomAnnotationBox;