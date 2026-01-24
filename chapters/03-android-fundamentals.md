# Androidアプリの基本

Androidアプリがどのように動いているのか、基本的な仕組みを理解します。
この章では、Android特有の概念を学び、アプリ開発の土台を固めます。

---

## 前提

- [オブジェクト指向プログラミング](chapters/02-oop-fundamentals.md) を完了し、クラス/責務の考え方がわかる
- [Android Studioのインストールと環境準備](chapters/01-setup.md) を完了し、Android Studioでプロジェクトを作って起動できる

## この章でできるようになること

- [ ] Androidアプリの基本構造を理解する
- [ ] ActivityとComposeの関係がわかる
- [ ] ライフサイクルの基本を理解する
- [ ] リソース管理の仕組みがわかる
- [ ] AndroidManifest.xmlの役割を理解する
- [ ] 実際にシンプルメモアプリのプロジェクトを作成できる

**所要時間の目安：2〜3時間**

---

## この章で作るもの

**シンプルメモアプリのプロジェクト**を作成します。

```text
SimpleMemoApp/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/example/simplememo/
│   │       │   └── MainActivity.kt
│   │       ├── res/
│   │       │   ├── values/
│   │       │   │   ├── strings.xml
│   │       │   │   └── colors.xml
│   │       │   └── drawable/
│   │       └── AndroidManifest.xml
│   └── build.gradle.kts
└── build.gradle.kts
```

最初の一歩として、「Hello, メモアプリ！」を表示するアプリを作ります。

---

## なぜAndroidの基礎を学ぶのか

### プログラミング vs Androidアプリ開発

**Kotlinのプログラミング**を学んだだけでは、**Androidアプリは作れません**。

| 学習内容 | できること | できないこと |
|---------|----------|------------|
| Kotlinプログラミング | 変数、関数、クラスを書く | 画面を表示する、タップを検知する |
| Android基礎 | ✅ 画面を表示、タップ検知、データ保存 | - |

Androidアプリを作るには、**Android特有の仕組み**を理解する必要があります。

### この章で学ぶこと

```text
Kotlinの知識
    ↓
Android特有の仕組みを学ぶ（この章）
    ↓
実際のアプリが作れる！
```

---

## Androidアプリの基本構造

### アプリの構成要素

Androidアプリは、いくつかの**コンポーネント**で構成されています。

```text
Androidアプリ
├── Activity（画面）
├── Service（バックグラウンド処理）
├── BroadcastReceiver（システムイベントの受信）
└── ContentProvider（データ共有）
```

初学者が最初に学ぶのは**Activity**です。

---

## Activity：アプリの「画面」

### Activityとは

**Activity = 1つの画面**

```text
メモアプリの例：
- メモ一覧画面 → MemoListActivity
- メモ作成画面 → MemoCreateActivity
- メモ詳細画面 → MemoDetailActivity
```

### Activityの役割

1. **画面を表示する**
2. **ユーザーの操作を受け取る**
3. **データを処理する**

### MainActivityの基本構造

```kotlin
package com.example.simplememo

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent

class MainActivity : ComponentActivity() {

    // アプリが起動されたときに呼ばれる
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Composeで画面を作る
        setContent {
            Text("Hello, メモアプリ！")
        }
    }
}
```

**重要なポイント：**
- `ComponentActivity`を継承している
- `onCreate()`がアプリ起動時に呼ばれる
- `setContent {}`の中にComposeのUIを書く

---

## ActivityとComposeの関係

### 従来の方法（XML）vs 新しい方法（Compose）

**従来の方法（2020年以前）：**
```kotlin
// Activity + XML
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)  // XMLファイルを読み込む
    }
}
```

```xml
<!-- res/layout/activity_main.xml -->
<LinearLayout>
    <TextView text="Hello, World!" />
</LinearLayout>
```

**新しい方法（Jetpack Compose）：**
```kotlin
// Activity + Compose
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            // Kotlinコードで直接UIを書く
            Text("Hello, World!")
        }
    }
}
```

### なぜComposeを使うのか

