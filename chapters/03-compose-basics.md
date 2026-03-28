# Jetpack Composeの基本

> 提出ブランチ：`feature/03-compose-basics`（PRのbase：`develop`）

Jetpack Composeは、Androidの**宣言的UIフレームワーク**です。
XMLではなくKotlinコードでUIを組み立てます。

---

## 前提

- [Androidアプリの基本](./03-android-fundamentals.md) を完了し、Activity/リソース/ライフサイクルの概要がわかる

## この章でできるようになること

- [ ] 宣言的UIの概念を理解する
- [ ] @Composable関数を作成できる
- [ ] 基本的なComposable（Text, Image, Button）を使える
- [ ] Row, Column, Boxでレイアウトを組める
- [ ] Modifierでスタイルを適用できる
- [ ] Previewでデザインを確認できる

**所要時間の目安：2〜3時間**

---

## 宣言的UIとは

### 命令的UI vs 宣言的UI

**命令的UI（従来のView）**
```kotlin
// 「どうやって」変更するかを記述
val textView = findViewById<TextView>(R.id.textView)
textView.text = "Hello"
textView.setTextColor(Color.RED)
textView.visibility = View.VISIBLE
```

**宣言的UI（Compose）**
```kotlin
// 「何を」表示するかを記述
@Composable
fun Greeting(name: String, isVisible: Boolean) {
    if (isVisible) {
        Text(
            text = "Hello, $name",
            color = Color.Red
        )
    }
}
```

### 宣言的UIのメリット

| メリット | 説明 |
|----------|------|
| **直感的** | UIの状態がそのままコードに反映される |
| **予測可能** | 同じ入力なら同じ出力になる |
| **テストしやすい** | 純粋関数として扱える |
| **少ないコード** | ボイラープレートが減る |

### 考え方のシフト

```text
従来：UI部品を作って、後から変更を命令する
Compose：状態に応じたUIを毎回「宣言」する
```

---

## 最初のComposable関数

### @Composableアノテーション

Composeで表示されるUI部品は、すべて`@Composable`関数として定義します。

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}
```

### 呼び出し方

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            // ここでComposable関数を呼び出す
            Greeting(name = "Android")
        }
    }
}
```

### Composable関数のルール

1. **@Composableが必要**
   ```kotlin
   @Composable  // この注釈が必須
   fun MyComponent() { ... }
   ```

2. **他のComposableから呼び出す**
   ```kotlin
   @Composable
   fun Parent() {
       Child()  // Composableは Composableから呼ぶ
   }
   ```

3. **大文字で始める（慣習）**
   ```kotlin
   // Good
   @Composable
   fun UserProfile() { ... }

   // Bad
   @Composable
   fun userProfile() { ... }
   ```

4. **戻り値はUnit（返さない）**
   ```kotlin
   @Composable
   fun Greeting() {
       Text("Hello")  // 値を返さない
   }
   ```

---

## 基本的なComposable

### Text - テキスト表示

```kotlin
@Composable
fun TextExamples() {
    // 基本
    Text(text = "Hello, World!")

    // スタイル指定
    Text(
        text = "スタイル付きテキスト",
        fontSize = 24.sp,
        fontWeight = FontWeight.Bold,
        color = Color.Blue,
        textAlign = TextAlign.Center,
        maxLines = 2,
        overflow = TextOverflow.Ellipsis
    )

    // 文字装飾
    Text(
        text = "下線付き",
        textDecoration = TextDecoration.Underline
    )
}
```

### Image - 画像表示

```kotlin
@Composable
fun ImageExamples() {
    // リソースから画像を表示
    Image(
        painter = painterResource(id = R.drawable.my_image),
        contentDescription = "説明文（アクセシビリティ用）"
    )

    // サイズとスケールを指定
    Image(
        painter = painterResource(id = R.drawable.my_image),
        contentDescription = "プロフィール画像",
        modifier = Modifier.size(100.dp),
        contentScale = ContentScale.Crop  // 切り抜き
    )

    // アイコン
    Icon(
        imageVector = Icons.Default.Favorite,
        contentDescription = "お気に入り",
        tint = Color.Red
    )
}
```

### Button - ボタン

