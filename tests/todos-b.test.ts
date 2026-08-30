import { expect, test } from "vite-plus/test";

import { createTodo, listTodos } from "../db/todos";

test("creates and lists todo B", async () => {
  await createTodo({ title: "todo from worker B" });

  expect(await listTodos()).toHaveLength(1);
});
