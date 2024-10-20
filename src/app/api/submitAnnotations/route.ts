import { addNode } from '@/db/queries/node';
import { addAnnotations } from '@/db/queries/annotations';
import { InsertAnnotation, InsertNode } from '@/db/schema';
import { NextResponse } from 'next/server';

/**
 * API route handler for submitting annotations
 * 
 * @route POST /api/submitAnnotations
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse>} The response object
 * 
 */
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

    for (const screen of screens) {
      const { id, image: imageFileName, annotations, isTheStart } = screen;

      // Get the actual file from FormData using the filename
      const pictureFile = formData.get(imageFileName) as File;
      if (!pictureFile) {
        return NextResponse.json({ message: `Image file ${imageFileName} not found` }, { status: 400 });
      }

      // Convert the image file to a buffer
      const pictureBuffer = Buffer.from(await pictureFile.arrayBuffer());

      // Save the screen (node) with the image
      const nodeData: InsertNode = {
        id,
        picture: pictureBuffer,
        markedPicture: pictureBuffer, // TODO: You might want to distinguish marked pictures
        coreId,
        createdAt: new Date(),
        // isTheStart, // TODO: You can handle this field if needed
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
