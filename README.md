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

## テスト

テストを追加・変更する前に、[テスト戦略](docs/testing/README.md)から対象に合う方針を確認してください。

## worktreeでの開発

IDEなどでworktreeを作成した後、依存関係と環境変数をセットアップします。詳しい手順と注意点は[worktreeを使った開発](docs/worktree-development.md)を参照してください。

```bash
vp install
vp run worktree:setup
vp run dev
```
