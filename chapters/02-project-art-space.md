# プロジェクト：Art Spaceアプリを作ろう

Unit 2の総仕上げとして、**Art Space（アートギャラリー）アプリ**を作成します。
ボタンで画像を切り替えるインタラクティブなギャラリーアプリです。

---

## 前提

- Unit 2の章を完了している
- 状態管理（remember, mutableStateOf）が理解できている
- ボタンのクリックイベントを実装できる

## この章でできるようになること

- [ ] 複数の状態を組み合わせてアプリを作れる
- [ ] ボタンで画像や情報を切り替えられる
- [ ] Composable関数を適切に分割できる

**所要時間の目安：3〜4時間**

---

## 🎯 STEP 1: 公式Codelabで実践（必須）

**まず以下のCodelabを完了してください。**

| Codelab | 内容 | 所要時間 |
|---------|------|----------|
| [クリック動作の練習問題](https://developer.android.com/codelabs/basic-android-kotlin-compose-practice-click-behavior?hl=ja) | ボタン、状態の練習 | 60分 |
| [プロジェクト: Art Spaceアプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-art-space?hl=ja) | ギャラリーアプリ | 120分 |

> 💡 **ヒント**: このプロジェクトは自由度が高いので、オリジナリティを出しましょう！

---

## 📚 STEP 2: Art Spaceアプリの設計

### 完成イメージ

```
┌────────────────────────────────────┐
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │         [アート画像]          │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  作品タイトル                  │  │
│  │  アーティスト名 (年)           │  │
│  └──────────────────────────────┘  │
│                                    │
│     [Previous]      [Next]         │
└────────────────────────────────────┘
```

### データモデル

```kotlin
data class Artwork(
    val imageRes: Int,
    val title: String,
    val artist: String,
    val year: Int
)

val artworks = listOf(
    Artwork(R.drawable.starry_night, "星月夜", "フィンセント・ファン・ゴッホ", 1889),
    Artwork(R.drawable.mona_lisa, "モナ・リザ", "レオナルド・ダ・ヴィンチ", 1503),
    Artwork(R.drawable.girl_pearl, "真珠の耳飾りの少女", "ヨハネス・フェルメール", 1665),
    Artwork(R.drawable.great_wave, "神奈川沖浪裏", "葛飾北斎", 1831)
)
```

---

## 🛠️ STEP 3: 実装ガイド

### メイン画面の構造

```kotlin
@Composable
fun ArtSpaceApp() {
    var currentIndex by remember { mutableStateOf(0) }
    val currentArtwork = artworks[currentIndex]

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Spacer(modifier = Modifier.weight(1f))

        // アートワーク表示
        ArtworkDisplay(artwork = currentArtwork)

        Spacer(modifier = Modifier.weight(1f))

        // 作品情報
        ArtworkInfo(artwork = currentArtwork)

        Spacer(modifier = Modifier.height(24.dp))

        // ナビゲーションボタン
        NavigationButtons(
            onPrevious = {
                currentIndex = if (currentIndex > 0) {
                    currentIndex - 1
                } else {
                    artworks.lastIndex
                }
            },
            onNext = {
                currentIndex = if (currentIndex < artworks.lastIndex) {
                    currentIndex + 1
                } else {
                    0
                }
            }
        )
    }
}
```

### アートワーク表示

```kotlin
@Composable
fun ArtworkDisplay(artwork: Artwork) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .aspectRatio(1f),  // 正方形
        shadowElevation = 8.dp,
        color = MaterialTheme.colorScheme.surface
    ) {
        Image(
            painter = painterResource(artwork.imageRes),
            contentDescription = artwork.title,
            modifier = Modifier
                .padding(32.dp)
                .fillMaxSize(),
            contentScale = ContentScale.Fit
        )
    }
}
```

### 作品情報

```kotlin
@Composable
fun ArtworkInfo(artwork: Artwork) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.surfaceVariant
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = artwork.title,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "${artwork.artist} (${artwork.year})",
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium
            )
        }
    }
}
```

### ナビゲーションボタン

```kotlin
@Composable
fun NavigationButtons(
    onPrevious: () -> Unit,
    onNext: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Button(
            onClick = onPrevious,
            modifier = Modifier.weight(1f)
        ) {
            Text("Previous")
        }

        Spacer(modifier = Modifier.width(16.dp))

        Button(
            onClick = onNext,
            modifier = Modifier.weight(1f)
        ) {
            Text("Next")
        }
    }
}
```

---

## ⚠️ STEP 4: つまずきポイント集

### Q1: 画像が見つからない

**解決方法：**
1. 著作権フリーの画像を使用（Unsplash, Pixabay等）
2. `res/drawable`フォルダに配置
3. ファイル名は小文字・アンダースコアのみ

### Q2: インデックスが範囲外になる

**原因：** Previous/Nextの境界処理が不適切

```kotlin
// ✅ 循環するパターン
onNext = {
    currentIndex = (currentIndex + 1) % artworks.size
}
onPrevious = {
    currentIndex = if (currentIndex > 0) {
        currentIndex - 1
    } else {
        artworks.lastIndex
    }
}
```

### Q3: 画像のアスペクト比が崩れる

```kotlin
Image(
    painter = painterResource(artwork.imageRes),
    contentDescription = artwork.title,
    contentScale = ContentScale.Fit,  // アスペクト比を維持
    modifier = Modifier.fillMaxSize()
)
```

---

## 🎨 STEP 5: カスタマイズのアイデア

### アニメーションを追加

```kotlin
val animatedIndex by animateIntAsState(
    targetValue = currentIndex,
    animationSpec = tween(durationMillis = 300)
)
```

### スワイプで画像を切り替え

```kotlin
Box(
    modifier = Modifier
        .pointerInput(Unit) {
            detectHorizontalDragGestures { _, dragAmount ->
                if (dragAmount < -50) onNext()
                if (dragAmount > 50) onPrevious()
            }
        }
) {
    // 画像
}
```

### お気に入り機能

```kotlin
data class Artwork(
    val imageRes: Int,
    val title: String,
    val artist: String,
    val year: Int,
    var isFavorite: Boolean = false
)

// お気に入りボタン
IconButton(onClick = { artwork.isFavorite = !artwork.isFavorite }) {
    Icon(
        imageVector = if (artwork.isFavorite) {
            Icons.Filled.Favorite
        } else {
            Icons.Outlined.FavoriteBorder
        },
        contentDescription = "お気に入り"
    )
}
```

---

## ✅ 課題提出

### 提出要件

1. **Art Spaceアプリを完成させる**
   - 最低4枚の画像を切り替えられる
   - Previous/Nextボタンが動作する
   - 作品情報が表示される

2. **オリジナル要素を追加**（以下から1つ以上）
   - テーマや配色のカスタマイズ
   - アニメーション
   - お気に入り機能
   - その他のアイデア

3. **GitHubにプッシュ**
   - ブランチ: `feature/02-art-space`
   - PRを作成、スクリーンショットを添付

### 評価ポイント

| 項目 | 内容 |
|------|------|
| **動作** | アプリがクラッシュせず動く |
| **状態管理** | remember/mutableStateOfを適切に使用 |
| **コード分割** | Composable関数を適切に分割 |
| **カスタマイズ** | オリジナル要素がある |

---

## ✅ チェックリスト

この章を完了したか確認しましょう。

- [ ] 公式Codelabを2つとも完了した
- [ ] オリジナルのArt Spaceアプリを作成した
- [ ] Previous/Nextで画像が切り替わる
- [ ] 作品情報が正しく表示される
- [ ] オリジナル要素を1つ以上追加した
- [ ] GitHubにプッシュした

---

## 🎉 Unit 2 完了！

おめでとうございます！Unit 2を完了しました。

### 学んだこと

- ✅ Kotlinの基礎（条件分岐、Null安全、クラス、ラムダ式）
- ✅ ボタンとクリックイベント
- ✅ 状態管理（remember, mutableStateOf）
- ✅ 状態の持ち上げ（State Hoisting）
- ✅ TextField、Switch、Checkbox
- ✅ 自動テストの基礎

### 次のステップ

Unit 3では、リスト表示（LazyColumn）とMaterial Design 3を学び、よりプロフェッショナルなUIを作れるようになります。

[Unit 3: リスト表示とMaterial Design](./03-unit3-guide.md) へ進みましょう！
