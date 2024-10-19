// src/components/newResults/BarChart.tsx
import React from 'react';
import styles from './BarChart.module.css';

interface BarChartProps {
  data: number[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data, 7); // Set minimum height for visualization

  return (
    <div className={styles.chartContainer}>
      <div className={styles.yAxisLabelsAndGridLines}>
        <div className={styles.gridLines}>
          <div className={styles.peak} />
          <div className={styles.mid} />
          <div className={styles.base} />
        </div>
        <div className={styles.yAxisLabels}>
          <div className={styles.yLabel}>7</div>
          <div className={styles.yLabel}>5</div>
          <div className={styles.yLabel}>3</div>
          <div className={styles.yLabel}>1</div>
        </div>
      </div>
      <div className={styles.chart}>
        {data.map((value, index) => {
          const height = Math.max((value / maxValue) * 155, 1); // Ensure minimum 1px height
          return (
            <div
              key={index}
              className={styles.bar}
              style={{
                height: `${height}px`,
                backgroundColor: index < 2 ? '#8D87FC' : index < 5 ? '#625AFA' : '#4C44DC'
              }}
            />
          );
        })}
      </div>
      <div className={styles.xAxisLabelsAndTicks}>
        <div className={styles.xAxisLabels}>
          {['<=8', '9', '13', '14', '15', '17', '18', '>=19'].map((label, index) => (
            <div key={index} className={styles.xAxisLabelContainer}>
              <div className={styles.xLabel}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BarChart;

