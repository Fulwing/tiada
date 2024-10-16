import { db } from './../index';
import { annotationTable, InsertAnnotation, SelectAnnotation } from './../schema';
import { eq } from 'drizzle-orm';

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