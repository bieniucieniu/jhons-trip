import type { Express } from "express";
import { and, count, eq, gt, like, lt } from "drizzle-orm";
import { country, journey, region } from "../../shared/schema/journey";
import { history } from "@/shared/schema/user";
import { db } from "../db";
import { authenticateToken } from "../auth";

export default function AppendGettingHandlers(app: Express) {
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

  const tablesMap = [
    { name: "country", table: country },
    { name: "journey", table: journey },
    { name: "region", table: region },
  ];
  app.get("/api/limit", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const { table } = req.query;

    const tableName = table ? String(table) : "";
    const t = tablesMap.find(({ name }) => name !== tableName);
    if (!t) {
      res.status(400);
      res.json({
        error: "incorect table name: '" + tableName + "'",
      });
      return;
    }
    try {
      const data = await db.select({ value: count() }).from(t.table);

      res.status(200);
      res.json(data[0]);
    } catch (e) {
      if (!table) {
        res.status(400);
        res.json({
          error: e,
        });
        return;
      }
    }
  });

  return app;
}
