# 状態管理とユーザーインタラクション

Composeアプリを動的にするには「状態（State）」の管理が必要です。
この章では、ユーザー操作に応答するアプリの作り方を学びます。

---

## 前提

- `chapters/02-unit2-guide.md` を読んでいる
- `chapters/04-project-start.md` を完了し、シンプルメモアプリが起動できる

## この章でできるようになること

- [ ] 状態（State）の概念を理解する
- [ ] remember と mutableStateOf を使える
- [ ] ボタンクリックで状態を更新できる
- [ ] テキスト入力を扱える
- [ ] 状態の巻き上げ（State Hoisting）を理解する

**所要時間の目安：2〜3時間**

---

## 状態（State）とは

Composeにおける**状態**とは、UIに影響を与えるデータのことです。

### 状態が変わるとUIが更新される

```kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }

    Column {
        Text("カウント: $count")
        Button(onClick = { count++ }) {
            Text("増やす")
        }
    }
}
```

- `count`が**状態**
- ボタンを押すと`count`が変わる
- `count`が変わるとUIが**自動で再描画**される

### なぜ普通の変数ではダメなのか

```kotlin
// NG: 普通の変数は再コンポジションで値がリセットされる
@Composable
fun BadCounter() {
    var count = 0  // 毎回0にリセットされる

    Button(onClick = { count++ }) {
        Text("カウント: $count")  // 常に0
    }
}
```

**理由：** Composable関数は状態が変わるたびに**再実行**されます。
普通の変数は再実行のたびに初期化されてしまいます。

---

## remember と mutableStateOf

### mutableStateOf

Composeが**監視できる**状態を作ります。

```kotlin
val count = mutableStateOf(0)       // State<Int>型
println(count.value)                 // 値にアクセス
count.value = 1                      // 値を更新
```

### remember

**再コンポジションをまたいで**値を保持します。

```kotlin
val count = remember { mutableStateOf(0) }
```

- `remember`なしだと、再コンポジションのたびに`mutableStateOf(0)`が実行される
- `remember`をつけると、最初の1回だけ実行される

### by（委譲プロパティ）

`.value`を省略できます。

```kotlin
// 毎回 .value が必要
val count = remember { mutableStateOf(0) }
Text("${count.value}")
count.value++

// by で委譲すると .value が不要
var count by remember { mutableStateOf(0) }
Text("$count")
count++
```

**`by`を使う場合は`var`にする**ことを忘れずに！

### 必要なimport

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.mutableStateOf
```

---

## カウンターアプリを作る

### 基本的なカウンター

```kotlin
@Composable
fun CounterApp() {
    var count by remember { mutableStateOf(0) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "$count",
            fontSize = 48.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(24.dp))

        Row {
            Button(onClick = { count-- }) {
                Text("-")
            }
            Spacer(modifier = Modifier.width(16.dp))
            Button(onClick = { count++ }) {
                Text("+")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(onClick = { count = 0 }) {
            Text("リセット")
        }
    }
}
```

### リセット機能付きカウンター

```kotlin
@Composable
fun CounterWithReset() {
    var count by remember { mutableStateOf(0) }
    val maxCount = 10

    Column(
        modifier = Modifier.padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "$count / $maxCount",
            fontSize = 32.sp
        )

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = { if (count < maxCount) count++ },
            enabled = count < maxCount  // 上限に達したら無効化
        ) {
            Text("増やす")
        }

        if (count >= maxCount) {
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "上限に達しました！",
                color = Color.Red
            )
            Button(onClick = { count = 0 }) {
                Text("リセット")
            }
        }
    }
}
```

---

## テキスト入力を扱う

### 基本的なテキスト入力

```kotlin
@Composable
fun TextInputExample() {
    var text by remember { mutableStateOf("") }

    Column(modifier = Modifier.padding(16.dp)) {
        OutlinedTextField(
            value = text,
            onValueChange = { text = it },
            label = { Text("名前を入力") }
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text("入力された名前: $text")
    }
}
```

### 入力値を使った処理

```kotlin
@Composable
fun GreetingInput() {
    var name by remember { mutableStateOf("") }
    var greeting by remember { mutableStateOf("") }

    Column(modifier = Modifier.padding(16.dp)) {
        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("名前") },
            singleLine = true
        )

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = { greeting = "こんにちは、${name}さん！" },
            enabled = name.isNotBlank()
        ) {
            Text("挨拶する")
        }

        if (greeting.isNotEmpty()) {
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = greeting,
                fontSize = 20.sp
            )
        }
    }
}
```

### 数値入力

```kotlin
@Composable
fun NumberInputExample() {
    var input by remember { mutableStateOf("") }

    Column(modifier = Modifier.padding(16.dp)) {
        OutlinedTextField(
            value = input,
            onValueChange = { newValue ->
                // 数字のみ受け付ける
                if (newValue.all { it.isDigit() }) {
                    input = newValue
                }
            },
            label = { Text("数字を入力") },
            keyboardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Number
            )
        )

        val number = input.toIntOrNull() ?: 0
        Text("入力値: $number")
        Text("2倍: ${number * 2}")
    }
}
```

---

## 実践：チップ計算機を作る

テキスト入力と計算ロジックを組み合わせた実用的なアプリを作ります。

```kotlin
@Composable
fun TipCalculator() {
    var amountInput by remember { mutableStateOf("") }
    var tipPercent by remember { mutableStateOf(15) }

    val amount = amountInput.toDoubleOrNull() ?: 0.0
    val tip = amount * tipPercent / 100
    val total = amount + tip

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "チップ計算機",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(24.dp))

        // 金額入力
        OutlinedTextField(
            value = amountInput,
            onValueChange = { amountInput = it },
            label = { Text("金額") },
            leadingIcon = { Text("¥") },
            keyboardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Decimal
            ),
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        // チップ率選択
        Text("チップ率: $tipPercent%")
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            listOf(10, 15, 20, 25).forEach { percent ->
                FilterChip(
                    selected = tipPercent == percent,
                    onClick = { tipPercent = percent },
                    label = { Text("$percent%") }
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // 結果表示
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.primaryContainer
            )
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                ResultRow("小計", amount)
                ResultRow("チップ ($tipPercent%)", tip)
                Divider(modifier = Modifier.padding(vertical = 8.dp))
                ResultRow("合計", total, isBold = true)
            }
        }
    }
}

