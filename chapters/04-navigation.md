# 第11章: Jetpack Compose でのナビゲーション

> 公式コース: [ユニット 4: ナビゲーションとアプリ アーキテクチャ](https://developer.android.com/courses/android-basics-compose/unit-4?hl=ja) ／ [パスウェイ 2: Jetpack Compose でのナビゲーション](https://developer.android.com/courses/pathways/android-basics-compose-unit-4-pathway-2?hl=ja)
> 提出ブランチ: `feature/04-navigation`

## 1. この章のゴール

- `NavHost` と `NavController` で複数画面を切り替えられる
- 画面間でデータを受け渡し、戻る操作を正しく扱える
- ナビゲーションを含む UI テストを書ける

## 2. 進め方

公式パスウェイの内容を **上から順番に** 進めます。動画は省略可、「やらなくてOK」の行は飛ばして構いません。目安時間の合計は約375分です。

| # | 種類 | 内容 | 目安 | 備考 |
|---|---|---|---|---|
| 1 | 動画 | ナビゲーションと Cupcake アプリの概要 | 省略可 |  |
| 2 | Codelab | [Compose で画面間を移動する](https://developer.android.com/codelabs/basic-android-kotlin-compose-navigation?hl=ja) | 約150分 |  |
| 3 | Codelab | [Cupcake アプリをテストする](https://developer.android.com/codelabs/basic-android-kotlin-compose-test-cupcake?hl=ja) | 約60分 |  |
| 4 | Codelab | [演習: ナビゲーションを追加する](https://developer.android.com/codelabs/basic-android-kotlin-compose-practice-navigation?hl=ja) | 約150分 | **提出対象** |
| 5 | 動画 | 次のステップ | 省略可 |  |
| 6 | クイズ | [テスト: Jetpack Compose でのナビゲーション](https://developer.android.com/courses/quizzes/android-basics-compose-unit-4-pathway-2/android-basics-compose-unit-4-pathway-2?hl=ja) | 約15分 |  |

Codelab の進め方は次の通りです。

1. Codelab を開き、各ステップの説明を読んでから **自分でコードを打つ**（コピペで済ませない）
2. ステップごとにアプリを実行し、期待どおり動くか確認する
3. 動かないときは、エラー文をそのまま AI に貼って「何が原因か」を聞き、直したら **なぜ直ったか** をメモする
4. パスウェイ末尾のクイズを受けて、間違えた項目を Codelab で読み直す

## 3. つまずきやすいポイント

- 画面の名前は `enum class` で管理すると、文字列のタイプミスによるクラッシュを防げます。
- 「戻る」で意図しない画面に行くときは、`popBackStack` / `popUpTo` の指定を疑いましょう。

## 4. 提出物

次の Codelab で完成させた Android Studio プロジェクトを、学習用リポジトリの `unit4/Lunchtray/` に置きます（プロジェクトフォルダごとコピー。`build/` と `.idea/` は含めない）。

- [演習: ナビゲーションを追加する](https://developer.android.com/codelabs/basic-android-kotlin-compose-practice-navigation?hl=ja)

PR 本文には次の 3 点を書いてください。

- **やったこと**：どの Codelab / 演習を完了したか
- **動作確認**：どの端末（エミュレータ名 or 実機）で何を確認したか
- **詰まった点と解決**：エラーの内容と、どう直したか（AI に聞いた内容も可）

## 5. チェックリスト

- [ ] `NavHost` と `NavController` で複数画面を切り替えられる
- [ ] 画面間でデータを受け渡し、戻る操作を正しく扱える
- [ ] ナビゲーションを含む UI テストを書ける
- [ ] パスウェイ末尾のクイズに合格した
- [ ] 提出物が `unit4/Lunchtray/` にあり、Android Studio（または Kotlin Playground）で開いて動く

---

## 課題提出

この章には提出課題があります。

1. 上記の提出物を完了する
2. GitHub で `feature/04-navigation` ブランチを作成し、`develop` へのPRを作成（base=`develop`）
3. [AIプログラムレビュー](https://ai.studio/apps/84d224cb-7de1-44fb-995b-9a5917d25603?fullscreenApplet=true) を実行
4. 問題がなければ、進捗ダッシュボードで **PR URL** と **完了日** を記録
