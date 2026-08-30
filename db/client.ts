import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

function readDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl === undefined || databaseUrl.length === 0) {
    throw new Error("DATABASE_URL is required");
  }

  return databaseUrl;
}

export const pool = new Pool({ connectionString: readDatabaseUrl() });

export const db = drizzle({ client: pool, schema });
