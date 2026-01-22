# 設定とセキュリティ（秘密情報/通信）

実務では「動く」より「漏れない」「事故らない」が重要な領域があります。
この章では、Compose/Hilt/RESTを前提に、2年目として最低限押さえる設定・セキュリティの考え方をまとめます。

---

## この章の目標

- [ ] 秘密情報（APIキー/トークン）を安全に扱う方針を説明できる
- [ ] Debug/Releaseでログや設定を切り替える設計ができる
- [ ] HTTPS/証明書/ネットワークログの扱いで事故らない
- [ ] 権限（permission）を最小限に保つ意識を持てる

**所要時間の目安：1〜2時間**

---

## 秘密情報は「コードに置かない」

やってはいけない例：

- APIキーをKotlinファイルに直書き
- トークンをログに出す

最低限の方針例：

- `local.properties` / 環境変数 / CIのSecrets から注入する
- リポジトリにコミットしない
- 盗まれて困るものは端末内でも平文で持たない（必要ならKeystore系を検討）

---

## 設定の注入（Debug/Releaseで切り替える）

実務では、環境ごとに設定を変えることがよくあります（APIの向き先、ログ、機能フラグ等）。

例：`BuildConfig` に `BASE_URL` を注入する（概念）

```kotlin
// build.gradle.kts（例）
android {
    buildTypes {
        debug {
            buildConfigField("String", "BASE_URL", "\"https://api-stg.example.com/\"")
        }
        release {
            buildConfigField("String", "BASE_URL", "\"https://api.example.com/\"")
        }
    }
}
```

※ 実務ではURL/キーを直書きせず、`local.properties` やCIのSecretsから注入する形が一般的です。

---

## ネットワークの安全性（最低限）

- 基本はHTTPS
- デバッグログ（OkHttp Logging等）はDebug限定にする
- エラー時に個人情報を含むレスポンスをログに残さない

### Debug限定でネットワークログを出す（例）

```kotlin
val client = OkHttpClient.Builder().apply {
    if (BuildConfig.DEBUG) {
        addInterceptor(HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BASIC
        })
    }
}.build()
```

ポイント：

- 本番で詳細ログ（BODY）は基本NG（漏えいリスク）
- 認証トークンや個人情報はログに出さない

---

## 権限とプライバシー

- 権限は「必要になってから」追加する
- 使わない権限は削除する（リリース前チェック）
- ユーザーにとっての説明（なぜ必要か）を用意する

---

## ミニ課題

- Debugでだけネットワークログを有効化する設計を考える
- 「ログに出してはいけない情報」を列挙する（例：トークン、メール、住所）
- アプリで必要な権限を洗い出し、不要なものが無いか確認する

---

## AIに聞いてみよう

```
【質問】
Androidアプリで秘密情報を扱うときの基本方針を、
学習用プロジェクトと実務プロジェクトの違いも含めて整理して。
```
