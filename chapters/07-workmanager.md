# 第18章: WorkManager でタスクのスケジュールを設定する

> 公式コース: [ユニット 7: WorkManager](https://developer.android.com/courses/android-basics-compose/unit-7?hl=ja) ／ [パスウェイ 1: WorkManager でタスクのスケジュールを設定する](https://developer.android.com/courses/pathways/android-basics-compose-unit-7-pathway-1?hl=ja)
> 提出ブランチ: `feature/07-workmanager`

## 1. この章のゴール

- WorkManager を使う場面（アプリを閉じても実行したい処理）を説明できる
- `Worker` を作り、`WorkRequest` で実行・連結・制約付きの実行ができる

## 2. 進め方

公式パスウェイの内容を **上から順番に** 進めます。動画は省略可、「やらなくてOK」の行は飛ばして構いません。目安時間の合計は約280分です。

| # | 種類 | 内容 | 目安 | 備考 |
|---|---|---|---|---|
| 1 | 動画 | WorkManager の概要 | 省略可 |  |
| 2 | 動画 | WorkManager の実装 | 省略可 |  |
| 3 | Codelab | [WorkManager によるバックグラウンド処理](https://developer.android.com/codelabs/basic-android-kotlin-compose-workmanager?hl=ja) | 約120分 |  |
| 4 | Codelab | [高度な WorkManager とテスト](https://developer.android.com/codelabs/basic-android-kotlin-compose-verify-background-work?hl=ja) | — | **やらなくてOK**（学習効果に対して難易度・工数が高い） |
| 5 | Codelab | [演習: Water Me アプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-practice-water-me-app?hl=ja) | 約150分 | **提出対象** |
| 6 | 動画 | 次のステップ | 省略可 |  |
| 7 | クイズ | [テスト: WorkManager](https://developer.android.com/courses/quizzes/android-basics-compose-unit-7-pathway-1/android-basics-compose-unit-7-pathway-1?hl=ja) | 約10分 |  |

Codelab の進め方は次の通りです。

1. Codelab を開き、各ステップの説明を読んでから **自分でコードを打つ**（コピペで済ませない）
2. ステップごとにアプリを実行し、期待どおり動くか確認する
3. 動かないときは、エラー文をそのまま AI に貼って「何が原因か」を聞き、直したら **なぜ直ったか** をメモする
4. パスウェイ末尾のクイズを受けて、間違えた項目を Codelab で読み直す

## 3. つまずきやすいポイント

- 通知が出ないときは、Android 13 以降の **通知パーミッション**（`POST_NOTIFICATIONS`）を確認しましょう。
- Water Me アプリの「リマインダー」は、実行時刻をエミュレータの時刻設定で早送りせず、短い遅延（数十秒）でまず動作確認するのがコツです。

## 4. 提出物

次の Codelab で完成させた Android Studio プロジェクトを、学習用リポジトリの `unit7/WaterMe/` に置きます（プロジェクトフォルダごとコピー。`build/` と `.idea/` は含めない）。

- [演習: Water Me アプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-practice-water-me-app?hl=ja)

PR 本文には次の 3 点を書いてください。

- **やったこと**：どの Codelab / 演習を完了したか
- **動作確認**：どの端末（エミュレータ名 or 実機）で何を確認したか
- **詰まった点と解決**：エラーの内容と、どう直したか（AI に聞いた内容も可）

## 5. チェックリスト

- [ ] WorkManager を使う場面（アプリを閉じても実行したい処理）を説明できる
- [ ] `Worker` を作り、`WorkRequest` で実行・連結・制約付きの実行ができる
- [ ] パスウェイ末尾のクイズに合格した
- [ ] 提出物が `unit7/WaterMe/` にあり、Android Studio（または Kotlin Playground）で開いて動く

---

## 課題提出

この章には提出課題があります。

1. 上記の提出物を完了する
2. GitHub で `feature/07-workmanager` ブランチを作成し、`develop` へのPRを作成（base=`develop`）
3. [AIプログラムレビュー](https://ai.studio/apps/84d224cb-7de1-44fb-995b-9a5917d25603?fullscreenApplet=true) を実行
4. 問題がなければ、進捗ダッシュボードで **PR URL** と **完了日** を記録
