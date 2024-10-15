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
            // Send the annotation data to the backend
            const response = await fetch('/api/submitAnnotations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                // If the response is not OK, parse the error message and throw an error
                const errorData = await response.json();
                return { error: errorData.message || 'Failed to submit annotations' };
            }
            
            // Parse and log the successful response
            const result = await response.json();
            console.log('Submission successful:', result);
    
            // TODO: Replace '/nextPage' with the actual next page in the user flow
            router.push('/nextPage');
        } catch (error) {
            console.error('Error submitting annotations:', error);
            // Return an error object if submission fails
            return { error: error instanceof Error ? error.message : 'An unknown error occurred' };
        }
    };
    

    return (
        <FrontPage onFinishSetUp={handleFinishSetUp} />
    );
}

export default Page;