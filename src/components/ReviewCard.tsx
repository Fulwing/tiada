import React from 'react';
import Image from 'next/image';
import styles from '../styles/ReviewCard.module.css';

interface ReviewCardProps {
  src: string;
  title: string;
  body: string;
  date: string;
  name: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ src, title, body, date, name }) => {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewBody}>
        <div className={styles.textHeading}>
          <span className={styles.title}>{title}</span>
        </div>
        <div className={styles.text}>{body}</div>
      </div>
      <div className={styles.avatarBlock}>
        <Image 
          src={src}
          alt="Avatar"
          width={32}
          height={32}
          className={styles.avatar}
          onError={(e) => {
            e.currentTarget.src = '/placeholder.png';
          }}
        />
        <div className={styles.avatarInfo}>
          <div className={styles.name}>{name}</div>
          <div className={styles.date}>{date}</div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;


