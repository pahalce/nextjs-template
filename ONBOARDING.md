# Onboarding

## 前提

- [Vite+](https://viteplus.dev/guide/)をインストールしておく
- Docker Desktopをインストールし、起動しておく

## 初回セットアップ

依存関係をインストールします。

```bash
vp install
```

`.env.example`をコピーして、開発用の環境変数を作成します。

```bash
cp .env.example .env.local
```

`.env.local`をすでに作成している場合は、上書きせず既存のファイルを使ってください。

portlessが使うローカルHTTPS証明書を信頼します。

```bash
vp exec portless trust
```

Playwright用のChromiumをインストールします。

```bash
vp exec playwright install chromium
```

PostgreSQLを起動し、マイグレーションを適用します。

```bash
docker compose up -d --wait
vp run db:migrate
```

## 動作確認

開発サーバーを起動します。

```bash
vp run dev
```

`https://nextjs-template.localhost`を開き、Todoが表示されることを確認してください。

別のターミナルでチェックとテストを実行します。

```bash
vp check
vp test
vp run test:e2e
```

E2EテストはTestcontainersで専用のPostgreSQLコンテナを起動し、production buildしたアプリに対してPlaywrightを実行します。開発用のPostgreSQLとデータは使いません。テスト終了後、Testcontainersがコンテナを停止します。

## 2回目以降の開発

Docker DesktopとPostgreSQLを起動してから、開発サーバーを起動します。

```bash
docker compose up -d --wait
vp run dev
```

Git worktreeを使う場合は、[worktreeを使った開発](docs/worktree-development.md)を参照してください。
