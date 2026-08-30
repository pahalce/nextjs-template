import { expect, test } from "vite-plus/test";

import { createTodo, listTodos } from "../db/todos";

test("creates and lists todo A", async () => {
  await createTodo({ title: "todo from worker A" });

  expect(await listTodos()).toHaveLength(1);
});
