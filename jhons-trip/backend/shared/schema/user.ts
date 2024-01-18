import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { journey } from "./journey";
import { relations } from "drizzle-orm";

export const user = sqliteTable("user", {
  id: integer("id").primaryKey(),
  privilege: integer("privilege").notNull().default(0),
  username: text("username").notNull().unique(),
  password: text("username").notNull(),
});
export const history = sqliteTable("history", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").references(() => user.id, {
    onDelete: "restrict",
    onUpdate: "cascade",
  }),
  journeyId: integer("journey_id").references(() => journey.id, {
    onDelete: "restrict",
    onUpdate: "cascade",
  }),
});

export const userRelation = relations(user, ({ many }) => ({
  history: many(history),
}));

export const historyRelation = relations(history, ({ one }) => ({
  user: one(user, {
    fields: [history.userId],
    references: [user.id],
  }),
  journey: one(journey, {
    fields: [history.journeyId],
    references: [journey.id],
  }),
}));
