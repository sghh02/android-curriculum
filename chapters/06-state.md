# Composeの状態管理

Composeでは「状態(state)」がUIを決めます。状態が変わるとUIは自動で再描画されます。

## 目標
- `remember` と `mutableStateOf` を使える
- 状態変更でUIが更新される流れを理解する

## 概念の説明
- 状態はUIの「元データ」です。状態が変わるとUIが再描画されます。
- `remember`は状態を保持し、`mutableStateOf`は変更を検知します。

## コード例
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

## 状態の分離（概念の補足）
- UIは **状態を受け取って描画するだけ** が理想
- ロジックはViewModelへ分離する

## AIに聞いてみよう
- 「`remember`と`rememberSaveable`の違いは？」
- 「状態をどこに置くと再利用しやすい？」

## ハンズオン
- ボタンを押すと文字色が変わるUI
- メモ入力欄と追加ボタンでリストを増やす

## よくあるエラー
- **状態が更新されない**：`mutableStateOf`を使っているか確認。
- **再描画が起きない**：状態が`val`で固定されていないか確認。

## チェックリスト
- [ ] `remember`で状態を保持できる
- [ ] 状態の変更でUIが更新される
- [ ] 入力フォームで状態を扱えた

---

次章では、状態管理とユーザーインタラクションを組み合わせた実践に進みます。
