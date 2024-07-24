import { SelectPersona } from '../db/schema';

export interface Step {
  stepNumber: number;
  status: 'success' | 'miss';
  description: string;
  image: string;
  userAction: string;
  userExplanation: string;
}

export interface TestResult {
  id: number;
  taskCompletion: 'Success' | 'Failure';
  steps: number;
  completionTime: number;
  persona: SelectPersona;
  stages: Step[];
  generalFeedback: string;
}