```kotlin
@Composable
fun ButtonExamples() {
    // 基本的なボタン
    Button(onClick = { /* クリック時の処理 */ }) {
        Text("クリック")
    }

    // アイコン付きボタン
    Button(onClick = { }) {
        Icon(
            imageVector = Icons.Default.Add,
            contentDescription = null,
            modifier = Modifier.size(20.dp)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Text("追加")
    }

    // アウトラインボタン
    OutlinedButton(onClick = { }) {
        Text("キャンセル")
    }

    // テキストボタン
    TextButton(onClick = { }) {
        Text("詳細を見る")
    }

    // 無効化
    Button(
        onClick = { },
        enabled = false
    ) {
        Text("無効")
    }
}
```

### TextField - テキスト入力

```kotlin
@Composable
fun TextFieldExample() {
    var text by remember { mutableStateOf("") }

    TextField(
        value = text,
        onValueChange = { text = it },
        label = { Text("名前を入力") },
        placeholder = { Text("山田太郎") }
    )

    // アウトライン版
    OutlinedTextField(
        value = text,
        onValueChange = { text = it },
        label = { Text("メールアドレス") },
        leadingIcon = {
            Icon(Icons.Default.Email, contentDescription = null)
        }
    )
}
```

---

## レイアウト

### Column - 縦に並べる

```kotlin
@Composable
fun ColumnExample() {
    Column {
        Text("1番目")
        Text("2番目")
        Text("3番目")
    }

    // 配置を指定
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,      // 縦方向の配置
        horizontalAlignment = Alignment.CenterHorizontally  // 横方向の揃え
    ) {
        Text("中央に配置")
        Text("されます")
    }
}
```

### Row - 横に並べる

```kotlin
@Composable
fun RowExample() {
    Row {
        Text("左")
        Text("真ん中")
        Text("右")
    }

    // 配置を指定
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,  // 両端揃え
        verticalAlignment = Alignment.CenterVertically     // 縦方向中央揃え
    ) {
        Text("左端")
        Text("右端")
    }
}
```

### Box - 重ねる

```kotlin
@Composable
fun BoxExample() {
    Box(
        modifier = Modifier.size(200.dp),
        contentAlignment = Alignment.Center
    ) {
        // 後に書いたものが上に重なる
        Image(
            painter = painterResource(R.drawable.background),
            contentDescription = null,
            modifier = Modifier.fillMaxSize()
        )
        Text(
            text = "重ねて表示",
            color = Color.White
        )
    }
}
```

### Spacer - 余白

```kotlin
@Composable
fun SpacerExample() {
    Column {
        Text("上")
        Spacer(modifier = Modifier.height(16.dp))
        Text("下")
    }

    Row {
        Text("左")
        Spacer(modifier = Modifier.width(8.dp))
        Text("右")
    }

    // 残りのスペースを埋める
    Row(modifier = Modifier.fillMaxWidth()) {
        Text("左")
        Spacer(modifier = Modifier.weight(1f))
        Text("右端")
    }
}
```

### Arrangement（配置）の種類

```kotlin
// Column用（縦方向）
Arrangement.Top           // 上揃え
Arrangement.Center        // 中央揃え
Arrangement.Bottom        // 下揃え
Arrangement.SpaceBetween  // 両端揃え
Arrangement.SpaceAround   // 周囲に余白
Arrangement.SpaceEvenly   // 均等配置

// Row用（横方向）
Arrangement.Start         // 左揃え
Arrangement.Center        // 中央揃え
Arrangement.End           // 右揃え
Arrangement.SpaceBetween  // 両端揃え
```

---

## Modifier - スタイルと振る舞い

Modifierは、Composableの**見た目**と**振る舞い**を変更するためのものです。

### 基本的な使い方

```kotlin
@Composable
fun ModifierExample() {
    Text(
        text = "Hello",
        modifier = Modifier
            .padding(16.dp)           // 内側の余白
            .background(Color.Yellow) // 背景色
            .fillMaxWidth()           // 横幅いっぱい
    )
}
```

### サイズ

```kotlin
Modifier
    .size(100.dp)              // 幅と高さを同じに
    .size(width = 100.dp, height = 50.dp)  // 別々に指定
    .width(100.dp)             // 幅のみ
    .height(50.dp)             // 高さのみ
    .fillMaxSize()             // 親いっぱいに広がる
    .fillMaxWidth()            // 横幅いっぱい
    .fillMaxHeight()           // 高さいっぱい
    .fillMaxWidth(0.5f)        // 横幅の50%
    .wrapContentSize()         // コンテンツに合わせる
```

### 余白（Padding / Margin）

