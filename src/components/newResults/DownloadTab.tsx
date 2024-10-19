import React, { useState } from 'react';
import { TestResult } from '../../types/test/result';
import styles from './DownloadTab.module.css';

interface DownloadTabProps {
  results: TestResult[];
}

const DownloadTab: React.FC<DownloadTabProps> = ({ results }) => {
  const [selectedFormat, setSelectedFormat] = useState('HTML');
  const [selectedItems, setSelectedItems] = useState({
    taskCompletionDetails: true,
    personasActivityDetails: true,
    heuristicsEvaluation: true,
    personasInformation: true,
    chatHistory: true
  });

  const handleFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFormat(event.target.value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedItems({
      ...selectedItems,
      [event.target.name]: event.target.checked
    });
  };

  const handleDownload = () => {
    // Implement download functionality here
    console.log('Downloading:', selectedItems, 'in format:', selectedFormat);
  };

  return (
    <div className={styles.downloadTab}>
      <h2 className={styles.title}>Download Testing Results</h2>
      <div className={styles.formatSelector}>
        <select value={selectedFormat} onChange={handleFormatChange} className={styles.select}>
          <option value="HTML">HTML</option>
          <option value="PDF">PDF</option>
          <option value="CSV">CSV</option>
        </select>
      </div>
      <div className={styles.checkboxList}>
        <label className={styles.checkboxItem}>
          <input
            type="checkbox"
            name="taskCompletionDetails"
            checked={selectedItems.taskCompletionDetails}
            onChange={handleCheckboxChange}
          />
          Task Completion Details
        </label>
        <label className={styles.checkboxItem}>
          <input
            type="checkbox"
            name="personasActivityDetails"
            checked={selectedItems.personasActivityDetails}
            onChange={handleCheckboxChange}
          />
          Personas Activity Details
        </label>
        <label className={styles.checkboxItem}>
          <input
            type="checkbox"
            name="heuristicsEvaluation"
            checked={selectedItems.heuristicsEvaluation}
            onChange={handleCheckboxChange}
          />
          Heuristics Evaluation
        </label>
        <label className={styles.checkboxItem}>
          <input
            type="checkbox"
            name="personasInformation"
            checked={selectedItems.personasInformation}
            onChange={handleCheckboxChange}
          />
          Personas Information
        </label>
        <label className={styles.checkboxItem}>
          <input
            type="checkbox"
            name="chatHistory"
            checked={selectedItems.chatHistory}
            onChange={handleCheckboxChange}
          />
          Chat History
        </label>
      </div>
      <button onClick={handleDownload} className={styles.downloadButton}>
        Download
      </button>
    </div>
  );
};

export default DownloadTab;

