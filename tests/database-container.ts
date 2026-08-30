import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

import { parseDatabaseUrl, type DatabaseUrl } from "../db/environment";

export type TestDatabaseContainer = {
  databaseUrl: DatabaseUrl;
  stop: () => Promise<void>;
};

export async function startTestDatabaseContainer({
  database,
}: {
  database: string;
}): Promise<TestDatabaseContainer> {
  const container = await new PostgreSqlContainer("postgres:18-alpine")
    .withDatabase(database)
    .withTmpFs({ "/var/lib/postgresql": "rw,size=512m" })
    .withCommand([
      "postgres",
      "-c",
      "fsync=off",
      "-c",
      "full_page_writes=off",
      "-c",
      "synchronous_commit=off",
    ])
    .start();

  return {
    databaseUrl: parseDatabaseUrl(container.getConnectionUri()),
    stop: async () => container.stop().then(() => undefined),
  };
}

export async function migrateTestDatabase(databaseUrl: DatabaseUrl): Promise<void> {
  const pool = new Pool({ connectionString: databaseUrl });

  try {
    const database = drizzle({ client: pool });
    await migrate(database, { migrationsFolder: "./drizzle" });
  } finally {
    await pool.end();
  }
}
