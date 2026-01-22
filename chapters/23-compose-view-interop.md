# ComposeとViewの相互運用

Compose中心の案件でも、Viewベースのライブラリ（Map、WebView、広告、古いUI部品）と共存することは普通にあります。
この章では、ComposeとViewを同じアプリで扱うための最低限の知識をまとめます。

---

## この章の目標

- [ ] Compose内でViewを表示できる（`AndroidView`）
- [ ] View内でComposeを表示できる（`ComposeView`）
- [ ] 相互運用で起きやすい問題（再生成/ライフサイクル/状態）を回避できる
- [ ] 段階移行（View→Compose）の進め方がわかる

**所要時間の目安：1〜2時間**

---

## Compose内でViewを使う（AndroidView）

代表例：

- MapView
- WebView
- 既存のカスタムView

考え方：

- Viewの生成は“初回だけ”
- 更新は `update` で行う
- 破棄が必要なら `DisposableEffect` で扱う

### 例：WebViewを埋め込む

```kotlin
@Composable
fun WebViewContainer(url: String) {
    val context = LocalContext.current
    val webView = remember { WebView(context) }

    DisposableEffect(Unit) {
        onDispose { webView.destroy() }
    }

    AndroidView(
        factory = { webView },
        update = { it.loadUrl(url) }
    )
}
```

ポイント：

- Viewを `remember` して、再コンポーズで作り直さない
- `onDispose` で破棄する（リーク/クラッシュ対策）

---

## View内でComposeを使う（ComposeView）

代表例：

- 既存XML画面の一部だけCompose化したい
- まずは小さなUIコンポーネントから移行したい

### 例：XMLにComposeViewを置いて一部だけCompose化する

```kotlin
composeView.setViewCompositionStrategy(
    ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed
)
composeView.setContent {
    MyComposable()
}
```

---

## 落とし穴（実務でハマる）

- 再コンポーズでViewを作り直してしまい、状態が飛ぶ
- ライフサイクルの扱いがズレて、リーク/クラッシュする
- View側のコールバックが複数登録されて二重発火する

相互運用は「動けばOK」ではなく、**更新と破棄**まで含めて設計します。

---

## ミニ課題

- Compose画面内に `WebView`（例）を組み込む設計を考える
- “更新される値”と“初回だけでよい値”を分類する
- 破棄が必要なリソース（リスナー等）を洗い出す

---

## AIに聞いてみよう

```
【質問】
Composeの画面に既存View（例: MapView/WebView）を埋め込みたい。
再コンポーズで壊れない実装方針と、リーク対策を提案して。
```
