import { parseDatabaseUrl, type DatabaseUrl } from "../db/environment";

export type TestWorkerId = number & { readonly __brand: "TestWorkerId" };

export function readTestWorkerId(): TestWorkerId {
  const value = process.env.VITEST_POOL_ID;

  if (value === undefined || !/^[1-9]\d*$/u.test(value)) {
    throw new Error("VITEST_POOL_ID must be a positive integer");
  }

  const workerId = Number(value);
  if (!Number.isSafeInteger(workerId) || workerId < 1) {
    throw new Error("VITEST_POOL_ID must be a positive safe integer");
  }

  // SAFETY: The checks above prove the TestWorkerId invariant.
  return workerId as TestWorkerId;
}

export function readTestAdminDatabaseUrl(): DatabaseUrl {
  return parseDatabaseUrl(process.env.TEST_ADMIN_DATABASE_URL);
}
