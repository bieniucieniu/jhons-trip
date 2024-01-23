import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { journey, region } from "./journey";
import { relations } from "drizzle-orm";

export const user = sqliteTable("user", {
  id: integer("id").primaryKey(),
  privilege: integer("privilege").notNull().default(0),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const history = sqliteTable("history", {
  id: integer("id").primaryKey(),
  for: integer("for").notNull(),
  journeyName: text("journey_name").notNull(),
  date: integer("start").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  journeyId: integer("journey_id")
    .notNull()
    .references(() => journey.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const comment = sqliteTable("comment", {
  id: integer("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  journeyId: integer("journey_id")
    .notNull()
    .references(() => journey.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  regionId: integer("region_id")
    .notNull()
    .references(() => region.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  historyId: integer("history_id")
    .notNull()
    .references(() => journey.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  rating: integer("rating").default(10),
  title: text("title").notNull(),
  content: text("content").notNull(),
});

export const userRelation = relations(user, ({ many }) => ({
  history: many(history),
  comment: many(comment),
}));

export const historyRelation = relations(history, ({ one, many }) => ({
  user: one(user, {
    fields: [history.userId],
    references: [user.id],
  }),
  journey: one(journey, {
    fields: [history.journeyId],
    references: [journey.id],
  }),
  comment: many(comment),
}));

export const commentRelation = relations(comment, ({ one }) => ({
  user: one(user, {
    fields: [comment.userId],
    references: [user.id],
  }),
  journey: one(journey, {
    fields: [comment.journeyId],
    references: [journey.id],
  }),
  history: one(history, {
    fields: [comment.historyId],
    references: [history.id],
  }),
  region: one(region, {
    fields: [comment.regionId],
    references: [region.id],
  }),
}));
