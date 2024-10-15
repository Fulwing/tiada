'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface SupportDocumentationProps {
  relatedWebsites: string[];
  setRelatedWebsites: React.Dispatch<React.SetStateAction<string[]>>;
  uploadedFiles: File[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onFinishUpload: () => void;
  isSubmitting: boolean;
}

const SupportDocumentation: React.FC<SupportDocumentationProps> = ({
  relatedWebsites,
  setRelatedWebsites,
  uploadedFiles,
  setUploadedFiles,
  onFinishUpload,
  isSubmitting
}) => {
  const [url, setUrl] = useState('');
  const [isExampleExpanded, setIsExampleExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exampleCards = [
    { title: 'Product Manuals', description: 'Comprehensive guides detailing the operation, maintenance, and troubleshooting of the product.' },
    { title: 'Research Reports', description: 'Analytical documents or studies that provide insights into the products development, market analysis, and user feedback.' },
    { title: 'Product Pitch Deck', description: 'A presentation that outlines your products value proposition, key features, and market positioning.' },
    { title: 'Training Materials', description: 'Resources used to educate staff or users, which can give insights into the intended use of the product.' },
    { title: 'Product Website', description: 'URL to your products official webpage that includes up-to-date information, features, and the latest updates.' },
    { title: 'Customer Feedback', description: 'Summaries or compilations of user feedback or product reviews that provide insight into user experiences and satisfaction.' },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleUrlSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && url.trim()) {
      setRelatedWebsites(prev => [...prev, url.trim()]);
      setUrl('');
    }
  };

  const removeWebsite = (index: number) => {
    setRelatedWebsites(prev => prev.filter((_, i) => i !== index));
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1 flex flex-col p-[27px_25px_45px_25px] gap-[14px] rounded-xl border border-[#505050] bg-[#1C1D1F] relative">
      <div className="flex items-center gap-2">
        <Image src="/Paperclip.svg" alt="Support Documentation" width={48} height={48} />
        <h2 className="text-[#D9D9D9] text-2xl font-bold leading-[120%] tracking-[-0.48px]">
          Testing Support Documentation
        </h2>
      </div>
      <p className="text-[#C9D1D9] text-sm leading-[140%]">
        To optimize the effectiveness of our AI-driven testing and to ensure that our AI personas can deliver the most accurate and useful feedback, we require specific documentation related to your product. Uploading detailed support documentation enables Tiada system to access a rich context, enhancing its understanding of your product&apos;s intricacies.
      </p>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />
      <button 
        className="bg-[#625AFA] text-[#C9D1D9] py-2 px-6 rounded-md text-base font-medium"
        onClick={() => fileInputRef.current?.click()}
      >
        Upload documents from local device
      </button>
      <div className="flex flex-wrap gap-2 mt-2">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="bg-[#625AFA] text-[#C9D1D9] py-1 px-2 rounded-md text-sm flex items-center">
            {file.name}
            <button onClick={() => removeFile(index)} className="ml-2">
              <Image src="/close-icon.svg" alt="Remove" width={12} height={12} />
            </button>
          </div>
        ))}
      </div>
      <div className="w-full">
        <label className="text-[#D9D1D9] text-sm mb-1 block">Related Website</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleUrlSubmit}
          className="w-full p-2 bg-[#21262D] border border-[#505050] rounded-md text-[#C9D1D9]"
          placeholder="https://testingproduct.homepage"
        />
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {relatedWebsites.map((website, index) => (
          <div key={index} className="bg-[#625AFA] text-[#C9D1D9] py-1 px-2 rounded-md text-sm flex items-center">
            {website}
            <button onClick={() => removeWebsite(index)} className="ml-2">
              <Image src="/close-icon.svg" alt="Remove" width={12} height={12} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExampleExpanded(!isExampleExpanded)}>
          <h3 className="text-[#D9D9D9] text-base font-semibold">Example of what to upload</h3>
          <Image 
            src="/Chevron down.svg" 
            alt="Expand" 
            width={24} 
            height={24} 
            className={`transform transition-transform duration-200 ${isExampleExpanded ? 'rotate-0' : 'rotate-90'}`}
          />
        </div>
        <p className="text-[#C9D1D9] text-sm">
          Acceptable format: PDF, DOC/DOCX, PPT/PPTX, TXT, Web link, Image(jpg, png)
        </p>
        {isExampleExpanded && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {exampleCards.map((card, index) => (
              <div key={index} className="flex flex-col gap-2 p-4 bg-[#21262D] rounded-md">
                <div className="flex items-center gap-2">
                  <Image src="/Info.svg" alt="Info" width={32} height={32} />
                  <h4 className="text-[#C9D1D9] text-sm font-medium">{card.title}</h4>
                </div>
                <p className="text-[#939CA5] text-xs">{card.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <button 
      className="absolute right-4 bottom-4 bg-[#625AFA] text-[#C9D1D9] py-1 px-4 rounded-md text-sm font-medium disabled:opacity-50"
      onClick={onFinishUpload}
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Submitting...' : 'Finish Upload'}
    </button>
    </div>
  );
};

export default SupportDocumentation;