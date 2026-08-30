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

## E2Eテスト

初回セットアップと実行方法は[ONBOARDING.md](ONBOARDING.md)を参照してください。

```bash
vp run test:e2e
```

開発中は必要なときだけ実行します。`pull_request`では通常のCIと分かれたE2Eワークフローがproduction buildに対して実行します。GitHub Actions固有のretryとreporterは`playwright.ci.config.ts`に分けています。

## worktreeでの開発

IDEなどでworktreeを作成した後、依存関係と環境変数をセットアップします。詳しい手順と注意点は[worktreeを使った開発](docs/worktree-development.md)を参照してください。

```bash
vp install
vp run worktree:setup
vp run dev
```
