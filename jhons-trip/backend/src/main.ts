import express from "express";
import { AuthUser, authenticateToken, generateAccessToken } from "./auth";
import { db } from "./db";
import { country, journey, region } from "../shared/schema/journey";
import { and, eq, gt, like, lt } from "drizzle-orm";
import path from "path";
import { history, user } from "@/shared/schema/user";
import cors from "cors";
import cookieParser from "cookie-parser";
import { asyncFilter } from "./utils";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const app = express();

app.use(express.json(), cors(), cookieParser());

app.get("/api/auth", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const user = authenticateToken(req);

  res.json({ user });
});

app.post("/api/login", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { username, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string")
    return res.json({
      error: "no username or password",
    });

  try {
    const token = await AuthUser(username, password);

    return res.json({ token });
  } catch (e) {
    res.status(406);
    return res.json({ error: e });
  }
});

app.get("/api/countries", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const { limit, name, id } = req.query;

  try {
    if (id) {
      const data = await db
        .select()
        .from(country)
        .where(eq(country.id, Number(id)));
      return res.json({ data });
    }

    const l = Number(limit) ?? 10;
    const n = String(name) ?? "";

    const data = await db
      .select()
      .from(country)
      .limit(l)
      .where(like(country.name, "%" + n + "%"));
    return res.json({ data });
  } catch (e) {
    res.status(406);
    return res.json({ error: e });
  }
});

app.get("/api/regions", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { limit, name, countryId, id } = req.query;

  const l = Number(limit) ?? 10;
  const n = String(name);
  const c = Number(countryId);

  try {
    if (id) {
      const data = await db
        .select()
        .from(region)
        .where(eq(region.id, Number(id)));
      return res.json({ data });
    }
    const data = await db
      .select()
      .from(region)
      .limit(l)
      .where(
        and(
          n ? like(region.name, "%" + n + "%") : undefined,
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
  const { limit, name, regionId, id, offset, start, end } = req.query;

  try {
    if (id) {
      const data = await db.query.journey.findMany({
        where: eq(journey.id, Number(id)),
        with: {
          region: true,
        },
      });
      return res.json({ data });
    }

    const l = limit ? Number(limit) : 10;
    const n = name ? String(name).toUpperCase() : undefined;
    const r = regionId ? Number(regionId) : undefined;
    const o = offset ? Number(offset) : undefined;
    const s = start ? Number(start) : undefined;
    const e = end ? Number(end) : undefined;

    const data = await db.query.journey.findMany({
      limit: l,
      offset: o,
      where: and(
        n ? like(journey.name, "%" + n + "%") : undefined,
        r ? eq(journey.regionId, r) : undefined,
        s ? gt(journey.start, s) : undefined,
        e ? lt(journey.end, e) : undefined,
      ),
      with: {
        region: true,
      },
    });

    res.status(200);
    return res.json({ data });
  } catch (e) {
    res.status(406);
    return res.json({ error: e });
  }
});

app.get("/api/history", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const t = authenticateToken(req);
  if (!t) {
    res.status(401);
    return;
  }
  const { limit, name, countryId } = req.query;
  const l = limit ? Number(limit) : 20;
  const n = name ? String(name).toUpperCase() : undefined;
  const c = countryId ? Number(countryId) : undefined;
  try {
    const data = await db.query.history.findMany({
      limit: l,
      where: and(
        eq(history.userId, t.userID),
        n ? like(history.journeyName, "%" + n + "%") : undefined,
        c ? eq(history.journeyId, c) : undefined,
      ),
      with: {
        journey: true,
      },
    });
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

const insertCountriesSchema = createInsertSchema(country, {
  name: z.string().toUpperCase(),
}).array();

app.post("/api/countries", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const t = authenticateToken(req);

  if (!t || t.privilege < 10) return res.status(401);

  const { data } = req.body;

  try {
    const d = insertCountriesSchema.parse(data);

    const ok = await db.insert(country).values(d).onConflictDoNothing();
    if (!ok) throw Error("cant insert country: " + d);
    res.status(200);
    return res.json({
      success: true,
    });
  } catch (e) {
    res.status(406);
    return res.json({
      error: e,
    });
  }
});

const insertRegionsSchema = createInsertSchema(region, {
  name: z.string().toUpperCase(),
}).array();

app.post("/api/regions", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const t = authenticateToken(req);
  if (!t || t.privilege < 10) return res.status(401);

  const { data } = req.body;

  try {
    const d = insertRegionsSchema.parse(data);

    const ok = await db.insert(region).values(d).onConflictDoNothing();
    if (!ok) throw Error("cant insert country: " + d);

    res.status(200);
    return res.json({
      success: true,
    });
  } catch (e) {
    res.status(406);
    return res.json({
      error: e,
    });
  }
});

const insertJourneysSchema = createInsertSchema(journey, {
  name: z.string().toUpperCase(),
}).array();

app.post("/api/journeys", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const t = authenticateToken(req);
  if (!t || t.privilege < 10) return res.status(401);

  const { data } = req.body;

  try {
    const d = insertJourneysSchema.parse(data);

    const ok = db.insert(journey).values(d).onConflictDoNothing();
    if (!ok) throw Error("cant insert country: " + d);

    res.status(200);
    return res.json({
      success: true,
    });
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
  const t = authenticateToken(req);
  const { data, returning } = req.body;

  try {
    const d = insertHistorySchema.parse(data);
    const rejected: typeof d = [];

    const succeed = await asyncFilter(d, async (booking) => {
      if (booking.userId !== t?.userID) throw new Error("incorect user id");
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

app.use("", express.static(path.join(__dirname, "dist")));

app.get("/*", (_, res) => {
  return res.sendFile("dist/index.html", { root: __dirname });
});

app.listen("3000");
