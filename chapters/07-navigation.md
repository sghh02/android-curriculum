# 画面遷移（Navigation）

Composeでは **Navigation Compose** を使って画面遷移を管理します。

## 目標
- Navigationの基本構造を理解する
- 画面間の引数受け渡しができる

## 基本例
```kotlin
val navController = rememberNavController()
NavHost(navController, startDestination = "home") {
    composable("home") { HomeScreen(onDetail = { id ->
        navController.navigate("detail/$id")
    }) }
    composable("detail/{id}") { backStackEntry ->
        val id = backStackEntry.arguments?.getString("id")
        DetailScreen(id)
    }
}
```

## ミニ課題
- ホーム → 詳細画面への遷移を実装
- 引数で渡した値を画面に表示

---

次章では、アプリの設計（アーキテクチャ）を学びます。
