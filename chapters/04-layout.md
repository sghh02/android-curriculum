# 基本的なレイアウトコンポーネント

Composeのレイアウトは **Row / Column / Box** を中心に組み立てます。

## 目標
- Row/Column/Boxの使い分けを理解する
- Modifierで余白や配置を調整できる

## 概念の説明
- **Column**は縦並び、**Row**は横並び、**Box**は重ね合わせです。
- `Modifier`でサイズ・余白・配置を細かく調整します。

## コード例
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

## よく使うModifier（概念の補足）
- `padding` : 余白
- `size` / `fillMaxSize` : サイズ
- `background` : 背景色
- `clickable` : タップ可能にする

## AIに聞いてみよう
- 「RowとColumnの使い分けの基準は？」
- 「Modifierは順番で何が変わるの？」
- 「Boxで中央揃えにするにはどう書く？」

## ハンズオン
- Columnの中にTextを3つ並べる
- Boxで重ね合わせのUIを作る（例: 画像の上にラベル）

## よくあるエラー
- **余白が効かない**：`Modifier`の付け忘れや順番ミスを確認。
- **配置がずれる**：`Arrangement`や`Alignment`の指定を確認。

## チェックリスト
- [ ] Row/Column/Boxの違いを説明できる
- [ ] Modifierで余白とサイズを調整できる
- [ ] Boxで重ね合わせのUIを作れた

---

次章では **Composeの状態管理** を学び、UIの変化を扱えるようにしていきます。
