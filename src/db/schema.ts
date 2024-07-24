import { pgTable, customType, timestamp, varchar, integer, boolean, text, uuid, jsonb } from 'drizzle-orm/pg-core';

const bytea = customType<{
  data: Buffer
  default: false
}>({
  dataType() {
    return 'bytea'
  },
})

export const nodeTable = pgTable('node_table', {
  id: varchar('id').primaryKey(),
  picture: bytea('picture').notNull(),
  markedPicture: bytea('markedPicture').notNull(),
  coreId: varchar('core_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
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

export type InsertNode = typeof nodeTable.$inferInsert;
export type SelectNode = typeof nodeTable.$inferSelect;


export type InsertPersona = typeof personaTable.$inferInsert;
export type SelectPersona = typeof personaTable.$inferSelect;

export type InsertResult = typeof resultTable.$inferInsert;
export type SelectResult = typeof resultTable.$inferSelect;
