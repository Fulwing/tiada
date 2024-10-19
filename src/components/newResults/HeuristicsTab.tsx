import React, { useState } from 'react';
import styles from './HeuristicsTab.module.css';
import Image from 'next/image';

interface HeuristicsScore {
  name: string;
  score: number;
}

interface PageEvaluation {
  id: string;
  name: string;
  image: string;
  scores: HeuristicsScore[];
}

interface HeuristicsTabProps {
  scores: HeuristicsScore[];
  overallScore: number;
  pageEvaluations: PageEvaluation[];
}

const HeuristicsTab: React.FC<HeuristicsTabProps> = ({ scores, overallScore, pageEvaluations }) => {
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);

  const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPageIndex(parseInt(event.target.value));
  };

  const handlePreviousPage = () => {
    setSelectedPageIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : pageEvaluations.length - 1
    );
  };

  const handleNextPage = () => {
    setSelectedPageIndex((prevIndex) => 
      prevIndex < pageEvaluations.length - 1 ? prevIndex + 1 : 0
    );
  };

  const selectedPage = pageEvaluations[selectedPageIndex];

  return (
    <div className={styles.heuristicsTab}>
      <h2 className={styles.title}>Heuristics Evaluation</h2>
      <div className={styles.widgetHe}>
        <div className={styles.widgetHeInner}>
          <div className={styles.heuristicEvaluationParent}>
            <div className={styles.heuristicEvaluation}>Heuristic Evaluation</div>
            <Image src="/core-ic-information.svg" alt="Info" width={18} height={18} />
          </div>
        </div>
        <div className={styles.scoresList}>
          {scores.map((score, index) => (
            <div key={index} className={styles.scoreItem}>
              <span className={styles.scoreName}>{score.name}</span>
              <span className={styles.scoreValue}>{score.score}/5</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.overallHeuristicsInsightParent}>
        <b className={styles.overallHeuristicsInsight}>Overall Heuristics Insight</b>
        <div className={styles.insightText}>
          Based on the heuristics evaluation, the product shows strengths in visibility of system status and user control. 
          However, there&apos;s room for improvement in error prevention and flexibility of use. Consider focusing on these areas 
          in the next iteration of the design.
        </div>
      </div>
      <div className={styles.chatButtonWrapper}>
        <button className={styles.chatButton}>
          <div className={styles.chatButtonText}>Chat with UX expert AI</div>
        </button>
      </div>
      <b className={styles.evaluationOnEach}>Evaluation on each page</b>
      <div className={styles.pageSelector}>
        <div className={styles.selectField}>
          <select
            className={styles.select}
            value={selectedPageIndex}
            onChange={handlePageChange}
          >
            {pageEvaluations.map((page, index) => (
              <option key={page.id} value={index}>
                {page.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.navigationButtons}>
          <button onClick={handlePreviousPage}>
            <Image src="/chevron-left.svg" alt="Previous" width={20} height={20} />
          </button>
          <button onClick={handleNextPage}>
            <Image src="/chevron-right.svg" alt="Next" width={20} height={20} />
          </button>
        </div>
      </div>
      <div className={styles.pageEvaluation}>
        <Image
          className={styles.pageImage}
          src={selectedPage.image}
          alt={`Interface for ${selectedPage.name}`}
        />
        <div className={styles.pageScores}>
          {selectedPage.scores.map((score, index) => (
            <div key={index} className={styles.scoreItem}>
              <span className={styles.scoreName}>{score.name}</span>
              <span className={styles.scoreValue}>{score.score}/5</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.heuristicsInsightOnThisPage}>
        <b className={styles.insightTitle}>Heuristics Insight on this page</b>
        <div className={styles.insightContent}>
          <p className={styles.insightLabel}>Potential Problem:</p>
          <p className={styles.insightText}>
            The login button is not prominently displayed, which may cause users to struggle to find it. 
            This violates the heuristic of visibility of system status.
          </p>
          <p className={styles.insightLabel}>Suggestion:</p>
          <p className={styles.insightText}>
            Consider redesigning the login button to make it more prominent. Use contrasting colors or 
            increase its size to improve visibility. Also, consider placing it in a more conventional 
            location, such as the top right corner of the page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeuristicsTab;

