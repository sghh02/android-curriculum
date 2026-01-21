# 基本的なレイアウトコンポーネント

Composeのレイアウトは **Row / Column / Box** を中心に組み立てます。

## 目標
- Row/Column/Boxの使い分けを理解する
- Modifierで余白や配置を調整できる

## 代表的なレイアウト
```kotlin
Column(
    modifier = Modifier
        .fillMaxSize()
        .padding(16.dp),
    verticalArrangement = Arrangement.spacedBy(8.dp)
) {
    Text("Title", style = MaterialTheme.typography.headlineSmall)
    Text("Body text here")
}
```

## よく使うModifier
- `padding` : 余白
- `size` / `fillMaxSize` : サイズ
- `background` : 背景色
- `clickable` : タップ可能にする

## ミニ課題
- Columnの中にTextを3つ並べる
- Boxで重ね合わせのUIを作る（例: 画像の上にラベル）

---

次章では **Kotlin基礎** を学び、Android開発でよく使う文法に慣れていきます。
