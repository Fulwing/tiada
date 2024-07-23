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

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Persona {
  id: number;
  name: string;
  occupation: string;
  age: number;
  gender: string;
  experience: boolean;
  location: string;
  characteristic: string;
}

function ToolBar() {
    return (
        <div className="flex flex-col items-center w-[340px] h-[985px] p-[8px_17px] border border-[#505050] bg-[#333]">
            <div className="flex items-center justify-between w-full mb-4">
                <div className="relative w-[18px] h-[21px]">
                    <Image src="/subtract.svg" alt="Node" layout="fill" className="absolute" />
                    <Image src="/group-1.svg" alt="Node Overlay" layout="fill" className="absolute left-[-1px] top-[-1px]" />
                </div>
                <h1 className="text-white text-xl font-bold flex-grow ml-2">Generate Personas</h1>
                <Image src="/question.svg" alt="Help" width={20} height={20} />
            </div>
            
            <h2 className="text-white text-lg self-start mb-2">Personal Collection</h2>
            
            <div className="flex flex-col w-full gap-2 mb-4">
                <div className="flex justify-between items-center border-b border-[#505050] py-2">
                    <span className="text-white">Collections</span>
                    <Image src="/menu-item-list-chevron-right-condensced.svg" alt="Expand" width={24} height={24} />
                </div>
                <div className="flex justify-between items-center w-full">
                    <span className="text-white">New Collection</span>
                    <div className="bg-[#9E9E9E40] rounded-full w-[24px] h-[24px] flex items-center justify-center">
                        <Image src="/add.svg" alt="Add" width={16} height={16} />
                    </div>
                </div>
                <input className="bg-[#9E9E9E40] text-white p-2 rounded" placeholder="Collection Name" />
                <input className="bg-[#9E9E9E40] text-white p-2 rounded" placeholder="Personas Number" type="number" />
            </div>
            
            <h2 className="text-white text-lg self-start mb-2">Persona Settings</h2>
            
            <div className="flex flex-col w-full gap-2 mb-4">
                <span className="text-white">Features</span>
                <textarea className="bg-[#9E9E9E40] text-white p-2 rounded h-[140px]" placeholder="Ex: At least half of the personas should be female..." />
                
                <span className="text-white">Testing Problem</span>
                <textarea className="bg-[#9E9E9E40] text-white p-2 rounded h-[140px]" placeholder="Ex: Aim to test what kind of occupation feature might be aligned with our product" />
                
                <div className="flex justify-between items-center">
                    <span className="text-white">Temperature</span>
                    <Image src="/question.svg" alt="Help" width={20} height={20} />
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[#C4C4C4]">Stereo</span>
                    <input type="range" className="w-[200px]" />
                    <span className="text-[#C4C4C4]">Wild</span>
                </div>
            </div>
            
            <button className="bg-[#6A6DCD] text-white py-2 px-4 rounded w-full mt-auto">Generate</button>
        </div>
    );
}

function PersonaList({ personas }: { personas: Persona[] }) {
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
                {personas.map((persona) => (
                    <PersonaItem key={persona.id} persona={persona} />
                ))}
            </div>
        </div>
    );
}

function PersonaItem({ persona }: { persona: Persona }) {
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
                    <div className="flex justify-end gap-2">
                        <button className="bg-[#262626] text-white px-4 py-2 rounded-full">Edit</button>
                        <button className="bg-[#FF1D1D] text-white px-4 py-2 rounded-full">Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function GeneratePersonasPage() {
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/api/generate')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch personas');
                return res.json();
            })
            .then(data => {
                setPersonas(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load personas');
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-6 text-white">Loading...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="flex min-h-screen bg-[#272728]">
            <ToolBar />
            <PersonaList personas={personas} />
        </div>
    );
}


