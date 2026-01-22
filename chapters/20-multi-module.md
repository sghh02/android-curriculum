# マルチモジュール設計（単一→分割）

案件によっては、単一モジュールでも十分です。一方で規模が上がると、ビルド時間・責務の混在・レビューの辛さが目立ってきます。
この章では、**Compose + Hilt + REST**を前提に、単一からマルチモジュールへ移行するための考え方と進め方を整理します。

---

## この章の目標

- [ ] 「なぜ分割するのか」を、ビジネスと技術の両面で説明できる
- [ ] モジュールの分け方（feature/core/data等）の代表パターンを理解する
- [ ] 依存関係の方向（依存グラフ）を設計できる
- [ ] Hiltをマルチモジュールで使うときの注意点がわかる
- [ ] 既存単一モジュールを段階的に分割する計画を作れる

**所要時間の目安：2〜3.5時間**

---

## 分割の判断基準（いつやる？）

分割はコストもあります。以下が揃ったら検討します。

- 機能が増え、変更が衝突しやすい
- ビルドが遅く、開発効率が落ちている
- 依存関係がスパゲッティ化している（どこからでもどこでも呼べる）
- チームが増え、責務境界が必要になった

---

## 代表的な分け方（現場で多い）

### 1) feature + core（おすすめ）

- `:app`：エントリポイント（Application、Navigationの配線など）
- `:core:ui`：テーマ、共通UI、デザインシステム
- `:core:data`：ネットワーク/DB/Repositoryの共通
- `:feature:memo`：メモ機能（UI/VM/UseCaseなど）

**ポイント**：feature同士が直接依存しないようにすると事故が減ります。

### 2) clean寄り（domainを分ける）

- `:core:domain`：UseCase / Entity / interface
- `:core:data`：domain interface の実装（API/DB）

規模が上がったときに効きますが、小規模だと過剰になりがちです。

---

## 依存グラフのルール（超重要）

最低限のルールを決めると、メンテが楽になります。

- `feature` → `core` には依存してよい
- `core` → `feature` には依存しない
- `ui` は `data` を直接触らない（ViewModel/UseCase越しにする）

---

## Hiltをマルチモジュールで使うときの要点

- `@HiltAndroidApp` は基本的に `:app` に置く
- Moduleは、提供する依存の「責務」に応じて配置する（data層の提供はdata側）
- `@InstallIn(SingletonComponent::class)` を軸に、スコープの粒度を崩さない

テストで差し替える前提なら、interface（domain）と実装（data）を分けると楽になります。

---

## 段階移行の進め方（おすすめ）

いきなり全部を移すと壊れます。小さく進めます。

1. `:core:ui` を作り、テーマ/共通Composableを移す
2. `:core:data` を作り、API/DB/Repositoryを移す
3. `:feature:memo` を作り、画面単位で移す
4. `:app` は配線（Navigation/DI/起動）に寄せる

---

## 実装の最小手順（例）

### 1) settings にモジュールを追加

```kotlin
// settings.gradle.kts（例）
include(":app")
include(":core:ui")
include(":core:data")
include(":feature:memo")
```

### 2) 依存関係を配線

```kotlin
// feature 側の build.gradle.kts（例）
dependencies {
    implementation(project(":core:ui"))
    implementation(project(":core:data"))
}
```

### 3) 移動は「動く単位」で

- まず `Theme` や共通UIを `core:ui` に移す
- 次に `Api/Dao/Repository` を `core:data` に移す
- 最後に画面（feature）を移す

「移動したらビルドして動作確認」をセットにします（まとめて移すと壊れたときに戻れません）。

---

## 実務Tips（レビューで見られる）

- `app` が肥大化していないか（配線に寄せる）
- `feature` が勝手に `data` の詳細を触っていないか（境界が守れているか）
- 依存グラフが循環していないか（feature→feature になっていないか）

---

## ミニ課題（設計）

シンプルメモアプリを想定し、以下を作ってください。

- モジュール構成案（`app/core/feature`）
- 依存グラフ（どこがどこに依存するか）
- Hilt Module の配置方針（どこで何を提供するか）
- 「最初に切り出すもの」と、その理由

---

## AIに聞いてみよう

```
【質問】
単一モジュールのComposeアプリを、feature/core構成でマルチモジュール化したい。
分割案、依存グラフ、HiltのModule配置、段階移行の手順を提案して。
```
