# ナビゲーション

> 提出ブランチ：`feature/07-navigation`（PRのbase：`main`）

複数の画面を持つアプリには、画面間を移動する仕組みが必要です。
この章では、Jetpack ComposeのNavigationを学びます。

---

## 前提

- [Unit 3: ナビゲーションとアーキテクチャ（ガイド）](./03-unit3-guide.md) を読んでいる
- [Material Design 3とテーマ](./06-material-design.md) まで完了し、UIの骨格がある

## この章でできるようになること

- [ ] Navigation Composeの基本を理解する
- [ ] 複数の画面間を移動できる
- [ ] 引数を渡して画面遷移できる
- [ ] 戻る操作を実装できる
- [ ] BottomNavigationと連携できる

**所要時間の目安：2〜3時間**

---

## セットアップ

### 依存関係の追加

```kotlin
// build.gradle.kts (app)
dependencies {
    implementation("androidx.navigation:navigation-compose:<version>")
}
```

---

## Navigation Composeの基本

### 3つの主要コンポーネント

| コンポーネント | 役割 |
|----------------|------|
| **NavController** | ナビゲーションの状態を管理 |
| **NavHost** | 画面のコンテナ |
| **NavGraph** | 画面とルートの定義 |

### 基本構造

```kotlin
@Composable
fun MyApp() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = "home"  // 最初の画面
    ) {
        // 画面の定義
        composable("home") {
            HomeScreen(navController)
        }
        composable("detail") {
            DetailScreen(navController)
        }
    }
}
```

---

## 画面遷移の実装

### 基本的な画面遷移

```kotlin
// ルートの定義
object Routes {
    const val HOME = "home"
    const val DETAIL = "detail"
    const val SETTINGS = "settings"
}

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = Routes.HOME
    ) {
        composable(Routes.HOME) {
            HomeScreen(
                onNavigateToDetail = {
                    navController.navigate(Routes.DETAIL)
                }
            )
        }
        composable(Routes.DETAIL) {
            DetailScreen(
                onNavigateBack = {
                    navController.popBackStack()
                }
            )
        }
    }
}

@Composable
fun HomeScreen(onNavigateToDetail: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("ホーム画面", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = onNavigateToDetail) {
            Text("詳細へ")
        }
    }
}

@Composable
fun DetailScreen(onNavigateBack: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("詳細画面", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = onNavigateBack) {
            Text("戻る")
        }
    }
}
```

---

## 引数を渡す

### 文字列引数

```kotlin
// ルート定義
composable(
    route = "detail/{itemId}",
    arguments = listOf(navArgument("itemId") { type = NavType.StringType })
) { backStackEntry ->
    val itemId = backStackEntry.arguments?.getString("itemId")
    DetailScreen(itemId = itemId ?: "")
}

// 遷移時に引数を渡す
navController.navigate("detail/123")
```

### 数値引数

```kotlin
composable(
    route = "user/{userId}",
    arguments = listOf(navArgument("userId") { type = NavType.IntType })
) { backStackEntry ->
    val userId = backStackEntry.arguments?.getInt("userId") ?: 0
    UserScreen(userId = userId)
}

// 遷移
navController.navigate("user/42")
```

### オプショナル引数

```kotlin
composable(
    route = "search?query={query}",
    arguments = listOf(
        navArgument("query") {
            type = NavType.StringType
            defaultValue = ""  // デフォルト値
            nullable = true
        }
    )
) { backStackEntry ->
    val query = backStackEntry.arguments?.getString("query") ?: ""
    SearchScreen(initialQuery = query)
}

// 引数あり
navController.navigate("search?query=android")
// 引数なし（デフォルト値が使われる）
navController.navigate("search")
```

### 複数の引数

```kotlin
composable(
    route = "product/{categoryId}/{productId}",
    arguments = listOf(
        navArgument("categoryId") { type = NavType.IntType },
        navArgument("productId") { type = NavType.IntType }
    )
) { backStackEntry ->
    val categoryId = backStackEntry.arguments?.getInt("categoryId") ?: 0
    val productId = backStackEntry.arguments?.getInt("productId") ?: 0
    ProductScreen(categoryId = categoryId, productId = productId)
}

navController.navigate("product/1/100")
```

