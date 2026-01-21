# データ保存（Room / DataStore）

オフラインでも使えるアプリにはローカル保存が必須です。

## 目標
- RoomでDBを扱える
- DataStoreで軽量データを保存できる

## Roomの基本構成
```kotlin
@Entity
data class TodoEntity(
    @PrimaryKey val id: Int,
    val title: String,
    val done: Boolean
)

@Dao
interface TodoDao {
    @Query("SELECT * FROM TodoEntity")
    fun getTodos(): Flow<List<TodoEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(todo: TodoEntity)
}
```

## DataStore例
```kotlin
val Context.dataStore by preferencesDataStore(name = "settings")
```

## ミニ課題
- RoomにTODOを保存し、再起動しても残るか確認

---

次章では、テストの基本を学びます。
