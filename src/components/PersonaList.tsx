import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/PersonaList.module.css';

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
  description?: string;
}

interface PersonaListProps {
  personas: Persona[];
}

const PersonaList: React.FC<PersonaListProps> = ({ personas: initialPersonas }) => {
  const [personas, setPersonas] = useState<Persona[]>(initialPersonas);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);

  const handlePersonaClick = (persona: Persona) => {
    setSelectedPersona(selectedPersona?.id === persona.id ? null : persona);
    setEditingPersona(null);
  };

  const handleEditPersona = (persona: Persona) => {
    setEditingPersona({ ...persona });
  };

  const handleSavePersona = () => {
    if (editingPersona) {
      const updatedPersonas = personas.map(p =>
        p.id === editingPersona.id ? editingPersona : p
      );
      setPersonas(updatedPersonas);
      setSelectedPersona(editingPersona);
      setEditingPersona(null);
    }
  };

  const handleDeletePersona = (personaId: string) => {
    const updatedPersonas = personas.filter(p => p.id !== personaId);
    setPersonas(updatedPersonas);
    setSelectedPersona(null);
  };

  const handleInputChange = (field: keyof Persona, value: string | number | boolean) => {
    if (editingPersona) {
      setEditingPersona({ ...editingPersona, [field]: value });
    }
  };

  const renderExpandedDetails = (persona: Persona) => (
    <div className={styles.expandedDetails}>
      <div className={styles.expandedInfo}>
        <div className={styles.expandedInfoColumn}>
          <div className={styles.expandedInfoField}>
            <span className={styles.fieldLabel}>Name:</span>
            <span>{persona.name}</span>
          </div>
          <div className={styles.expandedInfoField}>
            <span className={styles.fieldLabel}>Experience:</span>
            <span>{persona.experience ? 'Experienced' : 'New'}</span>
          </div>
          <div className={styles.expandedInfoField}>
            <span className={styles.fieldLabel}>Age:</span>
            <span>{persona.age}</span>
          </div>
          <div className={styles.expandedInfoField}>
            <span className={styles.fieldLabel}>Gender:</span>
            <span>{persona.gender}</span>
          </div>
        </div>
        <div className={styles.expandedInfoColumn}>
          <div className={styles.expandedInfoField}>
            <span className={styles.fieldLabel}>Occupation:</span>
            <span>{persona.occupation}</span>
          </div>
          <div className={styles.expandedInfoField}>
            <span className={styles.fieldLabel}>Location:</span>
            <span>{persona.location}</span>
          </div>
          <div className={styles.expandedInfoField}>
            <span className={styles.fieldLabel}>Education Level:</span>
            <span>{persona.educationLevel || 'N/A'}</span>
          </div>
        </div>
      </div>
      <div className={styles.expandedDescription}>
        <span className={styles.fieldLabel}>Description:</span>
        <p>{persona.description || persona.characteristic}</p>
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.editButton} onClick={() => handleEditPersona(persona)}>Edit Persona</button>
        <button className={styles.deleteButton} onClick={() => handleDeletePersona(persona.id)}>Delete Persona</button>
      </div>
    </div>
  );

  const renderEditingDetails = (persona: Persona | null) => {
    if (!persona) {
      // If persona is null or undefined, return early
      return <div>No persona selected</div>;
    }

    return (
      <div className={styles.expandedDetails}>
        <div className={styles.expandedInfo}>
          <div className={styles.expandedInfoColumn}>
            <div className={styles.expandedInfoField}>
              <span className={styles.fieldLabel}>Name:</span>
              <input
                type="text"
                value={persona.name || ''}  // Fallback to empty string if name is null/undefined
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.expandedInfoField}>
              <span className={styles.fieldLabel}>Experience:</span>
              <select
                value={persona.experience ? 'Experienced' : 'New'}
                onChange={(e) => handleInputChange('experience', e.target.value === 'Experienced')}
                className={styles.select}
              >
                <option value="New">New</option>
                <option value="Experienced">Experienced</option>
              </select>
            </div>
            <div className={styles.expandedInfoField}>
              <span className={styles.fieldLabel}>Age:</span>
              <input
                type="number"
                value={persona.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                className={styles.input}
              />
            </div>
            <div className={styles.expandedInfoField}>
              <span className={styles.fieldLabel}>Gender:</span>
              <select
                value={persona.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className={styles.select}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
              </select>
            </div>
          </div>
          <div className={styles.expandedInfoColumn}>
            <div className={styles.expandedInfoField}>
              <span className={styles.fieldLabel}>Occupation:</span>
              <input
                type="text"
                value={persona.occupation || ''}  // Fallback to empty string if occupation is null/undefined
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.expandedInfoField}>
              <span className={styles.fieldLabel}>Location:</span>
              <input
                type="text"
                value={persona.location || ''}  // Fallback to empty string if location is null/undefined
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.expandedInfoField}>
              <span className={styles.fieldLabel}>Education Level:</span>
              <select
                value={persona.educationLevel || ''}  // Fallback to empty string if educationLevel is null/undefined
                onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                className={styles.select}
              >
                <option value="">N/A</option>
                <option value="High School">High School</option>
                <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
                <option value="Master's Degree">Master&apos;s Degree</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
          </div>
        </div>
        <div className={styles.expandedDescription}>
          <span className={styles.fieldLabel}>Description:</span>
          <textarea
            value={persona.description || persona.characteristic || ''}  // Fallback to empty string if both description and characteristic are null/undefined
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={styles.textarea}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.saveButton} onClick={handleSavePersona}>Save Persona</button>
          <button className={styles.cancelButton} onClick={() => setEditingPersona(null)}>Cancel</button>
        </div>
      </div>
    );
  };


  return (
    <div className={styles.groupParent}>
      {/* ... (keep existing header and sorting options) */}
      <div className={styles.frame}>
        <div className={styles.frame1}>
          <div className={styles.header}>#</div>
          <div className={styles.header}>Name</div>
          <div className={styles.header}>Experience</div>
          <div className={styles.header}>Age</div>
          <div className={styles.header}>Gender</div>
          <div className={styles.header}>Occupation</div>
          <div className={styles.header}>Location</div>
          <div className={styles.header}>Education Level</div>
        </div>
        {personas.map((persona) => (
          <React.Fragment key={persona.id}>
            <div
              className={`${styles.personaListBlock} ${selectedPersona?.id === persona.id ? styles.expanded : ''}`}
              onClick={() => handlePersonaClick(persona)}
            >
              <div className={styles.checkboxField}>
                <input type="checkbox" className={styles.checkbox} />
              </div>
              <div className={styles.personaInfo}>
                <div>{persona.id}</div>
                <div>{persona.name}</div>
                <div>{persona.experience ? 'Experienced' : 'New'}</div>
                <div>{persona.age}</div>
                <div>{persona.gender}</div>
                <div>{persona.occupation}</div>
                <div>{persona.location}</div>
                <div>{persona.educationLevel || 'N/A'}</div>
              </div>
            </div>
            {selectedPersona?.id === persona.id && (
              editingPersona?.id === persona.id
                ? renderEditingDetails(editingPersona)
                : renderExpandedDetails(persona)
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PersonaList;