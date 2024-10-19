// src/components/newResults/DonutChart.tsx
import React from 'react';
import styles from './DonutChart.module.css';

interface DonutChartProps {
  successPercentage: number;
  failurePercentage: number;
  incompletePercentage: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ successPercentage, failurePercentage, incompletePercentage }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const center = 100;

  // Calculate segment sizes
  const successOffset = (1 - successPercentage / 100) * circumference;
  const failureOffset = (1 - (successPercentage + failurePercentage) / 100) * circumference;
  const incompleteOffset = (1 - (successPercentage + failurePercentage + incompletePercentage) / 100) * circumference;

  return (
    <div className={styles.donutChart}>
      <svg viewBox="0 0 200 200" width="144" height="144">
        {/* Background circle */}
        <circle 
          cx={center} 
          cy={center} 
          r={radius} 
          fill="transparent" 
          strokeWidth="20" 
          stroke="#2D2D30"
        />
        {/* Success segment */}
        <circle 
          cx={center} 
          cy={center} 
          r={radius} 
          fill="transparent" 
          strokeWidth="20" 
          stroke="#3FB950" 
          strokeDasharray={circumference} 
          strokeDashoffset={successOffset}
          transform={`rotate(-90 ${center} ${center})`} 
        />
        {/* Failure segment */}
        <circle 
          cx={center} 
          cy={center} 
          r={radius} 
          fill="transparent" 
          strokeWidth="20" 
          stroke="#FF4848" 
          strokeDasharray={`${(failurePercentage / 100) * circumference} ${circumference}`}
          strokeDashoffset={-((successPercentage / 100) * circumference)}
          transform={`rotate(-90 ${center} ${center})`} 
        />
        {/* Incomplete segment */}
        {incompletePercentage > 0 && (
          <circle 
            cx={center} 
            cy={center} 
            r={radius} 
            fill="transparent" 
            strokeWidth="20" 
            stroke="#6A737D" 
            strokeDasharray={`${(incompletePercentage / 100) * circumference} ${circumference}`}
            strokeDashoffset={-(((successPercentage + failurePercentage) / 100) * circumference)}
            transform={`rotate(-90 ${center} ${center})`} 
          />
        )}
      </svg>
      <div className={styles.metricAndCaptionContainers}>
        <div className={styles.metricContainer}>
          <div className={styles.metric}>{successPercentage}%</div>
        </div>
        <div className={styles.captionContainer}>
          <div className={styles.caption}>Completion</div>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;

