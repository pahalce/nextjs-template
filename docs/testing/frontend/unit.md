# Frontend unit test

DOMを使わないロジックはVitestのNode環境でテストする。

## 対象

- データ変換
- validation
- 条件分岐と境界値
- reducerや状態遷移

Reactコンポーネント、ブラウザAPI、CSSによる表示は対象にしない。[Component test](component.md)または[VRT](vrt.md)を使う。

## 書き方

入力と出力で振る舞いを検証する。内部関数を公開したり、module mockで実装順序を固定したりしない。外部データは境界でparseし、内部では型の付いた値を使う。

## 完了条件

成功、失敗、境界値のうち仕様に存在するケースを網羅し、Node環境だけで決定的に成功すれば完了とする。
