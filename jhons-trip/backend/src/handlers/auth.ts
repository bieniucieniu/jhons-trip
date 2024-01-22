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

  return app;
}
