import { db } from '../index';
import { TestProject, InsertTestProject, SelectTestProject } from '../schema';
import { eq } from 'drizzle-orm';

// Insert a new TestProject
export async function insertTestProject(testProject: InsertTestProject): Promise<SelectTestProject[]> {
    try {
        const insertedTestProject = await db.insert(TestProject).values(testProject).returning();
        return insertedTestProject;
    } catch (error) {
        console.error('Error inserting TestProject:', error);
        throw error;
    }
}

// Get all TestProjects
export async function getAllTestProjects(): Promise<SelectTestProject[]> {
    try {
        const testProjects = await db.select().from(TestProject);
        return testProjects;
    } catch (error) {
        console.error('Error fetching all TestProjects:', error);
        throw error;
    }
}

// Get a TestProject by ID
export async function getTestProjectById(testProjectId: string): Promise<SelectTestProject | undefined> {
    try {
        const testProject = await db.select().from(TestProject).where(eq(TestProject.id, testProjectId)).limit(1);
        return testProject[0];
    } catch (error) {
        console.error(`Error fetching TestProject with ID ${testProjectId}:`, error);
        throw error;
    }
}

// Update a TestProject by ID
export async function updateTestProject(testProjectId: string, updatedData: Partial<InsertTestProject>): Promise<SelectTestProject[]> {
    try {
        const updatedTestProject = await db.update(TestProject)
            .set(updatedData)
            .where(eq(TestProject.id, testProjectId))
            .returning();
        return updatedTestProject;
    } catch (error) {
        console.error(`Error updating TestProject with ID ${testProjectId}:`, error);
        throw error;
    }
}

// Delete a TestProject by ID
export async function deleteTestProject(testProjectId: string): Promise<SelectTestProject[]> {
    try {
        const deletedTestProject = await db.delete(TestProject).where(eq(TestProject.id, testProjectId)).returning();
        return deletedTestProject;
    } catch (error) {
        console.error(`Error deleting TestProject with ID ${testProjectId}:`, error);
        throw error;
    }
}