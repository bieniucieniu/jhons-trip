import type { Express } from "express";
import { db } from "../db";
import { country, journey, region } from "@/shared/schema/journey";
import { eq } from "drizzle-orm";
import { authenticateToken } from "../auth";
import { comment, user } from "@/shared/schema/user";
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
  app.delete("/api/comment", async (req, res) => {
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
  return app;
}
