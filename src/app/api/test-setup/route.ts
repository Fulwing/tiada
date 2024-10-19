import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { insertTestProject } from '@/db/queries/testProject';
import { InsertTestProject } from '@/db/schema';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const testSetupData = JSON.parse(formData.get('testSetupData') as string);
    const files = formData.getAll('file') as File[];

    console.log('Received test setup data:', testSetupData);
    console.log('Received files:', files.map((f: File) => f.name));

    const fileBuffers = await Promise.all(files.map(async (file: File) => Buffer.from(await file.arrayBuffer())));

    const setupTestProject: InsertTestProject = {
      id: uuidv4(),
      testName: testSetupData.testName,
      productType: testSetupData.productType,
      productDescription: testSetupData.productDescription,
      taskDescription: testSetupData.taskDescription,
      taskInstruction: testSetupData.taskInstruction,
      evaluationMetrics: JSON.stringify(testSetupData.evaluationMetrics),
      relatedWebsites: testSetupData.relatedWebsites,
      files: fileBuffers,
      coreId: testSetupData.coreId,
      createdAt: new Date(),
    };

    const insertedTestProject = await insertTestProject(setupTestProject);

    return NextResponse.json({
      success: true,
      message: 'Test setup received successfully',
      testId: insertedTestProject[0].id, // Return the generated test project ID
    });
  } catch (error) {
    console.error('Error processing test setup:', error);
    return NextResponse.json({ success: false, message: 'Error processing test setup' }, { status: 500 });
  }
}
