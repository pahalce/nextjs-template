# Accessibility test

静的解析、Story単位の自動検査、主要フローの手動確認を組み合わせる。

## 自動検査

Oxlintの`jsx-a11y`でJSXから判断できる誤りを検出する。Storybookでは`@storybook/addon-a11y`を全Storyに実行し、axe violationでCIを失敗させる。

違反ルールを無効化して通過させない。false positiveの場合は、対象Storyに理由を残した最小範囲の設定を行う。

## 手動確認

主要フローでは次を確認する。

- keyboardだけで操作を完了できる
- focus順とfocus表示が操作順に一致する
- 状態変化をscreen readerが読み上げる
- 200%拡大で情報や操作が欠けない

## 完了条件

静的解析と全Storyのaxeが成功し、操作方法を変更した主要フローでは手動確認項目を満たせば完了とする。
