import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./shared/schema",
  out: "./drizzle",
  driver: "turso",
  dbCredentials: {
    url: process.env.DB_URL as string,
    authToken: process.env.DB_TOKEN as string,
  },
} satisfies Config;
