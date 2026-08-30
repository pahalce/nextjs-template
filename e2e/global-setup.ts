import { spawn, type ChildProcess } from "node:child_process";

import type { FullConfig } from "@playwright/test";

import { migrateTestDatabase, startTestDatabaseContainer } from "../tests/database-container";

const baseUrl = "http://127.0.0.1:3100";

export default async function globalSetup(_config: FullConfig): Promise<() => Promise<void>> {
  const container = await startTestDatabaseContainer({ database: "e2e" });

  try {
    await migrateTestDatabase(container.databaseUrl);
    process.env.DATABASE_URL = container.databaseUrl;
    const environment = { ...process.env, DATABASE_URL: container.databaseUrl };
    await runCommand({ command: "vp", arguments: ["run", "build"], environment });
    const server = startServer({ environment });
    await waitForServer();

    return async () => {
      await stopServer(server);
      await container.stop();
    };
  } catch (error) {
    await Promise.allSettled([container.stop()]);
    throw error;
  }
}

function runCommand({
  command,
  arguments: args,
  environment,
}: {
  command: string;
  arguments: string[];
  environment: NodeJS.ProcessEnv;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { env: environment, stdio: "inherit" });

    process.once("error", reject);
    process.once("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} exited with code ${String(code)}`));
    });
  });
}

function startServer({ environment }: { environment: NodeJS.ProcessEnv }): ChildProcess {
  return spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3100"],
    {
      env: environment,
      stdio: "inherit",
    },
  );
}

async function stopServer(server: ChildProcess): Promise<void> {
  if (server.exitCode !== null) {
    return;
  }

  const stopped = new Promise<void>((resolve) => {
    server.once("exit", () => resolve());
  });

  server.kill("SIGTERM");
  await stopped;
}

async function waitForServer(): Promise<void> {
  const deadline = Date.now() + 120_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl);

      if (response.ok) {
        return;
      }
    } catch {
      // The server has not started listening yet.
    }

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 100);
    });
  }

  throw new Error(`Next.js did not start within 120 seconds at ${baseUrl}`);
}