| 観点 | XML | Compose |
|------|-----|---------|
| **言語** | XMLとKotlinの2つ | Kotlinだけ |
| **学習コスト** | 2つの言語を学ぶ | 1つの言語だけ |
| **コード量** | 多い | 少ない |
| **プレビュー** | 遅い | 速い |
| **Google推奨** | 過去 | **現在・未来** |

このカリキュラムでは、**Jetpack Compose**を使います。

---

## Activityのライフサイクル

### ライフサイクルとは

**アプリの「状態の変化」**のこと。

```text
起動 → 表示中 → 一時停止 → 再開 → 終了
```

### 主要なライフサイクルメソッド

```kotlin
class MainActivity : ComponentActivity() {

    // 1. Activity作成時
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.d("Lifecycle", "onCreate: アプリ起動")
        setContent { /* UI */ }
    }

    // 2. 画面が表示される直前
    override fun onStart() {
        super.onStart()
        Log.d("Lifecycle", "onStart: 画面表示準備")
    }

    // 3. 画面が完全に表示され、操作可能
    override fun onResume() {
        super.onResume()
        Log.d("Lifecycle", "onResume: 操作可能")
    }

    // 4. 他のアプリが前面に来た（一時停止）
    override fun onPause() {
        super.onPause()
        Log.d("Lifecycle", "onPause: 一時停止")
    }

    // 5. 画面が見えなくなった
    override fun onStop() {
        super.onStop()
        Log.d("Lifecycle", "onStop: 画面非表示")
    }

    // 6. Activity破棄
    override fun onDestroy() {
        super.onDestroy()
        Log.d("Lifecycle", "onDestroy: 終了")
    }
}
```

### ライフサイクルの流れ

```text
アプリ起動
    ↓
onCreate() → onStart() → onResume()
    ↓
【ユーザーが操作中】
    ↓
ホームボタンを押す
    ↓
onPause() → onStop()
    ↓
再度アプリを開く
    ↓
onStart() → onResume()
    ↓
バックボタンで終了
    ↓
onPause() → onStop() → onDestroy()
```

### なぜライフサイクルを理解する必要があるのか

**実例：動画再生アプリ**

```kotlin
class VideoPlayerActivity : ComponentActivity() {

    override fun onResume() {
        super.onResume()
        // 画面が見えるようになったら動画再生
        videoPlayer.play()
    }

    override fun onPause() {
        super.onPause()
        // 他のアプリに切り替わったら一時停止
        // （バックグラウンドで動画を再生し続けないため）
        videoPlayer.pause()
    }
}
```

**実例：メモアプリ**

```kotlin
class MemoEditActivity : ComponentActivity() {

    override fun onPause() {
        super.onPause()
        // 画面を離れるときに自動保存
        saveMemoToDraft()
    }
}
```

---

## リソース管理

### リソースとは

**アプリで使う素材**のこと。

```text
res/（リソースフォルダ）
├── drawable/   画像、アイコン
├── values/     文字列、色、サイズ
├── font/       フォント
└── raw/        音声、動画ファイル
```

### なぜリソースを分けるのか

**直接コードに書く場合（NG）：**
```kotlin
Text("メモを追加")
Text("#FF6B6B")  // 色
```

**問題点：**
- 多言語対応が大変（英語版を作る場合、コード全体を書き換える）
- 同じ文字列が複数箇所にある（修正漏れが発生）
- デザイン変更が大変

**リソースを使う場合（OK）：**
```kotlin
Text(stringResource(R.string.add_memo))
```

```xml
<!-- res/values/strings.xml（日本語） -->
<string name="add_memo">メモを追加</string>

<!-- res/values-en/strings.xml（英語） -->
<string name="add_memo">Add Memo</string>
```

**メリット：**
- コードを変更せず多言語対応
- 一箇所修正すれば全体に反映
- デザイナーがリソースだけ編集できる

### 文字列リソース

**定義：**
```xml
<!-- res/values/strings.xml -->
<resources>
    <string name="app_name">シンプルメモ</string>
    <string name="add_memo">メモを追加</string>
    <string name="delete_memo">削除</string>
    <string name="confirm_delete">本当に削除しますか？</string>
</resources>
```

