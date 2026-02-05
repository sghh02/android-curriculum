# 最初のAndroidアプリを作ろう

Android Studioの環境が整ったら、いよいよ最初のAndroidアプリを作成します。
この章では、「Hello, Android!」を表示するシンプルなアプリを作ります。

---

## 前提

- [Android Studioのインストールと環境準備](./01-setup.md) を完了している
- Android Studioが正常に起動する

## この章でできるようになること

- [ ] Android Studioで新しいプロジェクトを作成できる
- [ ] エミュレーターでアプリを実行できる
- [ ] Composeで「Hello, World!」を表示できる
- [ ] アプリの基本構造を理解する

**所要時間の目安：2〜3時間**（公式Codelab含む）

---

## 🎯 STEP 1: 公式Codelabで実践（必須）

**まず以下のCodelabを完了してください。**

| Codelab | 内容 | 所要時間 |
|---------|------|----------|
| [最初のAndroidアプリを作成する](https://developer.android.com/codelabs/basic-android-kotlin-compose-first-app?hl=ja) | プロジェクト作成、実行 | 60分 |
| [Androidエミュレーターでアプリを実行する](https://developer.android.com/codelabs/basic-android-kotlin-compose-emulator?hl=ja) | エミュレーター設定 | 30分 |

> 💡 **ヒント**: エミュレーターが遅い場合は、下の「つまずきポイント」を確認してください。

---

## 📚 STEP 2: 概念の深掘り

### Androidアプリの基本構造

Codelabで作成したプロジェクトの構造を理解しましょう。

```
MyFirstApp/
├── app/
│   ├── src/main/
│   │   ├── java/com/example/myfirstapp/
│   │   │   └── MainActivity.kt      ← メイン画面のコード
│   │   ├── res/
│   │   │   ├── values/
│   │   │   │   └── strings.xml      ← 文字列リソース
│   │   │   └── drawable/            ← 画像リソース
│   │   └── AndroidManifest.xml      ← アプリの設定
│   └── build.gradle.kts             ← ビルド設定
└── build.gradle.kts                 ← プロジェクト全体の設定
```

### MainActivityの解説

```kotlin
package com.example.myfirstapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.Text

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // ここでUIを設定
        setContent {
            Text("Hello, Android!")
        }
    }
}
```

**重要なポイント：**

| 要素 | 説明 |
|------|------|
| `ComponentActivity` | Compose用のActivity基底クラス |
| `onCreate()` | アプリ起動時に呼ばれる |
| `setContent { }` | ComposeのUIを設定するブロック |
| `Text()` | テキストを表示するComposable |

### @Composable関数

Composeでは、UIを**関数**として定義します。

```kotlin
// @Composable をつけた関数 = UI部品
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}

// 使い方
setContent {
    Greeting(name = "Android")
}
```

### なぜComposeを使うのか

| 従来のXML方式 | Jetpack Compose |
|-------------|-----------------|
| XMLとKotlinの2言語 | **Kotlinだけ** |
| findViewById必要 | **不要** |
| 状態管理が複雑 | **シンプル** |
| Google過去推奨 | **Google現在推奨** |

---

## ⚠️ STEP 3: つまずきポイント集

### Q1: エミュレーターが起動しない

**症状：** エミュレーターを起動しようとするとエラー

**解決方法：**

1. **HAXM/WHPXが有効か確認**
   - Windows: BIOSでVT-x有効化
   - Mac: 通常は問題なし

2. **SDK Toolsの確認**
   ```
   Tools → SDK Manager → SDK Tools タブ
   → Android Emulator にチェック
   ```

3. **新しいAVDを作成**
   ```
   Tools → Device Manager → Create Device
   → Pixel 6 など新しい機種を選択
   ```

### Q2: エミュレーターが遅い

**解決方法：**

1. **Cold Boot を試す**
   - Device Manager → デバイスの▼ → Cold Boot Now

2. **軽いエミュレーターを使う**
   - x86_64イメージを選択（ARMより速い）
   - RAMを4GB以上に設定

3. **実機を使う**
   - USB接続 + USBデバッグ有効化
   - 最も速く、確実

### Q3: 「Gradle sync failed」エラー

**症状：**
```
Gradle sync failed: Connection refused
```

**解決方法：**

1. **VPNをオフにする**（よくある原因）

2. **プロキシ設定を確認**
   ```
   File → Settings → Appearance & Behavior
   → System Settings → HTTP Proxy
   → No proxy を選択
   ```

3. **Gradleキャッシュをクリア**
   ```
   File → Invalidate Caches → Invalidate and Restart
   ```

### Q4: 「SDK location not found」エラー

**解決方法：**

1. **local.propertiesを確認**
   ```properties
   sdk.dir=/Users/yourname/Library/Android/sdk
   ```

2. **SDK Managerでパスを確認**
   ```
   File → Settings → Languages & Frameworks
   → Android SDK → Android SDK Location
   ```

### Q5: アプリは起動するが画面が真っ白

**原因：** setContentの中身がない、またはエラー

**確認方法：**
1. Logcatタブを開く
2. エラーメッセージを確認
3. `setContent { }` 内のコードを確認

---

## 🛠️ STEP 4: 応用課題

### 課題1: 自分の名前を表示

「Hello, [自分の名前]!」と表示するように変更してください。

```kotlin
setContent {
    Greeting(name = "あなたの名前")
}
```

### 課題2: 複数行のテキスト

以下のように複数行のテキストを表示してください。

```
こんにちは
私の最初のAndroidアプリです
```

<details>
<summary>ヒント</summary>

```kotlin
setContent {
    Column {
        Text("こんにちは")
        Text("私の最初のAndroidアプリです")
    }
}
```

`Column`を使うと縦に並べられます。

</details>

### 課題3: テキストの色を変える

テキストの色を赤色にしてください。

<details>
<summary>ヒント</summary>

```kotlin
import androidx.compose.ui.graphics.Color

Text(
    text = "Hello, Android!",
    color = Color.Red
)
```

</details>

---

## ✅ チェックリスト

この章を完了したか確認しましょう。

- [ ] 公式Codelabを2つとも完了した
- [ ] 新しいプロジェクトを作成できた
- [ ] エミュレーターまたは実機でアプリを実行できた
- [ ] MainActivityの基本構造を理解した
- [ ] @Composable関数の概念を理解した
- [ ] 応用課題を1つ以上試した

---

## 次の章

次は [基本レイアウト](./01-basic-layout.md) に進み、TextやImageなどの基本的なUI部品を学びましょう。
