import { NextRequest, NextResponse } from 'next/server';
import { getFakeNode } from '../../../../db/queries';

export const config = {
    maxDuration: 30, //sec
};

export async function GET() {
    try {
        const nodes = await getFakeNode();

        if (!nodes) {
            return NextResponse.json({ message: 'Node not found' }, { status: 404 });
        }

        return NextResponse.json(nodes.map(node => ({
            picture: node.picture.toString('base64'),
            markedPicture: node.markedPicture.toString('base64'),
        })));
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
    }
}