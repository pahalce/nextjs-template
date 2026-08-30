# Next.js template

Next.js 16、PostgreSQL、Drizzle ORMを使う最小構成です。

## 開発

依存関係をインストールし、portlessのローカルHTTPS証明書を信頼します。

```bash
vp install
vp exec portless trust
```

PostgreSQLを起動し、マイグレーションを適用してから開発サーバーを起動します。

```bash
cp .env.example .env.local
docker compose up -d --wait
vp run db:migrate
vp run dev
```

`https://nextjs-template.localhost` に、マイグレーションで投入したTodoが表示されます。

## worktreeでの開発

worktreeを作成し、そのディレクトリで依存関係をインストールします。

```bash
git worktree add ../nextjs-template-fix-ui -b fix-ui
cd ../nextjs-template-fix-ui
vp install
vp run worktree:setup
vp run dev
```

`worktree:setup`は、メインworktreeの`.env.local`を現在のworktreeへコピーします。すでに`.env.local`がある場合は上書きしません。

portlessがworktreeを検出し、ブランチごとにURLを分けます。この例のURLは`https://fix-ui.nextjs-template.localhost`です。

現在はすべてのworktreeが同じPostgreSQLデータベースを使います。複数のworktreeから同時にマイグレーションを実行しないでください。
