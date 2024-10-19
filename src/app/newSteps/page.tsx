"use client";

import { useRouter } from 'next/navigation';
import FrontPage from '../../components/FrontPage';

function Page() {
    const router = useRouter();


    /**
    * Handles the submission of annotation data to the backend
    * @param {any} data - The prepared annotation data
    * @returns {Promise<{ error?: string } | void>} A promise that resolves with an error object or void
    */
    const handleFinishSetUp = async (data: any): Promise<{ error?: string } | void> => {
        try {
          const response = await fetch('/api/submitAnnotations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || 'Failed to submit annotations' };
          }
          
          const result = await response.json();
          console.log('Submission successful:', result);
      
          // TODO: Implement navigation to the next page in your app flow
          // router.push('/nextPage');
        } catch (error) {
          console.error('Error submitting annotations:', error);
          return { error: error instanceof Error ? error.message : 'An unknown error occurred' };
        }
      };
    

    return (
        <FrontPage onFinishSetUp={handleFinishSetUp} />
    );
}

export default Page;