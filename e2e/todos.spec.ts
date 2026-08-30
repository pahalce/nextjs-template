import { expect, test } from "@playwright/test";

import { createTodo } from "../db/todos";

test("renders a todo stored in PostgreSQL", async ({ page }, testInfo) => {
  const todo = await createTodo({
    title: `E2EでPostgreSQLに追加したTodo-${testInfo.retry}`,
  });

  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Todos" })).toBeVisible();
  await expect(page.getByText(todo.title)).toBeVisible();
});