@Composable
fun ResultRow(label: String, value: Double, isBold: Boolean = false) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            fontWeight = if (isBold) FontWeight.Bold else FontWeight.Normal
        )
        Text(
            text = "¥${String.format("%.0f", value)}",
            fontWeight = if (isBold) FontWeight.Bold else FontWeight.Normal
        )
    }
}
```

---

## 状態の巻き上げ（State Hoisting）

### 問題：状態がコンポーネント内部に閉じている

```kotlin
// 状態が内部にある（テストしにくい、再利用しにくい）
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }
    Button(onClick = { count++ }) {
        Text("$count")
    }
}
```

### 解決：状態を親に「巻き上げる」

```kotlin
// 状態を外に出す（State Hoisting）
@Composable
fun Counter(
    count: Int,           // 状態を受け取る
    onIncrement: () -> Unit  // 変更方法を受け取る
) {
    Button(onClick = onIncrement) {
        Text("$count")
    }
}

// 親で状態を管理
@Composable
fun CounterScreen() {
    var count by remember { mutableStateOf(0) }

    Counter(
        count = count,
        onIncrement = { count++ }
    )
}
```

### State Hoistingのメリット

| メリット | 説明 |
|----------|------|
| **テストしやすい** | 状態を外から渡せるので、テストが簡単 |
| **再利用しやすい** | 異なる状態管理方法でも同じUIを使える |
| **デバッグしやすい** | 状態の流れが明確 |
| **単一の情報源** | 状態がどこにあるか明確 |

### パターン：value + onValueChange

```kotlin
// よく見るパターン
@Composable
fun NameInput(
    name: String,
    onNameChange: (String) -> Unit
) {
    OutlinedTextField(
        value = name,
        onValueChange = onNameChange,
        label = { Text("名前") }
    )
}

// 使う側
@Composable
fun NameScreen() {
    var name by remember { mutableStateOf("") }

    NameInput(
        name = name,
        onNameChange = { name = it }
    )
}
```

---

## rememberSaveable - 画面回転でも状態を保持

`remember`は画面回転や構成の変更で**リセット**されます。
`rememberSaveable`を使うと保持されます。

```kotlin
// 画面回転でリセットされる
var count by remember { mutableStateOf(0) }

// 画面回転でも保持される
var count by rememberSaveable { mutableStateOf(0) }
```

### いつrememberSaveableを使うか

| 状況 | 使うべき |
|------|----------|
| ユーザーが入力したテキスト | rememberSaveable |
| 一時的なUI状態（展開/折りたたみなど） | remember |
| スクロール位置 | remember（自動で保持される） |
| 重要なフォームデータ | ViewModelで管理 |

---

## 複数の状態を扱う

### 個別に管理

```kotlin
@Composable
fun UserForm() {
    var firstName by remember { mutableStateOf("") }
    var lastName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var age by remember { mutableStateOf("") }

    // ...
}
```

### データクラスでまとめる

```kotlin
data class UserFormState(
    val firstName: String = "",
    val lastName: String = "",
    val email: String = "",
    val age: String = ""
)

@Composable
fun UserForm() {
    var formState by remember { mutableStateOf(UserFormState()) }

    OutlinedTextField(
        value = formState.firstName,
        onValueChange = { formState = formState.copy(firstName = it) },
        label = { Text("名") }
    )

    OutlinedTextField(
        value = formState.lastName,
        onValueChange = { formState = formState.copy(lastName = it) },
        label = { Text("姓") }
    )

    // ...
}
```

---

## derivedStateOf - 派生状態

他の状態から計算される状態は`derivedStateOf`で効率的に管理できます。

```kotlin
@Composable
fun SearchableList(items: List<String>) {
    var searchQuery by remember { mutableStateOf("") }

    // searchQueryが変わったときだけ再計算
    val filteredItems by remember(searchQuery) {
        derivedStateOf {
            items.filter { it.contains(searchQuery, ignoreCase = true) }
        }
    }

    Column {
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            label = { Text("検索") }
        )

        LazyColumn {
            items(filteredItems) { item ->
                Text(item)
            }
        }
    }
}
```

---

## AIに聞いてみよう

状態管理でわからないことがあったら、AIに質問しましょう。

### 質問例

```text
【質問】
remember と rememberSaveable の違いは何？
どっちをいつ使えばいいの？
```

```text
【質問】
State Hoisting（状態の巻き上げ）って何？
なぜ必要なの？具体例で教えて。
```

```text
【質問】
以下のコードでカウンターが動かないのはなぜ？

