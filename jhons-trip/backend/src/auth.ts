import jwt from "jsonwebtoken";
import type { Request } from "express";
import { db } from "./db";
import { user } from "../shared/schema/user";
import { eq } from "drizzle-orm";

const secret = process.env.SECRET;

if (!secret) throw new Error("no secret provided");

export async function AuthUser(username: string, password: string) {
  const u = (
    await db.select().from(user).where(eq(user.username, username)).limit(1)
  )[0];
  if (!u || u.password !== password) throw new Error("invalid user data");

  return generateAccessToken(u.username, u.id, u.privilege);
}

export async function generateAccessToken(
  username: string,
  userID: number,
  privilege: number,
) {
  return jwt.sign({ username, userID, privilege }, secret!, {
    expiresIn: "7d",
  });
}

export function authenticateToken(req: Request) {
  const authToken = req.cookies["token"];

  if (authToken === undefined) return null;

  return jwt.verify(authToken, secret!) as {
    username: string;
    userID: number;
    privilege: number;
  };
}
