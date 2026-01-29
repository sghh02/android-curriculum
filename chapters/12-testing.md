# テスト（ユニット/Compose UI）

> 提出ブランチ：`feature/12-testing`（PRのbase：`develop`）

実務では「動いた」だけでは不十分です。**変更しても壊れない**ことを担保するのがテストの役割です。
実務の入口でも、機能追加やバグ修正のたびに「影響範囲を特定し、最低限のテストで守る」ことが求められます。

---

## 前提

- [Unit 6: 品質と運用（ガイド）](./06-unit6-guide.md) を読んでいる
- [データ保存（Room / DataStore）](./11-storage.md) まで完了し、永続化を含むアプリの骨格がある

## この章でできるようになること

- [ ] ユニットテスト / 結合テスト / UIテストの役割を説明できる
- [ ] ViewModelの状態遷移をユニットテストで検証できる
- [ ] Coroutines/Flowをテストできる（`runTest` / `TestDispatcher`）
- [ ] Hiltで依存関係をFakeに差し替えてテストできる
- [ ] Compose UIテストで主要導線（表示/入力/クリック）を守れる
- [ ] バグ修正に「回帰防止」を必ずセットで追加できる

**所要時間の目安：2〜3時間**

---

## どのテストを、どこまで書くべきか（現実解）

テストは「全部書く」のではなく、**壊れたら困るところ**を優先して守ります。

### 守る対象（優先度順）

1. 仕様の核（計算、判定、状態遷移）
2. 画面の主要導線（一覧→詳細、作成→保存など）
3. 失敗系（通信失敗、空状態、入力エラー）
4. 回帰しやすいバグ（再現が難しい/頻出）

### テストの使い分け（目安）

- **ユニットテスト（JVM）**：速い。ViewModel/UseCase/Mapper/Validatorを守る主力。
- **UIテスト（instrumentation）**：遅いが強い。主要画面の導線・表示を薄く守る。
- **結合テスト（instrumentation）**：RoomやHilt差し替え込みで実環境に近い確認。

---

## ユニットテスト：ViewModelを守る（最重要）

実務で一番コスパがいいのは、ViewModelのテストです。
UIは変わっても、**状態とイベントの契約**は残るためです。

### 基本方針

- 依存（Repositoryなど）はFakeにする（モックよりFake推奨）
- `StateFlow`の状態遷移を検証する
- `delay()`に依存しない（テストは決定的にする）

### Coroutines/Flowのテスト（必須）

実務では `Dispatchers.Main` を使うコードが多いので、テストではMainを差し替えます。

```kotlin
@get:Rule
val mainDispatcherRule = MainDispatcherRule()

@Test
fun addMemo_updatesUiState() = runTest {
    val repository = FakeMemoRepository()
    val viewModel = MemoViewModel(repository)

    viewModel.onTitleChange("買い物")
    viewModel.onContentChange("牛乳")
    viewModel.save()

    assertThat(viewModel.uiState.value.memos).hasSize(1)
}
```

`MainDispatcherRule` はプロジェクト側に用意します（一般的な実装例）。

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
class MainDispatcherRule(
    private val dispatcher: TestDispatcher = StandardTestDispatcher()
) : TestWatcher() {
    override fun starting(description: Description) {
        Dispatchers.setMain(dispatcher)
    }

    override fun finished(description: Description) {
        Dispatchers.resetMain()
    }
}
```

（前提）`kotlinx-coroutines-test` を `testImplementation` で追加しておきます。

---

## Hilt：依存を差し替えてテストする

Hiltを使うと、実務で必須になる「本番実装をFakeに差し替える」設計がしやすくなります。

### よくあるパターン

- `@UninstallModules` で本番Moduleを外す
- テスト用ModuleでFake実装を `@Binds` / `@Provides` する
- 画面（Activity/Composable）を起動してUIテスト

※ ここはプロジェクトの構成に依存するので、まずは「差し替えできる設計」に慣れることが目的です。

---

## Compose UIテスト：主要導線を薄く守る

Compose UIテストは、**“壊れやすいUI”を守る**というより、**“ユーザー導線が死んでない”**を確認する目的で使うと強いです。

### テストを安定させるコツ

- Text直指定に寄りすぎない（翻訳や文言変更で壊れる）
- `testTag` を使って要素を特定する
- 非同期は `Idling` に頼りすぎず、状態が落ち着く設計にする

```kotlin
composeTestRule
    .onNodeWithTag("memo_add_button")
    .performClick()

composeTestRule
    .onNodeWithTag("memo_title_input")
    .performTextInput("買い物")
```

---

## バグ修正の型（実務向け）

バグ修正は「直す」より先に、**守り方**を決めます。

1. 再現手順を書く（最短操作・端末/OS・発生頻度）
2. 原因の仮説を2〜3個立てる（ログ/スタックトレースから）
3. 修正方針を決める（影響範囲・リスク・代替案）
4. **回帰テストを追加する（可能なら）**
5. 修正 → テスト → PR説明（なぜ直るか）

---

## チェックリスト（PR前）

- [ ] 仕様の核にユニットテストを追加した
- [ ] 失敗系（エラー/空状態/入力エラー）を少なくとも1つ確認した
- [ ] 画面導線のUIテストを最低1本追加 or 既存を更新した
- [ ] テストが落ちた場合の原因が追える（ログ/スタックトレース）

---

## AIに聞いてみよう

### 質問テンプレ（コピペ）

```text
【前提】
この章を学習しています（この章のコンテキストは共有済み）。

【やりたいこと】
（例：テストを追加したい / flakyを直したい / Fakeの作り方が知りたい）

【今の状態】
- 該当コード：
- 守りたい仕様：
- テストの失敗ログ（あれば）：

【制約】
- 変えたくないこと：

【欲しい回答】
- 最低限のテスト案（3つ）
- 各テストの目的/守れるバグ
- 失敗したら疑うポイント
```

```text
【質問】
このViewModelをテストしやすくするための設計変更案を出して。
副作用（Snackbar、Navigation、ログ）をどう扱うべきかも含めて。
```

```text
【質問】
Coroutines/Flowのテストで flaky になりがちな原因と、
runTest + TestDispatcher で安定させる手順を教えて。
```

---

## 演習

- [ ] シンプルメモのViewModel（追加/編集/削除など）に、状態遷移のユニットテストを最低1本追加する
- [ ] 主要導線のCompose UIテストを最低1本追加する（例：追加画面の入力→保存）
- [ ] バグ修正チケットを1つ選び、回帰防止テスト（または二重送信ガード等）を入れる

---

## 課題提出

この章には提出課題があります。

1. 上記の演習を完了する
2. GitHub で `feature/12-testing` ブランチを作成し、PRを作成
3. [AI総合レビューツール](https://ai.studio/apps/drive/1AMqIqU4Bio4te7AWh5dly1Qzp7CesqP9?fullscreenApplet=true) でレビューを実行
4. 問題がなければ、スプレッドシートに **PR URL** と **完了日** を記入

---

## ふりかえり

- 今のアプリで「テストで守るべき核」はどこ？
- flakyになりそうなポイントは何？どう避ける？
- テストを書いてみて、設計の改善点は見つかった？

---

## 次の章

次は [パフォーマンスと最適化](./13-performance.md) に進み、計測→改善の基本を押さえましょう。
