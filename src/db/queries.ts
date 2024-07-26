import { db } from './index';
import { InsertNode, InsertPersona, InsertPersonaChat, InsertResult, SelectNode, SelectPersona, SelectPersonaChat, SelectResult, nodeTable, personaChatTable, personaTable, resultTable } from './schema';
import { TestResult, Step } from '../types/test/result'
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

export async function getFakeNode(): Promise<{
  id: string;
  picture: Buffer;
  markedPicture: Buffer;
  createdAt: Date;
}[] | null> {
  const nodes = await db
    .select()
    .from(nodeTable)
    .execute();

  if (nodes.length === 0) {
    return null;
  }

  return nodes.map(node => ({
    id: node.id,
    picture: Buffer.from(node.picture),
    markedPicture: Buffer.from(node.markedPicture),
    createdAt: new Date(node.createdAt),
  }));
}


// persona table
export async function addPersona(data: InsertPersona) {
  const result = await db.insert(personaTable).values(data).returning({ insertedId: nodeTable.id });
  return result[0];
}

export async function getPersonaById(id: SelectPersona['id']): Promise<{
  id: string;
  name: string;
  occupation: string;
  age: number;
  gender: string;
  experience: boolean;
  location: string;
  characteristic: string;
  coreId: string;
  createdAt: Date;
} | null> {

  const persona = await db
    .select()
    .from(personaTable)
    .where(eq(personaTable.id, id))
    .execute();

  return persona[0];
}

export async function addMultiplePersonas(personas: InsertPersona[]) {
  const result = await db.insert(personaTable).values(personas).returning({ insertedId: personaTable.id });
  return result.map(row => row.insertedId);
}

export async function getMultiplePersonasByCoreId(id: SelectPersona['coreId']): Promise<{
  id: string;
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

// result table
export async function addMultipleResults(results: InsertResult[]) {
  const result = await db.insert(resultTable).values(results).returning({ insertedId: resultTable.id });
  return result.map(row => row.insertedId);
}

export async function getMultipleResultsByCoreId(coreId: SelectResult['coreId']): Promise<TestResult[] | null> {

  try {
    const results = await db
      .select()
      .from(resultTable)
      .where(eq(resultTable.coreId, coreId))
      .execute();

    if (!results.length) {
      return null;
    }

    return await Promise.all(results.map(async (result) => {
      const persona = await getPersonaById(result.personaId);
      return {
        id: result.id,
        taskCompletion: result.taskCompletion,
        steps: result.steps,
        name: persona?.name ?? '',
        gender: persona?.gender ?? '',
        age: persona?.age ?? 0,
        occupation: persona?.occupation ?? '',
        completionTime: result.completionTime,
        persona: {
          name: persona?.name ?? '',
          age: persona?.age ?? 0,
          gender: persona?.gender ?? '',
          occupation: persona?.occupation ?? '',
          location: persona?.location ?? '',
          characteristic: persona?.characteristic ?? '',
        },
        stages: result.stepObj as Step[],
        generalFeedback: result.generalFeedback,
        personaId: result.personaId,
        coreId: result.coreId
      };
    }));

  } catch (error) {
    console.error("Error fetching personas by coreId:", error);
    return null;
  }
}

// persona chat table
export async function addPersonaChat(data: InsertPersonaChat) {
  const result = await db.insert(personaChatTable).values(data).returning({ insertedId: personaChatTable.personaId });
  return result[0];
}

export async function getPersonaChatById(id: SelectPersonaChat['personaId']): Promise<{
  personaId: string;
  createdAt: Date;
  chatHistory: unknown;
} | null> {

  const personaChat = await db
    .select()
    .from(personaChatTable)
    .where(eq(personaChatTable.personaId, id))
    .execute();

  return personaChat[0];
}

export async function updatePersonaChatById(
  id: SelectPersonaChat['personaId'],
  data: Partial<Omit<SelectPersonaChat, 'personaId'>>
): Promise<void> {
  await db
    .update(personaChatTable)
    .set(data)
    .where(eq(personaChatTable.personaId, id))
    .execute();
}