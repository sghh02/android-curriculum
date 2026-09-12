# 第20章: Compose 内のビュー

> 公式コース: [ユニット 8: Compose とビュー](https://developer.android.com/courses/android-basics-compose/unit-8?hl=ja) ／ [パスウェイ 2: Compose 内のビュー](https://developer.android.com/courses/pathways/android-basics-compose-unit-8-pathway-2?hl=ja)
> 提出ブランチ: `feature/08-views-in-compose`

## 1. この章のゴール

- `AndroidView` で Compose 内に既存の View（Spinner、AdView など）を埋め込める
- Compose と View を混在させる場面と注意点を説明できる

## 2. 進め方

公式パスウェイの内容を **上から順番に** 進めます。動画は省略可、「やらなくてOK」の行は飛ばして構いません。目安時間の合計は約130分です。

| # | 種類 | 内容 | 目安 | 備考 |
|---|---|---|---|---|
| 1 | 動画 | Compose 内のビュー | 省略可 |  |
| 2 | Codelab | [Compose のビュー相互運用機能](https://developer.android.com/codelabs/basic-android-kotlin-compose-view-interop?hl=ja) | 約120分 | **提出対象** |
| 3 | 動画 | 次のステップ | 省略可 |  |
| 4 | クイズ | [テスト: Compose 内のビュー](https://developer.android.com/courses/quizzes/android-basics-compose-unit-8-pathway-2/android-basics-compose-unit-8-pathway-2?hl=ja) | 約10分 |  |

Codelab の進め方は次の通りです。

1. Codelab を開き、各ステップの説明を読んでから **自分でコードを打つ**（コピペで済ませない）
2. ステップごとにアプリを実行し、期待どおり動くか確認する
3. 動かないときは、エラー文をそのまま AI に貼って「何が原因か」を聞き、直したら **なぜ直ったか** をメモする
4. パスウェイ末尾のクイズを受けて、間違えた項目を Codelab で読み直す

## 3. つまずきやすいポイント

- この章が公式コースの最終章です。ここまでの提出物を振り返り、「自分で一からアプリを作るなら何を作るか」を先生に相談してみましょう。

## 4. 提出物

次の Codelab で完成させた Android Studio プロジェクトを、学習用リポジトリの `unit8/JuiceTracker/` に置きます（プロジェクトフォルダごとコピー。`build/` と `.idea/` は含めない）。

- [Compose のビュー相互運用機能](https://developer.android.com/codelabs/basic-android-kotlin-compose-view-interop?hl=ja)

PR 本文には次の 3 点を書いてください。

- **やったこと**：どの Codelab / 演習を完了したか
- **動作確認**：どの端末（エミュレータ名 or 実機）で何を確認したか
- **詰まった点と解決**：エラーの内容と、どう直したか（AI に聞いた内容も可）

## 5. チェックリスト

- [ ] `AndroidView` で Compose 内に既存の View（Spinner、AdView など）を埋め込める
- [ ] Compose と View を混在させる場面と注意点を説明できる
- [ ] パスウェイ末尾のクイズに合格した
- [ ] 提出物が `unit8/JuiceTracker/` にあり、Android Studio（または Kotlin Playground）で開いて動く

---

## 課題提出

この章には提出課題があります。

1. 上記の提出物を完了する
2. GitHub で `feature/08-views-in-compose` ブランチを作成し、`develop` へのPRを作成（base=`develop`）
3. [AIプログラムレビュー](https://ai.studio/apps/84d224cb-7de1-44fb-995b-9a5917d25603?fullscreenApplet=true) を実行
4. 問題がなければ、進捗ダッシュボードで **PR URL** と **完了日** を記録
