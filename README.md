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

## DBテスト

Dockerを起動した状態で実行します。開発用PostgreSQLを事前に起動する必要はありません。

```bash
vp test
```

アプリ用DBとテスト用DBは共有しません。

- アプリ用: Composeで起動する`nextjs_template`
- テスト用: Testcontainersが別コンテナ内に作る`test_worker_1`と`test_worker_2`

テスト全体でテスト用PostgreSQLコンテナを1つだけ起動します。マイグレーション済みの`test_template`からVitest workerごとのDatabaseを複製し、各テストの前に`TRUNCATE ... RESTART IDENTITY CASCADE`を実行します。異なるworkerは同じテーブル名と一意値を使っても干渉しません。テスト終了時にはコンテナごと削除します。

スキーマを変更した場合は、新しいマイグレーションを生成します。

```bash
vp run db:generate
```
