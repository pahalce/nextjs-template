# Component test

UIコンポーネントの表示と操作は、StorybookのStoryを`@storybook/addon-vitest`からVitest Browser Modeで実行して検証する。

## Storyを作る

Storyを表示状態とテストデータの正本にする。通常状態に加え、仕様に存在するempty、loading、error、長い文字列、disabledなどをStoryとして表す。

Storyを作るためだけにServer Componentやデータ取得処理をmockしない。propsだけで描画できる表示コンポーネントを分離し、そのStoryを作る。

## Interaction testを書く

ユーザー操作があるStoryには`play`関数を追加する。

- role、label、表示テキストから要素を取得する
- `userEvent`でclick、入力、keyboard操作を行う
- 操作後にユーザーが観測できる結果をassertする

Reactのstate、hookの呼び出し回数、CSS class、DOM構造はassertしない。StoryにしにくいブラウザAPIの処理だけ、独立したVitest Browser Modeのテストにする。

## 完了条件

各Storyが実ブラウザで描画でき、操作を持つStoryの`play`が成功し、実装内部をassertしていなければ完了とする。
