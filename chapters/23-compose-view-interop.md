# ComposeとViewの相互運用

Compose中心の案件でも、Viewベースのライブラリ（Map、WebView、広告、古いUI部品）と共存することは普通にあります。
この章では、ComposeとViewを同じアプリで扱うための最低限の知識をまとめます。

---

## 前提

- `chapters/22-workmanager.md` を完了し、発展要件を実装する前提がある

## この章でできるようになること

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

## 演習

- Compose画面内に `WebView`（例）を組み込む設計を考える
- “更新される値”と“初回だけでよい値”を分類する
- 破棄が必要なリソース（リスナー等）を洗い出す

---

## AIに聞いてみよう

```text
【質問】
Composeの画面に既存View（例: MapView/WebView）を埋め込みたい。
再コンポーズで壊れない実装方針と、リーク対策を提案して。
```

---

## ふりかえり

- Viewを「初回だけ作る」ために、どこで何を `remember` する？
- 更新（update）と破棄（dispose）で、事故が起きやすいポイントは？
- 既存ViewからComposeへ段階移行するなら、どこから始める？

---

## 次の章

次は `chapters/24-accessibility-i18n.md` に進み、アクセシビリティと多言語対応を押さえましょう。
