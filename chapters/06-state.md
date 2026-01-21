# Composeの状態管理

Composeでは「状態(state)」がUIを決めます。状態が変わるとUIは自動で再描画されます。

## 目標
- `remember` と `mutableStateOf` を使える
- 状態変更でUIが更新される流れを理解する

## 基本例
```kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }
    Column {
        Text("Count: $count")
        Button(onClick = { count++ }) { Text("+1") }
    }
}
```

## 状態の分離
- UIは **状態を受け取って描画するだけ** が理想
- ロジックはViewModelへ分離する

## ミニ課題
- ボタンを押すと文字色が変わるUI
- TODO入力欄と追加ボタンでリストを増やす

---

次章では、画面遷移（Navigation）を学びます。
