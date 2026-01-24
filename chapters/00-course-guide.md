# コースガイド：6ヶ月でAndroid開発（Compose）を学ぶ

このコースは、**完全初心者が「自分で調べて実装し、壊さずに直せる」状態**になることをゴールにしています。UIはJetpack Compose中心で進め、題材は「シンプルメモ」アプリです。

---

## 前提

- PC（Windows/macOS/Linuxいずれか）と、学習に使う時間（目安：週6時間 × 24週）
- Android Studioをインストールできる権限（会社PCの場合は要確認）

## この章でできるようになること

- 6ヶ月（24週）の学習ペースと、各週の「やること」を決められる
- 学習の成果物（PR/スクショ/テスト）を“証拠”として残す運用ができる
- 迷ったときに参照する「基準（Definition of Done）」を持てる

---

## 6ヶ月の到達目標（最終成果物）

最終的に、以下が揃った状態を目指します。

- Composeで、一覧・詳細（作成/編集）を含むアプリを実装できる
- Coroutines/Flowで非同期処理を扱い、ネットワーク/DBをRepositoryに隠蔽できる
- 失敗系（Loading/Empty/Error/Retry）を設計し、デバッグで原因を切り分けられる
- 最低限のテスト（ユニット/Compose UI）で回帰を防げる
- Releaseビルド〜公開手順を理解し、PRで説明できる

---

## 学習の進め方（毎週の型）

毎週、次の型で進めると伸びが安定します。

1. **読む（30〜60分）**：章の「できるようになること」を先に確認
2. **手を動かす（2〜4時間）**：シンプルメモアプリに反映（コミットを小さく）
3. **動作確認（30分）**：チェックポイントを埋める（スクショ/ログを残す）
4. **ふりかえり（10分）**：詰まった点と解決策をメモ（次に効く）

---

## 週6時間の運用（標準）

週6時間は「2時間 × 3回」にすると継続しやすいです（例：平日2回 + 週末1回）。

### 1週間の時間配分（目安）

| 時間 | やること | 成果物 |
|---:|---|---|
| 1.0h | 読む（該当レッスン + 用語確認） | 不明点メモ（3つ） |
| 3.5h | 実装（シンプルメモに反映） | 小さなコミットを積む |
| 1.0h | 動作確認（チェックリスト） | スクショ1枚 + 確認手順 |
| 0.5h | 仕上げ（PR/ふりかえり） | PR 1本 + ふりかえり3行 |

### 毎週のDefinition of Done（DoD）

- [ ] PRを1本作る（小さくてOK）
- [ ] 主要導線のスクショを1枚残す
- [ ] 章末チェックリストを埋める（埋められない項目は理由を書く）
- [ ] ふりかえりを3行書く（詰まった点/原因/次にやること）
- [ ] 2週に1本はテストを増やす（状態遷移から）

### バッファ週（追いつき週）を作る

週6時間でも、**遅れる前提**で設計すると完走率が上がります。

- おすすめ：Week 4 / 8 / 12 / 16 / 20 / 24 を「バッファ週」にする
- 使い道：遅れの解消、復習、演習の深掘り、`chapters/27-ticket-backlog.md` のSチケットを1つ

---

## 24週プラン（目安）

ペースは固定ではありません。忙しい週は「読むだけ」、余裕がある週は「演習を厚く」で調整してください（週6時間の場合、上のバッファ週を前提にすると安定します）。

### Month 1（Week 1〜4）：環境構築と基礎

- Week 1：`chapters/00-course-guide.md` / `chapters/00-roadmap.md` / `chapters/00-ai-learning.md` / `chapters/00-glossary.md` / `chapters/01-unit1-guide.md` / `chapters/01-setup.md`
- Week 2：`chapters/02-kotlin-basics.md`（前半）+ 演習
- Week 3：`chapters/02-kotlin-basics.md`（後半）/ `chapters/02-oop-fundamentals.md`（前半）
- Week 4（バッファ）：`chapters/02-oop-fundamentals.md`（後半）/ `chapters/03-android-fundamentals.md` / 追いつき

### Month 2（Week 5〜8）：ComposeでUIを作る

