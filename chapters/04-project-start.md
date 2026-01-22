# ハンズオン：シンプルメモアプリを始める

これまで学んだKotlin、オブジェクト指向、Androidの基礎を活かして、
実際に**シンプルメモアプリ**の開発を始めます。

---

## この章の目標

- [ ] シンプルメモアプリのプロジェクトを作成する
- [ ] Memoデータクラスを設計・実装する
- [ ] 基本的なUI画面を作成する
- [ ] Composeの基本的なレイアウトを理解する
- [ ] 最初の動くアプリを完成させる

**所要時間の目安：2〜3時間**

---

## この章で作るもの

**シンプルメモアプリ v0.1**

機能：
- 「Hello, メモアプリ！」のウェルカム画面
- Memoデータクラスの定義
- サンプルメモを表示

```
┌─────────────────────┐
│   シンプルメモ      │
├─────────────────────┤
│                     │
│  Hello, メモアプリ！ │
│                     │
│  サンプルメモ       │
│  ─────────────      │
│  買い物リスト       │
│  牛乳、卵、パン... │
│                     │
└─────────────────────┘
```

---

## なぜこのハンズオンを行うのか

### 学習の流れ

```
これまで：個別の知識を学んだ
├─ Kotlin文法
├─ オブジェクト指向
└─ Android基礎

これから：実際にアプリを作る
└─ 知識を統合して形にする
```

### ハンズオンの重要性

| 学習方法 | 定着率 |
|---------|-------|
| 講義を聞く | 5% |
| 読む | 10% |
| 映像・音声 | 20% |
| デモンストレーション | 30% |
| グループ討議 | 50% |
| 自分でやってみる | 75% |
| **人に教える・アプリを作る** | **90%** |

実際に手を動かすことで、知識が定着します。

---

## プロジェクト作成

### ステップ1：Android Studioで新規プロジェクト作成

1. Android Studioを起動
2. **New Project**を選択
3. **Empty Activity**を選択
4. プロジェクト設定：
   - **Name**: `SimpleMemo`
   - **Package name**: `com.example.simplememo`
   - **Save location**: 任意の場所
   - **Language**: `Kotlin`
   - **Minimum SDK**: `API 24 (Android 7.0)`
   - **Build configuration language**: `Kotlin DSL (build.gradle.kts)`
5. **Finish**をクリック

### ステップ2：プロジェクト構造を確認

Android Studioの左側で**Android**ビューに切り替え、以下を確認：

```
app/
├── manifests/
│   └── AndroidManifest.xml
├── java/com.example.simplememo/
│   └── MainActivity.kt
└── res/
    ├── drawable/
    ├── values/
    │   ├── colors.xml
    │   ├── strings.xml
    │   └── themes.xml
    └── ...
```

### ステップ3：依存関係の確認

`app/build.gradle.kts`を開き、Compose関連の依存関係が含まれているか確認：

```kotlin
dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")

    // Jetpack Compose
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")

    // テスト
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
}
```

### ステップ4：初回ビルド

1. メニューから **Build → Make Project**
2. ビルドが成功することを確認
3. エラーが出た場合は、Android Studioの指示に従って修正

---

## データモデルの設計

### メモの要件定義

シンプルメモアプリで管理するメモには、以下の情報が必要です：

| 項目 | 型 | 説明 |
|------|---|------|
| ID | String | 一意の識別子 |
| タイトル | String | メモのタイトル |
| 本文 | String | メモの内容 |
| 作成日時 | Long | メモを作成した日時（UNIXタイムスタンプ） |
| 更新日時 | Long | 最後に更新した日時 |
| カテゴリ | Category | メモのカテゴリ（仕事、プライベートなど） |

### Categoryの定義

`app/src/main/java/com/example/simplememo/`に新しいファイル`Category.kt`を作成：

