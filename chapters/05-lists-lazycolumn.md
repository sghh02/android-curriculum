# リスト表示とLazyColumn

多くのアプリではデータの一覧を表示します。
この章では、Composeで効率的にリストを表示する方法を学びます。

---

## この章の目標

- [ ] LazyColumn/LazyRowでスクロール可能なリストを作れる
- [ ] items()でリストデータを表示できる
- [ ] LazyGridでグリッドレイアウトを作れる
- [ ] パフォーマンスを意識した実装ができる

**所要時間の目安：2時間**

---

## なぜLazyColumnを使うのか

### Columnの問題点

```kotlin
// NG: 1000件のデータをColumnで表示
Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
    items.forEach { item ->
        ItemCard(item)  // 1000個すべてが一度に生成される
    }
}
```

**問題：** 画面に見えていない要素も含めて、すべてが一度に生成される。
→ メモリ消費大、起動が遅い

### LazyColumnの解決策

```kotlin
// OK: LazyColumnは見える部分だけ生成
LazyColumn {
    items(items) { item ->
        ItemCard(item)  // 見える分だけ生成される
    }
}
```

**メリット：** 画面に見えている要素だけを生成・破棄する。
→ 何千件でも快適に動作

---

## LazyColumnの基本

### 基本構文

```kotlin
@Composable
fun SimpleList() {
    LazyColumn {
        items(100) { index ->
            Text(
                text = "アイテム $index",
                modifier = Modifier.padding(16.dp)
            )
        }
    }
}
```

### リストデータを表示

```kotlin
@Composable
fun UserList(users: List<User>) {
    LazyColumn {
        items(users) { user ->
            UserCard(user)
        }
    }
}

@Composable
fun UserCard(user: User) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Default.Person,
                contentDescription = null,
                modifier = Modifier.size(40.dp)
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text(
                    text = user.name,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = user.email,
                    color = Color.Gray,
                    fontSize = 14.sp
                )
            }
        }
    }
}
```

### 異なる種類のアイテムを混在

```kotlin
@Composable
fun MixedList() {
    LazyColumn {
        // ヘッダー
        item {
            Text(
                text = "ユーザー一覧",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(16.dp)
            )
        }

        // リストアイテム
        items(users) { user ->
            UserCard(user)
        }

        // フッター
        item {
            Text(
                text = "以上 ${users.size} 件",
                modifier = Modifier.padding(16.dp),
                color = Color.Gray
            )
        }
    }
}
```

### itemsIndexed - インデックス付き

```kotlin
LazyColumn {
    itemsIndexed(users) { index, user ->
        Row {
            Text("${index + 1}. ")
            Text(user.name)
        }
    }
}
```

---

## LazyRow - 横スクロール

```kotlin
@Composable
fun CategoryChips(categories: List<String>) {
    LazyRow(
        contentPadding = PaddingValues(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(categories) { category ->
            FilterChip(
                selected = false,
                onClick = { },
                label = { Text(category) }
            )
        }
    }
}

@Composable
fun HorizontalCardList(items: List<Item>) {
    LazyRow(
        contentPadding = PaddingValues(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(items) { item ->
            Card(
                modifier = Modifier.size(width = 150.dp, height = 200.dp)
            ) {
                // カードの内容
            }
        }
    }
}
```

---

## LazyVerticalGrid - グリッドレイアウト

```kotlin
@Composable
fun PhotoGrid(photos: List<Photo>) {
    LazyVerticalGrid(
        columns = GridCells.Fixed(3),  // 3列固定
        contentPadding = PaddingValues(8.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(photos) { photo ->
            Image(
                painter = painterResource(photo.resId),
                contentDescription = null,
                modifier = Modifier
                    .aspectRatio(1f)
                    .clip(RoundedCornerShape(8.dp)),
                contentScale = ContentScale.Crop
            )
        }
    }
}

// 可変幅のグリッド
LazyVerticalGrid(
    columns = GridCells.Adaptive(minSize = 100.dp)  // 最小100dp
) {
    // ...
}
```

