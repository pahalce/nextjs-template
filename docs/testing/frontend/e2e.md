# End-to-end test

Playwright Testは、ブラウザとNext.jsサーバーを結ぶ主要フローに使う。

## 対象

- RSCが取得したデータの表示
- Server ActionやAPIを通る更新
- routing、redirect、認証
- page-levelのloading、error、not-found

コンポーネントで確認済みの表示パターンを繰り返さない。細かな入力制御は[Component test](component.md)、データベースの制約は[データベーステスト](../../database-testing.md)で検証する。

## 書き方

role、label、表示テキストを使って操作する。テスト用の安定したデータを用意し、各テストが他のテストの実行順に依存しないようにする。

失敗時はPlaywrightのtraceとscreenshotをGitHub Actions artifactへ保存する。画面全体の見た目を守る必要があるフローでは`toHaveScreenshot()`を使い、baselineをGitで管理する。

## 完了条件

ユーザーの開始操作からサーバー処理後の表示までを実環境で確認でき、単独実行とsuite実行の両方で成功し、失敗時のtraceを取得できれば完了とする。

## 参考

- [Playwright Visual comparisons](https://playwright.dev/docs/test-snapshots)
