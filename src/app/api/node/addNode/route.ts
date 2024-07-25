import { NextRequest, NextResponse } from 'next/server';
import { addNode } from '../../../../db/queries';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const pictureFile = formData.get('picture') as File;
    const markedPictureFile = formData.get('markedPicture') as File;
    const id = formData.get('id') as string;
    // const coreId = formData.get('core_id') as string;

    if (!pictureFile || !markedPictureFile) {
        return NextResponse.json({ message: 'Missing images' }, { status: 400 });
    }

    const pictureBuffer = Buffer.from(await pictureFile.arrayBuffer());
    const markedPictureBuffer = Buffer.from(await markedPictureFile.arrayBuffer());

    const data = {
        id: '3',
        picture: pictureBuffer,
        markedPicture: markedPictureBuffer,
        coreId: 'KBNX34'
    };

    try {
        const { insertedId } = await addNode(data);

        return NextResponse.json({ message: 'Images uploaded successfully', id: insertedId });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
    }
}