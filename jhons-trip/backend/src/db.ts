import { drizzle } from "drizzle-orm/libsql";
import * as journey from "../shared/schema/journey";
import * as user from "../shared/schema/user";

import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DB_URL as string,
  authToken: process.env.DB_TOKEN as string,
});

export const db = drizzle(client, {
  schema: {
    ...journey,
    ...user,
  },
});
