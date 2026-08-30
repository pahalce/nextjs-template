# Onboarding

## E2Eテストのセットアップ

E2EテストはTestcontainersで専用のPostgreSQLコンテナを起動し、production buildしたアプリに対してPlaywrightを実行します。開発用のPostgreSQLとデータは使いません。

### 前提

- Docker Desktopをインストールし、起動しておく
- リポジトリの依存関係をインストールしておく

```bash
vp install
```

### Chromiumのインストール

初回だけ、Playwright用のChromiumをインストールします。

```bash
vp run test:e2e:install
```

### E2Eテストの実行

```bash
vp run test:e2e
```

テスト終了後、TestcontainersがPostgreSQLコンテナを停止します。
