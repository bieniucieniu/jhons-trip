import dotenv from "dotenv";
import express from "express";
import { AuthUser } from "./auth";
import { db } from "./db";
import { country, journey, region } from "@/shared/schema/journey";
import { and, eq, like } from "drizzle-orm";

dotenv.config();

const app = express();

app.get("/api/login", async (req, res) => {
  const body = req.body as { username?: string; password?: string };

  if (body.password === undefined || body.username === undefined) {
    return res.json({
      error: "invalid data",
    });
  }

  try {
    const token = AuthUser(body.username, body.password);

    res.json({
      token,
    });
  } catch (e) {
    res.json({
      error: e,
    });
  }
});

app.get("/api/countries", async (req, res) => {
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
    return res.json({ error: e });
  }
});

app.get("/api/regions", async (req, res) => {
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
    return res.json({ error: e });
  }
});

app.get("/api/journeys", async (req, res) => {
  const { limit, name, regionId, countryId } = req.query;
  const l = Number(limit) ?? 10;
  const n = String(name);
  const c = Number(countryId);
  const r = Number(regionId);

  try {
    const data = await db
      .select()
      .from(region)
      .limit(l)
      .where(
        and(
          n ? like(journey.name, n) : undefined,
          c ? eq(journey.countryId, c) : undefined,
          r ? eq(journey.regionId, c) : undefined,
        ),
      );
    return res.json({ data });
  } catch (e) {
    return res.json({ error: e });
  }
});
