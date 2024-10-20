import { db } from './../index';
import { annotationTable, InsertAnnotation, SelectAnnotation } from './../schema';
import { eq } from 'drizzle-orm';
import { getNodeById } from '@/db/queries/node';
import { NodeData } from '@/types/node/node';

// Insert new annotation
export async function addAnnotation(data: InsertAnnotation): Promise<{ insertedId: string }> {
    try {
        const result = await db.insert(annotationTable).values(data).returning({ insertedId: annotationTable.id });
        return result[0];
    } catch (error) {
        console.error('Error inserting annotation:', error);
        throw error;
    }
}

export async function addAnnotations(data: InsertAnnotation[]): Promise<boolean> {
    try {
        await db.insert(annotationTable).values(data);
        return true;
    } catch (error) {
        console.error('Error inserting annotations:', error);
        throw error;
    }
}

// Get an annotation by ID
export async function getAnnotationById(id: string): Promise<SelectAnnotation> {
    try {
        const result = await db.select().from(annotationTable).where(eq(annotationTable.id, id));
        return result[0] || null;
    } catch (error) {
        console.error('Error getting annotation by ID:', error);
        throw error;
    }
}

// Get all annotations for a specific screen
export async function getAnnotationsByScreenId(screenId: string): Promise<SelectAnnotation[]> {
    try {
        return await db.select().from(annotationTable).where(eq(annotationTable.nodeId, screenId));
    } catch (error) {
        console.error('Error getting annotations by screen ID:', error);
        throw error;
    }
}

export async function getAnnotationsByTestProjectId(testProjectId: string): Promise<NodeData> {
    try {
        // Get all annotations for the given test project
        const annotations: SelectAnnotation[] = await db
            .select()
            .from(annotationTable)
            .where(eq(annotationTable.testProjectId, testProjectId));

        // Group annotations by nodeId (synchronous grouping)
        const groupedAnnotations: { [nodeId: string]: any[] } = annotations.reduce((acc, annotation) => {
            if (!acc[annotation.nodeId]) {
                acc[annotation.nodeId] = [];
            }
            acc[annotation.nodeId].push({
                id: annotation.id,
                label: annotation.label,
                coordinates: annotation.coordinates, // Make sure coordinates are in correct structure
                leadsTo: annotation.leadsTo,
                isCorrectPath: annotation.isCorrectPath,
                isTheEnd: annotation.isTheEnd,
            });
            return acc;
        }, {} as { [nodeId: string]: any[] });

        // Prepare the screens array by fetching each node asynchronously
        const screens = await Promise.all(
            Object.keys(groupedAnnotations).map(async (nodeId) => {
                const node = await getNodeById(nodeId);
                if (node) {
                    return {
                        id: node.id,
                        image: node.picture.toString('base64'), // Convert image to base64
                        annotations: groupedAnnotations[nodeId].map(annotation => ({
                            id: annotation.id,
                            label: annotation.label,
                            coordinates: annotation.coordinates as {
                                x: number;
                                y: number;
                                width: number;
                                height: number;
                            }, // Make sure coordinates are typed correctly
                            leadsTo: annotation.leadsTo,
                            isCorrectPath: annotation.isCorrectPath,
                            isTheEnd: annotation.isTheEnd,
                        }))
                    };
                }
                return null; // In case node is not found
            })
        );

        // Filter out any null values (in case any nodes were not found)
        return {
            screens: screens.filter(screen => screen !== null)
        } as NodeData;
    } catch (error) {
        console.error(`Error fetching annotations for testProjectId ${testProjectId}:`, error);
        throw error;
    }
}

// Update an annotation by ID
export async function updateAnnotation(id: string, data: Partial<InsertAnnotation>): Promise<SelectAnnotation> {
    try {
        const result = await db.update(annotationTable).set(data).where(eq(annotationTable.id, id)).returning();
        return result[0] || null;
    } catch (error) {
        console.error('Error updating annotation:', error);
        throw error;
    }
}

// Delete an annotation by ID
export async function deleteAnnotation(id: string): Promise<{ deletedId: string }> {
    try {
        const result = await db.delete(annotationTable).where(eq(annotationTable.id, id)).returning({ deletedId: annotationTable.id });
        return result[0] || null;
    } catch (error) {
        console.error('Error deleting annotation:', error);
        throw error;
    }
}