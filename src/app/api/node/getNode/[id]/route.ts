import { NextRequest, NextResponse } from 'next/server';
import { getNodeById } from '../../../../../db/queries';

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {

  try {
    const node = await getNodeById(params.id);

    if (!node) {
      return NextResponse.json({ message: 'Node not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...node,
      picture: node.picture.toString('base64'),
      markedPicture: node.markedPicture.toString('base64'),
    });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}