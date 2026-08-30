import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const maxAttempts = 8;
const input: unknown = JSON.parse(readFileSync(0, "utf8"));

if (
  !(input instanceof Object) ||
  !("session_id" in input) ||
  Object.prototype.toString.call(input.session_id) !== "[object String]"
) {
  process.stderr.write("Codex Stop hook received an invalid session_id.\n");
  process.exit(1);
}

const sessionId = String(input.session_id);
const stateDirectory = join(tmpdir(), "nextjs-template-codex-quality-hooks");
const stateKey = createHash("sha256").update(sessionId).digest("hex");
const statePath = join(stateDirectory, stateKey);
const qualityCheckPath = fileURLToPath(
  new URL("../../.agents/hooks/quality-check.mts", import.meta.url),
);
const result = spawnSync(process.execPath, [qualityCheckPath], {
  encoding: "utf8",
});

if (result.status === 0) {
  rmSync(statePath, { force: true });
  process.stdout.write("{}\n");
  process.exit(0);
}

process.stderr.write(result.stdout);
process.stderr.write(result.stderr);

mkdirSync(stateDirectory, { recursive: true });
const previousAttempts = Number.parseInt(
  readFileSync(statePath, { encoding: "utf8", flag: "a+" }) || "0",
  10,
);
const attempts = Number.isNaN(previousAttempts) ? 1 : previousAttempts + 1;

if (attempts >= maxAttempts) {
  rmSync(statePath, { force: true });
  process.stdout.write(
    `${JSON.stringify({
      continue: false,
      systemMessage:
        "Project quality checks still fail after 8 Codex repair attempts. Run the checks manually and report the remaining errors.",
    })}\n`,
  );
  process.exit(0);
}

writeFileSync(statePath, String(attempts));
process.stdout.write(
  `${JSON.stringify({
    decision: "block",
    reason: `Project quality checks failed on attempt ${attempts} of ${maxAttempts}. Fix the errors and try again.`,
  })}\n`,
);
