# アクセシビリティと多言語対応

実務では「動くUI」だけでなく、**誰でも使えるUI**が求められます。
アクセシビリティ（a11y）と多言語対応（i18n）は、後から入れるとコストが跳ねます。最初から最低限を押さえましょう。

---

## 前提

- [ComposeとViewの相互運用](./23-compose-view-interop.md) を完了し、発展要件の流れがわかる

## この章でできるようになること

- [ ] `contentDescription` とSemanticsの役割を説明できる
- [ ] TalkBackで最低限使えるUIになっているか確認できる
- [ ] 文字サイズ/端末設定で崩れない設計を意識できる
- [ ] `strings.xml` を使って多言語対応できる（Composeでの参照含む）

**所要時間の目安：1〜2時間**

---

## アクセシビリティ（Composeの最低限）

### 画像・アイコン

- 情報を伝える画像には `contentDescription` を付ける
- 装飾なら `null`（読み上げ不要）にする判断も必要

```kotlin
IconButton(onClick = onAdd) {
    Icon(
        imageVector = Icons.Default.Add,
        contentDescription = "メモを追加"
    )
}
```

※ 実務では `strings.xml` に寄せます（後述）。

### クリック可能領域

- 小さすぎるタップターゲットは避ける（押しにくい）

### 意味付け（Semantics）

- UIテストの安定化にも効く（testTag/semantics）

```kotlin
Modifier.semantics {
    contentDescription = "メモ一覧"
}
```

---

## 多言語対応（i18n）

### 文字列はコードに直書きしない

- `strings.xml` に寄せる（後から翻訳できる）
- Composeでは `stringResource(...)` を使う

```kotlin
Text(text = stringResource(R.string.memo_list_title))
```

複数形が必要なら `plurals` を使い、Composeでは `pluralStringResource(...)` を検討します。

### よくある落とし穴

- 長い文言でレイアウトが崩れる（英語/ドイツ語等）
- 日付/数値のフォーマットがロケールで変わる

---

## 確認方法（最低限）

- TalkBack（Androidのアクセシビリティ設定）で、主要導線を読み上げ操作できるか
- 端末の文字サイズを最大にして、レイアウトが破綻しないか
- 可能なら、英語表示でも主要導線が崩れないか

---

## 演習

- 主要画面のアイコンに `contentDescription` を付ける/不要なものは外す
- 文字列を `strings.xml` に移し、Composeから参照する
- 文字サイズを大きくして（端末設定）、崩れないかチェックする

---

## AIに聞いてみよう

### 質問テンプレ（コピペ）

```text
【前提】
この章を学習しています（この章のコンテキストは共有済み）。

【やりたいこと】
（例：contentDescriptionを整えたい / 多言語対応したい）

【今の状態】
- 対象画面：
- 該当コード：
- 直したい課題：

【欲しい回答】
- 改善案（アクセシビリティ観点）
- string resourcesの設計案
- 確認手順（TalkBack/言語切替）
```

```text
【質問】
この画面のアクセシビリティを改善したい。
TalkBack観点の改善案と、Composeでの実装ポイントを挙げて。
```

---

## 課題提出

この章には提出課題があります。

1. 上記の演習を完了する
2. GitHub で `feature/24-accessibility-i18n` ブランチを作成し、PRを作成
3. [AI総合レビューツール](https://ai.studio/apps/drive/1AMqIqU4Bio4te7AWh5dly1Qzp7CesqP9?fullscreenApplet=true) でレビューを実行
4. 問題がなければ、スプレッドシートに **PR URL** と **完了日** を記入

---

## ふりかえり

- `contentDescription` を付ける/付けない判断基準は？
- 文字列直書きが、後でどんな事故につながる？
- いまのアプリで、まず直したいa11y/i18nポイントはどこ？

---

## 次の章

次は [設定とセキュリティ（秘密情報/通信）](./25-security-config.md) に進み、設定とセキュリティの最低ラインを押さえましょう。
