import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

const workerCount = 2;
const templateDatabase = "test_template";

function databaseUrl({ baseUrl, database }: { baseUrl: string; database: string }): string {
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
  const adminUrl = container.getConnectionUri();
  const adminPool = new Pool({ connectionString: adminUrl });

  await adminPool.query(`CREATE DATABASE ${templateDatabase}`);

  const templateUrl = databaseUrl({ baseUrl: adminUrl, database: templateDatabase });
  const templatePool = new Pool({ connectionString: templateUrl });
  const templateDb = drizzle({ client: templatePool });
  await migrate(templateDb, { migrationsFolder: "./drizzle" });
  await templatePool.end();

  for (let workerId = 1; workerId <= workerCount; workerId += 1) {
    const database = `test_worker_${workerId}`;
    await adminPool.query(`CREATE DATABASE ${database} TEMPLATE ${templateDatabase}`);
    process.env[`TEST_DATABASE_URL_${workerId}`] = databaseUrl({ baseUrl: adminUrl, database });
  }

  await adminPool.end();

  return async () => {
    await container.stop();
  };
}
