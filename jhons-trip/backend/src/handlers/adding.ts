import { country, journey, region } from "@/shared/schema/journey";
import { createInsertSchema } from "drizzle-zod";
import type { Express } from "express";
import { z } from "zod";
import { authenticateToken } from "../auth";
import { db } from "../db";
import { comment, history } from "@/shared/schema/user";
import { asyncFilter } from "../utils";
import { and, eq } from "drizzle-orm";
const insertCountriesSchema = createInsertSchema(country, {
  name: z.string().toUpperCase(),
}).array();

export default function AppendAddingHandlers(app: Express) {
  app.post("/api/countries", async (req, res) => {
    const t = authenticateToken(req);
    if (!t || t.privilege < 10) {
      res.status(401);
      return;
    }
    res.setHeader("Content-Type", "application/json");

    const { data } = req.body;

    try {
      const d = insertCountriesSchema.parse(data);

      const ok = await db.insert(country).values(d).onConflictDoNothing();
      if (!ok) throw Error("cant insert country: " + d);
      res.status(200);
      res.json({
        success: true,
      });
      return;
    } catch (e) {
      res.status(406);
      res.json({
        error: e,
      });
      return;
    }
  });

  const insertRegionsSchema = createInsertSchema(region, {
    name: z.string().toUpperCase(),
  }).array();

  app.post("/api/regions", async (req, res) => {
    const t = authenticateToken(req);
    if (!t || t.privilege < 10) {
      res.status(401);
      return;
    }
    res.setHeader("Content-Type", "application/json");

    const { data } = req.body;

    try {
      const d = insertRegionsSchema.parse(data);

      const ok = await db.insert(region).values(d).onConflictDoNothing();
      if (!ok) throw Error("cant insert country: " + d);

      res.status(200);
      res.json({
        success: true,
      });
      return;
    } catch (e) {
      res.status(406);
      res.json({
        error: e,
      });
      return;
    }
  });

  const insertJourneysSchema = createInsertSchema(journey, {
    name: z.string().toUpperCase(),
  }).array();

  app.post("/api/journeys", async (req, res) => {
    const t = authenticateToken(req);
    if (!t || t.privilege < 10) {
      res.status(401);
      return;
    }
    res.setHeader("Content-Type", "application/json");

    const { data } = req.body;

    try {
      const d = insertJourneysSchema.parse(data);

      const ok = db.insert(journey).values(d).onConflictDoNothing();
      if (!ok) throw Error("cant insert country: " + d);

      res.status(200);
      res.json({
        success: true,
      });
      return;
    } catch (e) {
      res.status(406);
      res.json({
        error: e,
      });
      return;
    }
  });

  const insertHistorySchema = createInsertSchema(history).array();

  app.post("/api/book", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const t = authenticateToken(req);
    if (!t) {
      res.status(406);
      return;
    }
    const { data, returning } = req.body;

    try {
      const d = insertHistorySchema.parse(data);
      const rejected: typeof d = [];

      const succeed = await asyncFilter(d, async (booking) => {
        if (booking.userId !== t.userID) throw new Error("incorect user id");
        console.log(booking);
        const j = await db.query.journey.findFirst({
          where: eq(journey.id, booking.journeyId),
        });

        if (!j || booking.for > j.slots - j.booked) {
          rejected.push(booking);
          return false;
        }
        await db
          .update(journey)
          .set({ booked: j.booked + booking.for })
          .where(eq(journey.id, booking.journeyId));
        return true;
      });

      await db.insert(history).values(succeed);

      if (rejected.length > 0 || returning)
        return res.json({
          succeed,
          rejected,
        });

      res.status(200);
      return res.json({
        success: true,
      });
    } catch (e) {
      res.status(400);
      if (e instanceof Error) return res.json({ error: e.message });
      return res.json({
        error: e,
      });
    }
  });

  app.post("/api/cancel", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const t = authenticateToken(req);
    if (!t) {
      res.status(406);
      return;
    }
    const { id } = req.body;
    console.log({ id });
    try {
      const i = z.number().parse(id);

      const d = await db
        .update(history)
        .set({
          for: 0,
          journeyName: "canceled",
        })
        .where(and(eq(history.id, i), eq(history.userId, t.userID)))
        .returning();

      const j = await db
        .select({ booked: journey.booked })
        .from(journey)
        .where(eq(journey.id, d[0].id));
      if (d && j) {
        const r = await db
          .update(journey)
          .set({
            booked: j[0].booked > d[0].for ? j[0].booked - d[0].for : 0,
          })
          .where(eq(journey.id, d[0].id));

        await db
          .delete(history)
          .where(and(eq(history.id, i), eq(history.userId, t.userID)));
        res.status(200);
        return res.json({ return: r });
      }
      res.status(500);
      return;
    } catch (e) {
      console.log(e);
      res.status(406);
      return res.json({
        error: e,
      });
    }
  });

  const insertCommentSchema = createInsertSchema(comment);

  app.post("/api/comment", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const { data } = req.body;

    try {
      const d = insertCommentSchema.parse(data);
      db.insert(comment).values(d);
    } catch (e) {
      res.status(406);
      res.json({ error: e });
      return;
    }
  });

  return app;
}
