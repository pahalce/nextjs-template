import { setTimeout } from "node:timers/promises";

import { expect, test } from "vite-plus/test";

import { createTodo, listTodos } from "../db/todos";

test("worker A has an isolated database", async () => {
  await createTodo({ title: "same title in every worker" });
  await setTimeout(250);

  const rows = await listTodos();
  expect(rows).toHaveLength(1);
});
