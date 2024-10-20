import React from 'react';
import { motion } from 'framer-motion';
import { UploadedImage } from './FrontPage';
import { v4 as uuidv4 } from 'uuid';

interface UploadPromptProps {
  onImageUpload: (images: UploadedImage[]) => void;
}

const UploadPrompt: React.FC<UploadPromptProps> = ({ onImageUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Convert File[] to UploadedImage[]
      const newImages: UploadedImage[] = Array.from(files).map(file => ({
        id: uuidv4(),
        src: URL.createObjectURL(file),
        name: file.name.split('.').slice(0, -1).join('.'),
        filename: file.name,
        file: file,
        regions: [],
        used: false,
        touchpoints: 0,
        trueTouchpoints: 0,
        falseTouchpoints: 0
      }));
      // Pass the converted UploadedImage[] to the parent
      onImageUpload(newImages);
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-[#0D1117]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#21262D] border-2 border-[#625AFA] rounded-lg p-8 text-center"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Upload Interfaces for testing</h2>
        <p className="mb-6 text-white">Select and upload at least 2 local image files (png, jpg)</p>
        <div className="flex space-x-4 justify-center">
          <button className="px-4 py-2 bg-gray-700 rounded text-white">Q&A</button>
          <label className="px-4 py-2 bg-[#625AFA] rounded cursor-pointer text-white">
            Select Files
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange} // Call handleFileChange to process File[]
              className="hidden"
              multiple
            />
          </label>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadPrompt;
