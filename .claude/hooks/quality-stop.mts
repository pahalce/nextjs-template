import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const qualityCheckPath = fileURLToPath(
  new URL("../../.agents/hooks/quality-check.mts", import.meta.url),
);
const result = spawnSync(process.execPath, [qualityCheckPath], {
  encoding: "utf8",
});

if (result.status === 0) {
  process.stdout.write("{}\n");
  process.exit(0);
}

process.stderr.write(result.stdout);
process.stderr.write(result.stderr);
process.stdout.write(
  `${JSON.stringify({
    decision: "block",
    reason: "Project quality checks failed. Fix the errors and try again.",
  })}\n`,
);
