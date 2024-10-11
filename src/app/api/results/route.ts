import { NextResponse } from 'next/server';
import { getMultipleResultsByCoreId } from '../../../db/queries';
import { TestResult, Step } from '../../../types/test/result';

export const dynamic = 'force-dynamic';

// Handle GET requests to the /api/results endpoint
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const coreId = url.searchParams.get('userId');

    if (!coreId) {
      return NextResponse.json({ error: 'coreId parameter is required' }, { status: 400 });
    }

    const testResults = await getMultipleResultsByCoreId(coreId);

    if (!testResults) {
      return NextResponse.json({ error: 'No test results found' }, { status: 404 });
    }

    const mockResults: TestResult[] = testResults.map((testResult) => ({
      id: testResult.id,
      taskCompletion: testResult.taskCompletion,
      steps: testResult.steps,
      name: testResult.name,
      gender: testResult.gender,
      age: testResult.age,
      occupation: testResult.occupation,
      completionTime: testResult.completionTime,
      persona: testResult.persona,
      stages: testResult.stages,
      generalFeedback: testResult.generalFeedback,
      personaId: testResult.personaId,
      coreId: testResult.coreId
    }));

    return NextResponse.json(mockResults);
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}

