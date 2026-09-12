# 第10章: アーキテクチャ コンポーネント

> 公式コース: [ユニット 4: ナビゲーションとアプリ アーキテクチャ](https://developer.android.com/courses/android-basics-compose/unit-4?hl=ja) ／ [パスウェイ 1: アーキテクチャ コンポーネント](https://developer.android.com/courses/pathways/android-basics-compose-unit-4-pathway-1?hl=ja)
> 提出ブランチ: `feature/04-architecture-components`

## 1. この章のゴール

- Activity のライフサイクル（onCreate / onStart / onResume …）を説明できる
- `ViewModel` と `StateFlow` で UI 状態を管理できる
- ViewModel のユニットテストを書ける

## 2. 進め方

公式パスウェイの内容を **上から順番に** 進めます。動画は省略可、「やらなくてOK」の行は飛ばして構いません。目安時間の合計は約405分です。

| # | 種類 | 内容 | 目安 | 備考 |
|---|---|---|---|---|
| 1 | 動画 | ユニット 4 へようこそ | 省略可 |  |
| 2 | Codelab | [アクティビティのライフサイクルのステージ](https://developer.android.com/codelabs/basic-android-kotlin-compose-activity-lifecycle?hl=ja) | 約90分 |  |
| 3 | 動画 | アプリ アーキテクチャの概要 | 省略可 |  |
| 4 | 動画 | アーキテクチャ: UI レイヤ | 省略可 |  |
| 5 | Codelab | [Compose での ViewModel と状態](https://developer.android.com/codelabs/basic-android-kotlin-compose-viewmodel-and-state?hl=ja) | 約120分 |  |
| 6 | Codelab | [ViewModel をテストする単体テストを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-test-viewmodel?hl=ja) | 約60分 |  |
| 7 | Codelab | [演習: Dessert Clicker に ViewModel を追加する](https://developer.android.com/codelabs/basic-android-kotlin-compose-practice-viewmodel?hl=ja) | 約120分 | **提出対象** |
| 8 | 動画 | 次のステップ | 省略可 |  |
| 9 | クイズ | [テスト: アーキテクチャ コンポーネント](https://developer.android.com/courses/quizzes/android-basics-compose-unit-4-pathway-1/android-basics-compose-unit-4-pathway-1?hl=ja) | 約15分 |  |

Codelab の進め方は次の通りです。

1. Codelab を開き、各ステップの説明を読んでから **自分でコードを打つ**（コピペで済ませない）
2. ステップごとにアプリを実行し、期待どおり動くか確認する
3. 動かないときは、エラー文をそのまま AI に貼って「何が原因か」を聞き、直したら **なぜ直ったか** をメモする
4. パスウェイ末尾のクイズを受けて、間違えた項目を Codelab で読み直す

## 3. つまずきやすいポイント

- 画面回転でデータが消える問題は、この章の ViewModel で解決します。「なぜ消えるのか」（Activity が作り直される）をまず理解しましょう。
- 「UI 状態は ViewModel に、表示は Composable に」という分け方は、この後のすべてのアプリで使います。

## 4. 提出物

次の Codelab で完成させた Android Studio プロジェクトを、学習用リポジトリの `unit4/DessertClicker/` に置きます（プロジェクトフォルダごとコピー。`build/` と `.idea/` は含めない）。

- [演習: Dessert Clicker に ViewModel を追加する](https://developer.android.com/codelabs/basic-android-kotlin-compose-practice-viewmodel?hl=ja)

PR 本文には次の 3 点を書いてください。

- **やったこと**：どの Codelab / 演習を完了したか
- **動作確認**：どの端末（エミュレータ名 or 実機）で何を確認したか
- **詰まった点と解決**：エラーの内容と、どう直したか（AI に聞いた内容も可）

## 5. チェックリスト

- [ ] Activity のライフサイクル（onCreate / onStart / onResume …）を説明できる
- [ ] `ViewModel` と `StateFlow` で UI 状態を管理できる
- [ ] ViewModel のユニットテストを書ける
- [ ] パスウェイ末尾のクイズに合格した
- [ ] 提出物が `unit4/DessertClicker/` にあり、Android Studio（または Kotlin Playground）で開いて動く

---

## 課題提出

この章には提出課題があります。

1. 上記の提出物を完了する
2. GitHub で `feature/04-architecture-components` ブランチを作成し、`develop` へのPRを作成（base=`develop`）
3. [AIプログラムレビュー](https://ai.studio/apps/84d224cb-7de1-44fb-995b-9a5917d25603?fullscreenApplet=true) を実行
4. 問題がなければ、進捗ダッシュボードで **PR URL** と **完了日** を記録
