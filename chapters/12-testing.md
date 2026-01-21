# テスト（ユニット/Compose UI）

品質を担保するため、テストは必須です。

## 目標
- ユニットテストとUIテストの違いを理解する
- Compose UIテストの基本を知る

## ユニットテスト例
```kotlin
@Test
fun add_returnsSum() {
    assertEquals(4, add(2, 2))
}
```

## Compose UIテスト例
```kotlin
composeTestRule
    .setContent { Greeting("Android") }

composeTestRule
    .onNodeWithText("Hello, Android")
    .assertIsDisplayed()
```

## ミニ課題
- カウンター画面のテストを作成

---

次章では、パフォーマンスや最適化を学びます。
