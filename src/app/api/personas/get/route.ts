import { NextResponse } from 'next/server';
import { getMultiplePersonasByCoreId } from '../../../../db/queries';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const coreId = url.searchParams.get('userId');

  if (!coreId) {
    return NextResponse.json({ error: 'coreId parameter is required' }, { status: 400 });
  }

  try {
    const personas = await getMultiplePersonasByCoreId(coreId);

    if (!personas || personas.length === 0) {
      return NextResponse.json({ personas: [] }, { status: 200 });
    }

    return NextResponse.json({ personas });
  } catch (error) {
    console.error('Error in getPersonas:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}


