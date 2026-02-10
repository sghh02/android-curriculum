# プロジェクト：名刺アプリを作ろう

Unit 1の総仕上げとして、**名刺アプリ**を作成します。
これまで学んだKotlin基礎、レイアウト、Modifierを組み合わせて、オリジナルの名刺を作りましょう。

---

## 前提

- [基本レイアウト](./01-basic-layout.md) までを完了している
- Text, Image, Column, Row, Modifierの基本が理解できている

## この章でできるようになること

- [ ] 学んだ知識を組み合わせてアプリを作れる
- [ ] 自分でUIの構成を考えられる
- [ ] デザインを意識したコードが書ける

**所要時間の目安：2〜3時間**

---

## 🎯 STEP 1: 公式Codelabで実践（必須）

**まず以下のCodelabを完了してください。**

| Codelab | 内容 | 所要時間 |
|---------|------|----------|
| [Composeの基本の練習問題](https://developer.android.com/codelabs/basic-android-kotlin-compose-composables-practice-problems?hl=ja) | 4つの練習問題 | 60分 |
| [プロジェクト: 名刺アプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-business-card?hl=ja) | 名刺アプリの作成 | 90分 |

> 💡 **ヒント**: 練習問題を先にやると、名刺アプリがスムーズに作れます。

---

## 📚 STEP 2: 名刺アプリの設計

### 完成イメージ

```


          [ロゴ/写真]

           山田 太郎
       Android Developer

────────────────────────
   📞  090-1234-5678
   📧  tanaka@example.com
   🐦  @tanaka_android

```

### UI構成を分解

```
Column（全体を縦に並べる）
├── Box（上部: ロゴと名前）
│   ├── Image（ロゴ/写真）
│   ├── Text（名前）
│   └── Text（肩書き）
│
└── Column（下部: 連絡先）
    ├── Row（電話番号）
    │   ├── Icon
    │   └── Text
    ├── Row（メール）
    │   ├── Icon
    │   └── Text
    └── Row（SNS）
        ├── Icon
        └── Text
```

---

## 🛠️ STEP 3: 実装ガイド

### 基本構造

```kotlin
@Composable
fun BusinessCard() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFD2E8D4)),  // 背景色
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // 上部: ロゴと名前
        ProfileSection()

        Spacer(modifier = Modifier.height(48.dp))

        // 下部: 連絡先
        ContactSection()
    }
}
```

### 上部: プロフィールセクション

```kotlin
@Composable
fun ProfileSection() {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // ロゴ/写真
        Image(
            painter = painterResource(R.drawable.android_logo),
            contentDescription = "ロゴ",
            modifier = Modifier
                .size(120.dp)
                .clip(CircleShape)  // 丸く切り抜き
                .background(Color(0xFF073042))
                .padding(16.dp)
        )

        Spacer(modifier = Modifier.height(16.dp))

        // 名前
        Text(
            text = "山田 太郎",
            fontSize = 40.sp,
            fontWeight = FontWeight.Light
        )

        // 肩書き
        Text(
            text = "Android Developer",
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF006D3B)
        )
    }
}
```

### 下部: 連絡先セクション

```kotlin
@Composable
fun ContactSection() {
    Column {
        ContactRow(
            icon = Icons.Default.Phone,
            text = "090-1234-5678"
        )
        ContactRow(
            icon = Icons.Default.Email,
            text = "tanaka@example.com"
        )
        ContactRow(
            icon = Icons.Default.Share,
            text = "@tanaka_android"
        )
    }
}

@Composable
fun ContactRow(
    icon: ImageVector,
    text: String
) {
    Row(
        modifier = Modifier.padding(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = Color(0xFF006D3B),
            modifier = Modifier.size(24.dp)
        )
        Spacer(modifier = Modifier.width(16.dp))
        Text(
            text = text,
            fontSize = 16.sp
        )
    }
}
```

### 必要なimport

```kotlin
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
```

---

## ⚠️ STEP 4: つまずきポイント集

### Q1: アイコンが見つからない

**症状：** `Icons.Default.Phone`が見つからない

**解決方法：**

1. **依存関係を追加**（build.gradle.kts）
   ```kotlin
   implementation("androidx.compose.material:material-icons-extended")
   ```

2. **Sync Now をクリック**

3. **importを追加**
   ```kotlin
   import androidx.compose.material.icons.Icons
   import androidx.compose.material.icons.filled.Phone
   ```

### Q2: CircleShapeが見つからない

**解決方法：**
```kotlin
import androidx.compose.foundation.shape.CircleShape
```

### Q3: 背景色の指定方法

```kotlin
// RGB値で指定
Color(red = 210, green = 232, blue = 212)

// 16進数で指定（おすすめ）
Color(0xFFD2E8D4)  // 0xAARRGGBB形式
                    // AA = 透明度, RR = 赤, GG = 緑, BB = 青

// 定義済みの色
Color.White
Color.Black
Color.Red
```

### Q4: 中央揃えにならない

**解決方法：**

```kotlin
Column(
    modifier = Modifier.fillMaxSize(),
    // 縦方向の配置
    verticalArrangement = Arrangement.Center,
    // 横方向の配置
    horizontalAlignment = Alignment.CenterHorizontally
) {
    // 子要素
}
```

---

## 🎨 STEP 5: カスタマイズのアイデア

### 色の変更

```kotlin
// ダークテーマ風
val backgroundColor = Color(0xFF1E1E1E)
val textColor = Color.White
val accentColor = Color(0xFF4CAF50)
```

### フォントの変更

```kotlin
Text(
    text = "山田 太郎",
    fontFamily = FontFamily.Serif,  // 明朝体風
    fontStyle = FontStyle.Italic    // 斜体
)
```

### 画像を丸くする

```kotlin
Image(
    painter = painterResource(R.drawable.photo),
    contentDescription = null,
    modifier = Modifier
        .size(150.dp)
        .clip(CircleShape)  // 丸く切り抜き
        .border(3.dp, Color.White, CircleShape)  // 白い枠線
)
```

### グラデーション背景

```kotlin
Box(
    modifier = Modifier
        .fillMaxSize()
        .background(
            brush = Brush.verticalGradient(
                colors = listOf(
                    Color(0xFF1A237E),
                    Color(0xFF4A148C)
                )
            )
        )
) {
    // コンテンツ
}
```

---

## ✅ 課題提出

### 提出要件

1. **名刺アプリを完成させる**
   - 自分の情報（本名でなくてOK）を表示
   - 最低3つの連絡先情報を含める
   - 見た目をオリジナルにカスタマイズ

2. **GitHubにプッシュ**
   - ブランチ: `feature/01-business-card`
   - PRを作成

3. **スクリーンショット**
   - 完成した名刺アプリのスクリーンショットをPRに添付

### 評価ポイント

| 項目 | 内容 |
|------|------|
| **動作** | アプリがクラッシュせず動く |
| **レイアウト** | Column/Rowを適切に使っている |
| **Modifier** | padding, sizeなどを使っている |
| **カスタマイズ** | 色やフォントを変更している |
| **コード品質** | Composable関数を適切に分割している |

---

## ✅ チェックリスト

この章を完了したか確認しましょう。

- [ ] 公式Codelabの練習問題を完了した
- [ ] 公式Codelabの名刺アプリを完了した
- [ ] 自分オリジナルの名刺アプリを作成した
- [ ] Column/Row/Boxを使い分けられた
- [ ] Modifierでスタイルを調整できた
- [ ] GitHubにプッシュした

---

## 🎉 Unit 1 完了！

おめでとうございます！Unit 1を完了しました。

### 学んだこと

- ✅ Kotlinの基礎（変数、関数、制御構文）
- ✅ Android Studioの使い方
- ✅ Composeの基本（Text, Image, レイアウト）
- ✅ Modifierによるスタイリング

### 次のステップ

Unit 2では、より複雑なKotlin（クラス、Null安全、ラムダ式）と、ユーザー操作に反応するインタラクティブなUIを学びます。

[Unit 2: Kotlinの基礎とインタラクティブUI](./02-unit2-guide.md) へ進みましょう！
