// src/components/PersonaDetails.tsx

// Import necessary modules from React and Next.js Image component
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { SelectPersona } from '../db/schema';

// Defines interface for PersonaDetailsProps to ensure type safety for props.
interface PersonaDetailsProps {
  persona: SelectPersona | null;
  isOpen: boolean;
  onClose: () => void;
}


// PersonaDetails component displays detailed information about a selected persona.
const PersonaDetails: React.FC<PersonaDetailsProps> = ({ persona, isOpen, onClose }) => {
  const [width, setWidth] = useState(463);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

    // Handles resizing of the sidebar.
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const newWidth = window.innerWidth - e.clientX;
      setWidth(Math.max(300, Math.min(newWidth, 800)));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Render null if not open or no persona is selected.
  if (!isOpen || !persona) return null;

  return (
    <div
      // Sidebar content here.
      ref={sidebarRef}
      className="fixed top-16 right-0 h-[calc(100vh-64px)] bg-[#333] border-l border-[#272728] flex flex-col font-['Almarai']"
      //className="fixed top-0 right-0 h-full bg-[#333] border-l border-[#272728] flex flex-col font-['Almarai']"
      style={{ width: `${width}px` }}
    >
      <div className="flex items-center p-4 border-b border-[#272728]">
        <Image src="/profile-list.svg" alt="Profile" width={20} height={20} />
        <span className="ml-4 text-white font-bold text-base">Persona Details</span>
        <button onClick={onClose} className="ml-auto text-white">&times;</button>
      </div>
      <div className="flex p-4">
        <Image src="/ellipse-65.svg" alt="User" width={66} height={64} className="rounded-full" />
        <div className="ml-6 flex-1">
        {Object.entries(persona).map(([key, value]) => (
          key !== 'characteristic' && (
            <p key={key} className="text-white text-base leading-6">
              <span className="font-normal">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>{' '}
              <span className="text-[#BEBEBE] font-normal">
            {value instanceof Date ? value.toLocaleString() : String(value)}
            </span>
            </p>
          )
        ))}

        </div>
      </div>
      <div className="p-4 overflow-y-auto flex-1">
        <p className="text-[#EAEAEA] text-base leading-6 font-normal">{persona.characteristic}</p>
      </div>
      <div
        className="absolute left-0 top-1/2 w-1.5 h-20 bg-[#4F4F4F] rounded-full cursor-ew-resize"
        onMouseDown={() => { isDragging.current = true; }}
      ></div>
    </div>
  );
};

// Export the component.
export default PersonaDetails;


