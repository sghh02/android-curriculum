# 第4章: Kotlin の基礎

> 公式コース: [ユニット 2: アプリ UI を作成する](https://developer.android.com/courses/android-basics-compose/unit-2?hl=ja) ／ [パスウェイ 1: Kotlin の基礎](https://developer.android.com/courses/pathways/android-basics-compose-unit-2-pathway-1?hl=ja)
> 提出ブランチ: `feature/02-kotlin-fundamentals`

## 1. この章のゴール

- `if` / `when` で条件分岐を書ける
- null 安全（`?` / `?:` / `!!`）の意味を説明できる
- クラス・オブジェクト・ラムダ式を使ったコードが読める・書ける

## 2. 進め方

公式パスウェイの内容を **上から順番に** 進めます。動画は省略可、「やらなくてOK」の行は飛ばして構いません。目安時間の合計は約405分です。

| # | 種類 | 内容 | 目安 | 備考 |
|---|---|---|---|---|
| 1 | 動画 | Kotlin の基礎へようこそ | 省略可 |  |
| 2 | Codelab | [Kotlin で条件を記述する](https://developer.android.com/codelabs/basic-android-kotlin-compose-conditionals?hl=ja) | 約60分 |  |
| 3 | Codelab | [Kotlin で null 可能性を使用する](https://developer.android.com/codelabs/basic-android-kotlin-compose-nullability?hl=ja) | 約60分 |  |
| 4 | Codelab | [Kotlin でクラスとオブジェクトを使用する](https://developer.android.com/codelabs/basic-android-kotlin-compose-classes-and-objects?hl=ja) | 約90分 |  |
| 5 | Codelab | [Kotlin で関数型とラムダ式を使用する](https://developer.android.com/codelabs/basic-android-kotlin-compose-function-types-and-lambda?hl=ja) | 約90分 |  |
| 6 | Codelab | [演習: Kotlin の基礎](https://developer.android.com/codelabs/basic-android-kotlin-compose-kotlin-fundamentals-practice-problems?hl=ja) | 約90分 | **提出対象** |
| 7 | 動画 | 次のステップ | 省略可 |  |
| 8 | クイズ | [テスト: Kotlin の基礎](https://developer.android.com/courses/quizzes/android-basics-compose-unit-2-pathway-1/android-basics-compose-unit-2-pathway-1?hl=ja) | 約15分 |  |

Codelab の進め方は次の通りです。

1. Codelab を開き、各ステップの説明を読んでから **自分でコードを打つ**（コピペで済ませない）
2. ステップごとにアプリを実行し、期待どおり動くか確認する
3. 動かないときは、エラー文をそのまま AI に貼って「何が原因か」を聞き、直したら **なぜ直ったか** をメモする
4. パスウェイ末尾のクイズを受けて、間違えた項目を Codelab で読み直す

## 3. つまずきやすいポイント

- この章の内容は後のユニットで **毎回** 使います。演習でつまずいた箇所は必ずメモして質問してください。
- ラムダ式 `{ x -> x * 2 }` は「名前のない小さな関数」です。Compose のクリック処理（`onClick = { ... }`）もこれです。
- `!!` は「絶対 null じゃない」と宣言する記号です。安易に使うとクラッシュの原因になるので、まず `?.` と `?:` で書けないか考えましょう。

## 4. 提出物

次の演習で書いた Kotlin コードを、学習用リポジトリの `unit2/kotlin-fundamentals/` に `.kt` ファイルとして置きます（1 問 1 ファイル、ファイル名は問題が分かる名前にする）。

- [演習: Kotlin の基礎](https://developer.android.com/codelabs/basic-android-kotlin-compose-kotlin-fundamentals-practice-problems?hl=ja)

PR 本文には次の 3 点を書いてください。

- **やったこと**：どの Codelab / 演習を完了したか
- **動作確認**：どの端末（エミュレータ名 or 実機）で何を確認したか
- **詰まった点と解決**：エラーの内容と、どう直したか（AI に聞いた内容も可）

## 5. チェックリスト

- [ ] `if` / `when` で条件分岐を書ける
- [ ] null 安全（`?` / `?:` / `!!`）の意味を説明できる
- [ ] クラス・オブジェクト・ラムダ式を使ったコードが読める・書ける
- [ ] パスウェイ末尾のクイズに合格した
- [ ] 提出物が `unit2/kotlin-fundamentals/` にあり、Android Studio（または Kotlin Playground）で開いて動く

---

## 課題提出

この章には提出課題があります。

1. 上記の提出物を完了する
2. GitHub で `feature/02-kotlin-fundamentals` ブランチを作成し、`develop` へのPRを作成（base=`develop`）
3. [AIプログラムレビュー](https://ai.studio/apps/84d224cb-7de1-44fb-995b-9a5917d25603?fullscreenApplet=true) を実行
4. 問題がなければ、進捗ダッシュボードで **PR URL** と **完了日** を記録