**使用：**
```kotlin
import androidx.compose.ui.res.stringResource

@Composable
fun MemoScreen() {
    Text(stringResource(R.string.app_name))
    Button(onClick = { /* ... */ }) {
        Text(stringResource(R.string.add_memo))
    }
}
```

### 色リソース

**定義：**
```xml
<!-- res/values/colors.xml -->
<resources>
    <color name="purple_500">#FF6200EE</color>
    <color name="teal_200">#FF03DAC5</color>
    <color name="work_category">#FF6B6B</color>
    <color name="personal_category">#4ECDC4</color>
</resources>
```

**使用（Composeの場合はテーマで管理）：**
```kotlin
Color(0xFF6200EE)  // 直接指定も可能だが、テーマ推奨
```

### 画像リソース

**配置：**
```text
res/
└── drawable/
    ├── ic_add.xml          ← ベクター画像
    ├── ic_delete.xml
    └── app_logo.png        ← ビットマップ画像
```

**使用：**
```kotlin
import androidx.compose.ui.res.painterResource

@Composable
fun AddButton() {
    Icon(
        painter = painterResource(R.drawable.ic_add),
        contentDescription = "追加"
    )
}
```

---

## AndroidManifest.xml

### AndroidManifest.xmlとは

**アプリの設定ファイル**

Androidシステムに以下を伝えます：
- アプリの名前
- どのActivityがあるか
- 最初に起動するActivityはどれか
- 必要な権限（カメラ、位置情報など）

### 基本的な構造

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.simplememo">

    <!-- 権限の宣言 -->
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:name=".SimpleMemoApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.SimpleMemo">

        <!-- メインActivity -->
        <activity
            android:name=".MainActivity"
            android:exported="true">

            <!-- 最初に起動するActivity -->
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>

</manifest>
```

### 重要な要素

#### 1. パッケージ名

```xml
<manifest package="com.example.simplememo">
```

**パッケージ名 = アプリの一意な識別子**
- 世界中で重複してはいけない
- 通常は逆ドメイン形式（com.会社名.アプリ名）

#### 2. 権限

```xml
<!-- インターネット通信 -->
<uses-permission android:name="android.permission.INTERNET" />

<!-- カメラ -->
<uses-permission android:name="android.permission.CAMERA" />

<!-- 位置情報 -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

メモアプリでクラウドバックアップをする場合は、`INTERNET`権限が必要です。

#### 3. アプリケーション設定

```xml
<application
    android:icon="@mipmap/ic_launcher"    <!-- アプリアイコン -->
    android:label="@string/app_name"      <!-- アプリ名 -->
    android:theme="@style/Theme.SimpleMemo">  <!-- テーマ -->
```

#### 4. Activity宣言

```xml
<activity
    android:name=".MainActivity"
    android:exported="true">  <!-- 他のアプリから起動可能 -->

    <!-- LAUNCHERアイコンから起動 -->
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

---

## Applicationクラス

### Applicationクラスとは

**アプリ全体で1つだけ存在するクラス**

Activityより先に起動し、アプリ全体の初期化を行います。

```kotlin
package com.example.simplememo

import android.app.Application
import android.util.Log

class SimpleMemoApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        // アプリ全体の初期化処理
        Log.d("App", "SimpleMemoアプリ起動")

        // ここで以下のような初期化を行う：
        // - データベース初期化
        // - 設定の読み込み
        // - クラッシュレポートツールの初期化
    }
}
```

**AndroidManifest.xmlに登録：**
```xml
<application
    android:name=".SimpleMemoApplication"
    ...>
