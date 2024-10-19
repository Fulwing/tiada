import React from 'react';
import styles from '../styles/DialogBox.module.css';

interface DialogBoxProps {
  personasCount: number;
  onClose: () => void;
  onStart: () => void;
}

const DialogBox: React.FC<DialogBoxProps> = ({ personasCount, onClose, onStart }) => {
  const estimatedTime = Math.ceil((personasCount * 8) / 60); // 8 seconds per persona, rounded up to nearest minute

  return (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialogBody}>
        <div className={styles.text}>
          <div className={styles.confirmPersonasAnd}>Confirm personas and start testing?</div>
          <div className={styles.onceYouStartContainer}>
            <p className={styles.onceYouStart}>
              Once you start testing, you are not allowed to modify personas. Are you sure you want to start testing now?
            </p>
            <p className={styles.estimatedTestingTime}>Personas number: {personasCount}</p>
            <p className={styles.estimatedTestingTime}>Estimated testing time: {estimatedTime} min</p>
          </div>
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={onClose}>
            Back to modify
          </button>
          <button className={styles.button2} onClick={onStart}>
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;