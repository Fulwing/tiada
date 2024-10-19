import React from 'react';
import Image from 'next/image';
import styles from './TestingActivitySidebar.module.css';
import { TestResult, Step } from '../../types/test/result';

interface TestingActivitySidebarProps {
  result: TestResult;
}

const TestingActivitySidebar: React.FC<TestingActivitySidebarProps> = ({ result }) => {
  const getStepColor = (status: 'success' | 'miss') => {
    return status === 'success' ? styles.successStep : styles.failureStep;
  };

  return (
    <div className={styles.sidebarContent}>
      <div className={styles.header}>
        <h2 className={styles.title}>Testing Activity</h2>
      </div>
      {result && (
        <>
          <div className={styles.feedbackSection}>
            <h3 className={styles.sectionTitle}>General feedback from persona</h3>
            <p className={styles.feedbackText}>{result.generalFeedback}</p>
          </div>
          <div className={styles.insightSection}>
            <h3 className={styles.sectionTitle}>Research Insight</h3>
            <p className={styles.insightText}>
              Based on {result.name}&apos;s testing activity, we observed that...
              [Add more detailed insights here based on the user&apos;s journey]
            </p>
            <Image src="/core-ic-information.svg" alt="Info" width={18} height={18} className={styles.infoIcon} />
          </div>
          <div className={styles.journeySection}>
            <h3 className={styles.sectionTitle}>Testing Journey</h3>
            <div className={styles.journeyVisual}>
              {/* Add visual representation of the user's journey here */}
            </div>
            {result.stages.map((stage: Step, index: number) => (
              <div key={index} className={styles.journeyStep}>
                <h4 className={`${styles.stepTitle} ${getStepColor(stage.status)}`}>
                  Step {stage.stepNumber}: {stage.image.split('/').pop() || 'No image'}
                </h4>
                <p className={styles.stepDescription}>{stage.description}</p>
                <p className={styles.userAction}>{stage.userAction}</p>
                <p className={styles.userExplanation}>{stage.userExplanation}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TestingActivitySidebar;


