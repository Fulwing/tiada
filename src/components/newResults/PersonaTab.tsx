import React from 'react';
import Image from 'next/image';
import styles from './PersonaTab.module.css';
import { TestPersona } from '../../types/test/result';

interface PersonaTabProps {
  persona: TestPersona;
}

const PersonaTab: React.FC<PersonaTabProps> = ({ persona }) => {
  if (!persona) return null;

  return (
    <div className={styles.personaTab}>
      <h2 className={styles.title}>Persona Information</h2>
      <div className={styles.personaInfo}>
        <div className={styles.personaHeader}>
          <Image
            src="/persona-tab-image.png"
            alt={persona.name}
            width={45}
            height={45}
            className={styles.personaImage}
          />
          <h3 className={styles.personaName}>{persona.name}</h3>
        </div>
        <div className={styles.personaDetails}>
          <p>Age: {persona.age}</p>
          <p>Gender: {persona.gender}</p>
          <p>Experience Level: {persona.characteristic}</p>
          <p>Occupation: {persona.occupation}</p>
          <p>Location: {persona.location}</p>
          <p>Education Level: Master Degree</p>
          <p>&nbsp;</p>
          <p className={styles.personaDescription}>
            {persona.characteristic}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonaTab;


