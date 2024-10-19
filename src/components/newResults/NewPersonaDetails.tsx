// src/components/newResults/NewPersonaDetails.tsx
import React, { useState, useEffect } from 'react';
import { TestPersona } from '../../types/test/result';

interface NewPersonaDetailsProps {
  personaId: string;
  onClose: () => void;
}

const NewPersonaDetails: React.FC<NewPersonaDetailsProps> = ({ personaId, onClose }) => {
  const [persona, setPersona] = useState<TestPersona | null>(null);

  useEffect(() => {
    // In a real application, you would fetch the persona details here
    // For now, we'll use mock data
    setPersona({
      name: 'John Doe',
      age: 30,
      gender: 'Male',
      occupation: 'Software Engineer',
      location: 'New York, USA',
      characteristic: 'Tech-savvy, detail-oriented'
    });
  }, [personaId]);

  if (!persona) return null;

  return (
    <div className="fixed top-0 right-0 w-1/3 h-full bg-[#333] p-6 overflow-y-auto">
      <button onClick={onClose} className="absolute top-4 right-4 text-white">&times;</button>
      <h2 className="text-2xl font-bold text-white mb-4">{persona.name}</h2>
      <div className="space-y-4">
        <DetailItem label="Age" value={persona.age.toString()} />
        <DetailItem label="Gender" value={persona.gender} />
        <DetailItem label="Occupation" value={persona.occupation} />
        <DetailItem label="Location" value={persona.location} />
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Characteristics</h3>
          <p className="text-[#7D7D7D]">{persona.characteristic}</p>
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <h3 className="text-lg font-semibold text-white">{label}</h3>
    <p className="text-[#7D7D7D]">{value}</p>
  </div>
);

export default NewPersonaDetails;