```

### ActivityとApplicationの違い

| 観点 | Application | Activity |
|------|------------|----------|
| **数** | アプリに1つ | 画面ごとに複数 |
| **起動** | アプリ起動時に1回 | 画面遷移のたびに |
| **寿命** | アプリが終了するまで | 画面を閉じると終了 |
| **用途** | 全体の初期化 | 画面の表示・操作 |

---

## プロジェクト構造を理解する

### Android Studioで作成されるファイル

```text
SimpleMemoApp/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/simplememo/
│   │   │   │   ├── MainActivity.kt          ← メインActivity
│   │   │   │   └── SimpleMemoApplication.kt ← Applicationクラス
│   │   │   ├── res/
│   │   │   │   ├── values/
│   │   │   │   │   ├── strings.xml          ← 文字列リソース
│   │   │   │   │   ├── colors.xml           ← 色リソース
│   │   │   │   │   └── themes.xml           ← テーマ
│   │   │   │   ├── drawable/                ← 画像
│   │   │   │   └── mipmap/                  ← アイコン
│   │   │   └── AndroidManifest.xml          ← マニフェスト
│   │   └── test/                             ← テストコード
│   └── build.gradle.kts                      ← アプリのビルド設定
├── gradle/                                   ← Gradleラッパー
└── build.gradle.kts                          ← プロジェクト全体の設定
```

### build.gradle.kts（アプリレベル）

**依存関係とビルド設定を管理**

```kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.example.simplememo"
    compileSdk = <api-level>

    defaultConfig {
        applicationId = "com.example.simplememo"
        minSdk = 24
        targetSdk = <api-level>
        versionCode = 1
        versionName = "1.0"
    }

    buildFeatures {
        compose = true  // Jetpack Composeを有効化
    }

    composeOptions {
        kotlinCompilerExtensionVersion = "<version>"
    }
}

dependencies {
    // Jetpack Compose
    implementation(platform("androidx.compose:compose-bom:<version>"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.activity:activity-compose:<version>")

    // その他のライブラリ
}
```

**重要な設定：**
- `minSdk`: サポートする最小Androidバージョン
- `targetSdk`: ターゲットとするAndroidバージョン
- `versionCode`: アプリのバージョン番号（整数）
- `versionName`: ユーザーに見えるバージョン（"1.0.0"など）

---

## 実践：シンプルメモアプリのプロジェクト作成

### ステップ1：Android Studioで新規プロジェクト作成

1. Android Studioを起動
2. "New Project"を選択
3. "Empty Activity"を選択
4. 以下を入力：
   - Name: `SimpleMemo`
   - Package name: `com.example.simplememo`
   - Language: `Kotlin`
   - Minimum SDK: `API 24`
   - Build configuration language: `Kotlin DSL`

### ステップ2：プロジェクト構造を確認

Android Studioの左側のProject viewで確認：
```text
app/src/main/
├── java/com/example/simplememo/
│   └── MainActivity.kt
├── res/
│   └── values/
│       └── strings.xml
└── AndroidManifest.xml
```

### ステップ3：strings.xmlを編集

```xml
<!-- res/values/strings.xml -->
<resources>
    <string name="app_name">シンプルメモ</string>
    <string name="welcome_message">シンプルメモアプリへようこそ！</string>
</resources>
```

### ステップ4：MainActivity.ktを編集

```kotlin
package com.example.simplememo

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SimpleMemoTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    WelcomeScreen()
                }
            }
        }
    }
}

@Composable
fun WelcomeScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = stringResource(R.string.app_name),
            style = MaterialTheme.typography.headlineLarge
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = stringResource(R.string.welcome_message),
            style = MaterialTheme.typography.bodyLarge
        )
    }
}

@Composable
fun SimpleMemoTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = lightColorScheme(),
        content = content
    )
}
```

### ステップ5：実行

1. エミュレーターまたは実機を接続
2. 緑色の▶ボタンをクリック
3. アプリが起動し、「シンプルメモ」と表示される

---

## AIに聞いてみよう

### 質問テンプレ（コピペ）

```text
【前提】
この章を学習しています（この章のコンテキストは共有済み）。

【やりたいこと】
（例：演習を完成させたい / エラーを直したい / もっと良い書き方にしたい）

【今の状態】
- 該当コード：
- エラー/ログ：
- 期待する挙動：

【制約】
- 変えたくないこと：

