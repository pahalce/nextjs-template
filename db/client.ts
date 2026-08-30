import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { readDatabaseUrl } from "./environment";
import * as schema from "./schema";

/** @internal Used by test teardown to close the database connection. */
export const pool = new Pool({ connectionString: readDatabaseUrl() });

export const db = drizzle({ client: pool, schema });
