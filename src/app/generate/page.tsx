/**
 * PREVIOUS CODE
// components/Page.tsx
"use client";

import React, { useState } from 'react';

export default function Page() {
  const [number, setNumber] = useState('');
  const [age, setAge] = useState('');
  const [story, setStory] = useState('');
  const [persona, setPersona] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGeneratePersona = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({number, age, story }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate persona');
      }
      setPersona(data.persona.name);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Generate AI Persona</h1>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <div>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Number"
            className="input input-bordered w-full mb-4"
          />
          <input
            type="text"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
            className="input input-bordered w-full mb-4"
          />
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Brief Story"
            className="textarea textarea-bordered w-full mb-4 h-24"
          />
          <button
            onClick={handleGeneratePersona}
            className="btn w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Persona'}
          </button>
        </div>
        {persona && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800">Generated Persona</h2>
            <p className="text-gray-600">{persona}</p>
          </div>
        )}
      </div>
    </div>
  );
};
*/

"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { SelectPersona } from '../../db/schema';

// ToolBar component for persona generation settings and initiating the generation process.
function ToolBar({ onGenerate }: { onGenerate: (personas: SelectPersona[]) => void }) {
  const [number, setNumber] = useState(1);
  const [feature, setFeature] = useState('');
  const [testProb, setTestProb] = useState('');
  const [temp, setTemp] = useState(0.7);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [coreId, setCoreId] = useState('');

    // Handles form submission for generating personas.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number, feature, test_prob: testProb, temp, coreId }),
      });
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok && Array.isArray(data.personas)) {
        onGenerate(data.personas);
      } else if (data.error) {
        throw new Error(`${data.error}: ${data.details || ''}`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating personas:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  
  // Render the form with inputs for each parameter of the persona generation.
    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center w-[340px] h-[985px] p-[8px_17px] border border-[#505050] bg-[#333]">
            <div className="flex items-center justify-between w-full mb-4">
                <div className="relative w-[18px] h-[21px]">
                    <Image src="/subtract.svg" alt="Node" width={18} height={21} />
                    <Image src="/group-1.svg" alt="Node Overlay" width={18} height={21} className="absolute left-[-1px] top-[-1px]" />
                </div>
                <h1 className="text-white text-xl font-bold flex-grow ml-2">Generate Personas</h1>
                <Image src="/question.svg" alt="Help" width={20} height={20} />
            </div>
            
            <h2 className="text-white text-lg self-start mb-2">Persona Settings</h2>
            
            <div className="flex flex-col w-full gap-2 mb-4">
                <span className="text-white">Number of Personas</span>
                <input 
                    className="bg-[#9E9E9E40] text-white p-2 rounded" 
                    type="number"
                    min="1"
                    max="30"
                    value={number}
                    onChange={(e) => setNumber(parseInt(e.target.value))}
                />

                <span className="text-white">Feature</span>
                <textarea 
                    className="bg-[#9E9E9E40] text-white p-2 rounded h-[140px]" 
                    placeholder="Ex: At least half of the personas should be female..." 
                    value={feature}
                    onChange={(e) => setFeature(e.target.value)}
                />
                
                <span className="text-white">Testing Problem</span>
                <textarea 
                    className="bg-[#9E9E9E40] text-white p-2 rounded h-[140px]" 
                    placeholder="Ex: Aim to test what kind of occupation feature might be aligned with our product" 
                    value={testProb}
                    onChange={(e) => setTestProb(e.target.value)}
                />
                
                <div className="flex justify-between items-center">
                    <span className="text-white">Temperature</span>
                    <Image src="/question.svg" alt="Help" width={20} height={20} />
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[#C4C4C4]">Stereo</span>
                    <input 
                        type="range" 
                        className="w-[200px]" 
                        min="0"
                        max="1"
                        step="0.01"
                        value={temp}
                        onChange={(e) => setTemp(parseFloat(e.target.value))}
                    />
                    <span className="text-[#C4C4C4]">Wild</span>
                </div>
                <div className="text-center text-[#C4C4C4]">{temp.toFixed(2)}</div>
            </div>
            
            <button 
                type="submit" 
                className="bg-[#6A6DCD] text-white py-2 px-4 rounded w-full mt-auto"
                disabled={loading}
            >
                {loading ? 'Generating...' : 'Generate'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
    );
}

// PersonaList component to display generated personas.
function PersonaList({ personas }: { personas: SelectPersona[] }) {
  return (
    <div className="flex-1 p-[9px_35px] bg-[#272728]">
      <div className="flex justify-end mb-4">
        <Image src="/sort.svg" alt="Sort" width={20} height={20} />
      </div>
      <div className="bg-[#272728] rounded-md">
        <div className="flex text-[#7D7D7D] p-4 mb-2">
          <span className="flex-1 px-2">Name</span>
          <span className="flex-1 px-2">Occupation</span>
          <span className="w-1/6 px-2">Age</span>
          <span className="w-1/6 px-2">Gender</span>
          <span className="w-1/6 px-2">Experience</span>
          <span className="flex-1 px-2">Location</span>
        </div>
        {personas.length > 0 ? (
          personas.map((persona, index) => (
            <PersonaItem key={index} persona={persona} />
          ))
        ) : (
          <p className="text-white text-center p-4">No personas generated yet.</p>
        )}
      </div>
    </div>
  );
}

// PersonaItem component displays details for a single persona.
function PersonaItem({ persona }: { persona: SelectPersona }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#333] mb-2 rounded">
      <div className="flex items-center text-[#7D7D7D] p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <span className="flex-1 px-2">{persona.name}</span>
        <span className="flex-1 px-2">{persona.occupation}</span>
        <span className="w-1/6 px-2">{persona.age}</span>
        <span className="w-1/6 px-2">{persona.gender}</span>
        <span className={`w-1/6 px-2 ${persona.experience ? 'text-[#00FF85]' : 'text-[#FF4848]'}`}>
          {persona.experience ? 'True' : 'False'}
        </span>
        <span className="flex-1 px-2">{persona.location}</span>
      </div>
      {expanded && (
        <div className="p-4 bg-[#333] rounded-b-md">
          <p className="text-[#7D7D7D] mb-4">{persona.characteristic}</p>
        </div>
      )}
    </div>
  );
}

// Main component of the GeneratePersonasPage.
export default function GeneratePersonasPage() {
  const [personas, setPersonas] = useState<SelectPersona[]>([]);

  const handleGenerate = (newPersonas: SelectPersona[]) => {
    console.log('New personas received:', newPersonas);
    setPersonas(prevPersonas => [...prevPersonas, ...newPersonas]);
  };

  return (
    <div className="flex min-h-screen bg-[#272728]">
      <ToolBar onGenerate={handleGenerate} />
      <PersonaList personas={personas} />
    </div>
  );
}





