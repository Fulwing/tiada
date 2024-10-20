import { addNode } from '@/db/queries/node';
import { addAnnotations } from '@/db/queries/annotations';
import { InsertAnnotation, InsertNode } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Parse the incoming FormData
    const formData = await request.formData();

    // Get the screens data from FormData (which is sent as a string)
    const screensData = formData.get('screens') as string;
    const screens = JSON.parse(screensData);

    const coreId = formData.get('coreId') as string;
    const testProjectId = formData.get('testProjectId') as string;

    // Validate the incoming data
    if (!screens || !Array.isArray(screens) || !coreId || !testProjectId) {
      return NextResponse.json({ message: 'Invalid data format' }, { status: 400 });
    }

    const insertAnnotations: InsertAnnotation[] = [];
    const imageFiles: File[] = [];

    // Collect all image files from FormData
    formData.forEach((value, key) => {
      if (key === 'images' && value instanceof File) {
        imageFiles.push(value); // Collect image files
      }
    });

    if (imageFiles.length !== screens.length) {
      return NextResponse.json({ message: 'Mismatch between screen count and image file count' }, { status: 400 });
    }

    for (let index = 0; index < screens.length; index++) {
      const screen = screens[index];
      const { id, annotations } = screen;
      const pictureFile = imageFiles[index]; // Get corresponding image file

      // Convert the image file to a buffer
      const pictureBuffer = Buffer.from(await pictureFile.arrayBuffer());

      // Save the screen (node) with the image
      const nodeData: InsertNode = {
        id,
        picture: pictureBuffer,
        markedPicture: pictureBuffer, // Use a different image if needed for markedPicture
        coreId,
        createdAt: new Date(),
      };

      await addNode(nodeData);

      // Process annotations
      for (const annotation of annotations) {
        const { id: annotationId, label, coordinates, leadsTo, isCorrectPath, isTheEnd } = annotation;

        // Validate annotation data
        if (!annotationId || !label || !coordinates || !leadsTo || isTheEnd === undefined) {
          return NextResponse.json({ message: 'Invalid annotation data' }, { status: 400 });
        }

        // Prepare annotation data for insertion
        const newAnnotation: InsertAnnotation = {
          id: annotationId,
          nodeId: id,
          label,
          coordinates,
          leadsTo,
          isCorrectPath,
          isTheEnd,
          testProjectId,
          createdAt: new Date(),
        };

        insertAnnotations.push(newAnnotation);
      }
    }

    // Bulk insert all annotations into the database
    if (insertAnnotations.length > 0) {
      await addAnnotations(insertAnnotations);
    }

    return NextResponse.json({ message: 'Data received and processed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing annotation data:', error);
    return NextResponse.json({ message: 'Error processing annotation data' }, { status: 500 });
  }
}
