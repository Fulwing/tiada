'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { SelectPersona } from '../../db/schema';
import { useRouter } from 'next/navigation';

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

function ToolBar({ onGenerate, personas, setLoadingScreen }: { onGenerate: (personas: SelectPersona[]) => void; personas: SelectPersona[]; setLoadingScreen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [number, setNumber] = useState(1);
  const [feature, setFeature] = useState('');
  const [testProb, setTestProb] = useState('');
  const [temp, setTemp] = useState(0.7);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const coreId = localStorage.getItem('userId');

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

  const handleStartTesting = async () => {
    setLoadingScreen(true);

    const userId = localStorage.getItem('userId');

    try {
      const response = await fetch('/api/ai/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDetails: testProb, screenshots: ['1', '2', '3', '4'], userId }),
      });
      const data = await response.json();

      if (response.ok) {
        // Handle successful response
        console.log('Test successful:', data);
      } else {
        // Handle error response
        console.error('Test error:', data);
      }
    } catch (error) {
      console.error('Error during testing:', error);
    } finally {
      setLoadingScreen(false);
      router.push(`/results`);
    }
  };
{/* <div className=" flex-col items-center w-[370px] h-auto border border-[#505050] bg-[#333] justify-start pt-10 overflow-y-hidden	"> */}

  return (
    <form onSubmit={handleSubmit} className="flex-col items-center w-[370px] h-auto p-[8px_17px] border border-[#505050] bg-[#333]">
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
      className="bg-[#6A6DCD] text-white py-2 px-4 rounded w-full mb-2 hover:bg-[#5a5fb0] hover:shadow-lg"
      disabled={loading}
    >
      {loading ? 'Generating...' : 'Generate'}
    </button>
    <button
      type="button"
      className={`bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform w-full ${personas.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:from-purple-600 hover:to-indigo-600 hover:shadow-lg hover:-translate-y-1'
        }`}
      onClick={handleStartTesting}
      disabled={personas.length === 0}
    >
      Start Testing
    </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}

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

export default function GeneratePersonasPage() {
  const [personas, setPersonas] = useState<SelectPersona[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(false);
  

  useEffect(() => {
    const fetchPersonas = async () => {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        console.error('No userId found in local storage');
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(`/api/generate/getPersonas?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch personas');
        }
        const data = await response.json();
        setPersonas(data.personas);
      } catch (error) {
        console.error('Error fetching personas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonas();
  }, []);

  const handleGenerate = (newPersonas: SelectPersona[]) => {
    const updatedPersonas = [...personas, ...newPersonas];
    setPersonas(updatedPersonas);
    localStorage.setItem('personas', JSON.stringify(updatedPersonas));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#272728]">
      <div className="flex flex-1 mt-20 p-4 overflow-hidden">
        <ToolBar onGenerate={handleGenerate} personas={personas} setLoadingScreen={setLoadingScreen} />
        {loading ? (
          <div className="flex flex-1 items-center justify-center text-white text-xl">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-8 w-8 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
          </div>
        ) : (
          <PersonaList personas={personas} />
        )}
      </div>
      {loadingScreen && (
        <div className="loading-screen">
          <div className="flex flex-col items-center justify-center h-full">
            <svg className="animate-spin h-16 w-16 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-white text-xl ml-4">Testing...</p>
          </div>
        </div>
      )}
      <style jsx>{`
        .loading-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(128, 0, 128, 1) 100%);
          z-index: 9999;
        }
      `}</style>
    </div>
  );
  
}
