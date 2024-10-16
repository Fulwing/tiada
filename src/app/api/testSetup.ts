// src/app/api/testSetup.ts

import axios from 'axios';
import { TestSetupData } from '@/types/test/project';

export const submitTestSetup = async (data: TestSetupData, files: File[]) => {
  try {
    const formData = new FormData();
    formData.append('testSetupData', JSON.stringify(data));
    files.forEach((file) => {
      formData.append('file', file);
    });

    const response = await axios.post('/api/test-setup', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error submitting test setup:', error.response?.data || error.message);
    throw error;
  }
};

