# worktreeを使った開発

Git worktreeを使うと、ブランチごとに別のディレクトリで開発サーバーを起動できる。worktreeの作成はIDEまたはGitで行い、このリポジトリのスクリプトは作成後の環境変数だけをセットアップする。

## 事前準備

メインworktreeで依存関係をインストールし、`.env.local`とローカルHTTPS証明書を用意する。

```bash
vp install
cp .env.example .env.local
vp exec portless trust
docker compose up -d --wait
vp run db:migrate
```

`.env.local`をすでに作成している場合は、コピーせず既存のファイルを使う。

## worktreeのセットアップ

IDEなどでworktreeを作成したら、そのディレクトリで次のコマンドを実行する。

```bash
vp install
vp run worktree:setup
vp run dev
```

`worktree:setup`はメインworktreeの`.env.local`を現在のworktreeへコピーする。次の場合はコピーせずエラーで終了する。

- メインworktreeで実行した
- メインworktreeに`.env.local`がない
- 現在のworktreeに`.env.local`がすでにある

既存の`.env.local`を更新したい場合は、必要な値を手動で反映する。スクリプトは既存ファイルを上書きしない。

## 開発サーバーのURL

`vp run dev`はportlessを通してNext.jsを起動する。portlessはworktreeを検出し、ブランチごとにURLを分ける。

たとえば`fix-ui`ブランチのworktreeは、次のURLで開く。

```text
https://fix-ui.nextjs-template.localhost
```

メインworktreeは次のURLを使う。

```text
https://nextjs-template.localhost
```

## データベース

すべてのworktreeの`.env.local`は、メインworktreeと同じPostgreSQLデータベースを参照する。PostgreSQLコンテナの起動と停止はメインworktreeで行う。

複数のworktreeから同時にマイグレーションを実行しないこと。スキーマ変更を含むブランチへ切り替える場合は、ほかのworktreeで開発サーバーやDB操作が動いていないことを確認してから、対象のworktreeで次を実行する。

```bash
vp run db:migrate
```

## worktreeの削除

開発サーバーを停止してから、IDEまたはメインworktreeでworktreeを削除する。Gitで削除する場合は次のコマンドを使う。

```bash
git worktree remove <worktreeのパス>
git branch -d <ブランチ名>
```

未コミットの変更があるworktreeは削除できない。変更をコミットするか、必要なファイルを退避してから削除する。