---

## contentPaddingとArrangement

### contentPadding

リスト全体の余白を設定します。

```kotlin
LazyColumn(
    contentPadding = PaddingValues(
        start = 16.dp,
        end = 16.dp,
        top = 8.dp,
        bottom = 80.dp  // FABの分のスペース
    )
) {
    // ...
}
```

### verticalArrangement

アイテム間のスペースを設定します。

```kotlin
LazyColumn(
    verticalArrangement = Arrangement.spacedBy(8.dp)
) {
    items(users) { user ->
        UserCard(user)  // カード間に8dpのスペース
    }
}
```

---

## キー（key）の重要性

### なぜキーが必要か

```kotlin
// NG: キーがないとアイテムの追加/削除で問題が起きる
LazyColumn {
    items(memos) { memo ->
        MemoItem(memo)
    }
}

// OK: 一意のキーを指定
LazyColumn {
    items(
        items = memos,
        key = { memo -> memo.id }  // 一意のID
    ) { memo ->
        MemoItem(memo)
    }
}
```

### キーがないと起きる問題

1. **アニメーションが正しく動かない**
2. **入力中のテキストが失われる**
3. **チェックボックスの状態がずれる**

### キーの指定方法

```kotlin
// data classのidを使う
items(
    items = users,
    key = { it.id }
) { user -> ... }

// itemsIndexedの場合
itemsIndexed(
    items = users,
    key = { _, user -> user.id }
) { index, user -> ... }

// 単一アイテム
item(key = "header") {
    Header()
}
```

---

## スクロール状態の管理

### スクロール位置の取得

```kotlin
@Composable
fun ScrollableList() {
    val listState = rememberLazyListState()

    // 最初のアイテムが見えているか
    val showButton by remember {
        derivedStateOf {
            listState.firstVisibleItemIndex > 0
        }
    }

    Box {
        LazyColumn(state = listState) {
            items(100) { index ->
                Text("Item $index", modifier = Modifier.padding(16.dp))
            }
        }

        // 一番上に戻るボタン
        if (showButton) {
            FloatingActionButton(
                onClick = { /* スクロール処理 */ },
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(16.dp)
            ) {
                Icon(Icons.Default.KeyboardArrowUp, "上に戻る")
            }
        }
    }
}
```

### プログラムでスクロール

```kotlin
@Composable
fun ScrollableListWithButton() {
    val listState = rememberLazyListState()
    val coroutineScope = rememberCoroutineScope()

    Column {
        Button(
            onClick = {
                coroutineScope.launch {
                    // アニメーション付きでスクロール
                    listState.animateScrollToItem(0)
                }
            }
        ) {
            Text("先頭へ")
        }

        LazyColumn(state = listState) {
            items(100) { index ->
                Text("Item $index")
            }
        }
    }
}
```

---

## Stickyヘッダー

グループごとにヘッダーを固定表示します。

```kotlin
@OptIn(ExperimentalFoundationApi::class)
@Composable
fun ContactList(contacts: Map<Char, List<Contact>>) {
    LazyColumn {
        contacts.forEach { (initial, contactsForInitial) ->
            // 固定ヘッダー
            stickyHeader {
                Text(
                    text = initial.toString(),
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(MaterialTheme.colorScheme.primaryContainer)
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    fontWeight = FontWeight.Bold
                )
            }

            // そのグループのアイテム
            items(contactsForInitial) { contact ->
                ContactItem(contact)
            }
        }
    }
}
```

---

## 実践：連絡先リストを作る

