# 第8章: スクロール可能なリストを作成する

> 公式コース: [ユニット 3: リストの表示とマテリアル デザインの使用](https://developer.android.com/courses/android-basics-compose/unit-3?hl=ja) ／ [パスウェイ 2: スクロール可能なリストを作成する](https://developer.android.com/courses/pathways/android-basics-compose-unit-3-pathway-2?hl=ja)
> 提出ブランチ: `feature/03-scrollable-list`

## 1. この章のゴール

- `LazyColumn` / `LazyVerticalGrid` でデータのリストを表示できる
- データクラスのリストからカード UI を生成できる
- アプリアイコン（Adaptive Icon）を差し替えられる

## 2. 進め方

公式パスウェイの内容を **上から順番に** 進めます。動画は省略可、「やらなくてOK」の行は飛ばして構いません。目安時間の合計は約265分です。

| # | 種類 | 内容 | 目安 | 備考 |
|---|---|---|---|---|
| 1 | 動画 | Affirmations アプリの概要 | 省略可 |  |
| 2 | Codelab | [スクロール可能なリストを追加する](https://developer.android.com/codelabs/basic-android-kotlin-compose-training-add-scrollable-list?hl=ja) | 約90分 | **提出対象** |
| 3 | Codelab | [アプリアイコンを変更する](https://developer.android.com/codelabs/basic-android-kotlin-compose-training-change-app-icon?hl=ja) | 約45分 |  |
| 4 | Codelab | [演習: グリッドを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-practice-grid?hl=ja) | 約120分 | **提出対象** |
| 5 | 動画 | 次のステップ | 省略可 |  |
| 6 | クイズ | [テスト: スクロール可能なリストを作成する](https://developer.android.com/courses/quizzes/android-basics-compose-unit-3-pathway-2/android-basics-compose-unit-3-pathway-2?hl=ja) | 約10分 |  |

Codelab の進め方は次の通りです。

1. Codelab を開き、各ステップの説明を読んでから **自分でコードを打つ**（コピペで済ませない）
2. ステップごとにアプリを実行し、期待どおり動くか確認する
3. 動かないときは、エラー文をそのまま AI に貼って「何が原因か」を聞き、直したら **なぜ直ったか** をメモする
4. パスウェイ末尾のクイズを受けて、間違えた項目を Codelab で読み直す

## 3. つまずきやすいポイント

- `Column` と `LazyColumn` の違い（全部作るか、見える分だけ作るか）を説明できるようにしましょう。
- リストの 1 行を別のコンポーザブル関数に切り出す（`AffirmationCard` など）と、コードが読みやすくなり AI レビューも通りやすくなります。

## 4. 提出物

次の Codelab で完成させた Android Studio プロジェクトを、学習用リポジトリの `unit3/Affirmations/` に置きます（プロジェクトフォルダごとコピー。`build/` と `.idea/` は含めない）。

- [スクロール可能なリストを追加する](https://developer.android.com/codelabs/basic-android-kotlin-compose-training-add-scrollable-list?hl=ja)
- [演習: グリッドを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-practice-grid?hl=ja)

PR 本文には次の 3 点を書いてください。

- **やったこと**：どの Codelab / 演習を完了したか
- **動作確認**：どの端末（エミュレータ名 or 実機）で何を確認したか
- **詰まった点と解決**：エラーの内容と、どう直したか（AI に聞いた内容も可）

## 5. チェックリスト

- [ ] `LazyColumn` / `LazyVerticalGrid` でデータのリストを表示できる
- [ ] データクラスのリストからカード UI を生成できる
- [ ] アプリアイコン（Adaptive Icon）を差し替えられる
- [ ] パスウェイ末尾のクイズに合格した
- [ ] 提出物が `unit3/Affirmations/` にあり、Android Studio（または Kotlin Playground）で開いて動く

---

## 課題提出

この章には提出課題があります。

1. 上記の提出物を完了する
2. GitHub で `feature/03-scrollable-list` ブランチを作成し、`develop` へのPRを作成（base=`develop`）
3. [AIプログラムレビュー](https://ai.studio/apps/84d224cb-7de1-44fb-995b-9a5917d25603?fullscreenApplet=true) を実行
4. 問題がなければ、進捗ダッシュボードで **PR URL** と **完了日** を記録
