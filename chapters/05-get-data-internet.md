# 第13章: インターネットからデータを取得する

> 公式コース: [ユニット 5: インターネットに接続する](https://developer.android.com/courses/android-basics-compose/unit-5?hl=ja) ／ [パスウェイ 1: インターネットからデータを取得する](https://developer.android.com/courses/pathways/android-basics-compose-unit-5-pathway-1?hl=ja)
> 提出ブランチ: `feature/05-get-data-internet`

## 1. この章のゴール

- コルーチン（`launch` / `async` / `suspend`）の基本を説明できる
- Retrofit と kotlinx.serialization で REST API から JSON を取得できる
- 通信中・成功・失敗の 3 状態を UI に反映できる

## 2. 進め方

公式パスウェイの内容を **上から順番に** 進めます。動画は省略可、「やらなくてOK」の行は飛ばして構いません。目安時間の合計は約345分です。

| # | 種類 | 内容 | 目安 | 備考 |
|---|---|---|---|---|
| 1 | 動画 | インターネットに接続する | 省略可 |  |
| 2 | Codelab | [Kotlin Playground でのコルーチンの概要](https://developer.android.com/codelabs/basic-android-kotlin-compose-coroutines-kotlin-playground?hl=ja) | 約90分 |  |
| 3 | Codelab | [Android Studio でのコルーチンの概要](https://developer.android.com/codelabs/basic-android-kotlin-compose-coroutines-android-studio?hl=ja) | 約90分 |  |
| 4 | 動画 | HTTP / REST の概要 | 省略可 |  |
| 5 | Codelab | [インターネットからデータを取得する](https://developer.android.com/codelabs/basic-android-kotlin-compose-getting-data-internet?hl=ja) | 約150分 | **提出対象** |
| 6 | 動画 | 次のステップ | 省略可 |  |
| 7 | クイズ | [テスト: インターネットからデータを取得する](https://developer.android.com/courses/quizzes/android-basics-compose-unit-5-pathway-1/android-basics-compose-unit-5-pathway-1?hl=ja) | 約15分 |  |

Codelab の進め方は次の通りです。

1. Codelab を開き、各ステップの説明を読んでから **自分でコードを打つ**（コピペで済ませない）
2. ステップごとにアプリを実行し、期待どおり動くか確認する
3. 動かないときは、エラー文をそのまま AI に貼って「何が原因か」を聞き、直したら **なぜ直ったか** をメモする
4. パスウェイ末尾のクイズを受けて、間違えた項目を Codelab で読み直す

## 3. つまずきやすいポイント

- 通信が失敗するときは、`AndroidManifest.xml` の `INTERNET` パーミッションと URL のタイプミスを最初に確認しましょう。
- 「Loading / Success / Error」を `sealed interface` で表す書き方は、実務でもそのまま使えます。

## 4. 提出物

次の Codelab で完成させた Android Studio プロジェクトを、学習用リポジトリの `unit5/MarsPhotos/` に置きます（プロジェクトフォルダごとコピー。`build/` と `.idea/` は含めない）。

- [インターネットからデータを取得する](https://developer.android.com/codelabs/basic-android-kotlin-compose-getting-data-internet?hl=ja)

PR 本文には次の 3 点を書いてください。

- **やったこと**：どの Codelab / 演習を完了したか
- **動作確認**：どの端末（エミュレータ名 or 実機）で何を確認したか
- **詰まった点と解決**：エラーの内容と、どう直したか（AI に聞いた内容も可）

## 5. チェックリスト

- [ ] コルーチン（`launch` / `async` / `suspend`）の基本を説明できる
- [ ] Retrofit と kotlinx.serialization で REST API から JSON を取得できる
- [ ] 通信中・成功・失敗の 3 状態を UI に反映できる
- [ ] パスウェイ末尾のクイズに合格した
- [ ] 提出物が `unit5/MarsPhotos/` にあり、Android Studio（または Kotlin Playground）で開いて動く

---

## 課題提出

この章には提出課題があります。

1. 上記の提出物を完了する
2. GitHub で `feature/05-get-data-internet` ブランチを作成し、`develop` へのPRを作成（base=`develop`）
3. [AIプログラムレビュー](https://ai.studio/apps/84d224cb-7de1-44fb-995b-9a5917d25603?fullscreenApplet=true) を実行
4. 問題がなければ、進捗ダッシュボードで **PR URL** と **完了日** を記録
