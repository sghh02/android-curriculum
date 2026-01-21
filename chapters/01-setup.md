# Android Studioのインストールと環境準備

Androidアプリ開発には公式IDEの **Android Studio** と、動作確認用のエミュレータ／実機が必要です。
この章では、開発に必要な環境を“迷わず”整えることをゴールにします。

## 目標
- Android Studioのインストールと初期設定を完了する
- エミュレータまたは実機でアプリを動かせる状態にする
- Kotlinで「Hello Android」まで到達する

## インストール手順
1. [公式サイト](https://developer.android.com/studio)からインストーラーをダウンロードします。
2. インストーラーを実行し、**Standard** 設定で進めます。
3. セットアップウィザードで **Android SDK / Emulator / HAXM (Intel) or Hypervisor Driver (AMD)** を有効にします。

## 初期設定のポイント
- **SDK Manager**
  - 最新の **Android API** をインストール
  - 「Android SDK Platform-Tools」を最新に更新
- **AVD Manager (エミュレータ)**
  - Pixel系の端末 + 最新APIで仮想デバイスを作成
  - **Cold Boot** で起動できることを確認

## 実機での動作確認（任意だが強く推奨）
- 開発者向けオプションを有効化
- USBデバッグをONにし、PCと接続

## よくある詰まりポイント
- **VT-x / AMD-V が無効** → BIOSで仮想化技術を有効化
- **エミュレータが重い** → エミュレータ設定でグラフィックを「Hardware」に
- **ADBが認識しない** → Platform-Toolsの更新 & USBドライバ確認

## 初めてのコード
```kotlin
// Hello Android
fun main() {
    println("Hello, Android!")
}
```

## チェックリスト
- [ ] Android Studioを起動できる
- [ ] Emulatorが起動する、または実機が認識される
- [ ] Kotlinのコードが実行できる

---

次章では、実際に「初めてのAndroidアプリ」を作成します。
