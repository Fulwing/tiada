import { pgTable, customType, timestamp, varchar, integer, boolean, text, uuid, jsonb, PgArray } from 'drizzle-orm/pg-core';

const bytea = customType<{
  data: Buffer
  default: false
}>({
  dataType() {
    return 'bytea'
  },
})

export const nodeTable = pgTable('node_table', {
  id: varchar('id').primaryKey(), // uuid('id').defaultRandom().primaryKey(),
  picture: bytea('picture').notNull(),
  markedPicture: bytea('markedPicture').notNull(),
  coreId: varchar('core_id').notNull(), // TODO: Change to testProjectId
  createdAt: timestamp('created_at').notNull().defaultNow()
  // isTheStart: boolean('is_the_start').notNull(), TODO: add this after testing
});

export const personaTable = pgTable('persona_table', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  occupation: varchar('occupation').notNull(),
  age: integer('age').notNull(),
  gender: varchar('gender').notNull(),
  experience: boolean('experience').notNull(),
  location: varchar('location').notNull(),
  characteristic: text('characteristic').notNull(),
  coreId: varchar('core_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const resultTable = pgTable('result_table', {
  id: uuid('id').defaultRandom().primaryKey(),
  personaId: varchar('persona_id').notNull(),
  taskCompletion: varchar('task_completion').notNull(),
  steps: integer('steps').notNull(),
  stepObj: jsonb('stepObj').notNull(),
  completionTime: integer('completion_time').notNull(),
  generalFeedback: varchar('general_feedback').notNull(),
  coreId: varchar('core_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const personaChatTable = pgTable('personachat_table', {
  personaId: varchar('persona_id').notNull().primaryKey(),
  chatHistory: jsonb('chat_history').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const TestProject = pgTable('test_project', {
  id: uuid('id').defaultRandom().primaryKey(),
  testName: varchar('test_name').notNull(),
  productType: varchar('product_type').notNull(),
  productDescription: text('product_description').notNull(),
  taskDescription: text('task_description').notNull(),
  taskInstruction: text('task_instruction').notNull(),
  evaluationMetrics: text('evaluation_metrics').notNull(),
  relatedWebsites: text('related_websites').array().notNull(),
  files: bytea('files').array().notNull(),
  coreId: varchar('core_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const annotationTable = pgTable('annotation_table', {
  id: uuid('id').defaultRandom().primaryKey(),
  nodeId: varchar('node_id').notNull(),
  label: varchar('label').notNull(),
  coordinates: jsonb('coordinates').notNull(),
  leadsTo: varchar('leads_to').notNull(),
  isCorrectPath: boolean('is_correct_path').notNull(),
  isTheEnd: boolean('is_the_end').notNull(),
  testProjectId: varchar('test_project_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type InsertNode = typeof nodeTable.$inferInsert;
export type SelectNode = typeof nodeTable.$inferSelect;

export type InsertPersona = typeof personaTable.$inferInsert;
export type SelectPersona = typeof personaTable.$inferSelect;

export type InsertResult = typeof resultTable.$inferInsert;
export type SelectResult = typeof resultTable.$inferSelect;

export type InsertPersonaChat = typeof personaChatTable.$inferInsert;
export type SelectPersonaChat = typeof personaChatTable.$inferSelect;

export type InsertTestProject = typeof TestProject.$inferInsert;
export type SelectTestProject = typeof TestProject.$inferSelect;

export type InsertAnnotation = typeof annotationTable.$inferInsert;
export type SelectAnnotation = typeof annotationTable.$inferSelect;