---

## Type-Safe Navigation（Kotlin 2.0+）

Kotlin 2.0以降では、型安全なナビゲーションが使えます。

### セットアップ

```kotlin
// build.gradle.kts
plugins {
    kotlin("plugin.serialization") version "<version>"
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:<version>")
}
```

### ルートの定義

```kotlin
@Serializable
object Home

@Serializable
data class Detail(val itemId: String)

@Serializable
data class User(val userId: Int)
```

### 使用例

```kotlin
NavHost(
    navController = navController,
    startDestination = Home
) {
    composable<Home> {
        HomeScreen(
            onNavigateToDetail = { id ->
                navController.navigate(Detail(itemId = id))
            }
        )
    }
    composable<Detail> { backStackEntry ->
        val detail: Detail = backStackEntry.toRoute()
        DetailScreen(itemId = detail.itemId)
    }
}
```

---

## バックスタックの操作

### 戻る

```kotlin
// 1つ前の画面に戻る
navController.popBackStack()

// 特定の画面まで戻る
navController.popBackStack(
    route = Routes.HOME,
    inclusive = false  // HOMEは残す
)
```

### 履歴をクリアして遷移

```kotlin
// ログイン後にホームへ遷移（ログイン画面を履歴から削除）
navController.navigate(Routes.HOME) {
    popUpTo(Routes.LOGIN) { inclusive = true }
}

// ホームに戻る（途中の画面を全部削除）
navController.navigate(Routes.HOME) {
    popUpTo(Routes.HOME) { inclusive = true }
}
```

### シングルトップ

同じ画面を重複して開かない：

```kotlin
navController.navigate(Routes.HOME) {
    launchSingleTop = true
}
```

---

## BottomNavigationとの連携

```kotlin
@Composable
fun MainScreen() {
    val navController = rememberNavController()

    Scaffold(
        bottomBar = {
            NavigationBar {
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route

                listOf(
                    BottomNavItem("home", "ホーム", Icons.Default.Home),
                    BottomNavItem("search", "検索", Icons.Default.Search),
                    BottomNavItem("profile", "プロフィール", Icons.Default.Person)
                ).forEach { item ->
                    NavigationBarItem(
                        icon = { Icon(item.icon, contentDescription = item.label) },
                        label = { Text(item.label) },
                        selected = currentRoute == item.route,
                        onClick = {
                            navController.navigate(item.route) {
                                // バックスタックを整理
                                popUpTo(navController.graph.startDestinationId) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(paddingValues)
        ) {
            composable("home") { HomeScreen() }
            composable("search") { SearchScreen() }
            composable("profile") { ProfileScreen() }
        }
    }
}

data class BottomNavItem(
    val route: String,
    val label: String,
    val icon: ImageVector
)
```

---

## ネストされたナビゲーション

タブごとに独立した画面スタックを持つ場合：

```kotlin
NavHost(
    navController = navController,
    startDestination = "home_graph"
) {
    // ホームタブのグラフ
    navigation(
        startDestination = "home",
        route = "home_graph"
    ) {
        composable("home") { HomeScreen(navController) }
        composable("home_detail/{id}") { DetailScreen(navController) }
    }

    // 検索タブのグラフ
    navigation(
        startDestination = "search",
        route = "search_graph"
    ) {
        composable("search") { SearchScreen(navController) }
        composable("search_result/{query}") { ResultScreen(navController) }
    }
}
```

---

## ディープリンク

外部からアプリの特定画面を開く：

### AndroidManifest.xml

```xml
<activity android:name=".MainActivity">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="myapp"
            android:host="detail" />
    </intent-filter>
</activity>
```

### Composeでの設定

```kotlin
composable(
    route = "detail/{itemId}",
    arguments = listOf(navArgument("itemId") { type = NavType.StringType }),
    deepLinks = listOf(
        navDeepLink { uriPattern = "myapp://detail/{itemId}" }
    )
) { backStackEntry ->
    val itemId = backStackEntry.arguments?.getString("itemId")
    DetailScreen(itemId = itemId ?: "")
}
```

