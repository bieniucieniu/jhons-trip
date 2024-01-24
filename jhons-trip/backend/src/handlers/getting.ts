import type { Express } from "express";
import { and, count, eq, gt, like, lt } from "drizzle-orm";
import { country, journey, region } from "../../shared/schema/journey";
import { comment, history } from "@/shared/schema/user";
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
        res.json({ data });
        return;
      }

      const l = limit ? Number(limit) : 10;
      const n = name ? String(name) : "";

      const data = await db.query.country.findMany({
        limit: l,
        where: like(country.name, "%" + n + "%"),
      });
      res.json({ data });
      return;
    } catch (e) {
      res.status(406);
      res.json({ error: e });
      return;
    }
  });

  app.get("/api/regions", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const { limit, name, countryId, id } = req.query;

    const l = limit ? Number(limit) : 10;
    const n = name ? String(name) : undefined;
    const c = countryId ? Number(countryId) : undefined;

    try {
      if (id) {
        const data = await db.query.region.findMany({
          where: and(eq(region.id, Number(id))),
        });
        res.json({ data });
        return;
      }
      const data = await db.query.region.findMany({
        limit: l,
        where: and(
          n ? like(region.name, "%" + n + "%") : undefined,
          c ? eq(region.countryId, c) : undefined,
        ),
      });
      res.json({ data });
      return;
    } catch (e) {
      res.status(406);
      res.json({ error: e });
      return;
    }
  });

  app.get("/api/journeys", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const {
      limit,
      name,
      regionId,
      id,
      offset,
      start,
      end,
      minPrice,
      maxPrice,
      withComments,
    } = req.query;

    try {
      if (id) {
        const data = await db.query.journey.findMany({
          where: eq(journey.id, Number(id)),
          with: {
            region: {
              with: {
                country: true,
              },
            },
            comment: Boolean(withComments)
              ? {
                  with: {
                    user: {
                      columns: {
                        username: true,
                        id: true,
                      },
                    },
                  },
                }
              : undefined,
          },
        });
        res.json({ data });
        return;
      }

      const l = limit ? Number(limit) : 10;
      const n = name ? String(name).toUpperCase() : undefined;
      const r = regionId ? Number(regionId) : undefined;
      const o = offset ? Number(offset) : undefined;
      const s = start ? Number(start) : undefined;
      const e = end ? Number(end) : undefined;
      const max = maxPrice ? Number(maxPrice) : undefined;
      const min = minPrice ? Number(minPrice) : undefined;

      const data = await db.query.journey.findMany({
        limit: l,
        offset: o,
        where: and(
          n ? like(journey.name, "%" + n + "%") : undefined,
          r ? eq(journey.regionId, r) : undefined,
          s ? gt(journey.start, s) : undefined,
          e ? lt(journey.end, e) : undefined,
          max ? lt(journey.price, max) : undefined,
          min ? gt(journey.price, min) : undefined,
        ),
        with: {
          region: {
            with: {
              country: true,
            },
          },
          comment: Boolean(withComments)
            ? {
                with: {
                  user: {
                    columns: {
                      username: true,
                      id: true,
                    },
                  },
                },
              }
            : undefined,
        },
      });

      res.status(200);
      res.json({ data });
      return;
    } catch (e) {
      res.status(406);
      res.json({ error: e });
      return;
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
      res.json({ data });
      return;
    } catch (e) {
      res.status(406);
      res.json({ error: e });
      return;
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
    const t = tablesMap.find(({ name }) => name === tableName);
    if (!t) {
      res.status(400);
      res.json({
        error: "incorect table name: '" + tableName + "'",
      });
      return;
    }
    try {
      const data = await db.select({ value: count(t.table.id) }).from(t.table);

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

  app.get("/api/comments", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const { limit, journeyId, id, offset } = req.query;
    const l = limit ? Number(limit) : 20;
    const o = offset ? Number(offset) : undefined;
    const j = journeyId ? Number(journeyId) : undefined;

    if (id) {
    }
    db.query.comment.findMany({
      limit: l,
      offset: o,
      where: and(j ? eq(comment.journeyId, j) : undefined),
    });
  });

  return app;
}
