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
  
      if (!personas) {
        return NextResponse.json({ message: 'Node not found' }, { status: 404 });
      }
  
      return NextResponse.json({
        personas
      });
    } catch (error) {
      return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
    }
  }