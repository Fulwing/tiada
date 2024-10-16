import { db } from '../index';
import { InsertNode, InsertPersona, InsertPersonaChat, InsertResult, SelectNode, SelectPersona, SelectPersonaChat, SelectResult, nodeTable, personaChatTable, personaTable, resultTable } from '../schema';
import { TestResult, Step } from '../../types/test/result'
import { eq } from 'drizzle-orm';

// node table
export async function addNode(data: InsertNode): Promise<{ insertedId: string }> {
  const result = await db.insert(nodeTable).values(data).returning({ insertedId: nodeTable.id });
  return result[0];
}