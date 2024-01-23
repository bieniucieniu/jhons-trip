import type { Express } from "express";
import { AuthUser, authenticateToken, generateAccessToken } from "../auth";
import { db } from "../db";
import { user } from "@/shared/schema/user";

export default function AppendAuthHandlers(app: Express) {
  app.get("/api/auth", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const user = authenticateToken(req);

    res.json({ user });
  });

  app.post("/api/login", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const { username, password } = req.body;

    if (typeof username !== "string" || typeof password !== "string") {
      res.json({
        error: "no username or password",
      });
      return;
    }

    try {
      const token = await AuthUser(username, password);

      res.json({ token });
      return;
    } catch (e) {
      res.status(406);
      res.json({ error: e });
      return;
    }
  });
  app.post("/api/signin", async (req, res) => {
    res.setHeader("Content-Type", "application/json");

    const { username, password } = req.body;

    if (typeof username !== "string" || typeof password !== "string") {
      res.json({
        error: "no username or password",
      });

      return;
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

      if (!data) {
        res.json({
          error: "error inserting user to database",
        });
        return;
      }
      const d = data[0];
      const token = await generateAccessToken(d.username, d.id, d.privilege);

      res.json({
        token,
      });

      return;
    } catch (e) {
      res.status(406);
      res.json({
        error: e,
        message: "error inserting user, already",
      });

      return;
    }
  });

  return app;
}
