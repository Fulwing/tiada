// components/Page.tsx
"use client";

import React, { useState } from 'react';

export default function Page() {
  const [name, setName] = useState('');
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
        body: JSON.stringify({ name, age, story }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate persona');
      }
      setPersona(data.persona);
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
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