```kotlin
package com.example.simplememo

enum class Category(
    val displayName: String,
    val colorHex: String
) {
    WORK("仕事", "#FF6B6B"),
    PERSONAL("プライベート", "#4ECDC4"),
    IDEA("アイデア", "#FFE66D"),
    TODO("TODO", "#95E1D3");

    companion object {
        fun fromDisplayName(name: String): Category {
            return values().find { it.displayName == name } ?: PERSONAL
        }
    }
}
```

**解説：**
- `enum class`で固定のカテゴリを定義
- 各カテゴリに表示名と色を持たせる
- `companion object`で、表示名からCategoryを取得するメソッドを追加

### Memoデータクラスの定義

`app/src/main/java/com/example/simplememo/`に新しいファイル`Memo.kt`を作成：

```kotlin
package com.example.simplememo

import java.util.UUID

data class Memo(
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val content: String,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis(),
    val category: Category = Category.PERSONAL
) {
    /**
     * メモのプレビュー用短縮テキストを取得
     */
    fun getPreview(maxLength: Int = 50): String {
        return if (content.length > maxLength) {
            content.take(maxLength) + "..."
        } else {
            content
        }
    }

    /**
     * 文字数を取得
     */
    fun getCharacterCount(): Int = content.length

    /**
     * メモを更新した新しいインスタンスを返す
     */
    fun update(
        newTitle: String = title,
        newContent: String = content,
        newCategory: Category = category
    ): Memo {
        return copy(
            title = newTitle,
            content = newContent,
            category = newCategory,
            updatedAt = System.currentTimeMillis()
        )
    }

    /**
     * 作成日時を人間が読める形式で取得
     */
    fun getFormattedCreatedDate(): String {
        return java.text.SimpleDateFormat(
            "yyyy/MM/dd HH:mm",
            java.util.Locale.JAPAN
        ).format(java.util.Date(createdAt))
    }
}
```

**解説：**
- `data class`でイミュータブル（変更不可）なデータを定義
- デフォルト値でIDと日時を自動生成
- ユーティリティメソッドを追加（プレビュー、文字数、更新など）

### サンプルデータの作成

テスト用のサンプルメモを作成する関数を追加。

`app/src/main/java/com/example/simplememo/`に新しいファイル`SampleData.kt`を作成：

```kotlin
package com.example.simplememo

object SampleData {

    fun getSampleMemos(): List<Memo> {
        return listOf(
            Memo(
                title = "買い物リスト",
                content = "牛乳、卵、パン、バナナ、リンゴを買う。夕食の材料も忘れずに。",
                category = Category.PERSONAL
            ),
            Memo(
                title = "会議メモ",
                content = "次回のプロジェクトミーティングは来週水曜日10:00から。議題：進捗確認、課題共有。",
                category = Category.WORK
            ),
            Memo(
                title = "アプリアイデア",
                content = "天気予報と連動したタスク管理アプリ。雨の日には室内タスクを優先表示。",
                category = Category.IDEA
            ),
            Memo(
                title = "今週のTODO",
                content = """
                    - プログラミング課題を完成させる
                    - 本を2冊読む
                    - ジムに3回行く
                    - 部屋の掃除
                """.trimIndent(),
                category = Category.TODO
            ),
            Memo(
                title = "読書メモ",
                content = "「人を動かす」を読了。相手の立場に立つことの重要性を再認識。",
                category = Category.PERSONAL
            )
        )
    }
}
```

**解説：**
- `object`でシングルトンを定義
- サンプルメモを5つ作成
- 各カテゴリのメモを含める

---

## 基本UIの作成

### ステップ1：テーマの設定

`app/src/main/java/com/example/simplememo/ui/theme/`ディレクトリに、
`Theme.kt`を作成（または既存のものを編集）：

