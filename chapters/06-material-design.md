# Material Design 3とテーマ

Material Design 3（Material You）は、Googleの最新デザインシステムです。
この章では、美しく一貫性のあるUIを作る方法を学びます。

---

## この章の目標

- [ ] Material Design 3の概念を理解する
- [ ] テーマとカラースキームを設定できる
- [ ] Typographyでテキストスタイルを統一できる
- [ ] Material 3コンポーネントを使いこなせる
- [ ] ダークモードに対応できる

**所要時間の目安：2時間**

---

## Material Design 3とは

Material Design 3（MD3/Material You）は、2021年にGoogleが発表した最新のデザインシステムです。

### 主な特徴

| 特徴 | 説明 |
|------|------|
| **Dynamic Color** | 壁紙からカラーを自動生成 |
| **柔らかい形状** | より丸みを帯びたデザイン |
| **大きなタッチターゲット** | 押しやすいボタン |
| **表現力豊かなアニメーション** | 自然な動き |

### Jetpack Composeでの使用

```kotlin
// build.gradle.kts
dependencies {
    implementation("androidx.compose.material3:material3:1.2.0")
}
```

```kotlin
import androidx.compose.material3.*
// material（M2）ではなく material3 を使う
```

---

## テーマの基本構造

### MaterialThemeの設定

```kotlin
@Composable
fun MyApp() {
    MaterialTheme(
        colorScheme = lightColorScheme(),  // カラー
        typography = Typography(),          // フォント
        shapes = Shapes()                   // 形状
    ) {
        // アプリのコンテンツ
        Surface {
            MainScreen()
        }
    }
}
```

### プロジェクト生成時のテーマ

Android Studioでプロジェクトを作ると、`ui/theme/`フォルダに以下が生成されます：

```
ui/theme/
├── Color.kt      // カラー定義
├── Theme.kt      // テーマ設定
└── Type.kt       // Typography設定
```

---

## カラースキーム

### Material 3のカラーロール

```kotlin
// 主要な色
colorScheme.primary           // 主要なアクション
colorScheme.onPrimary         // primary上のテキスト/アイコン
colorScheme.primaryContainer  // 主要な背景
colorScheme.onPrimaryContainer

// セカンダリ
colorScheme.secondary
colorScheme.onSecondary
colorScheme.secondaryContainer
colorScheme.onSecondaryContainer

// 背景とサーフェス
colorScheme.background        // 画面背景
colorScheme.onBackground      // 背景上のテキスト
colorScheme.surface           // カードなどの表面
colorScheme.onSurface         // surface上のテキスト
colorScheme.surfaceVariant    // 代替サーフェス

// エラー
colorScheme.error
colorScheme.onError
```

### カスタムカラースキームの定義

```kotlin
// Color.kt
val Purple80 = Color(0xFFD0BCFF)
val PurpleGrey80 = Color(0xFFCCC2DC)
val Pink80 = Color(0xFFEFB8C8)

val Purple40 = Color(0xFF6650a4)
val PurpleGrey40 = Color(0xFF625b71)
val Pink40 = Color(0xFF7D5260)

// Theme.kt
private val LightColorScheme = lightColorScheme(
    primary = Purple40,
    secondary = PurpleGrey40,
    tertiary = Pink40,
    background = Color(0xFFFFFBFE),
    surface = Color(0xFFFFFBFE),
)

private val DarkColorScheme = darkColorScheme(
    primary = Purple80,
    secondary = PurpleGrey80,
    tertiary = Pink80,
    background = Color(0xFF1C1B1F),
    surface = Color(0xFF1C1B1F),
)
```

### 色の使い方

```kotlin
@Composable
fun ColorExample() {
    // テーマから色を取得
    val primaryColor = MaterialTheme.colorScheme.primary

    Column {
        // ボタンは自動でprimaryを使う
        Button(onClick = { }) {
            Text("Primary Button")
        }

        // 明示的に色を指定
        Text(
            text = "カスタムカラー",
            color = MaterialTheme.colorScheme.secondary
        )

        // 背景色
        Box(
            modifier = Modifier.background(
                MaterialTheme.colorScheme.primaryContainer
            )
        ) {
            Text(
                text = "Container内のテキスト",
                color = MaterialTheme.colorScheme.onPrimaryContainer
            )
        }
    }
}
```

---

## Dynamic Color（Android 12+）

Android 12以降では、壁紙から自動的にカラーを生成できます。

```kotlin
@Composable
fun MyAppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,  // Dynamic Colorを有効化
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        // Dynamic Colorが使える場合
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context)
            else dynamicLightColorScheme(context)
        }
        // フォールバック
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
```

---

## Typography

### 定義済みのテキストスタイル

