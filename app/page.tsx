import { Suspense } from "react";
import { connection } from "next/server";

import { listTodos } from "../db/todos";

async function TodoList() {
  await connection();
  const todos = await listTodos();

  if (todos.length === 0) {
    return <p className="text-zinc-500">Todoはまだありません。</p>;
  }

  return (
    <ul className="grid gap-3">
      {todos.map((todo) => (
        <li
          className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm"
          key={todo.id}
        >
          <span aria-hidden="true">{todo.completed ? "✓" : "○"}</span>
          <span className={todo.completed ? "text-zinc-400 line-through" : ""}>{todo.title}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-20 font-sans text-zinc-950">
      <main className="mx-auto w-full max-w-xl">
        <p className="mb-2 text-sm font-medium text-blue-600">PostgreSQL + Drizzle</p>
        <h1 className="mb-8 text-4xl font-bold tracking-tight">Todos</h1>
        <Suspense fallback={<p className="text-zinc-500">DBから読み込み中...</p>}>
          <TodoList />
        </Suspense>
      </main>
    </div>
  );
}
