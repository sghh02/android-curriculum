# サイコロアプリを作ろう

ボタンをタップするとサイコロを振れるインタラクティブなアプリを作ります。
この章で、**ユーザー操作に反応するUI**の基本を学びます。

---

## 前提

- Unit 1を完了している
- Composeの基本（Text, Image, Column, Modifier）が理解できている

## この章でできるようになること

- [ ] Buttonでクリックイベントを処理できる
- [ ] rememberで状態を保持できる
- [ ] mutableStateOfで状態を更新できる
- [ ] 状態に応じてUIを変更できる

**所要時間の目安：2〜3時間**（公式Codelab含む）

---

## 🎯 STEP 1: 公式Codelabで実践（必須）

**まず以下のCodelabを完了してください。**

| Codelab | 内容 | 所要時間 |
|---------|------|----------|
| [インタラクティブなサイコロアプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-build-a-dice-roller-app?hl=ja) | ボタン、状態、画像切り替え | 90分 |
| [Android Studioでデバッガを使用する](https://developer.android.com/codelabs/basic-android-kotlin-compose-using-the-debugger?hl=ja) | デバッグ方法 | 30分 |

> 💡 **ヒント**: デバッガの使い方を覚えると、バグを見つけやすくなります！

---

## 📚 STEP 2: 概念の深掘り

### なぜ「状態」が必要なのか

Composeは**宣言的UI**です。UIは「状態」に基づいて描画されます。

```
状態が変わる → UIが自動的に更新される
```

### remember と mutableStateOf

```kotlin
@Composable
fun DiceRoller() {
    // remember: Composableが再構成されても値を保持
    // mutableStateOf: 値が変わったらUIを更新
    var result by remember { mutableStateOf(1) }

    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // 状態に基づいて画像を表示
        val imageResource = when (result) {
            1 -> R.drawable.dice_1
            2 -> R.drawable.dice_2
            3 -> R.drawable.dice_3
            4 -> R.drawable.dice_4
            5 -> R.drawable.dice_5
            else -> R.drawable.dice_6
        }

        Image(
            painter = painterResource(imageResource),
            contentDescription = result.toString()
        )

        Spacer(modifier = Modifier.height(16.dp))

        // ボタンをクリックすると状態が変わる
        Button(onClick = { result = (1..6).random() }) {
            Text("Roll")
        }
    }
}
```

### 状態の更新フロー

```
1. ユーザーがボタンをクリック
      ↓
2. onClick が呼ばれる
      ↓
3. result の値が変わる (例: 1 → 4)
      ↓
4. Composeが検知して再構成(Recomposition)
      ↓
5. 新しい result に基づいてUIが更新される
```

### Button の使い方

```kotlin
// 基本的なボタン
Button(onClick = { /* クリック時の処理 */ }) {
    Text("ボタン")
}

// アイコン付きボタン
Button(onClick = { }) {
    Icon(Icons.Default.Add, contentDescription = null)
    Spacer(modifier = Modifier.width(8.dp))
    Text("追加")
}

// 無効化されたボタン
Button(
    onClick = { },
    enabled = false  // クリックできない
) {
    Text("無効")
}

// アウトラインボタン（線だけのボタン）
OutlinedButton(onClick = { }) {
    Text("キャンセル")
}

// テキストボタン（背景なし）
TextButton(onClick = { }) {
    Text("詳細")
}
```

---

## ⚠️ STEP 3: つまずきポイント集

### Q1: by remember が使えない

**症状：**
```
Type 'TypeVariable(T)' has no method 'getValue(Nothing?, KProperty<*>)'
```

**解決方法：**
```kotlin
// import を追加
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue

// 正しい書き方
var count by remember { mutableStateOf(0) }
```

### Q2: 状態が更新されない

**症状：** ボタンをクリックしても画面が変わらない

**原因と解決：**
```kotlin
// ❌ NG: rememberを使っていない
var count = mutableStateOf(0)  // 毎回リセットされる

// ❌ NG: mutableStateOfを使っていない
var count by remember { 0 }  // 変更が検知されない

// ✅ OK: 両方使う
var count by remember { mutableStateOf(0) }
```

### Q3: = と by の違い

```kotlin
// パターン1: = を使う場合
val count = remember { mutableStateOf(0) }
// 使うとき: count.value を使う
Text("Count: ${count.value}")
Button(onClick = { count.value++ }) { ... }

// パターン2: by を使う場合（推奨）
var count by remember { mutableStateOf(0) }
// 使うとき: そのまま count を使える
Text("Count: $count")
Button(onClick = { count++ }) { ... }
```

`by` を使うと `.value` が不要になり、コードが簡潔になります。

### Q4: サイコロ画像が表示されない

**解決方法：**

1. **画像ファイルを配置**
   ```
   app/src/main/res/drawable/
   ├── dice_1.png
   ├── dice_2.png
   ├── dice_3.png
   ├── dice_4.png
   ├── dice_5.png
   └── dice_6.png
   ```

2. **Codelabから画像をダウンロード**
   - Codelabの指示に従って画像をダウンロード
   - drawableフォルダにコピー

---

## 🛠️ STEP 4: 応用課題

### 課題1: ロール回数を表示

サイコロを振った回数を表示してください。

```
[サイコロ画像]
ロール回数: 5
[Roll]
```

<details>
<summary>ヒント</summary>

```kotlin
var result by remember { mutableStateOf(1) }
var rollCount by remember { mutableStateOf(0) }

Button(onClick = {
    result = (1..6).random()
    rollCount++
}) {
    Text("Roll")
}

Text("ロール回数: $rollCount")
```

</details>

### 課題2: 2つのサイコロ

2つのサイコロを同時に振れるようにしてください。

<details>
<summary>ヒント</summary>

```kotlin
var dice1 by remember { mutableStateOf(1) }
var dice2 by remember { mutableStateOf(1) }

Row {
    Image(painterResource(getDiceImage(dice1)), ...)
    Spacer(modifier = Modifier.width(16.dp))
    Image(painterResource(getDiceImage(dice2)), ...)
}

Button(onClick = {
    dice1 = (1..6).random()
    dice2 = (1..6).random()
}) {
    Text("Roll")
}

Text("合計: ${dice1 + dice2}")
```

</details>

### 課題3: リセットボタン

ロール回数をリセットするボタンを追加してください。

---

## ✅ チェックリスト

この章を完了したか確認しましょう。

- [ ] 公式Codelabを2つとも完了した
- [ ] Buttonのクリックイベントを実装できる
- [ ] remember と mutableStateOf を使える
- [ ] 状態に応じてUIが変わる仕組みを理解した
- [ ] デバッガの基本的な使い方を覚えた
- [ ] 応用課題を1つ以上試した

---

## 次の章

次は [状態管理入門](./02-state-intro.md) に進み、状態管理をより深く学びましょう。
