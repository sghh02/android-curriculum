# ネットワーク通信（Retrofit）

API通信には **Retrofit + OkHttp** がよく使われます。

## 目標
- Retrofitの基本構成を理解する
- JSONをデータクラスに変換できる

## 基本構成
```kotlin
interface ApiService {
    @GET("/items")
    suspend fun getItems(): List<Item>
}

val retrofit = Retrofit.Builder()
    .baseUrl("https://example.com")
    .addConverterFactory(MoshiConverterFactory.create())
    .build()
```

## エラーハンドリング
- `try/catch` ではなく **Result型** や **sealed class** で結果を表現する
- ローディング / 成功 / 失敗のUIを分ける

## ミニ課題
- JSONPlaceholderのAPIを取得する
- 取得結果をリスト表示する

---

次章では、データの保存（ローカルストレージ）を学びます。
