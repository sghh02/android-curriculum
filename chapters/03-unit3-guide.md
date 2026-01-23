# Unit 3: ナビゲーションとアーキテクチャ（ガイド）

Unit 3では、画面が増えても破綻しないように、**画面遷移（Navigation）**と**設計（ViewModel/Repository/DI）**の基礎を固めます。初心者が伸びる分岐点です。

---

## 前提

- Unit 2まで完了し、一覧/入力などのUIが作れている

## この章でできるようになること

- Navigationで画面遷移を組み、引数や戻る操作を扱える
- ViewModel + UI Stateで、UIとロジックを分離できる
- Repository/DIの目的を理解し、拡張しやすい骨格を作れる

---

## このユニットでやること（レッスン）

- 画面遷移：`chapters/07-navigation.md`
- 設計：`chapters/08-architecture.md`

---

## チェックポイント（完了条件）

- [ ] 一覧 → 作成/編集 へ遷移できる（戻るも含む）
- [ ] UIは「状態表示」に寄せ、操作はViewModelの関数として表現できる
- [ ] Repositoryを導入し、データ取得/保存の詳細をUIから隠せる

---

## 演習

- [ ] 画面遷移を入れ、メモ作成/編集の導線を完成させる
- [ ] UI Stateに `isLoading` / `error` を追加し、失敗系の表示を用意する
- [ ] DI（Hilt）を導入するか、導入計画（どこに何を置くか）を作る

---

## ふりかえり

- Navigationの引数は、どの粒度で渡すと安全？
- ViewModelに書いていいこと/ダメなことは何？
- Repositoryを挟むと、何が嬉しい？

---

## 次の章

次は `chapters/07-navigation.md` に進み、画面遷移を整えましょう。