【欲しい回答】
- 結論（何を変えるか）
- 手順（最短）
- 理由
- 確認ポイント（動作確認/テスト）
```

Android基礎でわからないことがあったら、AIに質問しましょう。

### 質問例

```text
【質問】
ActivityとFragmentの違いは何？
どっちを使えばいいの？
```

```text
【質問】
ライフサイクルのonCreate、onStart、onResumeの違いがよくわからない。
具体的にどういうタイミングで呼ばれるの？
```

```text
【質問】
AndroidManifest.xmlのexported="true"ってどういう意味？
falseにするとどうなるの？
```

```text
【エラー解決】
アプリを実行したら以下のエラーが出た：

AndroidManifest.xml:15: Error: missing android:exported attribute

どう修正すればいい？
```

---

## 演習

### 基礎レベル

**問題1：ライフサイクルの理解**
以下のシナリオで、どのライフサイクルメソッドが呼ばれるか答えてください。

1. アプリを起動した
2. ホームボタンを押した
3. 再度アプリを開いた
4. バックボタンでアプリを終了した

<details>
<summary>解答例</summary>

1. アプリを起動した
   → `onCreate()` → `onStart()` → `onResume()`

2. ホームボタンを押した
   → `onPause()` → `onStop()`

3. 再度アプリを開いた
   → `onStart()` → `onResume()`

4. バックボタンでアプリを終了した
   → `onPause()` → `onStop()` → `onDestroy()`
</details>

**問題2：リソースの追加**
以下のリソースを追加してください。

1. 文字列リソース：「メモを作成」（キー: create_memo）
2. 色リソース：赤色（キー: error_color、値: #F44336）

<details>
<summary>解答例</summary>

```xml
<!-- res/values/strings.xml -->
<resources>
    <string name="app_name">シンプルメモ</string>
    <string name="create_memo">メモを作成</string>
</resources>
```

```xml
<!-- res/values/colors.xml -->
<resources>
    <color name="error_color">#F44336</color>
</resources>
```
</details>

**問題3：Manifestの編集**
`AndroidManifest.xml`に以下を追加してください。

1. インターネット権限
2. アプリ名を文字列リソース（@string/app_name）から取得

<details>
<summary>解答例</summary>

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- インターネット権限 -->
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        ...>

        <activity android:name=".MainActivity" ...>
        </activity>

    </application>

</manifest>
```
</details>

### 応用レベル

**問題4：ライフサイクルのログ出力**
すべてのライフサイクルメソッドで、Logcatにログを出力するコードを書いてください。

<details>
<summary>解答例</summary>

```kotlin
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.Text

class MainActivity : ComponentActivity() {

    private val TAG = "MainActivity"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.d(TAG, "onCreate")
        setContent {
            Text("Lifecycle Demo")
        }
    }

    override fun onStart() {
        super.onStart()
        Log.d(TAG, "onStart")
    }

    override fun onResume() {
        super.onResume()
        Log.d(TAG, "onResume")
    }

    override fun onPause() {
        super.onPause()
        Log.d(TAG, "onPause")
    }

    override fun onStop() {
        super.onStop()
        Log.d(TAG, "onStop")
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "onDestroy")
    }
}
```

**確認方法：**
1. アプリを実行
2. Android StudioのLogcatタブを開く
3. フィルターに「MainActivity」と入力
4. ホームボタンを押したり、アプリを再度開いたりして、ログを確認
</details>

**問題5：Applicationクラスの作成**
`SimpleMemoApplication`クラスを作成し、アプリ起動時に「SimpleMemoアプリを起動しました」とログ出力してください。

<details>
<summary>解答例</summary>

```kotlin
// SimpleMemoApplication.kt
package com.example.simplememo

import android.app.Application
import android.util.Log

class SimpleMemoApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        Log.d("SimpleMemoApp", "SimpleMemoアプリを起動しました")
    }
}
```

```xml
<!-- AndroidManifest.xml -->
<application
    android:name=".SimpleMemoApplication"
    ...>
```
</details>

### 発展レベル

**問題6：画面回転の対応**
画面を回転させたときのライフサイクルの動きを確認してください。
何が起こるか予想してから、実際に試してみましょう。

<details>
<summary>解答例</summary>

