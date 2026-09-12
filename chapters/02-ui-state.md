# 第6章: UI と状態を操作する

> 公式コース: [ユニット 2: アプリ UI を作成する](https://developer.android.com/courses/android-basics-compose/unit-2?hl=ja) ／ [パスウェイ 3: UI と状態を操作する](https://developer.android.com/courses/pathways/android-basics-compose-unit-2-pathway-3?hl=ja)
> 提出ブランチ: `feature/02-ui-state`

## 1. この章のゴール

- 状態ホイスティング（状態を親に持ち上げる）を説明できる
- `TextField` の入力を受け取って計算結果を表示できる
- 簡単な自動テスト（ユニットテスト / UI テスト）を書いて実行できる

## 2. 進め方

公式パスウェイの内容を **上から順番に** 進めます。動画は省略可、「やらなくてOK」の行は飛ばして構いません。目安時間の合計は約435分です。

| # | 種類 | 内容 | 目安 | 備考 |
|---|---|---|---|---|
| 1 | 動画 | Compose の状態を理解する | 省略可 |  |
| 2 | 動画 | チップ計算アプリの概要 | 省略可 |  |
| 3 | Codelab | [Compose の状態の概要](https://developer.android.com/codelabs/basic-android-kotlin-compose-using-state?hl=ja) | 約90分 |  |
| 4 | Codelab | [カスタムのチップを計算する](https://developer.android.com/codelabs/basic-android-kotlin-compose-calculate-tip?hl=ja) | 約90分 |  |
| 5 | Codelab | [自動テストを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-write-automated-tests?hl=ja) | 約60分 |  |
| 6 | Codelab | [プロジェクト: アートスペース アプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-art-space?hl=ja) | 約180分 | **提出対象** |
| 7 | 動画 | 次のステップ | 省略可 |  |
| 8 | クイズ | [テスト: UI と状態を操作する](https://developer.android.com/courses/quizzes/android-basics-compose-unit-2-pathway-3/android-basics-compose-unit-2-pathway-3?hl=ja) | 約15分 |  |

Codelab の進め方は次の通りです。

1. Codelab を開き、各ステップの説明を読んでから **自分でコードを打つ**（コピペで済ませない）
2. ステップごとにアプリを実行し、期待どおり動くか確認する
3. 動かないときは、エラー文をそのまま AI に貼って「何が原因か」を聞き、直したら **なぜ直ったか** をメモする
4. パスウェイ末尾のクイズを受けて、間違えた項目を Codelab で読み直す

## 3. つまずきやすいポイント

- 「状態はどこに置くか」がこの章のテーマです。複数のコンポーザブルで同じ値を使うなら、共通の親に持ち上げます。
- アートスペース アプリは Unit 1〜2 の総まとめです。画像・ボタン・状態の 3 点が入っていれば OK。凝りすぎて止まるより、まず動くものを提出しましょう。

## 4. 提出物

次の Codelab で完成させた Android Studio プロジェクトを、学習用リポジトリの `unit2/ArtSpace/` に置きます（プロジェクトフォルダごとコピー。`build/` と `.idea/` は含めない）。

- [プロジェクト: アートスペース アプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-art-space?hl=ja)

PR 本文には次の 3 点を書いてください。

- **やったこと**：どの Codelab / 演習を完了したか
- **動作確認**：どの端末（エミュレータ名 or 実機）で何を確認したか
- **詰まった点と解決**：エラーの内容と、どう直したか（AI に聞いた内容も可）

## 5. チェックリスト

- [ ] 状態ホイスティング（状態を親に持ち上げる）を説明できる
- [ ] `TextField` の入力を受け取って計算結果を表示できる
- [ ] 簡単な自動テスト（ユニットテスト / UI テスト）を書いて実行できる
- [ ] パスウェイ末尾のクイズに合格した
- [ ] 提出物が `unit2/ArtSpace/` にあり、Android Studio（または Kotlin Playground）で開いて動く

---

## 課題提出

この章には提出課題があります。

1. 上記の提出物を完了する
2. GitHub で `feature/02-ui-state` ブランチを作成し、`develop` へのPRを作成（base=`develop`）
3. [AIプログラムレビュー](https://ai.studio/apps/84d224cb-7de1-44fb-995b-9a5917d25603?fullscreenApplet=true) を実行
4. 問題がなければ、進捗ダッシュボードで **PR URL** と **完了日** を記録
