import { asc } from "drizzle-orm";

import { db } from "./client";
import { todos, type NewTodo, type Todo } from "./schema";

export async function listTodos(): Promise<Todo[]> {
  return db.select().from(todos).orderBy(asc(todos.id));
}

export async function createTodo(todo: NewTodo): Promise<Todo> {
  const [created] = await db.insert(todos).values(todo).returning();

  if (created === undefined) {
    throw new Error("PostgreSQL did not return the inserted todo");
  }

  return created;
}
