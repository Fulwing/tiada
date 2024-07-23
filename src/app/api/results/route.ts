// src/app/api/results/route.ts
import { NextResponse } from 'next/server';

// Define the structure for each step in a test result
interface StepDetail {
  stepNumber: number;
  status: 'success' | 'miss';
  description?: string;
}

// Define the structure for a complete test result
interface TestResult {
  id: number;
  taskCompletion: string;
  steps: number;
  name: string;
  gender: string;
  age: number;
  occupation: string;
  stepDetails: StepDetail[];
  persona?: string;
}

// Handle GET requests to /api/results
export async function GET() {
    // Mock data for testing purposes
    // TODO: Replace this with actual data fetching from backend when it's ready
    const mockResults: TestResult[] = [
        {
            id: 1,
            taskCompletion: 'Success',
            steps: 7,
            name: 'John',
            gender: 'Male',
            age: 28,
            occupation: 'PM',
            stepDetails: [
                { stepNumber: 1, status: 'success' },
                { stepNumber: 2, status: 'success' },
                { stepNumber: 3, status: 'success' },
                { stepNumber: 4, status: 'success' },
                { stepNumber: 5, status: 'success' },
                { stepNumber: 6, status: 'success' },
                { stepNumber: 7, status: 'success' },
            ],
            persona: "John is a detail-oriented project manager with 5 years of experience.",
        },
        {
            id: 2,
            taskCompletion: 'Success',
            steps: 7,
            name: 'Jane',
            gender: 'Female',
            age: 32,
            occupation: 'Designer',
            stepDetails: [
                { stepNumber: 1, status: 'success' },
                { stepNumber: 2, status: 'success' },
                { stepNumber: 3, status: 'success' },
                { stepNumber: 4, status: 'miss', description: 'Missed a key design element' },
                { stepNumber: 5, status: 'success' },
                { stepNumber: 6, status: 'success' },
                { stepNumber: 7, status: 'success' },
            ],
            persona: "Jane is a creative designer with a keen eye for user experience.",
        },
        {
            id: 3,
            taskCompletion: 'Failure',
            steps: 5,
            name: 'Mike',
            gender: 'Male',
            age: 24,
            occupation: 'Developer',
            stepDetails: [
                { stepNumber: 1, status: 'success' },
                { stepNumber: 2, status: 'success' },
                { stepNumber: 3, status: 'miss', description: 'Missed navigation step' },
                { stepNumber: 4, status: 'miss', description: 'Failed to complete form' },
                { stepNumber: 5, status: 'miss', description: 'Error in submission process' },
            ],
            persona: "Mike is a junior developer eager to learn new technologies.",
        },
    ];
    console.log("GET request to /api/results");
    return NextResponse.json(mockResults);
}