```kotlin
package com.example.simplememo.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF6200EE),
    secondary = Color(0xFF03DAC5),
    tertiary = Color(0xFF018786),
    background = Color(0xFFFFFBFE),
    surface = Color(0xFFFFFBFE),
    onPrimary = Color.White,
    onSecondary = Color.Black,
    onBackground = Color(0xFF1C1B1F),
    onSurface = Color(0xFF1C1B1F),
)

@Composable
fun SimpleMemoTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        typography = MaterialTheme.typography,
        content = content
    )
}
```

### ステップ2：MainActivityの更新

`MainActivity.kt`を以下のように更新：

```kotlin
package com.example.simplememo

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.simplememo.ui.theme.SimpleMemoTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SimpleMemoTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    MemoApp()
                }
            }
        }
    }
}

@Composable
fun MemoApp() {
    // サンプルメモを取得
    val memos = remember { SampleData.getSampleMemos() }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // ヘッダー
        Text(
            text = "シンプルメモ",
            style = MaterialTheme.typography.headlineLarge,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        Text(
            text = "Hello, メモアプリ！",
            style = MaterialTheme.typography.bodyLarge,
            modifier = Modifier.padding(bottom = 24.dp)
        )

        // メモリスト
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(memos) { memo ->
                MemoCard(memo = memo)
            }
        }
    }
}

@Composable
fun MemoCard(memo: Memo) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // カテゴリバッジ
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(bottom = 8.dp)
            ) {
                Surface(
                    color = Color(android.graphics.Color.parseColor(memo.category.colorHex)),
                    shape = MaterialTheme.shapes.small,
                    modifier = Modifier.padding(end = 8.dp)
                ) {
                    Text(
                        text = memo.category.displayName,
                        style = MaterialTheme.typography.labelSmall,
                        color = Color.White,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }

                Text(
                    text = memo.getFormattedCreatedDate(),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            // タイトル
            Text(
                text = memo.title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 4.dp)
            )

            // プレビュー
            Text(
                text = memo.getPreview(),
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            // 文字数
            Text(
                text = "${memo.getCharacterCount()}文字",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 8.dp)
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun MemoCardPreview() {
    SimpleMemoTheme {
        MemoCard(
            memo = Memo(
                title = "サンプルメモ",
                content = "これはプレビュー用のサンプルメモです。",
                category = Category.PERSONAL
            )
        )
    }
}
```

**解説：**
- `MemoApp`: アプリ全体のメイン画面
- `MemoCard`: 個別のメモを表示するカード
- `LazyColumn`: スクロール可能なリスト
- `@Preview`: プレビュー機能（Android Studioで表示確認）

### ステップ3：strings.xmlの更新

`res/values/strings.xml`を更新：

```xml
<resources>
    <string name="app_name">シンプルメモ</string>
    <string name="welcome_message">Hello, メモアプリ！</string>
    <string name="memo_count">%d 件のメモ</string>
</resources>
```

---

## 実行とテスト

### ステップ1：エミュレーターの起動

1. Android Studioの上部メニューから**Device Manager**を開く
2. エミュレーターを作成（まだない場合）
   - **Create Device**をクリック
   - **Pixel 6**などの最新デバイスを選択
   - システムイメージ（API 34など）をダウンロード
   - **Finish**

### ステップ2：アプリの実行

1. 緑色の▶（Run）ボタンをクリック
2. エミュレーターが起動し、アプリが表示される

### ステップ3：動作確認

以下を確認：
- [ ] 「シンプルメモ」とヘッダーが表示される
- [ ] 「Hello, メモアプリ！」が表示される
- [ ] 5つのサンプルメモが表示される
- [ ] 各メモにカテゴリバッジが表示される
- [ ] メモがスクロールできる

---

## コードの理解を深める

### LazyColumnの仕組み

```kotlin
LazyColumn {
    items(memos) { memo ->
        MemoCard(memo = memo)
    }
}
```

**LazyColumn**は、RecyclerViewのCompose版です：
- 画面に表示される部分だけレンダリング（効率的）
- 自動でスクロール対応
- アイテムごとにComposableを生成

