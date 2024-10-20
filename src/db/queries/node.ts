import { db } from '../index';
import { InsertNode, InsertPersona, InsertPersonaChat, InsertResult, SelectNode, SelectPersona, SelectPersonaChat, SelectResult, nodeTable, personaChatTable, personaTable, resultTable } from '../schema';
import { TestResult, Step } from '../../types/test/result'
import { eq } from 'drizzle-orm';

// node table
export async function addNode(data: InsertNode): Promise<{ insertedId: string }> {
  const result = await db.insert(nodeTable).values(data).returning({ insertedId: nodeTable.id });
  return result[0];
}

export async function getNodeById(id: SelectNode['id']): Promise<{
  id: string;
  picture: Buffer;
  markedPicture: Buffer;
  createdAt: Date;
} | null> {
  const nodes = await db
    .select()
    .from(nodeTable)
    .where(eq(nodeTable.id, id))
    .execute();

  if (nodes.length === 0) {
    return null;
  }

  const node = nodes[0];
  return {
    id: node.id,
    picture: Buffer.from(node.picture),
    markedPicture: Buffer.from(node.markedPicture),
    createdAt: new Date(node.createdAt),
  };
}