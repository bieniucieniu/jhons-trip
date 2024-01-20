import express from "express";
import { AuthUser, authenticateToken, generateAccessToken } from "./auth";
import { db } from "./db";
import { country, journey, region } from "../shared/schema/journey";
import { and, eq, like } from "drizzle-orm";
import path from "path";
import { history, user } from "@/shared/schema/user";
import cors from "cors";
import cookieParser from "cookie-parser";

import { createInsertSchema } from "drizzle-zod";
const app = express();

app.use(express.json(), cors(), cookieParser());

app.get("/api/auth", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const user = authenticateToken(req);

  res.json({ user });
});

app.get("/api/login", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { username, password } = req.query;

  if (typeof username !== "string" || typeof password !== "string")
    return res.json({
      error: "no username or password",
    });

  try {
    const token = AuthUser(username, password);

    return res.json({ token });
  } catch (e) {
    res.status(406);
    return res.json({ error: e });
  }
});

app.get("/api/countries", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const { limit, name } = req.query;

  const l = Number(limit) ?? 10;
  const n = String(name) ?? "";

  try {
    const data = await db
      .select()
      .from(country)
      .limit(l)
      .where(like(country.name, n));
    return res.json({ data });
  } catch (e) {
    res.status(406);
    return res.json({ error: e });
  }
});

app.get("/api/regions", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { limit, name, countryId } = req.query;

  const l = Number(limit) ?? 10;
  const n = String(name);
  const c = Number(countryId);

  try {
    const data = await db
      .select()
      .from(region)
      .limit(l)
      .where(
        and(
          n ? like(region.name, n) : undefined,
          c ? eq(region.countryId, c) : undefined,
        ),
      );
    return res.json({ data });
  } catch (e) {
    res.status(406);
    return res.json({ error: e });
  }
});

app.get("/api/journeys", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { limit, name, regionId } = req.query;
  const l = limit ? Number(limit) : 10;
  const n = name ? String(name) : undefined;
  const r = regionId ? Number(regionId) : undefined;

  try {
    const data = await db
      .select()
      .from(journey)
      .limit(l)
      .where(
        and(
          n ? like(journey.name, n) : undefined,
          r ? eq(journey.regionId, r) : undefined,
        ),
      );

    return res.json({ data });
  } catch (e) {
    res.status(406);
    return res.json({ error: e });
  }
});

app.get("/api/history", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const t = authenticateToken(req);
  if (!t) return res.status(401);
  const { limit, name, countryId } = req.query;
  const l = Number(limit) ?? 10;
  const n = String(name);
  const c = Number(countryId);
  try {
    const data = await db
      .select()
      .from(history)
      .limit(l)
      .where(
        and(
          eq(history.userId, t.userID),
          n ? like(history.journeyName, n) : undefined,
          c ? eq(history.journeyId, c) : undefined,
        ),
      );
    return res.json({ data });
  } catch (e) {
    res.status(406);
    return res.json({ error: e });
  }
});

app.post("/api/signin", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const { username, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string") {
    return res.json({
      error: "no username or password",
    });
  }
  try {
    const data = await db
      .insert(user)
      .values([
        {
          username,
          password,
        },
      ])
      .returning();

    if (!data)
      return res.json({
        error: "error inserting user to database",
      });
    const d = data[0];
    const token = await generateAccessToken(d.username, d.id, d.privilege);

    return res.json({
      token,
    });
  } catch (e) {
    res.status(406);
    return res.json({
      error: e,
      message: "error inserting user, already",
    });
  }
});

const insertCountriesSchema = createInsertSchema(country).array();

app.post("/api/countries", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const t = authenticateToken(req);

  if (!t || t.privilege < 10) return res.status(401);

  const { data } = req.body;

  try {
    const d = insertCountriesSchema.parse(data);

    const ok = await db.insert(country).values(d).onConflictDoNothing();
    if (!ok) throw Error("cant insert country: " + d);
    return res.status(200);
  } catch (e) {
    res.status(406);
    return res.json({
      error: e,
    });
  }
});

const insertRegionsSchema = createInsertSchema(region).array();

app.post("/api/regions", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const t = authenticateToken(req);
  if (!t || t.privilege < 10) return res.status(401);

  const { data } = req.body;

  try {
    const d = insertRegionsSchema.parse(data);

    const ok = await db.insert(region).values(d).onConflictDoNothing();
    if (!ok) throw Error("cant insert country: " + d);

    return res.status(200);
  } catch (e) {
    res.status(406);
    return res.json({
      error: e,
    });
  }
});

const insertJourneysSchema = createInsertSchema(journey).array();

app.post("/api/journeys", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const t = authenticateToken(req);
  if (!t || t.privilege < 10) return res.status(401);

  const { data } = req.body;

  try {
    const d = insertJourneysSchema.parse(data);

    const ok = db.insert(journey).values(d).onConflictDoNothing();
    if (!ok) throw Error("cant insert country: " + d);

    return res.status(200);
  } catch (e) {
    res.status(406);
    return res.json({
      error: e,
    });
  }
});

const insertHistorySchema = createInsertSchema(history).array();

app.post("/api/book", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { data, returning } = req.body;

  try {
    const d = insertHistorySchema.parse(data);
    const rejected: typeof d = [];

    const succeed = await asyncFilter(d, async (booking) => {
      const j = (
        await db.select().from(journey).where(eq(journey.id, booking.journeyId))
      )[0];
      if (booking.for > j.slots - j.booked) {
        rejected.push();
        return false;
      }
      await db.update(journey).set({ booked: j.booked + booking.for });
      return true;
    });

    await db.insert(history).values(data);

    if (rejected.length > 0 || returning)
      return res.json({
        succeed,
        rejected,
      });

    return res.status(200);
  } catch (e) {
    if (e instanceof Error) return res.json;
    return res.json({
      error: e,
    });
  }
});

app.use("", express.static(path.join(__dirname, "dist")));

app.get("/*", (_, res) => {
  return res.sendFile("dist/index.html", { root: __dirname });
});

app.listen("3000");
