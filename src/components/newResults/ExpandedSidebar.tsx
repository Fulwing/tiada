import React from 'react';
import { TestResult } from '../../types/test/result';
import { HeuristicsData } from '../../types/heuristics';
import styles from './ExpandedSidebar.module.css';
import DonutChart from './DonutChart';
import BarChart from './BarChart';
import HeuristicsTab from './HeuristicsTab';
import TestingActivitySidebar from './TestingActivitySidebar';
import DownloadTab from './DownloadTab';
import PersonaTab from './PersonaTab';
import Image from 'next/image';

interface ExpandedSidebarProps {
  results: TestResult[];
  onClose: () => void;
  selectedTab: 'overall' | 'heuristics' | 'testingActivity' | 'download' | 'persona';
  heuristicsData: HeuristicsData | null;
  selectedPersonaId: string | null;
  selectedJourneyId: string | null;
}

const ExpandedSidebar: React.FC<ExpandedSidebarProps> = ({ 
  results, 
  onClose, 
  selectedTab, 
  heuristicsData, 
  selectedPersonaId, 
  selectedJourneyId 
}) => {
  const totalPersonas = results.length;
  const completedPersonas = results.filter(r => r.taskCompletion === 'Success').length;
  const failedPersonas = results.filter(r => r.taskCompletion === 'Failure').length;
  const incompletePersonas = totalPersonas - completedPersonas - failedPersonas;
  
  const successPercentage = Math.round((completedPersonas / totalPersonas) * 100);
  const failurePercentage = Math.round((failedPersonas / totalPersonas) * 100);
  const incompletePercentage = Math.round((incompletePersonas / totalPersonas) * 100);

  const totalSteps = results.reduce((sum, r) => sum + r.steps, 0);
  const averageSteps = Math.round(totalSteps / totalPersonas);

  const stepsDistribution = Array(8).fill(0);
  
  results.forEach(result => {
    let barIndex;
    if (result.steps <= 8) barIndex = 0;
    else if (result.steps === 9) barIndex = 1;
    else if (result.steps === 13) barIndex = 2;
    else if (result.steps === 14) barIndex = 3;
    else if (result.steps === 15) barIndex = 4;
    else if (result.steps === 17) barIndex = 5;
    else if (result.steps === 18) barIndex = 6;
    else barIndex = 7;

    stepsDistribution[barIndex]++;
  });  

  const getSelectedResult = () => {
    if (selectedJourneyId) {
      return results.find(result => result.id === selectedJourneyId) || results[0];
    }
    return results[0];
  };

  const getSelectedPersona = () => {
    if (selectedPersonaId) {
      return results.find(result => result.personaId === selectedPersonaId)?.persona || results[0].persona;
    }
    return results[0].persona;
  };

  return (
    <div className={styles.expandedSidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {selectedTab === 'overall' ? 'Overall Insight' : 
           selectedTab === 'heuristics' ? 'Heuristics Evaluation' : 
           selectedTab === 'testingActivity' ? 'Testing Activity' :
           selectedTab === 'download' ? 'Download Testing Results' :
           'Persona Information'}
        </h2>
        <button onClick={onClose} className={styles.closeButton}>
            <Image src="/chevron-right.svg" alt="Close" />
        </button>
      </div>
      <div className={styles.content}>
        {selectedTab === 'overall' ? (
          <>    
            <div className={styles.metricCard}>
              <h3 className={styles.metricTitle}>Task Completion Ratio</h3>
              <DonutChart
                successPercentage={successPercentage}
                failurePercentage={failurePercentage}
                incompletePercentage={incompletePercentage}
              />
              <p className={styles.metricSubtext}>{completedPersonas} success</p>
              <p className={styles.metricSubtext}>{failedPersonas} failed</p>
              <p className={styles.metricSubtext}>{incompletePersonas} incomplete</p>
            </div>
            <div className={styles.metricCard}>
              <h3 className={styles.metricTitle}>Steps Taken</h3>
              <p className={styles.metricValue}>{averageSteps}</p>
              <p className={styles.metricSubtitle}>Ave. total</p>
              <p className={styles.metricSubtext}>Ideal steps taken: {averageSteps - 1}</p>
              <BarChart data={stepsDistribution} />
            </div>
            <div className={styles.overallTestingInsight}>
              <h3 className={styles.insightTitle}>Overall Testing Insight</h3>
              <p className={styles.insightText}>
                Based on the user journey results, the task completion rate is {successPercentage}%, 
                which indicates room for improvement. Users took an average of {averageSteps} steps 
                to complete the task, slightly higher than the ideal number of steps. Consider 
                streamlining the process to reduce the number of steps required.
              </p>
            </div>
            </>
        ) : selectedTab === 'heuristics' ? (
            heuristicsData && (
              <HeuristicsTab
                scores={heuristicsData.scores}
                overallScore={heuristicsData.overallScore}
                pageEvaluations={heuristicsData.pageEvaluations}
              />
            )
          ) : selectedTab === 'testingActivity' ? (
            <TestingActivitySidebar result={getSelectedResult()} />
          ) : selectedTab === 'download' ? (
            <DownloadTab results={results} />
          ) : (
            <PersonaTab persona={getSelectedPersona()!} />
          )}
        </div>
      </div>
    );
  };
  
  export default ExpandedSidebar;
  
  
  