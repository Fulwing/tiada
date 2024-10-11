import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { UploadedImage } from './FrontPage';

interface LeftSidebarProps {
  selectedImage: UploadedImage | null;
  onUpdateImage: (updatedImage: UploadedImage) => void;
  onSaveAnnotations: () => void;
  pendingAnnotationsCount: number;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ 
    selectedImage, 
    onUpdateImage, 
    onSaveAnnotations,
    pendingAnnotationsCount
  }) => {
    const [editingTitle, setEditingTitle] = useState(false);
    const [editingDescription, setEditingDescription] = useState(false);
    const [tempTitle, setTempTitle] = useState('');
    const [tempDescription, setTempDescription] = useState('');

    useEffect(() => {
        if (selectedImage) {
          setTempTitle(selectedImage.name);
          setTempDescription(selectedImage.description || '');
        }
      }, [selectedImage]);

      const handleTitleEdit = () => {
        setEditingTitle(true);
      };

      const handleTitleSave = () => {
        if (selectedImage) {
          onUpdateImage({ ...selectedImage, name: tempTitle });
        }
        setEditingTitle(false);
      };

      const handleDescriptionEdit = () => {
        setEditingDescription(true);
      };

      const handleDescriptionSave = () => {
        if (selectedImage) {
          onUpdateImage({ ...selectedImage, description: tempDescription });
        }
        setEditingDescription(false);
      };

      if (!selectedImage) {
        return (
          <aside className="w-60 border-r border-[#333] bg-[#0D1117] p-3 flex flex-col">
            <h3 className="text-[#C9D1D9] text-sm font-medium mb-6">Annotate Interfaces</h3>
            <p className="text-[#C9D1D9] text-sm">Select an image to view details</p>
          </aside>
        );
      }

      return (
        <aside className="w-60 border-r border-[#333] bg-[#0D1117] p-3 flex flex-col">
          <h3 className="text-[#C9D1D9] text-sm font-medium mb-6">Annotate Interfaces</h3>
          
          <div className="mb-4">
            {editingTitle ? (
              <div>
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  className="bg-[#21262D] text-[#C9D1D9] p-1 w-full"
                />
                <button onClick={handleTitleSave} className="text-[#C9D1D9] mt-2">Save</button>
              </div>
        ) : (
            <div className="flex items-center justify-between">
              <h4 className="text-[#C9D1D9] text-lg font-semibold">{selectedImage.name}</h4>
              <button onClick={handleTitleEdit}>
                <Image src="/Edit 3.svg" alt="Edit title" width={16} height={16} />
              </button>
            </div>
          )}
        </div>
    
          <p className="text-[#C9D1D9] text-xs mb-4">{selectedImage.filename}</p>

      <div className="mb-4">
        {editingDescription ? (
          <div>
            <textarea
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              className="bg-[#21262D] text-[#C9D1D9] p-1 w-full h-20"
            />
            <button onClick={handleDescriptionSave} className="text-[#C9D1D9] mt-2">Save</button>
          </div>
        ) : (
          <div>
            <p className="text-[#8B949E] text-sm mb-2">
              {selectedImage.description || "Write a page functionality description here to better set up the testing context. (optional)"}
            </p>
            <button onClick={handleDescriptionEdit} className="text-[#C9D1D9] text-sm border border-[#30363D] rounded px-2 py-1">
              Edit page description
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-[#21262D] py-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[#C9D1D9] text-base font-semibold">Touch point</h4>
          <span className="bg-[#6E76814D] text-[#C9D1D9] text-xs px-2 py-1 rounded-full">
            {selectedImage.touchpoints}
          </span>
        </div>
        <div className="flex items-center mb-2">
          <Image src="/Frame.svg" alt="True" width={16} height={16} />
          <span className="text-[#C9D1D9] text-sm ml-2 flex-grow">True Touch points</span>
          <span className="text-[#3FB950] text-xs border border-[#238636] rounded-full px-2">
            {selectedImage.trueTouchpoints}
          </span>
        </div>
        <div className="flex items-center">
          <Image src="/Frame.svg" alt="Incorrect" width={16} height={16} />
          <span className="text-[#C9D1D9] text-sm ml-2 flex-grow">False Touch points</span>
          <span className="text-[#FF4848] text-xs border border-[#FF4848] rounded-full px-2">
            {selectedImage.falseTouchpoints}
          </span>
        </div>
      </div>
      <div className="mt-auto">
        <button 
          className="w-full bg-[#21262D] text-white py-2 px-4 rounded mb-2"
          onClick={onSaveAnnotations}
          disabled={pendingAnnotationsCount === 0}
        >
          Save Annotations ({pendingAnnotationsCount})
        </button>
        <button className="w-full bg-[#21262D] text-white py-2 px-4 rounded">Discard change</button>
      </div>
    </aside>
  );
};

export default LeftSidebar;