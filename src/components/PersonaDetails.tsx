// src/components/PersonaDetails.tsx
import React from 'react';
import Image from 'next/image';
import { TestPersona } from '../types/test/result';

interface PersonaDetailsProps {
  persona: TestPersona | null;
  isOpen: boolean;
  onClose: () => void;
}

const PersonaDetails: React.FC<PersonaDetailsProps> = ({ persona, isOpen, onClose }) => {
  if (!isOpen || !persona) return null;

  return (
    <div className="fixed top-16 right-0 h-[calc(100vh-64px)] w-[400px] bg-[#333] border-l border-[#272728] flex flex-col font-['Almarai']">
      <div className="flex items-center p-4 border-b border-[#272728]">
        <Image src="/user.svg" alt="User" width={20} height={20} />
        <span className="ml-4 text-white font-bold text-base">Persona Details</span>
        <button onClick={onClose} className="ml-auto text-white">&times;</button>
      </div>
      <div className="p-4 overflow-y-auto flex-1">
        <h2 className="text-white text-xl font-bold mb-4">{persona.name}</h2>
        <div className="grid grid-cols-2 gap-4">
          <DetailItem label="Age" value={persona.age.toString()} />
          <DetailItem label="Gender" value={persona.gender} />
          <DetailItem label="Occupation" value={persona.occupation} />
          <DetailItem label="Location" value={persona.location} />
        </div>
        <div className="mt-4">
          <h3 className="text-white font-bold mb-2">Characteristics</h3>
          <p className="text-[#D0D0D0]">{persona.characteristic}</p>
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <span className="text-[#7D7D7D] text-sm">{label}</span>
    <p className="text-white">{value}</p>
  </div>
);

export default PersonaDetails;


