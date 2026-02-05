# 基本レイアウト（Text, Image, Box）

この章では、Composeの基本的なUI部品と、それらを配置する方法を学びます。
これらをマスターすれば、シンプルなUIを作れるようになります。

---

## 前提

- [最初のAndroidアプリを作ろう](./01-first-app.md) を完了している
- Android Studioでアプリを実行できる

## この章でできるようになること

- [ ] Textでテキストを表示できる
- [ ] Imageで画像を表示できる
- [ ] Column/Row/Boxでレイアウトを組める
- [ ] Modifierでサイズや余白を調整できる

**所要時間の目安：2〜3時間**（公式Codelab含む）

---

## 🎯 STEP 1: 公式Codelabで実践（必須）

**まず以下のCodelabを完了してください。**

| Codelab | 内容 | 所要時間 |
|---------|------|----------|
| [テキストComposableを使用してシンプルなアプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-text-composables?hl=ja) | Text, Preview | 60分 |
| [Androidアプリに画像を追加する](https://developer.android.com/codelabs/basic-android-kotlin-compose-add-images?hl=ja) | Image, Modifier, レイアウト | 60分 |

> 💡 **ヒント**: Codelabで作る「誕生日カード」は、次のプロジェクト課題の良い練習になります。

---

## 📚 STEP 2: 概念の深掘り

### Text - テキスト表示

```kotlin
@Composable
fun TextExamples() {
    // 基本
    Text(text = "Hello, World!")

    // スタイル指定
    Text(
        text = "スタイル付きテキスト",
        fontSize = 24.sp,           // サイズ
        fontWeight = FontWeight.Bold, // 太字
        color = Color.Blue,         // 色
        textAlign = TextAlign.Center, // 中央揃え
        maxLines = 2,               // 最大行数
        overflow = TextOverflow.Ellipsis  // 省略記号
    )
}
```

### Image - 画像表示

```kotlin
@Composable
fun ImageExamples() {
    // drawableフォルダの画像を表示
    Image(
        painter = painterResource(id = R.drawable.my_image),
        contentDescription = "画像の説明"  // アクセシビリティ用
    )

    // サイズと切り抜き
    Image(
        painter = painterResource(id = R.drawable.profile),
        contentDescription = "プロフィール画像",
        modifier = Modifier.size(100.dp),
        contentScale = ContentScale.Crop  // 切り抜き
    )
}
```

### レイアウト: Column（縦に並べる）

```kotlin
@Composable
fun ColumnExample() {
    Column {
        Text("1番目")
        Text("2番目")
        Text("3番目")
    }
    // 結果:
    // 1番目
    // 2番目
    // 3番目
}
```

### レイアウト: Row（横に並べる）

```kotlin
@Composable
fun RowExample() {
    Row {
        Text("左")
        Text("中央")
        Text("右")
    }
    // 結果: 左 中央 右
}
```

### レイアウト: Box（重ねる）

```kotlin
@Composable
fun BoxExample() {
    Box {
        // 後に書いたものが上に重なる
        Image(
            painter = painterResource(R.drawable.background),
            contentDescription = null
        )
        Text(
            text = "重ねて表示",
            color = Color.White
        )
    }
}
```

### Modifier - サイズと余白

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

**よく使うModifier：**

| Modifier | 説明 |
|----------|------|
| `.padding(16.dp)` | 余白を追加 |
| `.size(100.dp)` | 幅と高さを指定 |
| `.fillMaxWidth()` | 横幅いっぱい |
| `.fillMaxSize()` | 全体いっぱい |
| `.background(Color.Red)` | 背景色 |
| `.clickable { }` | クリック可能に |

### ⚠️ Modifierの順序は重要！

```kotlin
// パターン1：背景の後にパディング
Text(
    "Hello",
    modifier = Modifier
        .background(Color.Yellow)
        .padding(16.dp)
)
// → 黄色い背景の中にテキスト、背景の外に余白

// パターン2：パディングの後に背景
Text(
    "Hello",
    modifier = Modifier
        .padding(16.dp)
        .background(Color.Yellow)
)
// → 余白の後に黄色い背景、背景はテキストにぴったり
```

### Preview - デザイン確認

```kotlin
@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    Greeting(name = "Android")
}
```

Previewを使うと、エミュレーターを起動せずにデザインを確認できます。

---

## ⚠️ STEP 3: つまずきポイント集

### Q1: 画像が表示されない

**症状：** `R.drawable.xxx`が見つからない

**解決方法：**

1. **画像ファイルを正しい場所に配置**
   ```
   app/src/main/res/drawable/my_image.png
   ```

2. **ファイル名のルール**
   - 小文字のみ（`my_image.png` ◯、`MyImage.png` ✕）
   - 数字から始めない（`1_image.png` ✕）
   - ハイフン不可（`my-image.png` ✕、`my_image.png` ◯）

3. **プロジェクトをリビルド**
   - Build → Rebuild Project

### Q2: Previewが表示されない

**症状：** Design タブにPreviewが出ない

**解決方法：**

1. **ビルドする**
   - Build → Make Project (Ctrl+F9)

2. **@Previewの位置を確認**
   ```kotlin
   // ✅ OK
   @Preview
   @Composable
   fun MyPreview() { ... }

   // ❌ NG: @Composableがない
   @Preview
   fun MyPreview() { ... }
   ```

3. **Preview関数に引数を入れない**
   ```kotlin
   // ❌ NG: 引数があるとPreviewできない
   @Preview
   @Composable
   fun Preview(name: String) { ... }

   // ✅ OK: 引数なし
   @Preview
   @Composable
   fun Preview() {
       Greeting("Android")
   }
   ```

### Q3: Modifierの順序で見た目が変わる

**理解のコツ：** Modifierは「内側から外側へ」適用されると考える

```kotlin
Modifier
    .padding(8.dp)      // 1. まず余白を追加
    .background(Color.Red)  // 2. その上に背景を描画
    .padding(8.dp)      // 3. さらに外側に余白を追加
```

### Q4: ContentScaleの違いがわからない

| ContentScale | 説明 |
|--------------|------|
| `Crop` | 画像を切り抜いてサイズに合わせる |
| `Fit` | アスペクト比を維持してサイズ内に収める |
| `FillBounds` | アスペクト比を無視してサイズに合わせる |
| `Inside` | 元サイズより大きくしない |

---

## 🛠️ STEP 4: 応用課題

### 課題1: プロフィールカード

以下のようなプロフィールカードを作成してください。

```
┌─────────────────────┐
│      [画像]         │
│                     │
│    山田 太郎        │
│  Android Developer  │
└─────────────────────┘
```

<details>
<summary>ヒント</summary>

```kotlin
@Composable
fun ProfileCard() {
    Column(
        modifier = Modifier
            .padding(16.dp)
            .fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Image(
            painter = painterResource(R.drawable.profile),
            contentDescription = "プロフィール画像",
            modifier = Modifier.size(100.dp)
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "山田 太郎",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "Android Developer",
            color = Color.Gray
        )
    }
}
```

</details>

### 課題2: 誕生日カードをカスタマイズ

Codelabで作った誕生日カードを、自分用にカスタマイズしてください。
- 別の画像を使う
- メッセージを変更する
- フォントサイズや色を変更する

---

## ✅ チェックリスト

この章を完了したか確認しましょう。

- [ ] 公式Codelabを2つとも完了した
- [ ] Textでテキストを表示できる
- [ ] Imageで画像を表示できる
- [ ] Column/Rowでレイアウトを組める
- [ ] Modifierでサイズ、余白を調整できる
- [ ] Previewでデザインを確認できる
- [ ] 応用課題を1つ以上試した

---

## 次の章

次は [プロジェクト：名刺アプリを作ろう](./01-project-business-card.md) に進み、Unit 1で学んだことを総合して名刺アプリを作りましょう！
