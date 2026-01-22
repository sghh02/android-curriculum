# 初めてのプロジェクト作成

この章では、Android Studioで新規プロジェクトを作成し、アプリを起動するところまでを行います。

## 目標
- Android Studioで新規プロジェクトを作成できる
- エミュレータ or 実機でアプリが起動する
- Jetpack Composeの基本テンプレートを理解する

## 概念の説明
- **Empty Activity**はCompose前提の最小テンプレートです。
- 画面は`setContent { ... }`の中でCompose UIとして描画します。
- `MainActivity.kt`が起点となり、アプリ起動時に最初に呼ばれます。

## コード例
```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Text(text = "Hello Android")
        }
    }
}
```

## AIに聞いてみよう
- 「Empty ActivityとEmpty Compose Activityの違いは？」
- 「`setContent {}`の中はなぜKotlinコードだけでUIが書けるの？」
- 「エミュレータが起動しないときの確認ポイントは？」

## ハンズオン
1. **New Project** → **Empty Activity** を選択
2. 設定
   - Name: `HelloAndroid`
   - Package name: `com.example.helloandroid`
   - Language: **Kotlin**
   - Minimum SDK: **API 24 (Android 7.0)** 以上
3. **Finish** で作成
4. 右上の ▶ Run でビルド＆起動
5. 画面中央のテキストを **自分の名前** に変更する
6. 文字色を `Color.Magenta` に変更する

## よくあるエラー
- **Gradle Syncが終わらない**：初回は時間がかかるので待つ／ネットワークを確認。
- **エミュレータが起動しない**：AVDの再作成や、APIレベルの変更を試す。
- **"No devices" と表示される**：実機のUSBデバッグ設定やエミュレータ起動を確認。

## チェックリスト
- [ ] 新規プロジェクトを作成できた
- [ ] アプリが起動して画面が表示された
- [ ] テキストを自分の名前に変更した
- [ ] テキスト色を変更できた

---

次章からは **Kotlin基礎** を学び、Android開発で必要な文法に慣れていきます。