@Composable
fun Counter() {
    var count = 0
    Button(onClick = { count++ }) {
        Text("$count")
    }
}
```

```text
【コードレビューお願い】
フォームの状態管理、このやり方で大丈夫？
もっと良い方法ある？

var name by remember { mutableStateOf("") }
var email by remember { mutableStateOf("") }
var password by remember { mutableStateOf("") }
```

---

## 演習

### TODOリスト入力を作る

学んだ内容を使って、TODOの追加機能を作ってみましょう。

### 要件

1. テキスト入力欄がある
2. 「追加」ボタンを押すとリストに追加される
3. 空のテキストは追加できない
4. 追加後、入力欄がクリアされる

### チャレンジしてみよう

```kotlin
@Composable
fun TodoInput() {
    // ここにコードを書いてみよう
}
```

### 解答例

```kotlin
@Composable
fun TodoInput() {
    var inputText by remember { mutableStateOf("") }
    var todos by remember { mutableStateOf(listOf<String>()) }

    Column(modifier = Modifier.padding(16.dp)) {
        // 入力エリア
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = inputText,
                onValueChange = { inputText = it },
                label = { Text("新しいTODO") },
                modifier = Modifier.weight(1f),
                singleLine = true
            )

            Spacer(modifier = Modifier.width(8.dp))

            Button(
                onClick = {
                    if (inputText.isNotBlank()) {
                        todos = todos + inputText.trim()
                        inputText = ""
                    }
                },
                enabled = inputText.isNotBlank()
            ) {
                Text("追加")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // TODOリスト
        if (todos.isEmpty()) {
            Text(
                text = "TODOがありません",
                color = Color.Gray,
                modifier = Modifier.padding(16.dp)
            )
        } else {
            todos.forEachIndexed { index, todo ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(todo)
                        IconButton(
                            onClick = {
                                todos = todos.filterIndexed { i, _ -> i != index }
                            }
                        ) {
                            Icon(
                                imageVector = Icons.Default.Delete,
                                contentDescription = "削除"
                            )
                        }
                    }
                }
            }
        }
    }
}
```

---

## よくあるエラーと解決方法

### 状態が更新されない

```text
問題：ボタンを押しても画面が変わらない
```

**確認ポイント：**
1. `remember`を使っているか？
2. `mutableStateOf`を使っているか？
3. `by`を使う場合は`var`にしているか？

```kotlin
// NG
val count = 0

// NG
val count = remember { 0 }

// NG
val count by remember { mutableStateOf(0) }  // val だと更新できない

// OK
var count by remember { mutableStateOf(0) }
```

### リストの更新が反映されない

```kotlin
// NG: mutableListOfを変更しても再コンポジションされない
val list = remember { mutableListOf("A", "B") }
list.add("C")  // UIは更新されない

// OK: 新しいリストを代入する
var list by remember { mutableStateOf(listOf("A", "B")) }
list = list + "C"  // UIが更新される
```

### 画面回転で状態がリセットされる

```kotlin
// rememberは画面回転でリセットされる
var text by remember { mutableStateOf("") }

// rememberSaveableを使う
var text by rememberSaveable { mutableStateOf("") }
```

---

## チェックリスト

この章を完了したか確認しましょう。

- [ ] 状態（State）がなぜ必要か説明できる
- [ ] remember と mutableStateOf を使える
- [ ] by を使った委譲プロパティを理解している
- [ ] ボタンクリックで状態を更新できる
- [ ] テキスト入力の値を状態で管理できる
- [ ] State Hoisting の概念を理解している
- [ ] remember と rememberSaveable の違いがわかる

---

## まとめ

この章では以下を学びました：

1. **状態（State）** - UIに影響を与えるデータ
2. **remember** - 再コンポジションをまたいで値を保持
3. **mutableStateOf** - Composeが監視できる状態
4. **ユーザー入力** - TextField での入力値管理
5. **State Hoisting** - 状態を親に巻き上げるパターン
6. **rememberSaveable** - 構成変更をまたいで保持

状態管理は Compose の核心部分です。
この概念をしっかり理解することで、複雑なアプリも作れるようになります。

---

## ふりかえり

- Stateは「どこに置く」と後で困らない？（Composable内/親/VM）
- `remember` と `rememberSaveable` をどう使い分ける？
- シンプルメモアプリで、次に状態として管理したいものは何？（入力/一覧/選択など）

---

## 次の章

次は `chapters/05-lists-lazycolumn.md` に進み、一覧表示を作り込みましょう。
