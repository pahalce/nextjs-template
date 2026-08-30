import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

const templateDatabase = "test_template";

function databaseUrl({ baseUrl, database }: { baseUrl: URL; database: string }): string {
  const url = new URL(baseUrl);
  url.pathname = `/${database}`;
  return url.toString();
}

export default async function setup() {
  const container = await new PostgreSqlContainer("postgres:18-alpine")
    .withDatabase("test_admin")
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
  const adminUrl = new URL(container.getConnectionUri());

  try {
    const adminPool = new Pool({ connectionString: adminUrl.toString() });

    try {
      await adminPool.query(`CREATE DATABASE ${templateDatabase}`);

      const templateUrl = databaseUrl({ baseUrl: adminUrl, database: templateDatabase });
      const templatePool = new Pool({ connectionString: templateUrl });

      try {
        const templateDb = drizzle({ client: templatePool });
        await migrate(templateDb, { migrationsFolder: "./drizzle" });
      } finally {
        await templatePool.end();
      }
    } finally {
      await adminPool.end();
    }

    process.env.TEST_ADMIN_DATABASE_URL = adminUrl.toString();

    return async () => {
      await container.stop();
    };
  } catch (error) {
    await Promise.allSettled([container.stop()]);
    throw error;
  }
}
