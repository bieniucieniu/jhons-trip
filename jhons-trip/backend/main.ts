import { drizzle } from "drizzle-orm/libsql";

import Database from "better-sqlite3";

async function main() {
  const sqlite = new Database("sqlite.db");
  const db = drizzle(sqlite);
  db.select();
}

main();
