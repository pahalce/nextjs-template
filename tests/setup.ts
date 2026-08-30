import { sql } from "drizzle-orm";
import { Pool } from "pg";
import { afterAll, beforeEach } from "vite-plus/test";

import { readTestAdminDatabaseUrl, readTestWorkerId } from "./environment";

const workerId = readTestWorkerId();
const database = `test_worker_${workerId}`;
const adminDatabaseUrl = readTestAdminDatabaseUrl();
const adminPool = new Pool({ connectionString: adminDatabaseUrl });

try {
  const result = await adminPool.query<{ exists: boolean }>(
    "SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1) AS exists",
    [database],
  );

  if (result.rows[0]?.exists !== true) {
    await adminPool.query(`CREATE DATABASE ${database} TEMPLATE test_template`);
  }
} finally {
  await adminPool.end();
}

const testDatabaseUrl = new URL(adminDatabaseUrl);
testDatabaseUrl.pathname = `/${database}`;
process.env.DATABASE_URL = testDatabaseUrl.toString();

beforeEach(async () => {
  const { db } = await import("../db/client");
  await db.execute(sql`TRUNCATE TABLE ${sql.identifier("todos")} RESTART IDENTITY CASCADE`);
});

afterAll(async () => {
  const { pool } = await import("../db/client");
  await pool.end();
});