```kotlin
// Padding（内側の余白）
Modifier
    .padding(16.dp)                           // 全方向
    .padding(horizontal = 16.dp, vertical = 8.dp)  // 横と縦
    .padding(start = 8.dp, end = 8.dp)        // 左右
    .padding(top = 16.dp, bottom = 8.dp)      // 上下

// Composeにはmarginがない
// 代わりに親にpaddingをつけるか、Spacerを使う
```

### 背景と形状

```kotlin
Modifier
    .background(Color.Blue)                        // 背景色
    .background(Color.Blue, shape = RoundedCornerShape(8.dp))  // 角丸
    .clip(RoundedCornerShape(8.dp))               // 切り抜き
    .clip(CircleShape)                            // 円形
    .border(2.dp, Color.Black)                    // 枠線
    .border(2.dp, Color.Black, RoundedCornerShape(8.dp))  // 角丸枠線
    .shadow(4.dp, RoundedCornerShape(8.dp))       // 影
```

### クリックイベント

```kotlin
Modifier
    .clickable { /* クリック時の処理 */ }
    .clickable(
        onClick = { },
        onLongClick = { }  // 長押し
    )
```

### Modifierの順序は重要

Modifierはチェーンの**順序**で結果が変わります。

```kotlin
// パターン1：背景の後にパディング
Text(
    "Hello",
    modifier = Modifier
        .background(Color.Yellow)
        .padding(16.dp)
)
// 結果：黄色い背景の中にテキスト、周囲に余白

// パターン2：パディングの後に背景
Text(
    "Hello",
    modifier = Modifier
        .padding(16.dp)
        .background(Color.Yellow)
)
// 結果：余白の後に黄色い背景、背景はテキストぴったり
```

---

## Preview - デザインの確認

Previewを使うと、実機やエミュレータを起動せずにUIを確認できます。

### 基本的なPreview

```kotlin
@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    Greeting(name = "Android")
}
```

### Previewのオプション

```kotlin
@Preview(
    name = "ライトモード",
    showBackground = true,
    backgroundColor = 0xFFFFFFFF
)
@Composable
fun LightPreview() {
    MyComponent()
}

@Preview(
    name = "ダークモード",
    showBackground = true,
    backgroundColor = 0xFF000000,
    uiMode = Configuration.UI_MODE_NIGHT_YES
)
@Composable
fun DarkPreview() {
    MyComponent()
}

@Preview(
    name = "大きい画面",
    showBackground = true,
    widthDp = 400,
    heightDp = 800
)
@Composable
fun LargePreview() {
    MyComponent()
}
```

### 複数のPreviewを定義

```kotlin
@Preview(name = "日本語")
@Composable
fun JapanesePreview() {
    Greeting(name = "太郎")
}

@Preview(name = "英語")
@Composable
fun EnglishPreview() {
    Greeting(name = "John")
}

@Preview(name = "長い名前")
@Composable
fun LongNamePreview() {
    Greeting(name = "とても長い名前のユーザーさん")
}
```

### PreviewParameter - データを動的に

```kotlin
class NamePreviewProvider : PreviewParameterProvider<String> {
    override val values = sequenceOf("Android", "Compose", "Kotlin")
}

@Preview
@Composable
fun GreetingPreview(
    @PreviewParameter(NamePreviewProvider::class) name: String
) {
    Greeting(name = name)
}
```

---

## 実践：プロフィールカードを作る

学んだ内容を組み合わせて、プロフィールカードを作ってみましょう。

### 完成イメージ

```text
┌─────────────────────────┐
│  ┌───┐                  │
│  │ 🖼 │  田中 太郎        │
│  └───┘  Android Developer │
│                         │
│  東京都在住              │
│  Jetpack Compose勉強中   │
└─────────────────────────┘
```

### コード

```kotlin
@Composable
fun ProfileCard(
    name: String,
    title: String,
    description: String,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // ヘッダー部分
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                // プロフィール画像（仮）
                Box(
                    modifier = Modifier
                        .size(60.dp)
                        .clip(CircleShape)
                        .background(Color.LightGray),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = null,
                        modifier = Modifier.size(40.dp)
                    )
                }

                Spacer(modifier = Modifier.width(16.dp))

                // 名前と肩書き
                Column {
                    Text(
                        text = name,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = title,
                        fontSize = 14.sp,
                        color = Color.Gray
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // 説明文
            Text(
                text = description,
                fontSize = 14.sp
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ProfileCardPreview() {
    ProfileCard(
        name = "田中 太郎",
        title = "Android Developer",
        description = "東京都在住。Jetpack Composeを使ったモダンなAndroidアプリ開発を勉強中です。"
    )
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

Composeでわからないことがあったら、AIに質問しましょう。

### 質問例

```text
【質問】
Jetpack ComposeでRowの中の要素を両端に配置したい。
左端にアイコン、右端にテキストを置きたいんだけど、どうすればいい？
```

```text
【質問】
Modifierの padding と background の順番で結果が変わるって聞いたけど、
具体的にどう変わるの？図で説明して。
```

```text
【コードレビューお願い】
以下のComposeコード、もっと良い書き方ある？