### Cardコンポーネント

```kotlin
Card(
    modifier = Modifier.fillMaxWidth(),
    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
) {
    // カードの内容
}
```

**Card**は、Material Design 3のカードUI：
- 影付きの角丸四角形
- タップ可能にすることもできる

### Color.parseColorの使い方

```kotlin
Color(android.graphics.Color.parseColor(memo.category.colorHex))
```

**parseColor**で16進数カラーコードを変換：
- `"#FF6B6B"` → `Color`オブジェクト
- 動的に色を変える場合に便利

---

## AIに聞いてみよう

このハンズオンでわからないことがあったら、AIに質問しましょう。

### 質問例

```
【質問】
data classのcopy()メソッドって何？
どういう時に使うの？
```

```
【質問】
LazyColumnとColumnの違いは？
どっちを使えばいいの？
```

```
【エラー解決】
アプリを実行したら以下のエラーが出た：

Unresolved reference: R

どうすれば直せる？
```

```
【コードレビューお願い】
MemoCardのレイアウト、もっと見やすくできる？
Material Design 3の原則に沿ってる？
```

---

## 演習問題

### 基礎レベル

**問題1：新しいカテゴリの追加**
`Category.kt`に新しいカテゴリ「学習」（色: #FFA07A）を追加してください。

<details>
<summary>解答例</summary>

```kotlin
enum class Category(
    val displayName: String,
    val colorHex: String
) {
    WORK("仕事", "#FF6B6B"),
    PERSONAL("プライベート", "#4ECDC4"),
    IDEA("アイデア", "#FFE66D"),
    TODO("TODO", "#95E1D3"),
    STUDY("学習", "#FFA07A");  // 追加

    companion object {
        fun fromDisplayName(name: String): Category {
            return values().find { it.displayName == name } ?: PERSONAL
        }
    }
}
```
</details>

**問題2：サンプルメモの追加**
`SampleData.kt`に、新しく追加した「学習」カテゴリのメモを1つ追加してください。

<details>
<summary>解答例</summary>

```kotlin
fun getSampleMemos(): List<Memo> {
    return listOf(
        // ... 既存のメモ ...

        Memo(
            title = "Kotlin学習メモ",
            content = "data classとclassの違いを理解した。equals()、hashCode()、toString()が自動生成される。",
            category = Category.STUDY
        )
    )
}
```
</details>

**問題3：文字数表示のカスタマイズ**
`MemoCard`の文字数表示を「〇〇文字」から「〇〇 chars」に変更してください。

<details>
<summary>解答例</summary>

```kotlin
Text(
    text = "${memo.getCharacterCount()} chars",
    style = MaterialTheme.typography.labelSmall,
    color = MaterialTheme.colorScheme.onSurfaceVariant,
    modifier = Modifier.padding(top = 8.dp)
)
```
</details>

### 応用レベル

**問題4：メモ数の表示**
ヘッダー部分に、メモの総数を表示してください。
例：「5件のメモ」

<details>
<summary>解答例</summary>

```kotlin
@Composable
fun MemoApp() {
    val memos = remember { SampleData.getSampleMemos() }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "シンプルメモ",
            style = MaterialTheme.typography.headlineLarge,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        // メモ数を表示
        Text(
            text = "${memos.size}件のメモ",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        // ...
    }
}
```
</details>

**問題5：空状態の処理**
メモが0件の場合、「メモがありません」と表示するようにしてください。

<details>
<summary>解答例</summary>

```kotlin
@Composable
fun MemoApp() {
    val memos = remember { SampleData.getSampleMemos() }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // ヘッダー
        Text(
            text = "シンプルメモ",
            style = MaterialTheme.typography.headlineLarge,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        // メモの有無で分岐
        if (memos.isEmpty()) {
            // 空状態
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "メモがありません",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        } else {
            // メモリスト
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(memos) { memo ->
                    MemoCard(memo = memo)
                }
            }
        }
    }
}
```
</details>

