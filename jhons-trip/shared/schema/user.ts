import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { history } from "./history";

export const user = sqliteTable("user", {
  id: integer("id").primaryKey(),
  username: text("username").notNull(),
  password: text("username").notNull(),
});

export const userRelation = relations(history, ({ many }) => ({
  history: many(history),
}));
