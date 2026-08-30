import type { KnipConfig } from "knip";

const config = {
  // Knip replaces its default issue set when `include` is present, so keep the
  // defaults explicit when adding cycle detection.
  include: [
    "files",
    "dependencies",
    "devDependencies",
    "optionalPeerDependencies",
    "unlisted",
    "binaries",
    "unresolved",
    "exports",
    "types",
    "enumMembers",
    "namespaceMembers",
    "duplicates",
    "catalog",
    "catalogReferences",
    "cycles",
  ],
  // Keep development-only lint implementations out of production dead-file
  // analysis. Active plugins remain reachable through vite.config.ts in the
  // regular run.
  project: ["**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx,css}!", "!tools/oxlint/**!"],
  // Vite+ requires this catalog alias even though application code does not
  // import the aliased Vite package directly.
  ignoreDependencies: ["vite"],
  rules: {
    cycles: "warn",
  },
} satisfies KnipConfig;

export default config;