```kotlin
data class Contact(
    val id: String,
    val name: String,
    val phone: String,
    val initial: Char = name.first()
)

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun ContactListScreen() {
    val contacts = remember {
        listOf(
            Contact("1", "青木太郎", "090-1111-1111"),
            Contact("2", "石田花子", "090-2222-2222"),
            Contact("3", "上田次郎", "090-3333-3333"),
            Contact("4", "遠藤三郎", "090-4444-4444"),
            Contact("5", "大野四郎", "090-5555-5555"),
            // ...
        ).groupBy { it.initial }
    }

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("連絡先") })
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier.padding(paddingValues)
        ) {
            contacts.forEach { (initial, contactsForInitial) ->
                stickyHeader {
                    Text(
                        text = initial.toString(),
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(MaterialTheme.colorScheme.surfaceVariant)
                            .padding(horizontal = 16.dp, vertical = 8.dp),
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                }

                items(
                    items = contactsForInitial,
                    key = { it.id }
                ) { contact ->
                    ContactItem(
                        contact = contact,
                        onClick = { /* 詳細画面へ */ }
                    )
                }
            }
        }
    }
}

@Composable
fun ContactItem(
    contact: Contact,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(48.dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.primary),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = contact.initial.toString(),
                color = MaterialTheme.colorScheme.onPrimary,
                fontWeight = FontWeight.Bold
            )
        }

        Spacer(modifier = Modifier.width(16.dp))

        Column {
            Text(
                text = contact.name,
                fontWeight = FontWeight.Medium
            )
            Text(
                text = contact.phone,
                color = Color.Gray,
                fontSize = 14.sp
            )
        }
    }
}
```

---

## パフォーマンスのベストプラクティス

### 1. キーを必ず指定する

```kotlin
items(
    items = list,
    key = { it.id }  // 必須！
) { item -> ... }
```

### 2. 重いComposableを避ける

```kotlin
// NG: items内で重い処理
items(users) { user ->
    val processedData = expensiveCalculation(user)  // 毎回計算
    UserCard(processedData)
}

// OK: 事前に計算
val processedUsers = remember(users) {
    users.map { expensiveCalculation(it) }
}
items(processedUsers) { data ->
    UserCard(data)
}
```

### 3. Modifierを再利用

```kotlin
// NG: 毎回Modifierを生成
items(list) { item ->
    Text(
        text = item.name,
        modifier = Modifier.padding(16.dp)  // 毎回生成
    )
}

// OK: Modifierを再利用
val itemModifier = Modifier.padding(16.dp)
items(list) { item ->
    Text(
        text = item.name,
        modifier = itemModifier
    )
}
```

### 4. 画像の最適化

```kotlin
// NG: 大きな画像をそのまま
Image(
    painter = painterResource(R.drawable.huge_image),
    contentDescription = null
)

// OK: サイズを制限してクロップ
Image(
    painter = painterResource(R.drawable.huge_image),
    contentDescription = null,
    modifier = Modifier.size(100.dp),
    contentScale = ContentScale.Crop
)
```

---

## AIに聞いてみよう

### 質問例

```
【質問】
LazyColumn と Column の違いは何？
いつどっちを使えばいい？
```

```
【質問】
LazyColumnでアイテムを削除したとき、
なぜかチェックボックスの状態がおかしくなる。
keyを指定したら直るって聞いたけど、どういうこと？
```

```
【質問】
LazyColumnで「もっと見る」ボタンを押したら
追加データを読み込むようにしたい。
無限スクロールってどうやって実装する？
```

---

## チェックリスト

- [ ] LazyColumnとColumnの違いを説明できる
- [ ] items()でリストを表示できる
- [ ] キー（key）の重要性を理解している
- [ ] LazyRowで横スクロールを実装できる
- [ ] LazyVerticalGridでグリッド表示できる
- [ ] スクロール状態を管理できる

---

## まとめ

この章では以下を学びました：

1. **LazyColumn** - 縦スクロールリスト
2. **LazyRow** - 横スクロールリスト
3. **LazyVerticalGrid** - グリッドレイアウト
4. **キー（key）** - アイテムの一意識別
5. **スクロール状態** - プログラムからの制御
6. **Stickyヘッダー** - グループ化表示

リストはほぼすべてのアプリで使う重要な機能です。
次の章ではMaterial Designでより美しいUIを作ります。
