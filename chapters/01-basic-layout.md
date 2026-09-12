# 第3章: 基本的なレイアウトを作成する

> 公式コース: [ユニット 1: 初めての Android アプリ](https://developer.android.com/courses/android-basics-compose/unit-1?hl=ja) ／ [パスウェイ 3: 基本的なレイアウトを作成する](https://developer.android.com/courses/pathways/android-basics-compose-unit-1-pathway-3?hl=ja)
> 提出ブランチ: `feature/01-basic-layout`

## 1. この章のゴール

- `Text` / `Image` コンポーザブルと `Column` / `Row` / `Box` で画面を組める
- `Modifier` で余白・サイズ・配置を調整できる
- プロジェクト「名刺アプリ」を自分の情報で完成させられる

## 2. 進め方

公式パスウェイの内容を **上から順番に** 進めます。動画は省略可、「やらなくてOK」の行は飛ばして構いません。目安時間の合計は約345分です。

| # | 種類 | 内容 | 目安 | 備考 |
|---|---|---|---|---|
| 1 | 動画 | Jetpack Compose の概要 | 省略可 |  |
| 2 | 動画 | 誕生日カードアプリを設計する | 省略可 |  |
| 3 | Codelab | [テキスト コンポーザブルを使用してシンプルなアプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-text-composables?hl=ja) | 約60分 |  |
| 4 | 動画 | スクリーンキャスト: テキスト コンポーザブル | 省略可 |  |
| 5 | Codelab | [Android アプリに画像を追加する](https://developer.android.com/codelabs/basic-android-kotlin-compose-add-images?hl=ja) | 約60分 |  |
| 6 | 動画 | スクリーンキャスト: 画像を追加する | 省略可 |  |
| 7 | Codelab | [練習問題: Compose の基本](https://developer.android.com/codelabs/basic-android-kotlin-compose-composables-practice-problems?hl=ja) | 約90分 |  |
| 8 | Codelab | [プロジェクト: 名刺アプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-business-card?hl=ja) | 約120分 | **提出対象** |
| 9 | 動画 | 次のステップ | 省略可 |  |
| 10 | クイズ | [テスト: 基本的なレイアウトを作成する](https://developer.android.com/courses/quizzes/android-basics-compose-unit-1-pathway-3/Build-a-basic-layout?hl=ja) | 約15分 |  |

Codelab の進め方は次の通りです。

1. Codelab を開き、各ステップの説明を読んでから **自分でコードを打つ**（コピペで済ませない）
2. ステップごとにアプリを実行し、期待どおり動くか確認する
3. 動かないときは、エラー文をそのまま AI に貼って「何が原因か」を聞き、直したら **なぜ直ったか** をメモする
4. パスウェイ末尾のクイズを受けて、間違えた項目を Codelab で読み直す

## 3. つまずきやすいポイント

- レイアウトが思い通りにならないときは、まず `Column` / `Row` のどちらに入っているかを図に書いてみましょう。
- 画像は `res/drawable` に置き、`painterResource(R.drawable.xxx)` で読み込みます。ファイル名は小文字・数字・アンダースコアのみです。
- 名刺アプリは **正解が一つではありません**。要件（名前・肩書き・連絡先が見える）を満たしていれば、デザインは自由です。

## 4. 提出物

次の Codelab で完成させた Android Studio プロジェクトを、学習用リポジトリの `unit1/BusinessCard/` に置きます（プロジェクトフォルダごとコピー。`build/` と `.idea/` は含めない）。

- [プロジェクト: 名刺アプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-business-card?hl=ja)

PR 本文には次の 3 点を書いてください。

- **やったこと**：どの Codelab / 演習を完了したか
- **動作確認**：どの端末（エミュレータ名 or 実機）で何を確認したか
- **詰まった点と解決**：エラーの内容と、どう直したか（AI に聞いた内容も可）

## 5. チェックリスト

- [ ] `Text` / `Image` コンポーザブルと `Column` / `Row` / `Box` で画面を組める
- [ ] `Modifier` で余白・サイズ・配置を調整できる
- [ ] プロジェクト「名刺アプリ」を自分の情報で完成させられる
- [ ] パスウェイ末尾のクイズに合格した
- [ ] 提出物が `unit1/BusinessCard/` にあり、Android Studio（または Kotlin Playground）で開いて動く

---

## 課題提出

この章には提出課題があります。

1. 上記の提出物を完了する
2. GitHub で `feature/01-basic-layout` ブランチを作成し、`develop` へのPRを作成（base=`develop`）
3. [AIプログラムレビュー](https://ai.studio/apps/84d224cb-7de1-44fb-995b-9a5917d25603?fullscreenApplet=true) を実行
4. 問題がなければ、進捗ダッシュボードで **PR URL** と **完了日** を記録
