# WorkManager（バックグラウンド処理）

案件では「バックグラウンドで同期したい」「定期実行したい」「失敗したらリトライしたい」がよく出ます。
WorkManagerは、Androidで“条件付きの確実な実行”を担う標準的な選択肢です。

---

## 前提

- [画面サイズ対応（スマホ/タブレット）](chapters/21-adaptive-ui.md) を完了し、発展要件の進め方がわかる

## この章でできるようになること

- [ ] WorkManagerを使うべきケース/使わないケースを説明できる
- [ ] OneTime / Periodic の使い分けができる
- [ ] 制約（ネットワーク/充電など）を設定できる
- [ ] 重複実行を防ぐ（UniqueWork）設計ができる
- [ ] Hiltと組み合わせた設計方針を理解する

**所要時間の目安：1.5〜2.5時間**

---

## いつWorkManagerを使う？

使う：

- アプリが終了しても実行したい
- ネットワークが繋がったら実行したい
- 失敗時に自動でリトライしたい
- 定期実行したい

使わない（別手段を検討）：

- 画面が開いている間だけの処理（通常のCoroutineで十分）
- すぐ終わる軽い処理（過剰になりがち）

---

## 基本：OneTimeWorkRequest

用途例：

- アップロード/同期
- 期限切れデータの掃除

設計のコツ：

- Workerは薄くする（UseCase/Repositoryに委譲する）
- 失敗時の結果（retry/failure）をはっきり返す

---

## セットアップ（依存関係）

プロジェクト側（Androidアプリ）では、WorkManagerの依存を追加します。

```kotlin
// build.gradle.kts（例）
dependencies {
    implementation("androidx.work:work-runtime-ktx:<version>")
}
```

HiltでWorkerに依存注入したい場合は、WorkManager連携も追加します（プロジェクト構成により差分あり）。

---

## 実装の全体像（おすすめ）

1. 「同期したい処理」をUseCase/Repositoryとして切り出す
2. WorkerはUseCase/Repositoryを呼ぶだけにする（薄く）
3. WorkRequestを作る（制約、リトライ、タグ）
4. UniqueWorkで多重起動を防ぐ
5. 実行状況をUIに出す（必要なら）

---

## Worker実装（CoroutineWorker）

Workerは「一回実行して終わる」部品です。UIの状態管理はしません。

```kotlin
class BackupWorker(
    appContext: Context,
    params: WorkerParameters,
    private val repository: BackupRepository,
) : CoroutineWorker(appContext, params) {

    override suspend fun doWork(): Result {
        return runCatching {
            repository.backup()
        }.fold(
            onSuccess = { Result.success() },
            onFailure = { Result.retry() }
        )
    }
}
```

実務のポイント：

- **冪等性（何度走っても壊れない）**を意識する
- リトライするべき失敗（ネットワーク）と、失敗で終わるべきもの（入力不正）を分ける

---

## リクエスト作成（制約・バックオフ）

```kotlin
val constraints = Constraints.Builder()
    .setRequiredNetworkType(NetworkType.CONNECTED)
    .build()

val request = OneTimeWorkRequestBuilder<BackupWorker>()
    .setConstraints(constraints)
    .setBackoffCriteria(
        BackoffPolicy.EXPONENTIAL,
        10,
        TimeUnit.SECONDS
    )
    .addTag("memo_backup")
    .build()
```

---

## 重複実行を防ぐ（UniqueWork）

「同じ同期が多重に走る」は実務の事故ポイントです。

- 例：アプリ起動時に同期、画面でも同期、通知でも同期 → 3回走る
- 対策：ユニーク名で一本化し、`KEEP`/`REPLACE` を選ぶ

```kotlin
WorkManager.getInstance(context).enqueueUniqueWork(
    "memo_backup",
    ExistingWorkPolicy.KEEP,
    request
)
```

使い分けの目安：

- `KEEP`：すでに走っているなら新規を捨てる（多重起動を止めたい）
- `REPLACE`：新しいリクエストで上書きする（設定変更を反映したい）

---

## Periodic（定期実行）

「毎日深夜に掃除」「数時間ごとに同期」などはPeriodicを検討します。

- 端末都合で時間は前後する（厳密な時刻実行ではない）
- 最小間隔などの制約がある

---

## よくあるハマりどころ

- 制約（ネットワーク/充電）が満たされず、実行されない
- “すぐ実行” を期待していたが、OS最適化で遅れる
- 同じWorkが多重に走って二重送信（UniqueWorkで防ぐ）

---

## 演習

シンプルメモアプリを想定し、以下を設計してください。

- ネットワーク接続時だけ「バックアップ同期」を実行する
- 失敗したら指数バックオフでリトライする
- 同期は多重起動しない（UniqueWork）

### 追加（発展）

- 同期の成功/失敗をUIに表示できるようにする（状態設計）
- 手動実行（ユーザー操作）と自動実行（起動時）を同じUniqueWorkにまとめる

---

## AIに聞いてみよう

### 質問テンプレ（コピペ）

```text
【前提】
この章を学習しています（この章のコンテキストは共有済み）。

【やりたいこと】
（例：バックグラウンド処理を入れたい / リトライ条件を決めたい）

【今の状態】
- やりたい処理：
- 制約（ネットワーク/充電など）：
- エラー/ログ（あれば）：

【欲しい回答】
- 最小の実装例
- 失敗時の設計（リトライ/UniqueWork）
- 確認ポイント（端末依存/Dozeなど）
```

```text
【質問】
WorkManagerで同期処理を作りたい。
Workerを薄く保つ設計、リトライ戦略、重複防止（UniqueWork）の方針を提案して。
```

---

## ふりかえり

- WorkManagerが向いている処理/向いていない処理は何？
- 制約とUniqueWorkは、どんな事故を防ぐ？
- リトライ設計で一番気をつけたいことは？

---

## 次の章

次は [ComposeとViewの相互運用](chapters/23-compose-view-interop.md) に進み、ComposeとViewの相互運用を押さえましょう。
