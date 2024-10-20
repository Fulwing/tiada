import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/PersonaCollectionBar.module.css';
import ReviewCard from './ReviewCard';

interface PersonaCollectionBarProps {
  onStartTesting: () => void;
  onRegeneratePersonas: () => void;
  onCheckPersonas: () => void;
  onGeneratePersonas: () => void;
  setCollectionName: (name: string) => void;
  setCollectionSize: (size: string) => void;
  setCollectionDescription: (description: string) => void;
  setPersonaFeatures: (features: string) => void;
  personasCount: number; // Added personasCount prop
}

const PersonaCollectionBar: React.FC<PersonaCollectionBarProps> = ({ 
    onStartTesting, 
    onRegeneratePersonas, 
    onCheckPersonas,
    onGeneratePersonas,
    setCollectionName,
    setCollectionSize,
    setCollectionDescription,
    setPersonaFeatures,
    personasCount, // Destructure personasCount
  }) => {
    const [activeTab, setActiveTab] = useState<'select' | 'create'>('select');
    const [isNameConfirmed, setIsNameConfirmed] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
    const [localCollectionName, setLocalCollectionName] = useState('');

    // Determine if personas have been generated based on personasCount
    const personasGenerated = personasCount > 0;

    const handleTabClick = (tab: 'select' | 'create') => {
      setActiveTab(tab);
      if (tab === 'create') {
        setSelectedCollection(null);
      }
    };

    const handleCollectionSelect = (collection: string) => {
      setSelectedCollection(collection);
      setCollectionName(collection);
    };

    const handleNameConfirm = () => {
      if (localCollectionName.trim() !== '') {
        setIsNameConfirmed(true);
        setCollectionName(localCollectionName.trim());
      }
    };  

    const handleGeneratePersonas = () => {
      onGeneratePersonas();
    };

    const renderSelectTab = () => (
      <>
        <div className={styles.selectField}>
          <select 
            className={styles.select}
            onChange={(e) => handleCollectionSelect(e.target.value)}
            value={selectedCollection || ""}
          >
            <option value="">Select a collection</option>
            <option value="MS general client collection">MS general client collection</option>
          </select>
        </div>
        {selectedCollection && (
          <>
            <ReviewCard
              src="/Avatar.png"
              title="77 personas"
              body="This collection of AI personas can be used in general MS product usability testing. It contains diverse users that simulate MS general clients."
              date="Oct 11 2024"
              name="Created by Tiada Team"
            />
            <button className={styles.checkPersonasButton} onClick={onCheckPersonas}>
              Check personas
            </button>
            {/* Conditionally render "Start Testing" button based on personasCount */}
            {personasGenerated && (
              <button className={styles.startTestingButton} onClick={onStartTesting}>
                Start Testing
              </button>
            )}
          </>
        )}
      </>
    );

    const renderCreateTab = () => (
      <>    
        <div className={styles.inputField}>
          <div className={styles.label}>Name new collection</div>
          <div className={styles.inputWrapper}>
            <input
              className={styles.input}
              value={localCollectionName}
              onChange={(e) => setLocalCollectionName(e.target.value)}
              onBlur={handleNameConfirm}
              placeholder="my collection 1"
            />
            {isNameConfirmed && (
              <div className={styles.checkIconWrapper}>
                <Image src="/Check circle.svg" alt="Confirmed" width={20} height={20} />
              </div>
            )}
          </div>
        </div>
        <div className={styles.inputField}>
          <div className={styles.label}>Number of personas in collection</div>
          <input
            className={styles.input}
            onChange={(e) => setCollectionSize(e.target.value)}
            type="number"
            placeholder="55"
          />
        </div>
        <div className={styles.textareaField}>
          <div className={styles.label}>Collection description</div>
          <textarea
            className={styles.textarea}
            onChange={(e) => setCollectionDescription(e.target.value)}
            placeholder="This is a collection for new CPS system design testing..."
          />
        </div>
        <div className={styles.textareaField}>
          <div className={styles.label}>Features of the personas</div>
          <textarea
            className={styles.textarea}
            onChange={(e) => setPersonaFeatures(e.target.value)}
            placeholder="Enter the features you would like the personas to have..."
          />
        </div>
        {personasGenerated ? (
          <>
            <button className={styles.regenerateButton} onClick={onRegeneratePersonas}>
              Regenerate Personas
            </button>
            <button className={styles.startTestingButton} onClick={onStartTesting}>
              Start Testing
            </button>
          </>
        ) : (
          <button className={styles.generateButton} onClick={handleGeneratePersonas}>
            Generate Personas
          </button>
        )}
      </>
    );

    return (
      <div className={styles.personaCollectionBar}>
        <div className={styles.title}>
          <Image src="/Archive.svg" alt="Archive" width={20} height={20} />
          <div className={styles.personasCollection}>Personas Collection</div>
        </div>
        <div className={styles.tabs}>
          <div className={styles.tabWrapper}>
            <div 
              className={`${styles.tab} ${activeTab === 'select' ? styles.activeTab : ''}`}
              onClick={() => handleTabClick('select')}
            >
              <div className={styles.label}>Select from library</div>
            </div>
          </div>
          <div className={styles.tabWrapper}>
            <div 
              className={`${styles.tab} ${activeTab === 'create' ? styles.activeTab : ''}`}
              onClick={() => handleTabClick('create')}
            >
              <div className={styles.label}>Create new collection</div>
            </div>
          </div>
        </div>
        {activeTab === 'select' ? renderSelectTab() : renderCreateTab()}
      </div>
    );
  };

export default PersonaCollectionBar;
