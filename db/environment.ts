export type DatabaseUrl = string & { readonly __brand: "DatabaseUrl" };

/** @internal Used by test infrastructure to parse container connection URLs. */
export function parseDatabaseUrl(value: string | undefined): DatabaseUrl {
  if (value === undefined || value.length === 0) {
    throw new Error("DATABASE_URL is required");
  }

  const url = new URL(value);
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    throw new Error("DATABASE_URL must use the postgres or postgresql protocol");
  }

  // SAFETY: URL parsing and the protocol check above validate the DatabaseUrl invariant.
  return value as DatabaseUrl;
}

export function readDatabaseUrl(): DatabaseUrl {
  return parseDatabaseUrl(process.env.DATABASE_URL);
}
