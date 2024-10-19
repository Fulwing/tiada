// src/app/api/mock/results/route.ts
import { NextResponse } from 'next/server';
import { TestResult } from '../../../../types/test/result';

export async function GET(req: Request) {
  const mockResults: TestResult[] = [
    {
      id: '1',
      taskCompletion: 'Success',
      steps: 5,
      name: 'John Doe',
      gender: 'Male',
      age: 30,
      occupation: 'Software Engineer',
      completionTime: 120000, // 2 minutes in milliseconds
      persona: {
        name: 'John Doe',
        age: 30,
        gender: 'Male',
        occupation: 'Software Engineer',
        location: 'New York, USA',
        characteristic: 'Tech-savvy, detail-oriented'
      },
      stages: [
        { stepNumber: 1, status: 'success', description: 'Open application', image: '/placeholder.png', userAction: 'Clicked on app icon', userExplanation: 'I saw the app icon on my home screen' },
        { stepNumber: 2, status: 'success', description: 'Navigate to login page', image: '/placeholder.png', userAction: 'Clicked on login button', userExplanation: 'The login button was clearly visible' },
        { stepNumber: 3, status: 'success', description: 'Enter credentials', image: '/placeholder.png', userAction: 'Typed username and password', userExplanation: 'I entered my pre-existing account details' },
        { stepNumber: 4, status: 'success', description: 'Submit login form', image: '/placeholder.png', userAction: 'Clicked submit button', userExplanation: 'After entering my details, I submitted the form' },
        { stepNumber: 5, status: 'miss', description: 'View dashboard', image: '/placeholder.png', userAction: 'Observed dashboard', userExplanation: 'I was automatically taken to the dashboard after logging in' }
      ],
      generalFeedback: 'The login process was smooth and intuitive. I had no issues completing the task.',
      personaId: 'persona1',
      coreId: 'core1'
    },
    {
      id: '2',
      taskCompletion: 'Failure',
      steps: 3,
      name: 'Jane Smith',
      gender: 'Female',
      age: 45,
      occupation: 'Marketing Manager',
      completionTime: 180000, // 3 minutes in milliseconds
      persona: {
        name: 'Jane Smith',
        age: 45,
        gender: 'Female',
        occupation: 'Marketing Manager',
        location: 'Chicago, USA',
        characteristic: 'Non-technical, busy professional'
      },
      stages: [
        { stepNumber: 1, status: 'success', description: 'Open application', image: '', userAction: 'Clicked on app icon', userExplanation: 'I found the app icon after some searching' },
        { stepNumber: 2, status: 'success', description: 'Navigate to login page', image: '', userAction: 'Clicked on login button', userExplanation: 'The login button was not immediately obvious, but I found it' },
        { stepNumber: 3, status: 'miss', description: 'Enter credentials', image: '', userAction: 'Attempted to enter username and password', userExplanation: 'I couldnt remember my password and the password reset process was confusing' }
      ],
      generalFeedback: 'The login process was not intuitive for me. I had trouble finding the login button and then couldnt reset my password easily.',
      personaId: 'persona2',
      coreId: 'core1'
    }
  ];

  return NextResponse.json(mockResults);
}

