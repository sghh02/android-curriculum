# 第19章: ビュー内の Android ビューと Compose

> 公式コース: [ユニット 8: Compose とビュー](https://developer.android.com/courses/android-basics-compose/unit-8?hl=ja) ／ [パスウェイ 1: ビュー内の Android ビューと Compose](https://developer.android.com/courses/pathways/android-basics-compose-unit-8-pathway-1?hl=ja)
> 提出ブランチ: `feature/08-views`

## 1. この章のゴール

- XML レイアウト・Fragment・RecyclerView など従来の View システムの基本を説明できる
- View ベースの既存アプリに `ComposeView` でコンポーザブルを追加できる

## 2. 進め方

公式パスウェイの内容を **上から順番に** 進めます。動画は省略可、「やらなくてOK」の行は飛ばして構いません。目安時間の合計は約280分です。

| # | 種類 | 内容 | 目安 | 備考 |
|---|---|---|---|---|
| 1 | 動画 | Android ビューシステム | 省略可 |  |
| 2 | Codelab | [ビューで Android アプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-app-with-views?hl=ja) | 約150分 |  |
| 3 | 動画 | ビュー内の Compose | 省略可 |  |
| 4 | Codelab | [Compose を以前のアプリに追加する](https://developer.android.com/codelabs/basic-android-kotlin-training-compose-add-compose-to-a-view-based-app?hl=ja) | 約120分 | **提出対象** |
| 5 | 動画 | 次のステップ | 省略可 |  |
| 6 | クイズ | [テスト: Android ビュー](https://developer.android.com/courses/quizzes/android-basics-compose-unit-8-pathway-1/android-basics-compose-unit-8-pathway-1?hl=ja) | 約10分 |  |

Codelab の進め方は次の通りです。

1. Codelab を開き、各ステップの説明を読んでから **自分でコードを打つ**（コピペで済ませない）
2. ステップごとにアプリを実行し、期待どおり動くか確認する
3. 動かないときは、エラー文をそのまま AI に貼って「何が原因か」を聞き、直したら **なぜ直ったか** をメモする
4. パスウェイ末尾のクイズを受けて、間違えた項目を Codelab で読み直す

## 3. つまずきやすいポイント

- 実務の既存アプリはまだ View（XML）で書かれているものが多いです。「読める」ことがこの章の目的で、XML を書けるようになる必要はありません。

## 4. 提出物

次の Codelab で完成させた Android Studio プロジェクトを、学習用リポジトリの `unit8/Juice/` に置きます（プロジェクトフォルダごとコピー。`build/` と `.idea/` は含めない）。

- [Compose を以前のアプリに追加する](https://developer.android.com/codelabs/basic-android-kotlin-training-compose-add-compose-to-a-view-based-app?hl=ja)

PR 本文には次の 3 点を書いてください。

- **やったこと**：どの Codelab / 演習を完了したか
- **動作確認**：どの端末（エミュレータ名 or 実機）で何を確認したか
- **詰まった点と解決**：エラーの内容と、どう直したか（AI に聞いた内容も可）

## 5. チェックリスト

- [ ] XML レイアウト・Fragment・RecyclerView など従来の View システムの基本を説明できる
- [ ] View ベースの既存アプリに `ComposeView` でコンポーザブルを追加できる
- [ ] パスウェイ末尾のクイズに合格した
- [ ] 提出物が `unit8/Juice/` にあり、Android Studio（または Kotlin Playground）で開いて動く

---

## 課題提出

この章には提出課題があります。

1. 上記の提出物を完了する
2. GitHub で `feature/08-views` ブランチを作成し、`develop` へのPRを作成（base=`develop`）
3. [AIプログラムレビュー](https://ai.studio/apps/84d224cb-7de1-44fb-995b-9a5917d25603?fullscreenApplet=true) を実行
4. 問題がなければ、進捗ダッシュボードで **PR URL** と **完了日** を記録
