// src/app/api/mock/heuristics/route.ts
import { NextResponse } from 'next/server';
import { HeuristicsData } from '../../../../types/heuristics';

export async function GET(req: Request) {
  const mockHeuristicsData: HeuristicsData = {
    scores: [
      { name: 'Visibility of System Status', score: 4 },
      { name: 'Match Between System and Real World', score: 3 },
      { name: 'User Control and Freedom', score: 4 },
      { name: 'Consistency and Standards', score: 5 },
      { name: 'Error Prevention', score: 3 },
      { name: 'Recognition Rather Than Recall', score: 4 },
      { name: 'Flexibility and Efficiency of Use', score: 3 },
      { name: 'Aesthetic and Minimalist Design', score: 5 },
      { name: 'Help Users Recognize, Diagnose, and Recover from Errors', score: 4 },
      { name: 'Help and Documentation', score: 4 },
    ],
    overallScore: 4,
    pageEvaluations: [
      {
        id: '1',
        name: 'Login Page',
        image: '/mock-images/login-page.png',
        scores: [
          { name: 'Visibility of System Status', score: 3 },
          { name: 'Match Between System and Real World', score: 4 },
          { name: 'User Control and Freedom', score: 4 },
          { name: 'Consistency and Standards', score: 5 },
          { name: 'Error Prevention', score: 2 },
          { name: 'Recognition Rather Than Recall', score: 4 },
          { name: 'Flexibility and Efficiency of Use', score: 3 },
          { name: 'Aesthetic and Minimalist Design', score: 5 },
          { name: 'Help Users Recognize, Diagnose, and Recover from Errors', score: 4 },
          { name: 'Help and Documentation', score: 4 },
        ]
      },
      {
        id: '2',
        name: 'Dashboard',
        image: '/mock-images/dashboard.png',
        scores: [
          { name: 'Visibility of System Status', score: 5 },
          { name: 'Match Between System and Real World', score: 4 },
          { name: 'User Control and Freedom', score: 3 },
          { name: 'Consistency and Standards', score: 5 },
          { name: 'Error Prevention', score: 4 },
          { name: 'Recognition Rather Than Recall', score: 4 },
          { name: 'Flexibility and Efficiency of Use', score: 3 },
          { name: 'Aesthetic and Minimalist Design', score: 5 },
          { name: 'Help Users Recognize, Diagnose, and Recover from Errors', score: 4 },
          { name: 'Help and Documentation', score: 4 },
        ]
      },
      // Add more page evaluations as needed
    ]
  };

  return NextResponse.json(mockHeuristicsData);
}

