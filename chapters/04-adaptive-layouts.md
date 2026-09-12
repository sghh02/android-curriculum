# 第12章: さまざまな表示サイズに適応する

> 公式コース: [ユニット 4: ナビゲーションとアプリ アーキテクチャ](https://developer.android.com/courses/android-basics-compose/unit-4?hl=ja) ／ [パスウェイ 3: さまざまな表示サイズに適応する](https://developer.android.com/courses/pathways/android-basics-compose-unit-4-pathway-3?hl=ja)
> 提出ブランチ: `feature/04-adaptive-layouts`

## 1. この章のゴール

- ウィンドウサイズクラス（Compact / Medium / Expanded）を判定できる
- 画面幅に応じてナビゲーション（Bottom / Rail / Drawer）とレイアウトを切り替えられる
- タブレットや折りたたみ端末のエミュレータで動作確認できる

## 2. 進め方

公式パスウェイの内容を **上から順番に** 進めます。動画は省略可、「やらなくてOK」の行は飛ばして構いません。目安時間の合計は約405分です。

| # | 種類 | 内容 | 目安 | 備考 |
|---|---|---|---|---|
| 1 | 動画 | アダプティブ レイアウト | 省略可 |  |
| 2 | 動画 | Reply アプリの概要 | 省略可 |  |
| 3 | Codelab | [ダイナミック ナビゲーションを使用してアダプティブ アプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-adaptive-navigation-for-large-screens?hl=ja) | 約120分 |  |
| 4 | Codelab | [アダプティブ レイアウトでアプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-adaptive-content-for-large-screens?hl=ja) | 約120分 |  |
| 5 | Codelab | [演習: スポーツアプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-practice-sports-app?hl=ja) | 約150分 | **提出対象** |
| 6 | Codelab | [プロジェクト: My City アプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-my-city?hl=ja) | — | **やらなくてOK**（学習効果に対して難易度・工数が高い） |
| 7 | 動画 | 次のステップ | 省略可 |  |
| 8 | クイズ | [テスト: アダプティブ レイアウト](https://developer.android.com/courses/quizzes/android-basics-compose-unit-4-pathway-3/android-basics-compose-unit-4-pathway-3?hl=ja) | 約15分 |  |

Codelab の進め方は次の通りです。

1. Codelab を開き、各ステップの説明を読んでから **自分でコードを打つ**（コピペで済ませない）
2. ステップごとにアプリを実行し、期待どおり動くか確認する
3. 動かないときは、エラー文をそのまま AI に貼って「何が原因か」を聞き、直したら **なぜ直ったか** をメモする
4. パスウェイ末尾のクイズを受けて、間違えた項目を Codelab で読み直す

## 3. つまずきやすいポイント

- Android Studio の **Resizable Emulator** を使うと、スマホ／タブレット／折りたたみを 1 台で切り替えて確認できます。
- 「どのサイズでどのレイアウトを出すか」を先に表にしてから実装すると迷いません。

## 4. 提出物

次の Codelab で完成させた Android Studio プロジェクトを、学習用リポジトリの `unit4/Sports/` に置きます（プロジェクトフォルダごとコピー。`build/` と `.idea/` は含めない）。

- [演習: スポーツアプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-practice-sports-app?hl=ja)

PR 本文には次の 3 点を書いてください。

- **やったこと**：どの Codelab / 演習を完了したか
- **動作確認**：どの端末（エミュレータ名 or 実機）で何を確認したか
- **詰まった点と解決**：エラーの内容と、どう直したか（AI に聞いた内容も可）

## 5. チェックリスト

- [ ] ウィンドウサイズクラス（Compact / Medium / Expanded）を判定できる
- [ ] 画面幅に応じてナビゲーション（Bottom / Rail / Drawer）とレイアウトを切り替えられる
- [ ] タブレットや折りたたみ端末のエミュレータで動作確認できる
- [ ] パスウェイ末尾のクイズに合格した
- [ ] 提出物が `unit4/Sports/` にあり、Android Studio（または Kotlin Playground）で開いて動く

---

## 課題提出

この章には提出課題があります。

1. 上記の提出物を完了する
2. GitHub で `feature/04-adaptive-layouts` ブランチを作成し、`develop` へのPRを作成（base=`develop`）
3. [AIプログラムレビュー](https://ai.studio/apps/84d224cb-7de1-44fb-995b-9a5917d25603?fullscreenApplet=true) を実行
4. 問題がなければ、進捗ダッシュボードで **PR URL** と **完了日** を記録
