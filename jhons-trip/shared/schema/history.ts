import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { journey } from "./journey";
import { user } from "./user";
import { relations } from "drizzle-orm";

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