```kotlin
// 見出し（大きい順）
MaterialTheme.typography.displayLarge
MaterialTheme.typography.displayMedium
MaterialTheme.typography.displaySmall

MaterialTheme.typography.headlineLarge
MaterialTheme.typography.headlineMedium
MaterialTheme.typography.headlineSmall

MaterialTheme.typography.titleLarge
MaterialTheme.typography.titleMedium
MaterialTheme.typography.titleSmall

// 本文
MaterialTheme.typography.bodyLarge
MaterialTheme.typography.bodyMedium
MaterialTheme.typography.bodySmall

// ラベル
MaterialTheme.typography.labelLarge
MaterialTheme.typography.labelMedium
MaterialTheme.typography.labelSmall
```

### 使い方

```kotlin
@Composable
fun TypographyExample() {
    Column {
        Text(
            text = "見出し",
            style = MaterialTheme.typography.headlineLarge
        )
        Text(
            text = "本文テキスト",
            style = MaterialTheme.typography.bodyMedium
        )
        Text(
            text = "ラベル",
            style = MaterialTheme.typography.labelSmall
        )
    }
}
```

### カスタムTypography

```kotlin
// Type.kt
val Typography = Typography(
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.5.sp
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 22.sp,
        lineHeight = 28.sp,
        letterSpacing = 0.sp
    ),
    // 他のスタイルも同様に定義
)
```

---

## Material 3 コンポーネント

### Button

```kotlin
@Composable
fun ButtonExamples() {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        // 塗りつぶしボタン（最も強調）
        Button(onClick = { }) {
            Text("Filled Button")
        }

        // アウトラインボタン
        OutlinedButton(onClick = { }) {
            Text("Outlined Button")
        }

        // テキストボタン（最も控えめ）
        TextButton(onClick = { }) {
            Text("Text Button")
        }

        // トーンボタン（M3で追加）
        FilledTonalButton(onClick = { }) {
            Text("Filled Tonal Button")
        }

        // 高さのあるボタン
        ElevatedButton(onClick = { }) {
            Text("Elevated Button")
        }
    }
}
```

### Card

```kotlin
@Composable
fun CardExamples() {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        // 標準カード
        Card {
            Text("Card", modifier = Modifier.padding(16.dp))
        }

        // アウトラインカード
        OutlinedCard {
            Text("Outlined Card", modifier = Modifier.padding(16.dp))
        }

        // 高さのあるカード
        ElevatedCard {
            Text("Elevated Card", modifier = Modifier.padding(16.dp))
        }
    }
}
```

### TopAppBar

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TopAppBarExample() {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("アプリタイトル") },
                navigationIcon = {
                    IconButton(onClick = { }) {
                        Icon(Icons.Default.Menu, "メニュー")
                    }
                },
                actions = {
                    IconButton(onClick = { }) {
                        Icon(Icons.Default.Search, "検索")
                    }
                    IconButton(onClick = { }) {
                        Icon(Icons.Default.MoreVert, "その他")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                )
            )
        }
    ) { paddingValues ->
        // コンテンツ
    }
}
```

### NavigationBar（BottomNavigation）

```kotlin
@Composable
fun NavigationBarExample() {
    var selectedItem by remember { mutableStateOf(0) }
    val items = listOf("ホーム", "検索", "設定")
    val icons = listOf(Icons.Default.Home, Icons.Default.Search, Icons.Default.Settings)

    Scaffold(
        bottomBar = {
            NavigationBar {
                items.forEachIndexed { index, item ->
                    NavigationBarItem(
                        icon = { Icon(icons[index], contentDescription = item) },
                        label = { Text(item) },
                        selected = selectedItem == index,
                        onClick = { selectedItem = index }
                    )
                }
            }
        }
    ) { paddingValues ->
        // コンテンツ
    }
}
```

### FloatingActionButton

```kotlin
@Composable
fun FABExample() {
    Scaffold(
        floatingActionButton = {
            // 標準FAB
            FloatingActionButton(onClick = { }) {
                Icon(Icons.Default.Add, "追加")
            }
        }
    ) { paddingValues ->
        // コンテンツ
    }
}

// 大きいFAB
LargeFloatingActionButton(onClick = { }) {
    Icon(
        Icons.Default.Add,
        contentDescription = "追加",
        modifier = Modifier.size(36.dp)
    )
}

// 小さいFAB
SmallFloatingActionButton(onClick = { }) {
    Icon(Icons.Default.Add, "追加")
}

