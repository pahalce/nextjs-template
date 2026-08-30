# データベーステスト

Drizzleスキーマ、マイグレーション、Testcontainersの設定、PostgreSQLへ接続するテストを変更する前に、このドキュメントを読むこと。

## 構成

アプリ用データとテスト用データは、別々のPostgreSQLコンテナに保存する。

- `compose.yaml`は`nextjs_template`という名前のアプリ用Databaseを起動する。
- Vitestのglobal setupは使い捨てのPostgreSQLコンテナを1つ起動し、`test_template`へ一度だけマイグレーションを適用する。
- 各Vitest workerは`test_template`を`test_worker_<VITEST_POOL_ID>`へ遅延複製する。
- worker数はVitestに決めさせる。固定の`maxWorkers`に依存する設定を追加しない。
- 各テストの実行前にアプリ用テーブルをTRUNCATEする。テストスイート終了時にコンテナを削除する。

データベーステストでは実際のDrizzleクライアントを使う。データベース制約、SQL、トランザクションをテスト対象に含める。

## スキーマの変更手順

1. `db/schema.ts`を編集する。
2. マイグレーションを生成する。

   ```bash
   vp run db:generate
   ```

3. 生成されたSQLとDrizzleのメタデータを確認する。
4. テストデータを保持するテーブルを追加した場合は、`tests/setup.ts`のリセットクエリへ追加する。
5. データベーステストとリポジトリの検査を実行する。

   ```bash
   vp test
   vp check
   ```

新しいTestcontainers Databaseへマイグレーションを適用でき、すべてのDBテストが成功し、`vp check`がエラーを報告しなければ変更は完了。

## 不変条件

- 本番マイグレーションにはアプリ用テーブルだけを定義する。テスト制御用の状態はデータベースの外に置く。
- テストの接続URLはTestcontainersから受け取る。アプリ用の`DATABASE_URL`をテストDatabaseの選択に使わない。
- workerが複製するとき、`test_template`への接続を残さない。
- worker Databaseの名前には、正の整数として検証した`VITEST_POOL_ID`だけを使う。
- テストファイルが増えてworker数が変わっても、設定変更なしでDatabaseを用意できる状態を保つ。
