# Visual regression test

コンポーネントの視覚差分は、Vitest Browser Modeの`toMatchScreenshot()`で検出する。

## 対象を選ぶ

影響の大きい表示コンポーネントを要素単位で撮影する。最初は3から5件に限定し、全Storyを自動撮影しない。

色、余白、配置、文字量、responsive表示など、画像で検証する意味がある状態を対象にする。操作結果は[Component test](component.md)で検証する。

## 実行環境

VRT専用のVitest projectを作り、Chromium、viewport、Playwrightのバージョン、CI imageを固定する。時刻、乱数、データ、font、animationを固定または完了待ちしてから撮影する。

## Baselineを扱う

baseline画像はGitで管理する。PRでは比較モードで実行し、失敗時のactual画像とdiff画像をGitHub Actions artifactへ保存する。

意図した変更では`--update`でbaselineを更新する。GitHubの画像差分を人が確認してからmergeする。

## 追加ツールの条件

reg-suit、Chromatic、外部VRT addon、画像用object storageは導入しない。画像数が増えてGitHub上のレビューが難しくなった場合に再検討する。

画面全体のVRTが必要になったら、Playwright Testの`toHaveScreenshot()`を使う。詳しくは[E2E](e2e.md)を参照する。

## 完了条件

固定したCI環境で差分を再現でき、意図したbaselineだけがGit差分に含まれ、actual画像とdiff画像を失敗したCIから取得できれば完了とする。

## 参考

- [Vitest Visual Regression Testing](https://vitest.dev/guide/browser/visual-regression-testing.html)
- [Vitestで始めるシンプルなVRT](https://zenn.dev/cybozu_frontend/articles/vitest-simple-vrt)
