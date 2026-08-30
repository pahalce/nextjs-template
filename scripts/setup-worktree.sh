#!/usr/bin/env bash

set -euo pipefail

readonly ENV_FILE=".env.local"

main_worktree=$(git worktree list --porcelain | sed -n '1s/^worktree //p')
current_worktree=$(git rev-parse --show-toplevel)
source_env="$main_worktree/$ENV_FILE"
target_env="$current_worktree/$ENV_FILE"

if [[ "$current_worktree" == "$main_worktree" ]]; then
	echo "Run this command from a linked worktree." >&2
	exit 1
fi

if [[ ! -f "$source_env" ]]; then
	echo "Missing $source_env" >&2
	echo "Create it in the main worktree first: cp .env.example .env.local" >&2
	exit 1
fi

if [[ -e "$target_env" ]]; then
	echo "$target_env already exists; leaving it unchanged." >&2
	exit 1
fi

cp "$source_env" "$target_env"
echo "Copied $source_env to $target_env"
