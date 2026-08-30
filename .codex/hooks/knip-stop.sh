#!/bin/sh

hook_input=$(cat)

# A failing Stop hook asks Codex for one repair pass. Do not create an
# infinite continuation loop if the repair pass cannot make Knip succeed.
case "$hook_input" in
  *'"stop_hook_active":true'* | *'"stop_hook_active": true'*)
    if ! vp run knip >/dev/null 2>&1; then
      printf '%s\n' '{"continue":false,"systemMessage":"Knip is still failing after the repair pass. Run `vp run knip` and report the remaining issues."}'
      exit 0
    fi
    ;;
  *)
    if ! vp run knip >/dev/null 2>&1; then
      printf '%s\n' '{"decision":"block","reason":"Knip failed. Run `vp run knip`, fix the reported unused code or configuration, and verify it again."}'
      exit 0
    fi
    ;;
esac

printf '%s\n' '{}'
