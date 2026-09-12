# 第14章: インターネットから画像を読み込んで表示する

> 公式コース: [ユニット 5: インターネットに接続する](https://developer.android.com/courses/android-basics-compose/unit-5?hl=ja) ／ [パスウェイ 2: インターネットから画像を読み込んで表示する](https://developer.android.com/courses/pathways/android-basics-compose-unit-5-pathway-2?hl=ja)
> 提出ブランチ: `feature/05-load-images`

## 1. この章のゴール

- Repository パターンでデータ取得を UI から分離できる
- 手動の依存関係注入（`AppContainer`）を説明できる
- Coil で URL から画像を読み込んで表示できる

## 2. 進め方

公式パスウェイの内容を **上から順番に** 進めます。動画は省略可、「やらなくてOK」の行は飛ばして構いません。目安時間の合計は約405分です。

| # | 種類 | 内容 | 目安 | 備考 |
|---|---|---|---|---|
| 1 | 動画 | アーキテクチャ: データレイヤ | 省略可 |  |
| 2 | Codelab | [リポジトリと手動依存関係挿入を追加する](https://developer.android.com/codelabs/basic-android-kotlin-compose-add-repository?hl=ja) | 約120分 |  |
| 3 | Codelab | [インターネットから画像を読み込んで表示する](https://developer.android.com/codelabs/basic-android-kotlin-compose-load-images?hl=ja) | 約90分 |  |
| 4 | Codelab | [練習: Amphibians アプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-practice-amphibians-app?hl=ja) | 約180分 | **提出対象** |
| 5 | Codelab | [プロジェクト: Bookshelf アプリの作成](https://developer.android.com/codelabs/basic-android-kotlin-compose-bookshelf?hl=ja) | — | **やらなくてOK**（学習効果に対して難易度・工数が高い） |
| 6 | 動画 | 次のステップ | 省略可 |  |
| 7 | クイズ | [テスト: 画像を読み込んで表示する](https://developer.android.com/courses/quizzes/android-basics-compose-unit-5-pathway-2/android-basics-compose-unit-5-pathway-2?hl=ja) | 約15分 |  |

Codelab の進め方は次の通りです。

1. Codelab を開き、各ステップの説明を読んでから **自分でコードを打つ**（コピペで済ませない）
2. ステップごとにアプリを実行し、期待どおり動くか確認する
3. 動かないときは、エラー文をそのまま AI に貼って「何が原因か」を聞き、直したら **なぜ直ったか** をメモする
4. パスウェイ末尾のクイズを受けて、間違えた項目を Codelab で読み直す

## 3. つまずきやすいポイント

- Amphibians アプリは Unit 5 の総まとめです。「Mars Photos と同じ構成で、API と表示だけ変える」と考えると見通しが立ちます。
- Repository を挟む理由は「テストしやすくする」「データの取り方を後から変えられる」の 2 つです。自分の言葉で説明できるようにしましょう。

## 4. 提出物

次の Codelab で完成させた Android Studio プロジェクトを、学習用リポジトリの `unit5/Amphibians/` に置きます（プロジェクトフォルダごとコピー。`build/` と `.idea/` は含めない）。

- [練習: Amphibians アプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-practice-amphibians-app?hl=ja)

PR 本文には次の 3 点を書いてください。

- **やったこと**：どの Codelab / 演習を完了したか
- **動作確認**：どの端末（エミュレータ名 or 実機）で何を確認したか
- **詰まった点と解決**：エラーの内容と、どう直したか（AI に聞いた内容も可）

## 5. チェックリスト

- [ ] Repository パターンでデータ取得を UI から分離できる
- [ ] 手動の依存関係注入（`AppContainer`）を説明できる
- [ ] Coil で URL から画像を読み込んで表示できる
- [ ] パスウェイ末尾のクイズに合格した
- [ ] 提出物が `unit5/Amphibians/` にあり、Android Studio（または Kotlin Playground）で開いて動く

---

## 課題提出

この章には提出課題があります。

1. 上記の提出物を完了する
2. GitHub で `feature/05-load-images` ブランチを作成し、`develop` へのPRを作成（base=`develop`）
3. [AIプログラムレビュー](https://ai.studio/apps/84d224cb-7de1-44fb-995b-9a5917d25603?fullscreenApplet=true) を実行
4. 問題がなければ、進捗ダッシュボードで **PR URL** と **完了日** を記録