Column {
    Text("項目1")
    Spacer(modifier = Modifier.height(8.dp))
    Text("項目2")
    Spacer(modifier = Modifier.height(8.dp))
    Text("項目3")
}
```

```text
【質問】
ComposeのCard内で画像を上部いっぱいに表示して、
その下にテキストを配置するレイアウトを作りたい。
具体的なコード例を教えて。
```

---

## よくあるエラーと解決方法

### @Composableではない関数からComposableを呼び出している

```text
エラー: @Composable invocations can only happen from the context of a @Composable function
```

**原因と解決：**
```kotlin
// NG: 通常の関数からComposableを呼んでいる
fun createUI() {
    Text("Hello")  // エラー
}

// OK: Composable関数から呼ぶ
@Composable
fun CreateUI() {
    Text("Hello")
}
```

### Modifierが効かない

**原因：** `modifier`パラメータを受け取っていないか、使っていない

```kotlin
// NG: modifierを無視している
@Composable
fun MyComponent(modifier: Modifier = Modifier) {
    Text("Hello")  // modifierを使っていない
}

// OK: modifierを渡す
@Composable
fun MyComponent(modifier: Modifier = Modifier) {
    Text(
        text = "Hello",
        modifier = modifier  // 外から渡されたmodifierを適用
    )
}
```

### Previewが表示されない

**原因と解決：**
1. ビルドする（Build → Make Project）
2. `@Preview`の下に`@Composable`があるか確認
3. Preview関数に引数がないか確認（引数があるとエラー）

```kotlin
// NG: 引数があるとPreviewできない
@Preview
@Composable
fun Preview(name: String) {  // エラー
    Greeting(name)
}

// OK: 引数なし
@Preview
@Composable
fun Preview() {
    Greeting("Android")
}
```

---

## チェックリスト

この章を完了したか確認しましょう。

- [ ] 宣言的UIの概念を説明できる
- [ ] @Composable関数を作成できる
- [ ] Text, Image, Buttonを使える
- [ ] Column, Row, Boxでレイアウトを組める
- [ ] Modifierでサイズ、余白、背景を設定できる
- [ ] Previewでデザインを確認できる
- [ ] プロフィールカードのようなUIを作成できる

---

## 演習

- [ ] シンプルメモアプリに「タイトル・本文の表示」だけの仮UIをComposeで作る（固定データでOK）
- [ ] `Modifier` の順番（`padding` → `background` / `background` → `padding`）を変えて差を確認する
- [ ] 1つのUI部品（カード/行など）をComposableに切り出し、Previewで確認する

---

## まとめ

この章では以下を学びました：

1. **宣言的UI** - 「何を」表示するかを宣言する
2. **@Composable関数** - UIを定義する関数
3. **基本Composable** - Text, Image, Button, TextField
4. **レイアウト** - Column, Row, Box, Spacer
5. **Modifier** - サイズ、余白、背景、クリックなど
6. **Preview** - 実機なしでUIを確認

Composeの基礎が身につきました。
次の章では、ユーザー操作に応答する「状態管理」を学びます。

---

## 課題提出

この章には提出課題があります。

1. 上記の演習を完了する
2. GitHub で `feature/03-compose-basics` ブランチを作成し、PRを作成
3. [AI総合レビューツール](https://ai.studio/apps/drive/1AMqIqU4Bio4te7AWh5dly1Qzp7CesqP9?fullscreenApplet=true) でレビューを実行
4. 問題がなければ、進捗ダッシュボードで **PR URL** と **完了日** を記録

---

## ふりかえり

- 宣言的UIは「状態」とどうつながっている？
- Composableを分割するとき、どこで切ると読みやすかった？
- いまの自分のシンプルメモUIで、まず部品化したいものは何？

---

## 次の章

次は [ハンズオン：シンプルメモアプリを始める](./04-project-start.md) に進み、シンプルメモアプリの開発を始めましょう。