### 発展レベル

**問題6：カテゴリフィルター**
特定のカテゴリのメモだけを表示する機能を追加してください。

<details>
<summary>解答例</summary>

```kotlin
@Composable
fun MemoApp() {
    val allMemos = remember { SampleData.getSampleMemos() }
    var selectedCategory by remember { mutableStateOf<Category?>(null) }

    val displayMemos = if (selectedCategory == null) {
        allMemos
    } else {
        allMemos.filter { it.category == selectedCategory }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // ヘッダー
        Text(
            text = "シンプルメモ",
            style = MaterialTheme.typography.headlineLarge,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        // カテゴリフィルター
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            FilterChip(
                selected = selectedCategory == null,
                onClick = { selectedCategory = null },
                label = { Text("すべて") }
            )

            Category.values().forEach { category ->
                FilterChip(
                    selected = selectedCategory == category,
                    onClick = { selectedCategory = category },
                    label = { Text(category.displayName) }
                )
            }
        }

        // メモリスト
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(displayMemos) { memo ->
                MemoCard(memo = memo)
            }
        }
    }
}
```
</details>

**問題7：検索機能**
タイトルまたは本文にキーワードが含まれるメモを検索する機能を追加してください。

<details>
<summary>解答例</summary>

```kotlin
@Composable
fun MemoApp() {
    val allMemos = remember { SampleData.getSampleMemos() }
    var searchQuery by remember { mutableStateOf("") }

    val displayMemos = if (searchQuery.isBlank()) {
        allMemos
    } else {
        allMemos.filter { memo ->
            memo.title.contains(searchQuery, ignoreCase = true) ||
            memo.content.contains(searchQuery, ignoreCase = true)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // ヘッダー
        Text(
            text = "シンプルメモ",
            style = MaterialTheme.typography.headlineLarge,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        // 検索バー
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            label = { Text("検索") },
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp),
            singleLine = true
        )

        // メモリスト
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(displayMemos) { memo ->
                MemoCard(memo = memo)
            }
        }
    }
}
```
</details>

---

## よくあるエラーと解決方法

### エラー1：Unresolved reference: R

**原因：**
- XMLファイルにシンタックスエラーがある
- ビルドが完了していない

**解決方法：**
1. **Build → Clean Project**
2. **Build → Rebuild Project**
3. XMLファイルのエラーを確認

### エラー2：@Preview not found

**原因：**
- プレビュー用のインポートが不足

**解決方法：**
```kotlin
import androidx.compose.ui.tooling.preview.Preview
```

### エラー3：composable invocations can only happen from the context of a @Composable function

**原因：**
- Composable関数を通常の関数から呼んでいる

**解決方法：**
```kotlin
// NG
fun normalFunction() {
    Text("Hello")  // エラー
}

// OK
@Composable
fun MyComposable() {
    Text("Hello")
}
```

---

## チェックリスト

この章を完了したか確認しましょう。

- [ ] シンプルメモアプリのプロジェクトを作成できた
- [ ] Memoデータクラスを実装した
- [ ] サンプルメモが表示される
- [ ] カテゴリバッジが表示される
- [ ] メモがスクロールできる
- [ ] プレビュー機能を使えた
- [ ] 演習問題を3問以上解いた

---

## まとめ

この章では以下を達成しました：

1. **プロジェクト作成** - Android Studioで新規プロジェクト作成
2. **データモデル** - Memo、Categoryクラスの設計・実装
3. **サンプルデータ** - テスト用のメモを作成
4. **UI実装** - LazyColumn、Card、Material Design 3の活用
5. **実行とテスト** - エミュレーターで動作確認

次の章からは、このアプリに状態管理を追加し、
メモを作成・編集・削除できる機能を実装していきます。

このアプリが、最終的に実用的なメモアプリへと進化していきます。
楽しみながら学習を続けましょう！