---

## 実践：マルチ画面アプリ

```kotlin
sealed class Screen(val route: String) {
    object TaskList : Screen("task_list")
    object TaskDetail : Screen("task_detail/{taskId}") {
        fun createRoute(taskId: Int) = "task_detail/$taskId"
    }
    object AddTask : Screen("add_task")
}

@Composable
fun TaskApp() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = Screen.TaskList.route
    ) {
        composable(Screen.TaskList.route) {
            TaskListScreen(
                onTaskClick = { taskId ->
                    navController.navigate(Screen.TaskDetail.createRoute(taskId))
                },
                onAddClick = {
                    navController.navigate(Screen.AddTask.route)
                }
            )
        }

        composable(
            route = Screen.TaskDetail.route,
            arguments = listOf(navArgument("taskId") { type = NavType.IntType })
        ) { backStackEntry ->
            val taskId = backStackEntry.arguments?.getInt("taskId") ?: 0
            TaskDetailScreen(
                taskId = taskId,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.AddTask.route) {
            AddTaskScreen(
                onTaskAdded = { navController.popBackStack() },
                onCancel = { navController.popBackStack() }
            )
        }
    }
}
```

---

## AIに聞いてみよう

### 質問テンプレ（コピペ）

```text
【前提】
この章を学習しています（この章のコンテキストは共有済み）。

【やりたいこと】
（例：演習を完成させたい / エラーを直したい / もっと良い書き方にしたい）

【今の状態】
- 該当コード：
- エラー/ログ：
- 期待する挙動：

【制約】
- 変えたくないこと：

【欲しい回答】
- 結論（何を変えるか）
- 手順（最短）
- 理由
- 確認ポイント（動作確認/テスト）
```

### 質問例

```text
【質問】
Navigation Composeで、
ログイン画面→ホーム画面に遷移した後、
戻るボタンでログイン画面に戻らないようにしたい。
どうすればいい？
```

```text
【質問】
BottomNavigationでタブを切り替えても、
各タブの画面状態を保持したい。
どうやって実装する？
```

---

## 演習

- [ ] シンプルメモアプリに「一覧 → 作成/編集」遷移を入れる（戻るも含む）
- [ ] 引数（メモID等）を渡し、詳細/編集で表示内容が変わるようにする
- [ ] 戻るボタンの挙動が期待どおりか確認する（戻り先、戻れないパターン）

---

## チェックリスト

- [ ] NavHostとNavControllerを設定できる
- [ ] composable()で画面を定義できる
- [ ] navigate()で画面遷移できる
- [ ] 引数を渡して遷移できる
- [ ] popBackStack()で戻れる
- [ ] BottomNavigationと連携できる

---

## まとめ

この章では以下を学びました：

1. **Navigation Compose** - 画面遷移のライブラリ
2. **NavHost/NavController** - ナビゲーションの基本
3. **引数** - 画面間でデータを渡す
4. **バックスタック** - 履歴の管理
5. **BottomNavigation連携** - タブナビゲーション

次の章ではアプリのアーキテクチャを学びます。

---

## 課題提出

この章には提出課題があります。

1. 上記の演習を完了する
2. GitHub で `feature/07-navigation` ブランチを作成し、PRを作成
3. [AI総合レビューツール](https://ai.studio/apps/drive/1AMqIqU4Bio4te7AWh5dly1Qzp7CesqP9?fullscreenApplet=true) でレビューを実行
4. 問題がなければ、スプレッドシートに **PR URL** と **完了日** を記入

---

## ふりかえり

- 画面遷移に「引数でIDを渡す」設計のメリットは？
- BackStackで事故が起きやすいポイントはどこ？
- シンプルメモに必要な画面は何枚？遷移図を描けそう？

---

## 次の章

次は [ViewModelとアーキテクチャ](./08-architecture.md) に進み、ViewModel/Repositoryで設計を固めましょう。
