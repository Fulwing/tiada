import { db } from './index';
import { InsertNode, InsertPersona, SelectNode, SelectPersona, nodeTable, personaTable } from './schema';
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

export async function getMultiplePersonasByCoreId(id: SelectPersona['coreId']): Promise<{
  id: number;
  name: string;
  occupation: string;
  age: number;
  gender: string;
  experience: boolean;
  location: string;
  characteristic: string;
  coreId: string;
  createdAt: Date;
}[] | null> {

  try {
    const personas = await db
      .select()
      .from(personaTable)
      .where(eq(personaTable.coreId, id))
      .execute();

    if (!personas.length) {
      return null;
    }

    return personas.map(persona => ({
      id: persona.id,
      name: persona.name,
      occupation: persona.occupation,
      age: persona.age,
      gender: persona.gender,
      experience: persona.experience,
      location: persona.location,
      characteristic: persona.characteristic,
      coreId: persona.coreId,
      createdAt: persona.createdAt
    }));
  } catch (error) {
    console.error("Error fetching personas by coreId:", error);
    return null;
  }
}