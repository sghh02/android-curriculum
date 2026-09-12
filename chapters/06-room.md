# 第16章: Room を使用してデータを永続化する

> 公式コース: [ユニット 6: データの永続化](https://developer.android.com/courses/android-basics-compose/unit-6?hl=ja) ／ [パスウェイ 2: Room を使用してデータを永続化する](https://developer.android.com/courses/pathways/android-basics-compose-unit-6-pathway-2?hl=ja)
> 提出ブランチ: `feature/06-room`

## 1. この章のゴール

- Room の Entity / DAO / Database の役割を説明できる
- アプリを再起動してもデータが残る CRUD アプリを作れる
- `Flow` でデータベースの変更を UI に自動反映できる

## 2. 進め方

公式パスウェイの内容を **上から順番に** 進めます。動画は省略可、「やらなくてOK」の行は飛ばして構いません。目安時間の合計は約435分です。

| # | 種類 | 内容 | 目安 | 備考 |
|---|---|---|---|---|
| 1 | 動画 | Kotlin Flow の実践 | 省略可 |  |
| 2 | 記事 | [Flow のテスト](https://developer.android.com/kotlin/flow/test?hl=ja) | — | **やらなくてOK**（学習効果に対して難易度・工数が高い） |
| 3 | 動画 | Room Kotlin API を使用する | 省略可 |  |
| 4 | Codelab | [Room を使用してデータを永続化する](https://developer.android.com/codelabs/basic-android-kotlin-compose-persisting-data-room?hl=ja) | 約150分 |  |
| 5 | Codelab | [Room によるデータの読み取りと更新](https://developer.android.com/codelabs/basic-android-kotlin-compose-update-data-room?hl=ja) | 約120分 |  |
| 6 | Codelab | [演習: Bus Schedule アプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-practice-bus-schedule-app?hl=ja) | 約150分 | **提出対象** |
| 7 | 動画 | 次のステップ | 省略可 |  |
| 8 | クイズ | [テスト: Room](https://developer.android.com/courses/quizzes/android-basics-compose-unit-6-pathway-2/android-basics-compose-unit-6-pathway-2?hl=ja) | 約15分 |  |

Codelab の進め方は次の通りです。

1. Codelab を開き、各ステップの説明を読んでから **自分でコードを打つ**（コピペで済ませない）
2. ステップごとにアプリを実行し、期待どおり動くか確認する
3. 動かないときは、エラー文をそのまま AI に貼って「何が原因か」を聞き、直したら **なぜ直ったか** をメモする
4. パスウェイ末尾のクイズを受けて、間違えた項目を Codelab で読み直す

## 3. つまずきやすいポイント

- Room 関連のビルドエラーは KSP（アノテーション処理）の設定漏れが原因のことが多いです。Codelab の `build.gradle.kts` の記述と見比べましょう。
- 「保存したはずのデータが表示されない」ときは、Database Inspector で実際にテーブルの中身を見るのが最短です。

## 4. 提出物

次の Codelab で完成させた Android Studio プロジェクトを、学習用リポジトリの `unit6/BusSchedule/` に置きます（プロジェクトフォルダごとコピー。`build/` と `.idea/` は含めない）。

- [演習: Bus Schedule アプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-practice-bus-schedule-app?hl=ja)

PR 本文には次の 3 点を書いてください。

- **やったこと**：どの Codelab / 演習を完了したか
- **動作確認**：どの端末（エミュレータ名 or 実機）で何を確認したか
- **詰まった点と解決**：エラーの内容と、どう直したか（AI に聞いた内容も可）

## 5. チェックリスト

- [ ] Room の Entity / DAO / Database の役割を説明できる
- [ ] アプリを再起動してもデータが残る CRUD アプリを作れる
- [ ] `Flow` でデータベースの変更を UI に自動反映できる
- [ ] パスウェイ末尾のクイズに合格した
- [ ] 提出物が `unit6/BusSchedule/` にあり、Android Studio（または Kotlin Playground）で開いて動く

---

## 課題提出

この章には提出課題があります。

1. 上記の提出物を完了する
2. GitHub で `feature/06-room` ブランチを作成し、`develop` へのPRを作成（base=`develop`）
3. [AIプログラムレビュー](https://ai.studio/apps/84d224cb-7de1-44fb-995b-9a5917d25603?fullscreenApplet=true) を実行
4. 問題がなければ、進捗ダッシュボードで **PR URL** と **完了日** を記録
