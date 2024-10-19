// src/app/api/testSetup.ts
import axios from 'axios';

interface TestSetupData {
  testName: string;
  productType: string;
  productDescription: string;
  taskDescription: string;
  taskInstruction: string;
  evaluationMetrics: {
    taskCompletionSteps: boolean;
    taskCompletionPercentage: number;
    taskUltimateSuccess: boolean;
    completionTime: boolean;
    usersSubjectiveFeedback: boolean;
    heuristicsEvaluation: boolean;
  };
  relatedWebsites: string[];
  coreId: string; // Add this line
}

export const submitTestSetup = async (data: TestSetupData, files: File[]) => {
  try {
    const formData = new FormData();
    formData.append('testSetupData', JSON.stringify(data));
    files.forEach((file, index) => {
      formData.append(`file${index}`, file); // Change this line
    });

    const response = await axios.post('/api/test-setup', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data.success) {
      console.log('Test setup submitted successfully:', response.data);
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to submit test setup');
    }
  } catch (error: any) {
    console.error('Error submitting test setup:', error.response?.data || error.message);
    throw error;
  }
};