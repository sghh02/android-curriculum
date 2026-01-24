# Android Studioのインストールと環境準備

Androidアプリ開発には公式IDEの **Android Studio** と、動作確認用のエミュレータまたは実機が必要です。
この章では、開発に必要な環境を"迷わず"整えることをゴールにします。

---

## 前提

- [Unit 1: プログラミングとAndroidの基礎（ガイド）](chapters/01-unit1-guide.md) を読んでいる
- つまずいたら [デバッグと調査（実務の型）](chapters/16-debugging.md) の「調査の型」を参照できる

## この章でできるようになること

- [ ] Android Studioをインストールして起動できる
- [ ] エミュレータまたは実機でアプリを動かせる状態にする
- [ ] プロジェクトを作成して「Hello Android」を表示できる

**所要時間の目安：1〜2時間**（ダウンロード時間含む）

---

## Android Studioとは

Android Studioは、Googleが提供するAndroidアプリ開発の**公式統合開発環境（IDE）**です。

### 主な機能

| 機能 | 説明 |
|------|------|
| **コードエディタ** | Kotlin/Javaのコード補完、シンタックスハイライト |
| **レイアウトエディタ** | UIをビジュアルに設計（Composeプレビュー含む） |
| **エミュレータ** | PC上でAndroid端末をシミュレート |
| **デバッガ** | ブレークポイントでコードを止めて変数を確認 |
| **ビルドシステム** | Gradleによる自動ビルド |
| **APK/AAB作成** | アプリのパッケージ化 |

---

## システム要件

インストール前に、お使いのPCが要件を満たしているか確認しましょう。

### Windows

| 項目 | 要件 |
|------|------|
| OS | Windows 10/11（64bit） |
| RAM | 8GB以上（16GB推奨） |
| ストレージ | 8GB以上の空き容量（IDE + SDK + エミュレータ） |
| CPU | Intel / AMD（仮想化対応必須） |

### macOS

| 項目 | 要件 |
|------|------|
| OS | macOS 10.14以降 |
| RAM | 8GB以上（16GB推奨） |
| ストレージ | 8GB以上の空き容量 |
| CPU | Intel / Apple Silicon（M1/M2/M3対応） |

### Linux

| 項目 | 要件 |
|------|------|
| OS | Ubuntu 20.04以降 / Fedora / その他64bit Linux |
| RAM | 8GB以上（16GB推奨） |
| ストレージ | 8GB以上の空き容量 |
| 追加 | 64bit対応のGNOME/KDE環境 |

---

## インストール手順

### Step 1：ダウンロード

