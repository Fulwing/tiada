// src/app/api/results/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { personaTable, SelectPersona } from '../../../db/schema';
import { TestResult, Step } from '../../../types/index';


// Handle GET requests to the /api/results endpoint
export async function GET() {
    try {
      const personas = await db.select().from(personaTable);
  
      const mockResults: TestResult[] = personas.map((persona, index) => ({
        id: index + 1,
        taskCompletion: Math.random() > 0.5 ? 'Success' : 'Failure',
        steps: Math.floor(Math.random() * 10) + 1,
        completionTime: Math.floor(Math.random() * 600) + 60,
        persona: persona as SelectPersona,
        stages: generateMockStages(Math.floor(Math.random() * 10) + 1),
        generalFeedback: `Feedback for ${persona.name}'s performance...`
      }));
  
      return NextResponse.json(mockResults);
    } catch (error) {
      console.error("Error fetching results:", error);
      return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
    }
  }
  
  
  
  function generateMockStages(count: number): Step[] {
    return Array.from({ length: count }, (_, i) => ({
      stepNumber: i + 1,
      status: Math.random() > 0.3 ? 'success' : 'miss',
      description: `Step ${i + 1} description`,
      image: '/rectangle-6.png',
      userAction: `User action for step ${i + 1}`,
      userExplanation: `User explanation for step ${i + 1}`
    }));
  }
  
  