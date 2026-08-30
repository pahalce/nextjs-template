import { sql } from "drizzle-orm";
import { afterAll, beforeEach } from "vite-plus/test";

function readWorkerIndex(): number {
  const poolId = Number.parseInt(process.env.VITEST_POOL_ID ?? "", 10);

  if (!Number.isInteger(poolId) || poolId < 1) {
    throw new Error("VITEST_POOL_ID must be a positive integer");
  }

  return poolId - 1;
}

const workerIndex = readWorkerIndex();
const databaseUrl = process.env[`TEST_DATABASE_URL_${workerIndex + 1}`];

if (databaseUrl === undefined) {
  throw new Error(`No test database was prepared for worker ${workerIndex + 1}`);
}

process.env.DATABASE_URL = databaseUrl;

beforeEach(async () => {
  const { db } = await import("../db/client");
  await db.execute(sql`TRUNCATE TABLE ${sql.identifier("todos")} RESTART IDENTITY CASCADE`);
});

afterAll(async () => {
  const { pool } = await import("../db/client");
  await pool.end();
});
