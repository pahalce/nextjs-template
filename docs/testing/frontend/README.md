# フロントエンドテスト

フロントエンドでは、ロジック、コンポーネント、ブラウザとサーバーの結合を分けてテストする。

## テストを選ぶ

| 検証したいこと              | 使用するテスト                  | 方針                                   |
| --------------------------- | ------------------------------- | -------------------------------------- |
| DOMを使わない計算や変換     | VitestのNode環境                | [Unit test](unit.md)                   |
| コンポーネントの表示と操作  | Storybook + Vitest Browser Mode | [Component test](component.md)         |
| UIのアクセシビリティ        | jsx-a11y + Storybook axe        | [Accessibility test](accessibility.md) |
| コンポーネントの見た目      | Vitest Browser Mode             | [VRT](vrt.md)                          |
| Next.jsを通るユーザーフロー | Playwright Test                 | [E2E](e2e.md)                          |

一つの変更に複数のテストを追加するのは、検証する責任が異なる場合だけにする。たとえばフォームの入力制御はcomponent test、Server Actionを通した保存はE2Eで検証する。

## コンポーネントの境界

Server Componentが取得したデータの表示状態を増やすときは、データ取得と表示を分離する。Storybookとcomponent testはpropsだけで描画できる表示コンポーネントを対象にする。RSC、Server Action、route処理との結合はE2Eで検証する。
