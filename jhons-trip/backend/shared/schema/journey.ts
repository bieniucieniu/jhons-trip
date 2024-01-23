import { relations } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { comment, history } from "./user";

export const journey = sqliteTable("journey", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  details: text("details").notNull(),
  start: integer("start").notNull(),
  end: integer("end").notNull(),
  slots: integer("slots").notNull(),
  booked: integer("booked").notNull().default(0),
  price: integer("price").notNull(),
  imageUrl: text("image_url"),
  regionId: integer("region_id")
    .notNull()
    .references(() => region.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const country = sqliteTable("country", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
});

export const region = sqliteTable("region", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  countryId: integer("country_id")
    .notNull()
    .references(() => country.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const countryRelations = relations(country, ({ many }) => ({
  region: many(region),
}));

export const regionRelations = relations(region, ({ one }) => ({
  country: one(country, {
    fields: [region.countryId],
    references: [country.id],
  }),
}));

export const journeyRelation = relations(journey, ({ one, many }) => ({
  region: one(region, {
    fields: [journey.regionId],
    references: [region.id],
  }),
  history: many(history),
  comment: many(comment),
}));