**予想：**
画面回転時、Activityが一度破棄され、再作成されます。

**実際の動き：**
```text
onPause() → onStop() → onDestroy()
    ↓
onCreate() → onStart() → onResume()
```

**確認方法：**
1. 問題4のコードで、ライフサイクルをログ出力
2. エミュレーターで画面を回転（Ctrl+F11 / Cmd+左右矢印）
3. Logcatでライフサイクルメソッドの呼び出し順を確認

**問題点：**
画面回転のたびにActivityが再作成されるので、状態（データ）が失われます。

**解決方法：**
- `rememberSaveable`を使う
- `ViewModel`を使う（後の章で学習）
</details>

**問題7：多言語対応**
英語のリソースファイルを作成し、アプリを多言語対応してください。

<details>
<summary>解答例</summary>

```xml
<!-- res/values/strings.xml（日本語・デフォルト） -->
<resources>
    <string name="app_name">シンプルメモ</string>
    <string name="welcome_message">シンプルメモアプリへようこそ！</string>
</resources>
```

```xml
<!-- res/values-en/strings.xml（英語） -->
<resources>
    <string name="app_name">Simple Memo</string>
    <string name="welcome_message">Welcome to Simple Memo App!</string>
</resources>
```

**確認方法：**
1. エミュレーターの設定から言語を英語に変更
2. アプリを再起動
3. 英語で表示されることを確認
</details>

---

## よくある間違い

### 間違い1：Manifestにactivityを登録し忘れる

```kotlin
// 新しいActivityを作成
class MemoDetailActivity : ComponentActivity() { ... }
```

```xml
<!-- AndroidManifest.xml -->
<!-- 登録し忘れ！ -->
```

**エラー：**
```text
ActivityNotFoundException: Unable to find explicit activity class
```

**解決：**
```xml
<application>
    <activity android:name=".MainActivity" .../>

    <!-- 追加 -->
    <activity android:name=".MemoDetailActivity" />
</application>
```

### 間違い2：権限を宣言し忘れる

```kotlin
// インターネット通信
val url = URL("https://api.example.com/memos")
```

**エラー：**
```text
SecurityException: Permission denied
```

**解決：**
```xml
<manifest>
    <uses-permission android:name="android.permission.INTERNET" />
</manifest>
```

### 間違い3：R.javaの自動生成エラー

**症状：**
- `R.string.app_name`が見つからない
- `R.drawable.icon`にアクセスできない

**原因：**
- XMLファイルにシンタックスエラーがある
- リソース名にハイフン（-）を使った（使えるのはアンダースコア_のみ）

**解決：**
1. Build → Clean Project
2. Build → Rebuild Project
3. XMLファイルのエラーを修正

---

## チェックリスト

この章を完了したか確認しましょう。

- [ ] Androidアプリの構成要素を説明できる
- [ ] Activityとは何かを理解している
- [ ] ライフサイクルの基本的な流れを説明できる
- [ ] リソース管理のメリットを理解している
- [ ] AndroidManifest.xmlの役割を説明できる
- [ ] 実際にプロジェクトを作成できた
- [ ] 演習問題を3問以上解いた

---

## まとめ

この章では以下を学びました：

1. **Androidアプリの構造** - Activity、Application、リソース
2. **Activity** - 画面の基本単位
3. **ライフサイクル** - アプリの状態変化
4. **リソース管理** - 多言語対応、保守性向上
5. **AndroidManifest.xml** - アプリの設定ファイル
6. **プロジェクト作成** - シンプルメモアプリの土台

次の章からは、Jetpack Composeを使って実際のUIを作っていきます。
この章で学んだAndroidの基礎知識が、これからの学習の土台になります。

---

## ふりかえり

- Activityのライフサイクルで、今いちばん不安なメソッドはどれ？（onPause/onStopなど）
- リソースとして管理することで、どんな変更がラクになる？
- ComposeはActivityのどこで呼ばれて、どう表示される？

---

## 次の章

次は [Jetpack Composeの基本](chapters/03-compose-basics.md) に進み、ComposeでUIを組み立てましょう。
