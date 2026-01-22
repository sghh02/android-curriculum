# Gradleと依存関係管理（実務編）

2年目の現場では「機能開発」だけでなく、**依存関係追加・更新・ビルドエラー対応**が普通に降ってきます。
この章では、Compose/Hilt/RESTを前提に、Gradle周りで困らないための実務ポイントを整理します。

---

## この章の目標

- [ ] `build.gradle.kts` の役割（プロジェクト/モジュール）を説明できる
- [ ] ライブラリ追加（Retrofit/Room/Hilt等）を迷わずできる
- [ ] バージョン衝突やKSP周りのエラーを切り分けできる
- [ ] Debug/Releaseで挙動が変わる理由（minify/署名）を理解する
- [ ] マルチモジュール化に向けた依存関係の整理ができる

**所要時間の目安：2〜3時間**

---

## まず押さえる：Gradleの構造

### プロジェクト（root）

- 依存関係の解決ルール（repositories）
- プラグインのバージョン
- モジュール共通の設定（必要なら）

### モジュール（app / feature / core）

- Android設定（compileSdk/minSdk/targetSdk）
- buildTypes / productFlavors
- dependencies（実装に必要なライブラリ）

---

## ライブラリを追加するときの手順（事故らない版）

1. **何の層で使うか**を決める（UI/VM/Data など）
2. 追加先のモジュールを決める（appに寄せすぎない）
3. 依存の追加（Compose BOM、KSP、Hilt等は形式に注意）
4. Sync → ビルド → 実行
5. 使い方の最小コードを書いて動作確認

---

## 実例：Hilt（DI）の追加で見るべきポイント

Hiltは「プラグイン + 依存 + KSP/Compiler」の3点セットです。

```kotlin
// build.gradle.kts（app or 該当モジュール）
plugins {
    id("com.google.dagger.hilt.android")
    id("com.google.devtools.ksp")
}

dependencies {
    implementation("com.google.dagger:hilt-android:<version>")
    ksp("com.google.dagger:hilt-compiler:<version>")
    implementation("androidx.hilt:hilt-navigation-compose:<version>")
}
```

典型的な失敗：

- pluginだけ入れて依存がない
- `kapt` と `ksp` を混ぜて迷子になる（プロジェクト方針を統一する）

---

## 実例：Compose BOM（バージョンを揃える）

Compose周りのバージョンは揃えないと壊れやすいので、BOMで管理するのが楽です。

```kotlin
dependencies {
    implementation(platform("androidx.compose:compose-bom:<version>"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    debugImplementation("androidx.compose.ui:ui-tooling")
}
```

---

## 依存ツリーとビルドログ（切り分けに必須）

### 依存ツリーを見る

```bash
./gradlew :app:dependencies --configuration debugRuntimeClasspath
```

### 詳細ログで原因を掘る

```bash
./gradlew assembleDebug --stacktrace --info
```

「どの依存が引っ張られてきたか」「どこで失敗しているか」を、ログから説明できるようになると強いです。

---

## よくあるつまずき

### KSP（Room / Hilt）関連

- `ksp(...)` の追加漏れ
- Kotlin/AGP/KSPのバージョン組み合わせ不整合
- 生成物が見えない（Gradle Syncが通っていない）

### バージョン衝突

症状：

- 「同じクラスが複数ある」「解決できない」系のエラー

対処の型：

1. 直近で追加/更新した依存を特定
2. BOMを使って揃える（Compose/OkHttpなど）
3. 依存ツリーを確認して根本を揃える

---

## buildTypes / flavors（実務で効く）

よくある用途：

- 開発/検証/本番でAPIの向き先を変える
- `debug` だけログやデバッグメニューを有効にする

注意：

- 秘密情報（APIキー等）をコードに直書きしない
- Releaseでだけ壊れる（R8）問題があるので、早めにReleaseビルドも確認する

---

## マルチモジュール化の前にやる整理

単一モジュールのままでも、以下を揃えると後で分割が楽になります。

- 依存の置き場所を決める（UIにDataの依存を入れない等）
- パッケージ/命名を整える（`feature`/`core` などの単位）
- 「境界」を明確にする（interfaceで依存方向を固定する）

---

## ミニ課題

- Retrofit/Room/Hiltの依存を「どのモジュールに置くべきか」を説明できるようにする
- 依存追加でビルドが壊れた想定で、原因候補と切り分け手順を3つ書く

---

## AIに聞いてみよう

```
【質問】
この依存関係の追加でビルドが壊れた。
考えられる原因と、確認すべきGradle設定（KSP/Hilt/BOMなど）を順番に教えて。
```