// 拡張FAB
ExtendedFloatingActionButton(
    onClick = { },
    icon = { Icon(Icons.Default.Add, "追加") },
    text = { Text("新規作成") }
)
```

### TextField

```kotlin
@Composable
fun TextFieldExamples() {
    var text by remember { mutableStateOf("") }

    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        // 塗りつぶしTextField
        TextField(
            value = text,
            onValueChange = { text = it },
            label = { Text("ラベル") },
            supportingText = { Text("補足テキスト") }
        )

        // アウトラインTextField
        OutlinedTextField(
            value = text,
            onValueChange = { text = it },
            label = { Text("ラベル") },
            leadingIcon = { Icon(Icons.Default.Email, null) },
            trailingIcon = {
                if (text.isNotEmpty()) {
                    IconButton(onClick = { text = "" }) {
                        Icon(Icons.Default.Clear, "クリア")
                    }
                }
            }
        )
    }
}
```

### Switch / Checkbox / RadioButton

```kotlin
@Composable
fun SelectionControlExamples() {
    var switchState by remember { mutableStateOf(false) }
    var checkboxState by remember { mutableStateOf(false) }
    var radioState by remember { mutableStateOf(0) }

    Column {
        // Switch
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("通知")
            Spacer(Modifier.weight(1f))
            Switch(
                checked = switchState,
                onCheckedChange = { switchState = it }
            )
        }

        // Checkbox
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = checkboxState,
                onCheckedChange = { checkboxState = it }
            )
            Text("利用規約に同意する")
        }

        // RadioButton
        listOf("オプション1", "オプション2", "オプション3").forEachIndexed { index, text ->
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                RadioButton(
                    selected = radioState == index,
                    onClick = { radioState = index }
                )
                Text(text)
            }
        }
    }
}
```

---

## ダークモード対応

### システム設定に従う

```kotlin
@Composable
fun MyAppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),  // システム設定を取得
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
```

### ライト/ダークの色を定義

```kotlin
// Color.kt
// ライトモード用
val md_theme_light_primary = Color(0xFF6750A4)
val md_theme_light_background = Color(0xFFFFFBFE)

// ダークモード用
val md_theme_dark_primary = Color(0xFFD0BCFF)
val md_theme_dark_background = Color(0xFF1C1B1F)

// Theme.kt
private val LightColors = lightColorScheme(
    primary = md_theme_light_primary,
    background = md_theme_light_background,
    // ...
)

private val DarkColors = darkColorScheme(
    primary = md_theme_dark_primary,
    background = md_theme_dark_background,
    // ...
)
```

### Previewでダークモードを確認

```kotlin
@Preview(name = "Light Mode")
@Preview(name = "Dark Mode", uiMode = Configuration.UI_MODE_NIGHT_YES)
@Composable
fun MyScreenPreview() {
    MyAppTheme {
        MyScreen()
    }
}
```

---

## Shapes（形状）

### 定義済みの形状

```kotlin
MaterialTheme.shapes.extraSmall   // 4dp
MaterialTheme.shapes.small        // 8dp
MaterialTheme.shapes.medium       // 12dp
MaterialTheme.shapes.large        // 16dp
MaterialTheme.shapes.extraLarge   // 28dp
```

### カスタム形状

```kotlin
val Shapes = Shapes(
    small = RoundedCornerShape(4.dp),
    medium = RoundedCornerShape(8.dp),
    large = RoundedCornerShape(16.dp)
)
```

### 使い方

```kotlin
Card(
    shape = MaterialTheme.shapes.medium
) {
    // ...
}

Box(
    modifier = Modifier
        .clip(MaterialTheme.shapes.large)
        .background(MaterialTheme.colorScheme.primaryContainer)
) {
    // ...
}
```

---

## Material Theme Builder

GoogleはMaterial 3のテーマを簡単に作成できるWebツールを提供しています。

**Material Theme Builder**: https://m3.material.io/theme-builder

### 使い方

1. プライマリカラーを選択
2. セカンダリ、ターシャリーカラーを調整
3. 「Export」→「Jetpack Compose」でコードを出力
4. 出力されたColor.ktとTheme.ktをプロジェクトにコピー

---

## AIに聞いてみよう

### 質問例

```
【質問】
Material Design 2とMaterial Design 3の違いを教えて。
移行するときの注意点は？
```

```
【質問】
ダークモード対応するとき、
画像やアイコンの色はどう対応すればいい？
```

```
【質問】
Material Theme Builderで作ったテーマを
Android Studioプロジェクトに適用する方法を教えて。
```

---

## チェックリスト

- [ ] Material 3のカラーロールを理解している
- [ ] テーマをカスタマイズできる
- [ ] Typographyでテキストスタイルを統一できる
- [ ] Material 3コンポーネントを使える
- [ ] ダークモードに対応できる
- [ ] Dynamic Colorの仕組みを理解している

---

## まとめ

この章では以下を学びました：

1. **Material Design 3** - Googleの最新デザインシステム
2. **カラースキーム** - primary, secondary, surfaceなど
3. **Typography** - 統一されたテキストスタイル
4. **コンポーネント** - Button, Card, TopAppBar, NavigationBar
5. **ダークモード** - isSystemInDarkTheme()
6. **Dynamic Color** - 壁紙からの自動カラー生成

Material Designを活用することで、美しく使いやすいアプリを作れます。

---

次章：[ナビゲーション](./07-navigation.md)
