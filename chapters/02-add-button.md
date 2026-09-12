# 第5章: アプリにボタンを追加する

> 公式コース: [ユニット 2: アプリ UI を作成する](https://developer.android.com/courses/android-basics-compose/unit-2?hl=ja) ／ [パスウェイ 2: アプリにボタンを追加する](https://developer.android.com/courses/pathways/android-basics-compose-unit-2-pathway-2?hl=ja)
> 提出ブランチ: `feature/02-add-button`

## 1. この章のゴール

- `Button` の `onClick` でユーザー操作に反応するアプリを作れる
- `remember` と `mutableStateOf` で画面の状態を持てる
- Android Studio のデバッガで変数の中身を確認できる

## 2. 進め方

公式パスウェイの内容を **上から順番に** 進めます。動画は省略可、「やらなくてOK」の行は飛ばして構いません。目安時間の合計は約235分です。

| # | 種類 | 内容 | 目安 | 備考 |
|---|---|---|---|---|
| 1 | 動画 | Dice Roller アプリの概要 | 省略可 |  |
| 2 | Codelab | [インタラクティブな Dice Roller アプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-build-a-dice-roller-app?hl=ja) | 約90分 | **提出対象** |
| 3 | Codelab | [Android Studio でデバッガを使用する](https://developer.android.com/codelabs/basic-android-kotlin-compose-intro-debugger?hl=ja) | 約45分 |  |
| 4 | Codelab | [練習: クリック動作](https://developer.android.com/codelabs/basic-android-kotlin-compose-button-click-practice-problem?hl=ja) | 約90分 | **提出対象** |
| 5 | 動画 | 次のステップ | 省略可 |  |
| 6 | クイズ | [テスト: アプリにボタンを追加する](https://developer.android.com/courses/quizzes/android-basics-compose-unit-2-pathway-2/android-basics-compose-unit-2-pathway-2?hl=ja) | 約10分 |  |

Codelab の進め方は次の通りです。

1. Codelab を開き、各ステップの説明を読んでから **自分でコードを打つ**（コピペで済ませない）
2. ステップごとにアプリを実行し、期待どおり動くか確認する
3. 動かないときは、エラー文をそのまま AI に貼って「何が原因か」を聞き、直したら **なぜ直ったか** をメモする
4. パスウェイ末尾のクイズを受けて、間違えた項目を Codelab で読み直す

## 3. つまずきやすいポイント

- 「ボタンを押しても画面が変わらない」場合、変数が `remember { mutableStateOf(...) }` になっているかを最初に疑いましょう。
- デバッガの **ブレークポイント** は今後ずっと使う道具です。この章で「止めて、変数を見て、1 行ずつ進める」を一度体験してください。

## 4. 提出物

次の Codelab で完成させた Android Studio プロジェクトを、学習用リポジトリの `unit2/DiceRoller/` に置きます（プロジェクトフォルダごとコピー。`build/` と `.idea/` は含めない）。

- [インタラクティブな Dice Roller アプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-build-a-dice-roller-app?hl=ja)
- [練習: クリック動作](https://developer.android.com/codelabs/basic-android-kotlin-compose-button-click-practice-problem?hl=ja)

PR 本文には次の 3 点を書いてください。

- **やったこと**：どの Codelab / 演習を完了したか
- **動作確認**：どの端末（エミュレータ名 or 実機）で何を確認したか
- **詰まった点と解決**：エラーの内容と、どう直したか（AI に聞いた内容も可）

## 5. チェックリスト

- [ ] `Button` の `onClick` でユーザー操作に反応するアプリを作れる
- [ ] `remember` と `mutableStateOf` で画面の状態を持てる
- [ ] Android Studio のデバッガで変数の中身を確認できる
- [ ] パスウェイ末尾のクイズに合格した
- [ ] 提出物が `unit2/DiceRoller/` にあり、Android Studio（または Kotlin Playground）で開いて動く

---

## 課題提出

この章には提出課題があります。

1. 上記の提出物を完了する
2. GitHub で `feature/02-add-button` ブランチを作成し、`develop` へのPRを作成（base=`develop`）
3. [AIプログラムレビュー](https://ai.studio/apps/84d224cb-7de1-44fb-995b-9a5917d25603?fullscreenApplet=true) を実行
4. 問題がなければ、進捗ダッシュボードで **PR URL** と **完了日** を記録
