# 第9章: 美しいアプリを作成する

> 公式コース: [ユニット 3: リストの表示とマテリアル デザインの使用](https://developer.android.com/courses/android-basics-compose/unit-3?hl=ja) ／ [パスウェイ 3: 美しいアプリを作成する](https://developer.android.com/courses/pathways/android-basics-compose-unit-3-pathway-3?hl=ja)
> 提出ブランチ: `feature/03-beautiful-apps`

## 1. この章のゴール

- Material Theme（色・タイポグラフィ・シェイプ）をアプリに適用できる
- `animateContentSize` などで簡単なアニメーションを付けられる
- TalkBack やコントラストなど、ユーザー補助の基本を確認できる

## 2. 進め方

公式パスウェイの内容を **上から順番に** 進めます。動画は省略可、「やらなくてOK」の行は飛ばして構いません。目安時間の合計は約390分です。

| # | 種類 | 内容 | 目安 | 備考 |
|---|---|---|---|---|
| 1 | 動画 | Compose でのマテリアル デザインの概要 | 省略可 |  |
| 2 | Codelab | [Jetpack Compose でのマテリアル テーマ設定](https://developer.android.com/codelabs/basic-android-kotlin-compose-material-theming?hl=ja) | 約120分 |  |
| 3 | Codelab | [Jetpack Compose でのシンプルなアニメーション](https://developer.android.com/codelabs/basic-android-kotlin-compose-woof-animation?hl=ja) | 約60分 |  |
| 4 | Codelab | [ユーザー補助機能のテスト](https://developer.android.com/codelabs/basic-android-kotlin-compose-test-accessibility?hl=ja) | 約45分 |  |
| 5 | Codelab | [演習: スーパーヒーローのアプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-practice-superheroes?hl=ja) | 約150分 | **提出対象** |
| 6 | Codelab | [プロジェクト: 30 日間アプリの作成](https://developer.android.com/codelabs/basic-android-kotlin-compose-30-days?hl=ja) | — | **やらなくてOK**（学習効果に対して難易度・工数が高い） |
| 7 | 動画 | 次のステップ | 省略可 |  |
| 8 | クイズ | [テスト: 美しいアプリを作成する](https://developer.android.com/courses/quizzes/android-basics-compose-unit-3-pathway-3/android-basics-compose-unit-3-pathway-3?hl=ja) | 約15分 |  |

Codelab の進め方は次の通りです。

1. Codelab を開き、各ステップの説明を読んでから **自分でコードを打つ**（コピペで済ませない）
2. ステップごとにアプリを実行し、期待どおり動くか確認する
3. 動かないときは、エラー文をそのまま AI に貼って「何が原因か」を聞き、直したら **なぜ直ったか** をメモする
4. パスウェイ末尾のクイズを受けて、間違えた項目を Codelab で読み直す

## 3. つまずきやすいポイント

- 色を直接指定せず `MaterialTheme.colorScheme.xxx` を使うのがポイントです。ダークテーマ対応が自動で付いてきます。
- アニメーションは「動いたら OK」で十分です。細かい調整に時間をかけすぎないようにしましょう。

## 4. 提出物

次の Codelab で完成させた Android Studio プロジェクトを、学習用リポジトリの `unit3/Superheroes/` に置きます（プロジェクトフォルダごとコピー。`build/` と `.idea/` は含めない）。

- [演習: スーパーヒーローのアプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-practice-superheroes?hl=ja)

PR 本文には次の 3 点を書いてください。

- **やったこと**：どの Codelab / 演習を完了したか
- **動作確認**：どの端末（エミュレータ名 or 実機）で何を確認したか
- **詰まった点と解決**：エラーの内容と、どう直したか（AI に聞いた内容も可）

## 5. チェックリスト

- [ ] Material Theme（色・タイポグラフィ・シェイプ）をアプリに適用できる
- [ ] `animateContentSize` などで簡単なアニメーションを付けられる
- [ ] TalkBack やコントラストなど、ユーザー補助の基本を確認できる
- [ ] パスウェイ末尾のクイズに合格した
- [ ] 提出物が `unit3/Superheroes/` にあり、Android Studio（または Kotlin Playground）で開いて動く

---

## 課題提出

この章には提出課題があります。

1. 上記の提出物を完了する
2. GitHub で `feature/03-beautiful-apps` ブランチを作成し、`develop` へのPRを作成（base=`develop`）
3. [AIプログラムレビュー](https://ai.studio/apps/84d224cb-7de1-44fb-995b-9a5917d25603?fullscreenApplet=true) を実行
4. 問題がなければ、進捗ダッシュボードで **PR URL** と **完了日** を記録
