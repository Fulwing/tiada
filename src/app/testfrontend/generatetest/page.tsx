'use client'

import React, { useState, useEffect } from 'react';

interface Persona {
  id: string;
  name: string;
  occupation: string;
  age: number;
  gender: string;
  experience: boolean;
  location: string;
  characteristic: string;
  coreId: string;
  createdAt: Date;
  educationLevel?: string;
}

const PersonasPage: React.FC = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPersonas = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/personas/get?userId=1`); // Adjust the userId accordingly
      if (!response.ok) {
        throw new Error('Failed to fetch personas');
      }
      const data = await response.json();
      if (Array.isArray(data.personas)) {
        setPersonas(data.personas);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      setError('Error fetching personas: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Persona List</h1>
      {loading ? (
        <p>Loading personas...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div>
          {personas.length > 0 ? (
            <ul>
              {personas.map((persona) => (
                <li key={persona.id} style={{ marginBottom: '15px', listStyleType: 'none' }}>
                  <strong>Name:</strong> {persona.name} <br />
                  <strong>Occupation:</strong> {persona.occupation} <br />
                  <strong>Age:</strong> {persona.age} <br />
                  <strong>Gender:</strong> {persona.gender} <br />
                  <strong>Experience:</strong> {persona.experience ? 'Yes' : 'No'} <br />
                  <strong>Location:</strong> {persona.location} <br />
                  <strong>Characteristic:</strong> {persona.characteristic} <br />
                  <strong>Core ID:</strong> {persona.coreId} <br />
                  <strong>Created At:</strong> {new Date(persona.createdAt).toLocaleString()} <br />
                </li>
              ))}
            </ul>
          ) : (
            <p>No personas found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonasPage;
