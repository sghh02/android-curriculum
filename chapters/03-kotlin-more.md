# 第7章: Kotlin の基礎（その他）

> 公式コース: [ユニット 3: リストの表示とマテリアル デザインの使用](https://developer.android.com/courses/android-basics-compose/unit-3?hl=ja) ／ [パスウェイ 1: Kotlin の基礎（その他）](https://developer.android.com/courses/pathways/android-basics-compose-unit-3-pathway-1?hl=ja)
> 提出ブランチ: `feature/03-kotlin-more`

## 1. この章のゴール

- ジェネリクス・enum・data class・object・拡張関数の用途を説明できる
- `List` / `Set` / `Map` を使い分けられる
- `map` / `filter` / `sortedBy` などの高階関数でコレクションを加工できる

## 2. 進め方

公式パスウェイの内容を **上から順番に** 進めます。動画は省略可、「やらなくてOK」の行は飛ばして構いません。目安時間の合計は約375分です。

| # | 種類 | 内容 | 目安 | 備考 |
|---|---|---|---|---|
| 1 | 動画 | ユニット 3 へようこそ | 省略可 |  |
| 2 | Codelab | [ジェネリック、オブジェクト、拡張機能](https://developer.android.com/codelabs/basic-android-kotlin-compose-generics?hl=ja) | 約90分 |  |
| 3 | Codelab | [Kotlin でコレクションを使用する](https://developer.android.com/codelabs/basic-android-kotlin-compose-collections?hl=ja) | 約90分 |  |
| 4 | Codelab | [コレクションを操作する高階関数](https://developer.android.com/codelabs/basic-android-kotlin-compose-higher-order-functions?hl=ja) | 約90分 |  |
| 5 | Codelab | [演習: クラスとコレクション](https://developer.android.com/codelabs/basic-android-kotlin-compose-practice-classes-and-collections?hl=ja) | 約90分 | **提出対象** |
| 6 | クイズ | [テスト: Kotlin の基礎（その他）](https://developer.android.com/courses/quizzes/android-basics-compose-unit-3-pathway-1/android-basics-compose-unit-3-pathway-1?hl=ja) | 約15分 |  |

Codelab の進め方は次の通りです。

1. Codelab を開き、各ステップの説明を読んでから **自分でコードを打つ**（コピペで済ませない）
2. ステップごとにアプリを実行し、期待どおり動くか確認する
3. 動かないときは、エラー文をそのまま AI に貼って「何が原因か」を聞き、直したら **なぜ直ったか** をメモする
4. パスウェイ末尾のクイズを受けて、間違えた項目を Codelab で読み直す

## 3. つまずきやすいポイント

- 高階関数は「for 文で書けることを短く書く道具」です。最初は for 文で書いてから `map` / `filter` に置き換えると理解しやすいです。
- `data class` はこの後のユニットで「1 件のデータ」を表すのに毎回使います。

## 4. 提出物

次の演習で書いた Kotlin コードを、学習用リポジトリの `unit3/kotlin-more/` に `.kt` ファイルとして置きます（1 問 1 ファイル、ファイル名は問題が分かる名前にする）。

- [演習: クラスとコレクション](https://developer.android.com/codelabs/basic-android-kotlin-compose-practice-classes-and-collections?hl=ja)

PR 本文には次の 3 点を書いてください。

- **やったこと**：どの Codelab / 演習を完了したか
- **動作確認**：どの端末（エミュレータ名 or 実機）で何を確認したか
- **詰まった点と解決**：エラーの内容と、どう直したか（AI に聞いた内容も可）

## 5. チェックリスト

- [ ] ジェネリクス・enum・data class・object・拡張関数の用途を説明できる
- [ ] `List` / `Set` / `Map` を使い分けられる
- [ ] `map` / `filter` / `sortedBy` などの高階関数でコレクションを加工できる
- [ ] パスウェイ末尾のクイズに合格した
- [ ] 提出物が `unit3/kotlin-more/` にあり、Android Studio（または Kotlin Playground）で開いて動く

---

## 課題提出

この章には提出課題があります。

1. 上記の提出物を完了する
2. GitHub で `feature/03-kotlin-more` ブランチを作成し、`develop` へのPRを作成（base=`develop`）
3. [AIプログラムレビュー](https://ai.studio/apps/84d224cb-7de1-44fb-995b-9a5917d25603?fullscreenApplet=true) を実行
4. 問題がなければ、進捗ダッシュボードで **PR URL** と **完了日** を記録
