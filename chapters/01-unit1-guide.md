# Unit 1: プログラミングとAndroidの基礎（ガイド）

Unit 1では、**開発環境の準備 → Kotlin基礎 → Android/Compose基礎**までを一気に押さえます。ここを丁寧にやると、後半（アーキテクチャ/非同期/テスト）がラクになります。

---

## 前提

- `chapters/00-course-guide.md` を読んで、学習の進め方（毎週の型）を決めている
- わからない用語は `chapters/00-glossary.md` で都度つぶす

## この章でできるようになること

- Android Studioでプロジェクトを作成し、エミュレータ/実機で起動できる
- Kotlinの基本文法と、最小限のオブジェクト指向を使ってコードを書ける
- Composeで「動く画面」を作り、シンプルメモアプリ開発を開始できる

---

## このユニットでやること（レッスン）

- 環境構築：`chapters/01-setup.md`
- Kotlin基礎：`chapters/02-kotlin-basics.md`
- OOP基礎：`chapters/02-oop-fundamentals.md`
- Androidの基本：`chapters/03-android-fundamentals.md`
- Composeの基本：`chapters/03-compose-basics.md`
- ハンズオン開始：`chapters/04-project-start.md`

---

## チェックポイント（完了条件）

- [ ] Android Studioのセットアップが完了し、Helloアプリが起動できる
- [ ] Kotlinで「関数・クラス・コレクション」を使った小さなプログラムを書ける
- [ ] ComposeでText/Button/Row/Column/Modifierを使った画面を作れる
- [ ] シンプルメモアプリのプロジェクトを作成し、コミット履歴が残っている

---

## 演習

### 演習1：学習の“証拠”を残す

- [ ] Gitでリポジトリを作り、`setup`完了までを1つのPRにする
- [ ] PR本文に「目的/変更内容/動作確認（スクショ）」を書く

### 演習2：シンプルメモの最小構成を作る

- [ ] `Memo` のデータ構造（id/title/content/createdAt など）を決める
- [ ] サンプルメモを画面に表示できる（固定データでOK）

---

## ふりかえり

- Kotlinで「まだ曖昧」だと感じる文法はどれ？
- Composeは、XMLより何が嬉しいと感じた？
- 次のUnitで“詰まりそう”な点はどこ？（State/Navigation/設計）

---

## 次の章

次は `chapters/01-setup.md` に進み、環境構築から始めましょう。

