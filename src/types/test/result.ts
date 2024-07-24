// Represents a single step in the user journey
export interface Step {
    stepNumber: number;
    status: 'success' | 'miss';
    description: string;
    image: string;
    userAction: string;
    userExplanation: string;
}

// Represents the complete test result for a single user
export interface TestResult {
    id: number;
    taskCompletion: string;
    steps: number;
    name: string;
    gender: string;
    age: number;
    occupation: string;
    completionTime: number;
    persona: {
      name: string;
      age: number;
      gender: string;
      occupation: string;
      location: string;
      characteristic: string;
    };
    stages: Step[];
    generalFeedback: string;
}
  