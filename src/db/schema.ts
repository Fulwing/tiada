import { pgTable, customType, timestamp, varchar } from 'drizzle-orm/pg-core';

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
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export type InsertNode = typeof nodeTable.$inferInsert;
export type SelectNode = typeof nodeTable.$inferSelect;
