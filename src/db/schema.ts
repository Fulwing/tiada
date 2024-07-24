import { pgTable, customType, timestamp, varchar, serial, integer, boolean, text } from 'drizzle-orm/pg-core';

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
  id: serial('id').primaryKey(),
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

export type InsertNode = typeof nodeTable.$inferInsert;
export type SelectNode = typeof nodeTable.$inferSelect;


export type InsertPersona = typeof personaTable.$inferInsert;
export type SelectPersona = typeof personaTable.$inferSelect;
