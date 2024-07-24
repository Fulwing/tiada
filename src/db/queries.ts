import { db } from './index';
import { InsertNode, InsertPersona, SelectNode, nodeTable, personaTable } from './schema';
import { eq } from 'drizzle-orm';

// node table
export async function addNode(data: InsertNode) {
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
    picture: node.picture,
    markedPicture: node.markedPicture,
    createdAt: node.createdAt,
  };
}

// persona table
export async function addPersona(data: InsertPersona) {
  const result = await db.insert(personaTable).values(data).returning({ insertedId: nodeTable.id });
  return result[0];
}

export async function addMultiplePersonas(personas: InsertPersona[]) {
  const result = await db.insert(personaTable).values(personas).returning({ insertedId: personaTable.id });
  return result.map(row => row.insertedId);
}