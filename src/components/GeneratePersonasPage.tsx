import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/GeneratePersonasPage.module.css';
import PersonaCollectionBar from './PersonaCollectionBar';
import PersonaList from './PersonaList';
import DialogBox from './DialogBox';

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

const GeneratePersonasPage: React.FC = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPersonas, setShowPersonas] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [collectionSize, setCollectionSize] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [personaFeatures, setPersonaFeatures] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter();

  const fetchPersonas = async (collectionName: string = '') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/personas?collection=${encodeURIComponent(collectionName)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch personas');
      }
      const data = await response.json();
      if (Array.isArray(data.personas)) {
        setPersonas(data.personas);
        setShowPersonas(true);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      setError('Error fetching personas: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCheckPersonas = () => {
    fetchPersonas('MS general client collection');
  };

  const handleStartTesting = async () => {
    setShowDialog(true);
  };

  const handleGeneratePersonas = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/personas/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectionName,
          collectionSize: parseInt(collectionSize),
          collectionDescription,
          personaFeatures,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate personas');
      }
      const data = await response.json();
      if (Array.isArray(data.personas)) {
        setPersonas(data.personas);
        setShowPersonas(true);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      setError('Error generating personas: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegeneratePersonas = handleGeneratePersonas;

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleConfirmStartTesting = async () => {
    try {
      const response = await fetch('/api/ai/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDetails: `Testing ${collectionName} collection`,
          homePageId: 'default-home-page-id', // You might need to get this from somewhere
          coreId: 'user-core-id', // You might need to get the actual user ID
          totalStepsAllowed: 100, // You might want to make this configurable
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start AI test');
      }

      const data = await response.json();
      console.log('AI test started:', data);

      setShowDialog(false);
      router.push('/testing');
    } catch (error) {
      console.error('Error starting AI test:', error);
      setError('Failed to start AI test. Please try again.');
    }
  };

  return (
    <div className={styles.generatePersonasPage}>
      <div className={styles.navigationD}>
        {/* Navigation bar content */}
      </div>
      <div className={styles.body}>
        <PersonaCollectionBar 
          onStartTesting={handleStartTesting} 
          onRegeneratePersonas={handleGeneratePersonas}
          onCheckPersonas={handleCheckPersonas}
          onGeneratePersonas={handleGeneratePersonas}
          setCollectionName={setCollectionName}
          setCollectionSize={setCollectionSize}
          setCollectionDescription={setCollectionDescription}
          setPersonaFeatures={setPersonaFeatures}
        />
        {loading ? (
          <div className={styles.loading}>Loading personas...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : showPersonas && personas.length > 0 ? (
          <PersonaList personas={personas} />
        ) : (
          <div className={styles.noPersonas}>No personas found. Try generating some!</div>
        )}
      </div>
      {showDialog && (
        <DialogBox
          personasCount={personas.length}
          onClose={handleCloseDialog}
          onStart={handleConfirmStartTesting}
        />
      )}
    </div>
  );
};

export default GeneratePersonasPage;