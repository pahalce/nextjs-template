# Next.js template

Next.js 16、PostgreSQL、Drizzle ORMを使う最小構成です。

## 開発

PostgreSQLを起動し、マイグレーションを適用してから開発サーバーを起動します。

```bash
cp .env.example .env
docker compose up -d --wait
vp run db:migrate
vp run dev
```

`http://localhost:3000` に、マイグレーションで投入したTodoが表示されます。
