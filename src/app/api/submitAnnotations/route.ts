import { addNode } from '@/db/queries/Node';
import { addAnnotations } from '@/db/queries/Annotations';
import { InsertAnnotation, InsertNode } from '@/db/schema';
import { NextResponse } from 'next/server';

/**
 * API route handler for submitting annotations
 * 
 * @route POST /api/submitAnnotations
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse>} The response object
 * 
 * Expected request body structure:
 * {
 *   screens: [
 *     {
 *       id: string,
 *       image: string,
 *       annotations: [
 *         {
 *           id: string,
 *           label: string,
 *           coordinates: {
 *             x: number,
 *             y: number,
 *             width: number,
 *             height: number
 *           },
 *           leadsTo: string,
 *           isCorrectPath: boolean
 *         }
 *       ]
 *     }
 *   ]
 * }
 */

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const data = await request.json();
    console.log('Received annotation data:', data);

    // TODO: Implement data processing and storage logic here
    // 1. Validate the incoming data
    // 2. Process and store the annotations in your database
    // 3. Handle any necessary image processing or storage

    const { screens } = data;
    if (!screens || !Array.isArray(screens)) {
      return NextResponse.json({ message: 'Invalid data format' }, { status: 400 });
    }

    const insertAnnotations: InsertAnnotation[] = [];

    for (const screen of screens) {
      const { id, image, annotations } = screen;

      // First, save the screen (node) with the image using addNode
      const nodeData: InsertNode = {
        id: id,
        picture: Buffer.from(image, 'base64'),
        markedPicture: Buffer.from(image, 'base64'),
        coreId: data.coreId || '', // TODO: Change to testProjectId
        createdAt: new Date(),
      };

      await addNode(nodeData);

      // // Validate if screen exists by retrieving annotations for the screen (or node)
      // const screenExists = await getAnnotationsByScreenId(id);
      // if (!screenExists.length) {
      //   return NextResponse.json({ message: `Screen with ID ${id} not found` }, { status: 404 });
      // }

      for (const annotation of annotations) {
        const { id: annotationId, label, coordinates, leadsTo, isCorrectPath } = annotation;

        // Validate annotation data
        if (!annotationId || !label || !coordinates || !leadsTo || typeof isCorrectPath !== 'boolean') {
          return NextResponse.json({ message: 'Invalid annotation data' }, { status: 400 });
        }

        // Prepare annotation data for insertion
        const newAnnotation: InsertAnnotation = {
          id: annotationId,
          nodeId: id, // Link annotation to the current screen's ID (node)
          label,
          coordinates,
          leadsTo,
          isCorrectPath,
          testProjectId: data.testProjectId, // TODO: ask andrew to pass this id
          createdAt: new Date(),
        };

        insertAnnotations.push(newAnnotation);
      }
    }

    // Insert all annotations into the database
    if (insertAnnotations.length > 0) {
      await addAnnotations(insertAnnotations);
    }


    return NextResponse.json({ message: 'Data received and processed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing annotation data:', error);
    return NextResponse.json({ message: 'Error processing annotation data' }, { status: 500 });
  }
}