- Week 5：`chapters/03-compose-basics.md` / `chapters/04-project-start.md`
- Week 6：`chapters/02-unit2-guide.md` / `chapters/04-state-interaction.md`
- Week 7：`chapters/05-lists-lazycolumn.md` / `chapters/06-material-design.md`
- Week 8（バッファ）：`chapters/03-unit3-guide.md` / `chapters/07-navigation.md` / 追いつき（UI/遷移の整理）

### Month 3（Week 9〜12）：アーキテクチャと非同期・通信

- Week 9：`chapters/08-architecture.md`
- Week 10：`chapters/04-unit4-guide.md` / `chapters/09-data-layer.md`
- Week 11：`chapters/10-network.md`
- Week 12（バッファ）：ここまでの総復習 + `chapters/27-ticket-backlog.md` からSチケットを1つ

### Month 4（Week 13〜16）：永続化と品質

- Week 13：`chapters/05-unit5-guide.md` / `chapters/11-storage.md`
- Week 14：`chapters/06-unit6-guide.md` / `chapters/12-testing.md`
- Week 15：`chapters/13-performance.md`
- Week 16（バッファ）：`chapters/14-publishing.md` + Release確認 + Sチケットを1つ

### Month 5（Week 17〜20）：実務の進め方とリリース

- Week 17：`chapters/07-unit7-guide.md` / `chapters/15-project.md`（仕上げ）
- Week 18：`chapters/08-unit8-guide.md` / `chapters/26-onboarding.md` / `chapters/16-debugging.md`
- Week 19：`chapters/17-team-development.md` / `chapters/18-ci.md` / `chapters/09-unit9-guide.md`
- Week 20（バッファ）：`chapters/19-gradle.md` / 追いつき

### Month 6（Week 21〜24）：発展要件 + 総合演習

- Week 21：`chapters/20-multi-module.md`
- Week 22：`chapters/10-unit10-guide.md` / `chapters/21-adaptive-ui.md`
- Week 23：`chapters/22-workmanager.md` / `chapters/23-compose-view-interop.md`
- Week 24（バッファ）：`chapters/24-accessibility-i18n.md` / `chapters/25-security-config.md` / `chapters/11-unit11-guide.md` / `chapters/27-ticket-backlog.md`（チケットを回す）/ 卒業チェック更新

---

## 演習

### 演習1：学習リポジトリを用意する

- [ ] `SimpleMemo`（学習用）をGitで管理する（Private推奨）
- [ ] PRテンプレ（目的/変更内容/スクショ/テスト/リスク）を用意する

### 演習2：毎週の成果物の定義を決める

- [ ] 週1回はPRを出す（小さくてOK）
- [ ] 週1枚はスクショを残す（主要導線）
- [ ] 2週に1本はテストを増やす（状態遷移から）

---

## AIに聞いてみよう

### 質問テンプレ（コピペ）

```text
【前提】
週6時間でこのコースを進めています（この章のコンテキストは共有済み）。

【やりたいこと】
（例：今週のタスクを決めたい / 遅れを取り戻したい / DoDを満たせない）

【今の状態】
- 今週使える時間：
- どこまで終わったか（読了/実装/PR）：
- 詰まっている点：

【欲しい回答】
- 最小タスク（今週やること）
- 余裕があればやるタスク
- 成果物（PR/スクショ/テスト）のセット
```

### 質問例

```text
【質問】
週6時間（2h×3回）で回したい。
今週の「読む/実装/動作確認/ふりかえり」を、各回2時間のメニューに分けて提案して。
```

```text
【質問】
2週間遅れてしまった。何を削らず、何を薄くするべき？
バッファ週の使い方も含めて、リカバリプランを作って。
```

```text
【レビュー】
このPR説明文を、目的/変更内容/スクショ/テスト結果/リスクの形に整えて。
（ここにPR本文を貼る）
```

---

## ふりかえり

- 週6時間を「いつ」「何回」に分けると継続できそう？
- 「読むだけ」で終わらせないために、毎週残す成果物は何にする？
- 6ヶ月後、どんなアプリが作れたら嬉しい？

---

## 次の章

次は `chapters/00-roadmap.md` を読んで、到達基準（チェックリスト）を把握しましょう。
