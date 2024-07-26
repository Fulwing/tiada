// src/components/FormattedFeedback.tsx
import React from 'react';

interface FormattedFeedbackProps {
  feedback: string;
}

const FormattedFeedback: React.FC<FormattedFeedbackProps> = ({ feedback }) => {
  const parseFeedback = (rawFeedback: string) => {
    try {
      const parsed = JSON.parse(rawFeedback);
      const content = parsed.feedback || '';
      return content
        .replace(/\\n/g, '\n')
        .split('\n')
        .map((line: string, index: number) => (
          <React.Fragment key={index}>
            {line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
            <br />
          </React.Fragment>
        ));
    } catch (error) {
      console.error('Error parsing feedback:', error);
      return rawFeedback;
    }
  };

  return <div dangerouslySetInnerHTML={{ __html: parseFeedback(feedback) }} />;
};

export default FormattedFeedback;