1. [公式サイト](https://developer.android.com/studio)にアクセス
2. 「Download Android Studio」をクリック
3. 利用規約に同意してダウンロード

### Step 2：インストール（Windows）

```text
1. ダウンロードした .exe ファイルを実行
2. 「Next」をクリック
3. インストール先を確認（デフォルトでOK）
4. 「Android Virtual Device」にチェックを入れる
5. 「Install」をクリック
6. 完了後「Finish」で起動
```

### Step 2：インストール（macOS）

```text
1. ダウンロードした .dmg ファイルを開く
2. Android Studio.app を Applications フォルダにドラッグ
3. Applications から Android Studio を起動
4. 「開発元を確認できない」警告が出たら：
   システム設定 → プライバシーとセキュリティ → 「このまま開く」
```

### Step 2：インストール（Linux）

```bash
# tarファイルを展開
tar -xzf android-studio-*.tar.gz

# インストールディレクトリに移動
sudo mv android-studio /opt/

# 起動スクリプトを実行
/opt/android-studio/bin/studio.sh

# デスクトップエントリを作成（初回起動時に設定可能）
```

### Step 3：初回セットアップウィザード

初めて起動すると、セットアップウィザードが表示されます。

1. **Import Settings**
   - 「Do not import settings」を選択（初めての場合）

2. **Install Type**
   - **「Standard」を選択**（推奨）
   - 必要なコンポーネントが自動でインストールされます

3. **UI Theme**
   - Darcula（ダーク）か Light を好みで選択

4. **Verify Settings**
   - インストールされるコンポーネントを確認
   - 以下が含まれているか確認：
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device
     - Intel HAXM（Intel CPU）/ Android Emulator Hypervisor Driver（AMD CPU）

5. **License Agreement**
   - すべてのライセンスに「Accept」

6. **Downloading Components**
   - ダウンロード完了を待つ（10〜30分程度）

---

## SDK Managerの設定

Android StudioでSDK（Software Development Kit）を管理します。

### SDK Managerを開く

```text
方法1: Welcome画面 → More Actions → SDK Manager
方法2: プロジェクト画面 → Tools → SDK Manager
方法3: 右上の歯車アイコン → SDK Manager
```

### 推奨設定

#### SDK Platformsタブ

以下をインストール：
- **Android 14.0 (API 34)** - 最新安定版
- **Android 13.0 (API 33)** - 1つ前の安定版

```text
[✓] Android 14.0 ("UpsideDownCake")
    [✓] Android SDK Platform 34
    [✓] Sources for Android 34
    [✓] Google APIs Intel x86_64 Atom System Image
```

#### SDK Toolsタブ

以下を最新に更新：
- **Android SDK Build-Tools**
- **Android SDK Platform-Tools**
- **Android Emulator**
- **Android SDK Command-line Tools**

```text
[✓] Android SDK Build-Tools 34
[✓] Android SDK Command-line Tools (latest)
[✓] Android Emulator
[✓] Android SDK Platform-Tools
```

---

## エミュレータのセットアップ

実機がなくてもエミュレータでアプリをテストできます。

### AVD（Android Virtual Device）の作成

1. **Device Managerを開く**
   ```text
   Welcome画面 → More Actions → Virtual Device Manager
   または
   Tools → Device Manager
   ```

2. **Create Virtual Device**をクリック

3. **ハードウェアを選択**
   - **Phone** → **Pixel 7**（推奨）
   - 画面サイズとスペックのバランスが良い

4. **システムイメージを選択**
   - **Recommended**タブから選択
   - **API 34** の **x86_64** を選択
   - 「Download」リンクがある場合はダウンロード

5. **AVD名を設定**
   - デフォルトのままでOK
   - 「Show Advanced Settings」で詳細設定可能

6. **Finish**をクリック

### エミュレータの起動

1. Device Managerで作成したAVDの**再生ボタン**をクリック
2. 初回起動は時間がかかる（2〜5分）
3. Androidのホーム画面が表示されれば成功

### エミュレータを軽くするコツ

```text
AVDの設定（鉛筆アイコン）→ Show Advanced Settings

Graphics: Hardware - GLES 2.0
Multi-Core CPU: 使用可能なコア数
RAM: 2048MB以上
VM heap: 512MB
Internal Storage: 2048MB
```

---

## 実機での動作確認（推奨）

エミュレータより実機の方が動作が速く、実際の使用感を確認できます。

### 準備：開発者向けオプションを有効化

1. **設定アプリ**を開く
2. **デバイス情報**（または「端末情報」）をタップ
3. **ビルド番号**を**7回連続タップ**
4. 「デベロッパーになりました」と表示される

### USBデバッグを有効化

1. **設定** → **システム** → **開発者向けオプション**
2. **USBデバッグ**をON
3. PCとUSB接続
4. 「USBデバッグを許可しますか？」→ **OK**

### 接続確認

Android Studioの**Device Manager**または**実行ボタン横のデバイス選択**に端末名が表示されれば成功。

---

## 最初のプロジェクトを作成

### Step 1：新規プロジェクト作成

1. **New Project**をクリック
2. **Empty Activity**を選択（Compose用）
3. **Next**をクリック

### Step 2：プロジェクト設定

| 項目 | 設定値 | 説明 |
|------|--------|------|
| Name | HelloAndroid | アプリ名 |
| Package name | com.example.helloandroid | 一意の識別子 |
| Save location | 任意 | プロジェクトの保存先 |
| Language | **Kotlin** | 必ずKotlinを選択 |
| Minimum SDK | API 24 | Android 7.0以上対応 |
| Build configuration | Kotlin DSL | 推奨 |

### Step 3：プロジェクトを開く

「Finish」をクリックすると、Gradleの同期が始まります。
初回は依存関係のダウンロードに時間がかかります（5〜10分）。

### Step 4：アプリを実行

1. デバイスを選択（エミュレータまたは実機）
2. **再生ボタン（▶）**をクリック
3. 「Hello Android!」が表示されれば成功！

---

## プロジェクト構造を理解する

作成されたプロジェクトの構造を確認しましょう。

```text
HelloAndroid/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/helloandroid/
│   │   │   │   ├── MainActivity.kt        ← メインのActivity
│   │   │   │   └── ui/theme/              ← テーマ設定
│   │   │   ├── res/                        ← リソースファイル
│   │   │   │   ├── drawable/              ← 画像
│   │   │   │   ├── values/                ← 文字列、色など
│   │   │   │   └── ...
│   │   │   └── AndroidManifest.xml        ← アプリの設定
│   │   └── test/                          ← テストコード
│   └── build.gradle.kts                   ← アプリレベルのビルド設定
├── gradle/                                 ← Gradleラッパー
└── build.gradle.kts                       ← プロジェクトレベルのビルド設定
```

### 重要なファイル

#### MainActivity.kt

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            HelloAndroidTheme {
                Greeting(name = "Android")
            }
        }
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello $name!",
        modifier = modifier
    )
}
```

#### AndroidManifest.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:label="@string/app_name"
        android:theme="@style/Theme.HelloAndroid">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

---

## AIに聞いてみよう

### 質問テンプレ（コピペ）

```text
【前提】
この章を学習しています（この章のコンテキストは共有済み）。

【やりたいこと】
（例：セットアップを終えたい / エラーを直したい / 最短の確認手順が欲しい）

