# チップ計算アプリを作ろう

テキスト入力を受け取り、チップを計算するアプリを作ります。
この章で、**TextField**と**状態の持ち上げ（State Hoisting）**を学びます。

---

## 前提

- [サイコロアプリを作ろう](./02-dice-roller.md) を完了している
- remember と mutableStateOf の基本が理解できている

## この章でできるようになること

- [ ] TextFieldでユーザー入力を受け取れる
- [ ] 入力値を数値に変換できる
- [ ] 状態の持ち上げ（State Hoisting）を理解する
- [ ] Switch/Checkboxを使える

**所要時間の目安：3〜4時間**（公式Codelab含む）

---

## 🎯 STEP 1: 公式Codelabで実践（必須）

**まず以下のCodelabを完了してください。**

| Codelab | 内容 | 所要時間 |
|---------|------|----------|
| [Composeの状態の概要](https://developer.android.com/codelabs/basic-android-kotlin-compose-using-state?hl=ja) | remember, state hoisting | 60分 |
| [チップを計算する](https://developer.android.com/codelabs/basic-android-kotlin-compose-calculate-tip?hl=ja) | TextField, 計算処理 | 90分 |

> 💡 **ヒント**: 「状態の持ち上げ」は最初難しく感じますが、Codelabで実践すると理解できます。

---

## 📚 STEP 2: 概念の深掘り

### TextField の基本

```kotlin
@Composable
fun SimpleTextField() {
    var text by remember { mutableStateOf("") }

    TextField(
        value = text,                    // 現在の値
        onValueChange = { text = it },   // 値が変わったとき
        label = { Text("名前を入力") },
        placeholder = { Text("山田太郎") }
    )
}
```

### OutlinedTextField（枠線付き）

```kotlin
OutlinedTextField(
    value = amount,
    onValueChange = { amount = it },
    label = { Text("金額") },
    leadingIcon = {
        Icon(Icons.Default.AttachMoney, contentDescription = null)
    },
    keyboardOptions = KeyboardOptions(
        keyboardType = KeyboardType.Number  // 数字キーボード
    ),
    modifier = Modifier.fillMaxWidth()
)
```

### 状態の持ち上げ（State Hoisting）

**問題：** 子Composableで管理している状態を、親から使いたい

```kotlin
// ❌ 状態が子に閉じ込められている
@Composable
fun AmountInput() {
    var amount by remember { mutableStateOf("") }
    TextField(
        value = amount,
        onValueChange = { amount = it }
    )
}

@Composable
fun TipCalculator() {
    AmountInput()
    // ここで amount にアクセスできない！
}
```

**解決：** 状態を親に「持ち上げる」

```kotlin
// ✅ 状態を親に持ち上げる
@Composable
fun AmountInput(
    amount: String,              // 値は親から受け取る
    onAmountChange: (String) -> Unit  // 変更は親に通知
) {
    TextField(
        value = amount,
        onValueChange = onAmountChange
    )
}

@Composable
fun TipCalculator() {
    var amount by remember { mutableStateOf("") }

    AmountInput(
        amount = amount,
        onAmountChange = { amount = it }
    )

    // ここで amount を使ってチップを計算できる！
    val tip = calculateTip(amount)
    Text("チップ: ¥$tip")
}
```

### State Hoisting のパターン

```
Composable関数のパラメータ:
- value: T           → 現在の状態
- onValueChange: (T) -> Unit  → 状態変更のコールバック
```

### Switch と Checkbox

```kotlin
// Switch（オン/オフ）
var isRoundUp by remember { mutableStateOf(false) }

Switch(
    checked = isRoundUp,
    onCheckedChange = { isRoundUp = it }
)

// Checkbox
var isAgreed by remember { mutableStateOf(false) }

Row(verticalAlignment = Alignment.CenterVertically) {
    Checkbox(
        checked = isAgreed,
        onCheckedChange = { isAgreed = it }
    )
    Text("利用規約に同意する")
}
```

### 文字列から数値への変換

```kotlin
val amountInput = "100"

// 変換（失敗するとnull）
val amount = amountInput.toDoubleOrNull() ?: 0.0

// チップ計算
val tipPercent = 15.0
val tip = amount * (tipPercent / 100)

// 表示用にフォーマット
val formattedTip = NumberFormat.getCurrencyInstance().format(tip)
```

---

## ⚠️ STEP 3: つまずきポイント集

### Q1: 入力した数値が計算に反映されない

**症状：** TextFieldに入力しても計算結果が変わらない

**原因と解決：**
```kotlin
// ❌ NG: 変換に失敗している
val amount = amountInput.toDouble()  // 空文字でクラッシュ

// ✅ OK: 安全に変換
val amount = amountInput.toDoubleOrNull() ?: 0.0
```

### Q2: キーボードが数字入力にならない

**解決方法：**
```kotlin
TextField(
    value = amount,
    onValueChange = { amount = it },
    keyboardOptions = KeyboardOptions(
        keyboardType = KeyboardType.Number  // これを追加
    )
)
```

### Q3: 「状態の持ち上げ」がよくわからない

**考え方：**

```
従来のイメージ:
  子Composableが自分の状態を持つ

State Hoistingのイメージ:
  親が状態を持ち、子は「見せる」「変更を報告する」だけ

メリット:
  - 親が状態を把握できる
  - 複数の子で同じ状態を共有できる
  - テストしやすい
```

### Q4: onValueChangeの { it } がわからない

```kotlin
// it はラムダ式の暗黙の引数
onValueChange = { it }
// ↓ 同じ意味
onValueChange = { newValue -> newValue }

// 使い方
onValueChange = { newValue ->
    // newValue が新しい入力値
    amount = newValue
}
// 省略形
onValueChange = { amount = it }
```

---

## 🛠️ STEP 4: 応用課題

### 課題1: チップ率を選択可能に

チップ率（15%, 18%, 20%）を選択できるようにしてください。

<details>
<summary>ヒント</summary>

```kotlin
var tipPercent by remember { mutableStateOf(15.0) }

Row {
    listOf(15.0, 18.0, 20.0).forEach { percent ->
        OutlinedButton(
            onClick = { tipPercent = percent },
            colors = if (tipPercent == percent) {
                ButtonDefaults.outlinedButtonColors(
                    containerColor = MaterialTheme.colorScheme.primary
                )
            } else {
                ButtonDefaults.outlinedButtonColors()
            }
        ) {
            Text("${percent.toInt()}%")
        }
    }
}
```

</details>

### 課題2: 合計金額を表示

金額 + チップ = 合計 を表示してください。

### 課題3: 割り勘機能

人数を入力して、一人あたりの金額を計算してください。

---

## ✅ チェックリスト

この章を完了したか確認しましょう。

- [ ] 公式Codelabを2つとも完了した
- [ ] TextFieldでユーザー入力を受け取れる
- [ ] 状態の持ち上げ（State Hoisting）を理解した
- [ ] 文字列から数値への安全な変換ができる
- [ ] Switch/Checkboxを使える
- [ ] 応用課題を1つ以上試した

---

## 次の章

次は [自動テスト入門](./02-testing-intro.md) に進み、テストの書き方を学びましょう。
