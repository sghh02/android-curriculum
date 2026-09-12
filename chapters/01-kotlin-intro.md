# 第1章: Kotlin の概要

> 公式コース: [ユニット 1: 初めての Android アプリ](https://developer.android.com/courses/android-basics-compose/unit-1?hl=ja) ／ [パスウェイ 1: Kotlin の概要](https://developer.android.com/courses/pathways/android-basics-compose-unit-1-pathway-1?hl=ja)
> 提出ブランチ: `feature/01-kotlin-intro`

## 1. この章のゴール

- Kotlin Playground でプログラムを書いて実行できる
- 変数（`val` / `var`）と関数を使ったプログラムを書ける
- 練習問題の解答を Kotlin ファイルとして残せる

## 2. 進め方

公式パスウェイの内容を **上から順番に** 進めます。動画は省略可、「やらなくてOK」の行は飛ばして構いません。目安時間の合計は約235分です。

| # | 種類 | 内容 | 目安 | 備考 |
|---|---|---|---|---|
| 1 | Codelab | [始める前に](https://developer.android.com/codelabs/basic-android-kotlin-compose-before-you-begin?hl=ja) | 約10分 |  |
| 2 | 動画 | 「Compose での Android の基礎」へようこそ | 省略可 |  |
| 3 | Codelab | [初めての Kotlin プログラム](https://developer.android.com/codelabs/basic-android-kotlin-compose-first-program?hl=ja) | 約30分 |  |
| 4 | Codelab | [Kotlin で変数を作成して使用する](https://developer.android.com/codelabs/basic-android-kotlin-compose-variables?hl=ja) | 約60分 |  |
| 5 | Codelab | [Kotlin で関数を作成して使用する](https://developer.android.com/codelabs/basic-android-kotlin-compose-functions?hl=ja) | 約60分 |  |
| 6 | Codelab | [練習問題: Kotlin の基本](https://developer.android.com/codelabs/basic-android-kotlin-compose-intro-kotlin-practice-problems?hl=ja) | 約60分 | **提出対象** |
| 7 | 動画 | 次のステップ | 省略可 |  |
| 8 | クイズ | [テスト: Kotlin によるプログラミングの概要](https://developer.android.com/courses/quizzes/android-basics-compose-unit-1-pathway-1/intro-to-programming?hl=ja) | 約15分 |  |

Codelab の進め方は次の通りです。

1. Codelab を開き、各ステップの説明を読んでから **自分でコードを打つ**（コピペで済ませない）
2. ステップごとにアプリを実行し、期待どおり動くか確認する
3. 動かないときは、エラー文をそのまま AI に貼って「何が原因か」を聞き、直したら **なぜ直ったか** をメモする
4. パスウェイ末尾のクイズを受けて、間違えた項目を Codelab で読み直す

## 3. つまずきやすいポイント

- Kotlin Playground はブラウザだけで動きます。まだ Android Studio は不要です。
- エラーメッセージは赤い行だけでなく **英文の内容** を読みましょう。分からなければ AI に「このエラーの意味は？」と丸ごと貼って聞いて構いません。
- `val` と `var` の違いは何度も出てきます。「後から変えるか、変えないか」で説明できるようにしておきましょう。

## 4. 提出物

次の演習で書いた Kotlin コードを、学習用リポジトリの `unit1/kotlin-intro/` に `.kt` ファイルとして置きます（1 問 1 ファイル、ファイル名は問題が分かる名前にする）。

- [練習問題: Kotlin の基本](https://developer.android.com/codelabs/basic-android-kotlin-compose-intro-kotlin-practice-problems?hl=ja)

PR 本文には次の 3 点を書いてください。

- **やったこと**：どの Codelab / 演習を完了したか
- **動作確認**：どの端末（エミュレータ名 or 実機）で何を確認したか
- **詰まった点と解決**：エラーの内容と、どう直したか（AI に聞いた内容も可）

## 5. チェックリスト

- [ ] Kotlin Playground でプログラムを書いて実行できる
- [ ] 変数（`val` / `var`）と関数を使ったプログラムを書ける
- [ ] 練習問題の解答を Kotlin ファイルとして残せる
- [ ] パスウェイ末尾のクイズに合格した
- [ ] 提出物が `unit1/kotlin-intro/` にあり、Android Studio（または Kotlin Playground）で開いて動く

---

## 課題提出

この章には提出課題があります。

1. 上記の提出物を完了する
2. GitHub で `feature/01-kotlin-intro` ブランチを作成し、`develop` へのPRを作成（base=`develop`）
3. [AIプログラムレビュー](https://ai.studio/apps/84d224cb-7de1-44fb-995b-9a5917d25603?fullscreenApplet=true) を実行
4. 問題がなければ、進捗ダッシュボードで **PR URL** と **完了日** を記録
