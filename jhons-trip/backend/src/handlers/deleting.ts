import type { Express } from "express";
import { db } from "../db";
import { country, journey, region } from "@/shared/schema/journey";
import { and, eq } from "drizzle-orm";
import { authenticateToken } from "../auth";
import { comment, history, user } from "@/shared/schema/user";
import { z } from "zod";
export default function AppendDeletingHandlers(app: Express) {
  app.delete("/api/journey", async (req, res) => {
    const t = authenticateToken(req);
    if (!t || t.privilege < 100) {
      res.status(401);
      return;
    }
    res.setHeader("Content-Type", "application/json");
    const { id } = req.query;
    const i = id ? Number(id) : undefined;
    if (!i) {
      res.status(400);
      res.json({ message: "wrong id provided, id: " + id });
      return;
    }

    try {
      const data = await db
        .delete(journey)
        .where(eq(journey.id, i))
        .returning();

      if (data.length === 0) {
        res.status(400);
        res.json({
          message: "provided id doesn't exist in database, id: " + id,
        });
        return;
      }
      res.status(200);
      res.json({ data });
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
      });
      return;
    }
  });
  app.delete("/api/country", async (req, res) => {
    const t = authenticateToken(req);
    if (!t || t.privilege < 100) {
      res.status(401);
      return;
    }
    res.setHeader("Content-Type", "application/json");
    const { id } = req.query;
    const i = id ? Number(id) : undefined;
    if (!i) {
      res.status(400);
      res.json({ message: "wrong id provided, id: " + id });
      return;
    }

    try {
      const data = await db
        .delete(country)
        .where(eq(country.id, i))
        .returning();

      if (data.length === 0) {
        res.status(400);
        res.json({
          message: "provided id doesn't exist in database, id: " + id,
        });
        return;
      }
      res.status(200);
      res.json({ data });
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
      });
      return;
    }
  });
  app.delete("/api/region", async (req, res) => {
    const t = authenticateToken(req);
    if (!t || t.privilege < 100) {
      res.status(401);
      return;
    }
    res.setHeader("Content-Type", "application/json");
    const { id } = req.query;
    const i = id ? Number(id) : undefined;
    if (!i) {
      res.status(400);
      res.json({ message: "wrong id provided, id: " + id });
      return;
    }

    try {
      const data = await db.delete(region).where(eq(region.id, i)).returning();

      if (data.length === 0) {
        res.status(400);
        res.json({
          message: "provided id doesn't exist in database, id: " + id,
        });
        return;
      }
      res.status(200);
      res.json({ data });
      return;
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
      });
      return;
    }
  });
  app.delete("/api/user", async (req, res) => {
    const t = authenticateToken(req);
    if (!t || t.privilege < 100) {
      res.status(401);
      return;
    }
    res.setHeader("Content-Type", "application/json");
    const { id } = req.query;
    const i = id ? Number(id) : undefined;
    if (!i) {
      res.status(400);
      res.json({ message: "wrong id provided, id: " + id });
      return;
    }

    try {
      const data = await db.delete(user).where(eq(user.id, i)).returning();

      if (data.length === 0) {
        res.status(400);
        res.json({
          message: "provided id doesn't exist in database, id: " + id,
        });
        return;
      }
      res.status(200);
      res.json({ data });
      return;
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
      });
      return;
    }
  });
  app.delete("/api/comments", async (req, res) => {
    const t = authenticateToken(req);
    if (!t || t.privilege < 10) {
      res.status(401);
      return;
    }
    res.setHeader("Content-Type", "application/json");
    const { id } = req.query;
    const i = id ? Number(id) : undefined;
    if (!i) {
      res.status(400);
      res.json({ message: "wrong id provided, id: " + id });
      return;
    }

    try {
      const data = await db
        .delete(comment)
        .where(eq(comment.id, i))
        .returning();

      if (data.length === 0) {
        res.status(400);
        res.json({
          message: "provided id doesn't exist in database, id: " + id,
        });
        return;
      }
      res.status(200);
      res.json({ data });
      return;
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
      });
      return;
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
        .where(
          and(
            eq(history.id, i),
            t.privilege < 10 ? eq(history.userId, t.userID) : undefined,
          ),
        )
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

  return app;
}
