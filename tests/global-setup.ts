import { Pool } from "pg";

import { parseDatabaseUrl } from "../db/environment";
import { migrateTestDatabase, startTestDatabaseContainer } from "./database-container";

const templateDatabase = "test_template";

function databaseUrl({ baseUrl, database }: { baseUrl: URL; database: string }): URL {
  const url = new URL(baseUrl);
  url.pathname = `/${database}`;
  return url;
}

export default async function setup() {
  const container = await startTestDatabaseContainer({ database: "test_admin" });
  const adminUrl = new URL(container.databaseUrl);

  try {
    const adminPool = new Pool({ connectionString: adminUrl.toString() });

    try {
      await adminPool.query(`CREATE DATABASE ${templateDatabase}`);
    } finally {
      await adminPool.end();
    }

    const templateUrl = databaseUrl({ baseUrl: adminUrl, database: templateDatabase });
    await migrateTestDatabase(parseDatabaseUrl(templateUrl.toString()));
    process.env.TEST_ADMIN_DATABASE_URL = adminUrl.toString();

    return container.stop;
  } catch (error) {
    await Promise.allSettled([container.stop()]);
    throw error;
  }
}
