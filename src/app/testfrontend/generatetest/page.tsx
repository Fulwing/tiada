'use client'

import { useState } from 'react';

export default function TestPersonaAPI() {
  const [number, setNumber] = useState(1);
  const [feature, setFeature] = useState('');
  const [testProb, setTestProb] = useState('');
  const [temp, setTemp] = useState(0.7);
  const [personas, setPersonas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPersonas([]);
    setLoading(true); // Set loading state to true

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number, feature, test_prob: testProb, temp }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate personas');
      }

      const data = await response.json();
      setPersonas(data.personas);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false); // Set loading state to false once the request is complete
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6">Test Persona API</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700">Number of Personas:</label>
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(parseInt(e.target.value))}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Feature:</label>
          <input
            type="text"
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Testing Problem:</label>
          <input
            type="text"
            value={testProb}
            onChange={(e) => setTestProb(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Temperature:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={temp}
            onChange={(e) => setTemp(parseFloat(e.target.value))}
            className="mt-1 w-full"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>0</span>
            <span>1</span>
          </div>
          <div className="text-center text-gray-700 mt-2">{temp.toFixed(2)}</div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Generating...' : 'Generate Personas'}
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Generated Personas</h2>
        {loading ? (
          <p>Loading...</p> // Show loading message while waiting
        ) : (
          <ul>
            {personas.map((persona, index) => (
              <li key={index} className="mb-4 p-4 bg-white rounded-lg shadow-md">
                <pre className="text-sm text-gray-800">{JSON.stringify(persona, null, 2)}</pre>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
