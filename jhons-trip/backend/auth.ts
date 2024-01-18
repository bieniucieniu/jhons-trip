import jwt from "jsonwebtoken";
import type { Request } from "express";
import { db } from "./db";
import { user } from "@/shared/schema/user";
import { eq } from "drizzle-orm";
const secret = process.env.TOKEN_SECRET;

if (!secret) throw new Error("no secret provided");

export async function AuthUser(username: string, password: string) {
  const u = await db
    .select()
    .from(user)
    .where(eq(user.username, username))
    .limit(1);
  if (!u[0] || u[0].password !== password) throw new Error("invalid user data");

  return generateAccessToken(u[0].username, u[0].id);
}

export async function generateAccessToken(username: string, userID: number) {
  return jwt.sign({ username, userID }, secret!, {
    expiresIn: "7d",
  });
}

export function authenticateToken(req: Request) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return null;

  return jwt.verify(token, secret!) as { username: string; userID: number };
}
