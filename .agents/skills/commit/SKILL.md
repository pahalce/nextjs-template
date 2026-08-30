---
name: commit
description: Commit the current work in meaningful units using Conventional Commits.
disable-model-invocation: true
---

Use the work performed in the current session as the commit scope. Inspect `git status`, the staged and unstaged diffs, and only the files needed to understand that work. Preserve unrelated, pre-existing, or ambiguous changes without reading or committing them.

Partition the scoped work by intent. Each commit must be coherent and leave the repository valid. Keep direct tests and documentation with their implementation.

For each unit:

1. Stage its exact files or hunks.
2. Review `git diff --cached` and run the narrowest relevant verification.
3. Commit using `<type>(<optional-scope>): <imperative description>`. Add a body only when the reason, migration, or breaking change needs explanation.

Repeat until all scoped changes are committed. Report commit hashes, subjects, verification performed, and anything left uncommitted.
