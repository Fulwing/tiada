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
      console.log(data);
      if (!response.ok) {
        throw new Error(data.status || 'Failed to generate persona');
      }
      setPersona(data.persona);
    } catch (err : unknown) {
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
    <div className="container mx-auto p-4">
      <h1 className="text-lg font-bold">Generate AI Persona</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="input input-bordered w-full mb-2"
        />
        <input
          type="text"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
          className="input input-bordered w-full mb-2"
        />
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Brief Story"
          className="textarea textarea-bordered w-full mb-2"
        />
        <button
          onClick={handleGeneratePersona}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Persona'}
        </button>
      </div>
      {persona && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Generated Persona</h2>
          <p>{persona}</p>
        </div>
      )}
    </div>
  );
};