【今の状態】
- 該当コード/設定：
- エラー/ログ：
- 期待する挙動：

【制約】
- OS（Windows/macOS/Linux）：
- Android Studioのバージョン：

【欲しい回答】
- 結論（何をどう直すか）
- 手順（最短）
- 確認ポイント（動作確認）
```

環境構築でつまずいたら、AIに質問しましょう。

### 質問例

```text
【状況】
Android Studioをインストールしました。

【問題】
エミュレータが起動しません。
「Intel HAXM is not installed」というエラーが出ます。

【PC環境】
Windows 11, Intel Core i7

【教えてほしいこと】
HAXMをインストールする方法を教えてください。
```

```text
【状況】
Android Studioで新規プロジェクトを作成しました。

【問題】
Gradleの同期でエラーが出ます。
「Could not resolve com.android.tools.build:gradle:8.1.0」

【教えてほしいこと】
このエラーの原因と解決方法を教えてください。
```

---

## よくあるエラーと解決方法

### エミュレータが起動しない

#### Intel CPU：HAXM関連

```text
エラー: Intel HAXM is required to run this AVD
```

**解決方法：**
1. BIOSで**Intel VT-x**を有効化
2. SDK Manager → SDK Tools → Intel x86 Emulator Accelerator (HAXM installer) をインストール
3. PCを再起動

#### AMD CPU：Hypervisor関連

```text
エラー: Android Emulator Hypervisor Driver is not installed
```

**解決方法：**
1. BIOSで**AMD-V / SVM Mode**を有効化
2. Windowsの場合：「Windowsの機能」→「Hyper-V」を無効化
3. SDK Manager → Android Emulator Hypervisor Driver for AMD Processors をインストール

### Gradleの同期エラー

#### プロキシ環境の場合

```text
エラー: Could not resolve dependencies
```

**解決方法：**
1. File → Settings → Appearance & Behavior → System Settings → HTTP Proxy
2. プロキシ設定を入力
3. `gradle.properties`にも設定を追加：

```properties
systemProp.http.proxyHost=proxy.example.com
systemProp.http.proxyPort=8080
systemProp.https.proxyHost=proxy.example.com
systemProp.https.proxyPort=8080
```

#### JDKバージョンの問題

```text
エラー: Unsupported Java version
```

**解決方法：**
1. File → Settings → Build, Execution, Deployment → Build Tools → Gradle
2. Gradle JDK を **Embedded JDK** または **JDK 17** に設定

### 実機が認識されない

#### Windows：USBドライバの問題

1. 端末メーカーの公式USBドライバをインストール
2. デバイスマネージャーで確認
3. SDK Manager → Google USB Driver をインストール

#### 共通：ADBの問題

```bash
# ターミナル/コマンドプロンプトで確認
adb devices

# デバイスが表示されない場合
adb kill-server
adb start-server
adb devices
```

---

## 便利なショートカット

最初に覚えておくと便利なショートカットです。

| 操作 | Windows | macOS |
|------|---------|-------|
| 実行 | Shift + F10 | Ctrl + R |
| 検索 | Shift × 2 | Shift × 2 |
| コード補完 | Ctrl + Space | Ctrl + Space |
| コメント切り替え | Ctrl + / | Cmd + / |
| 行削除 | Ctrl + Y | Cmd + Delete |
| フォーマット | Ctrl + Alt + L | Cmd + Option + L |
| リネーム | Shift + F6 | Shift + F6 |

---

## チェックリスト

この章を完了したか確認しましょう。

- [ ] Android Studioをインストールできた
- [ ] SDK Managerで必要なSDKをインストールした
- [ ] エミュレータが起動する、または実機が認識される
- [ ] 新規プロジェクトを作成できた
- [ ] 「Hello Android!」が表示された

すべてチェックできたら、次の章に進みましょう！

---

## まとめ

この章では以下を学びました：

1. **Android Studio**のインストールと初期設定
2. **SDK Manager**でのSDK管理
3. **エミュレータ**の作成と起動
4. **実機**でのデバッグ設定
5. **最初のプロジェクト**の作成と実行

環境構築は最初の大きなハードルですが、一度できれば後は楽になります。
エラーが出たらAIに聞きながら解決していきましょう。

---

## 演習

- [ ] 新規プロジェクトを作成し、エミュレータ/実機で起動できたスクショを残す
- [ ] 「よくあるエラー」から1つ選び、原因と対処を自分の言葉でメモする
- [ ] 学習用リポジトリにPRを作り、環境構築の完了を“証拠”として残す

---

## ふりかえり

- 環境構築で一番時間がかかったポイントはどこ？
- つまずいたとき、次に同じ状況になったらどう切り分ける？
- 学習の成果物（PR/スクショ/メモ）を、どの頻度で残せそう？

---

## 次の章

次は [Kotlinプログラミングの基礎](chapters/02-kotlin-basics.md) に進み、Kotlinの基礎文法を固めましょう。
