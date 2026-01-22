# ネットワーク通信（Retrofit）

多くのアプリはサーバーからデータを取得します。
この章では、Retrofitを使ったAPI通信を学びます。

---

## この章の目標

- [ ] Retrofitのセットアップができる
- [ ] APIインターフェースを定義できる
- [ ] JSONをデータクラスにパースできる
- [ ] エラーハンドリングを実装できる
- [ ] 画像読み込み（Coil）を使える

**所要時間の目安：2〜3時間**

---

## セットアップ

### 依存関係の追加

```kotlin
// build.gradle.kts
dependencies {
    // Retrofit
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-kotlinx-serialization:2.9.0")

    // Kotlin Serialization
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.2")

    // OkHttp（ログ出力用）
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

    // Coil（画像読み込み）
    implementation("io.coil-kt:coil-compose:2.5.0")
}

// プラグイン
plugins {
    kotlin("plugin.serialization") version "1.9.21"
}
```

### インターネットパーミッション

```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
```

---

## Retrofitの基本

### APIインターフェースの定義

```kotlin
interface ApiService {
    @GET("users")
    suspend fun getUsers(): List<User>

    @GET("users/{id}")
    suspend fun getUser(@Path("id") userId: Int): User

    @GET("posts")
    suspend fun getPosts(@Query("userId") userId: Int): List<Post>

    @POST("users")
    suspend fun createUser(@Body user: User): User

    @PUT("users/{id}")
    suspend fun updateUser(
        @Path("id") userId: Int,
        @Body user: User
    ): User

    @DELETE("users/{id}")
    suspend fun deleteUser(@Path("id") userId: Int)
}
```

### データクラスの定義

```kotlin
@Serializable
data class User(
    val id: Int,
    val name: String,
    val email: String,
    val phone: String? = null
)

@Serializable
data class Post(
    val id: Int,
    val userId: Int,
    val title: String,
    val body: String
)
```

### Retrofitインスタンスの作成

```kotlin
object RetrofitClient {
    private const val BASE_URL = "https://jsonplaceholder.typicode.com/"

    private val json = Json {
        ignoreUnknownKeys = true  // 未知のキーを無視
        coerceInputValues = true  // nullを初期値に変換
    }

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        })
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    val apiService: ApiService = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
        .build()
        .create(ApiService::class.java)
}
```

---

## Repository実装

```kotlin
interface UserRepository {
    suspend fun getUsers(): Result<List<User>>
    suspend fun getUser(id: Int): Result<User>
    suspend fun createUser(user: User): Result<User>
}

class UserRepositoryImpl(
    private val api: ApiService
) : UserRepository {

    override suspend fun getUsers(): Result<List<User>> {
        return try {
            val users = api.getUsers()
            Result.success(users)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getUser(id: Int): Result<User> {
        return try {
            val user = api.getUser(id)
            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun createUser(user: User): Result<User> {
        return try {
            val created = api.createUser(user)
            Result.success(created)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
```

---

## ViewModelでの使用

```kotlin
data class UsersUiState(
    val users: List<User> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)

class UsersViewModel(
    private val repository: UserRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(UsersUiState())
    val uiState: StateFlow<UsersUiState> = _uiState.asStateFlow()

    init {
        loadUsers()
    }

    fun loadUsers() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }

            repository.getUsers()
                .onSuccess { users ->
                    _uiState.update { it.copy(users = users, isLoading = false) }
                }
                .onFailure { e ->
                    _uiState.update { it.copy(error = e.message, isLoading = false) }
                }
        }
    }

    fun retry() {
        loadUsers()
    }
}
```

---

## UIの実装

```kotlin
@Composable
fun UsersScreen(viewModel: UsersViewModel = viewModel()) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("ユーザー一覧") })
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            when {
                uiState.isLoading -> {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center)
                    )
                }
                uiState.error != null -> {
                    ErrorContent(
                        message = uiState.error!!,
                        onRetry = viewModel::retry,
                        modifier = Modifier.align(Alignment.Center)
                    )
                }
                else -> {
                    UserList(users = uiState.users)
                }
            }
        }
    }
}

@Composable
fun ErrorContent(
    message: String,
    onRetry: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = Icons.Default.Warning,
            contentDescription = null,
            modifier = Modifier.size(48.dp),
            tint = MaterialTheme.colorScheme.error
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = message,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = onRetry) {
            Text("再試行")
        }
    }
}

@Composable
fun UserList(users: List<User>) {
    LazyColumn {
        items(users, key = { it.id }) { user ->
            UserItem(user = user)
        }
    }
}
```

---

## 画像読み込み（Coil）

### 基本的な使い方

```kotlin
@Composable
fun UserAvatar(imageUrl: String) {
    AsyncImage(
        model = imageUrl,
        contentDescription = "アバター",
        modifier = Modifier
            .size(48.dp)
            .clip(CircleShape),
        contentScale = ContentScale.Crop
    )
}
```

### プレースホルダーとエラー画像

```kotlin
@Composable
fun UserAvatar(imageUrl: String?) {
    AsyncImage(
        model = ImageRequest.Builder(LocalContext.current)
            .data(imageUrl)
            .crossfade(true)
            .build(),
        contentDescription = "アバター",
        modifier = Modifier
            .size(48.dp)
            .clip(CircleShape),
        placeholder = painterResource(R.drawable.placeholder),
        error = painterResource(R.drawable.error_image),
        contentScale = ContentScale.Crop
    )
}
```

### キャッシュ設定

```kotlin
// Application.kt
@HiltAndroidApp
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        // Coilのキャッシュ設定
        val imageLoader = ImageLoader.Builder(this)
            .memoryCachePolicy(CachePolicy.ENABLED)
            .diskCachePolicy(CachePolicy.ENABLED)
            .diskCache {
                DiskCache.Builder()
                    .directory(cacheDir.resolve("image_cache"))
                    .maxSizePercent(0.02)
                    .build()
            }
            .build()

        Coil.setImageLoader(imageLoader)
    }
}
```

---

## エラーハンドリング

### sealed classでの状態管理

```kotlin
sealed interface NetworkResult<out T> {
    data class Success<T>(val data: T) : NetworkResult<T>
    data class Error(val message: String, val code: Int? = null) : NetworkResult<Nothing>
    object Loading : NetworkResult<Nothing>
}

// Repository
suspend fun getUsers(): NetworkResult<List<User>> {
    return try {
        val response = api.getUsers()
        NetworkResult.Success(response)
    } catch (e: HttpException) {
        NetworkResult.Error("サーバーエラー", e.code())
    } catch (e: IOException) {
        NetworkResult.Error("ネットワークエラー")
    } catch (e: Exception) {
        NetworkResult.Error("不明なエラー")
    }
}
```

### リトライ機能

```kotlin
suspend fun <T> retryWithBackoff(
    times: Int = 3,
    initialDelay: Long = 1000,
    maxDelay: Long = 10000,
    factor: Double = 2.0,
    block: suspend () -> T
): T {
    var currentDelay = initialDelay
    repeat(times - 1) {
        try {
            return block()
        } catch (e: Exception) {
            // 待機してリトライ
        }
        delay(currentDelay)
        currentDelay = (currentDelay * factor).toLong().coerceAtMost(maxDelay)
    }
    return block()  // 最後の試行
}
```

---

## 実践：ユーザー詳細画面

```kotlin
@Composable
fun UserDetailScreen(
    userId: Int,
    viewModel: UserDetailViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(userId) {
        viewModel.loadUser(userId)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("ユーザー詳細") },
                navigationIcon = {
                    IconButton(onClick = { /* 戻る */ }) {
                        Icon(Icons.Default.ArrowBack, "戻る")
                    }
                }
            )
        }
    ) { paddingValues ->
        when (val state = uiState) {
            is UserDetailUiState.Loading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
            is UserDetailUiState.Success -> {
                UserDetailContent(
                    user = state.user,
                    modifier = Modifier.padding(paddingValues)
                )
            }
            is UserDetailUiState.Error -> {
                ErrorContent(
                    message = state.message,
                    onRetry = { viewModel.loadUser(userId) }
                )
            }
        }
    }
}
```

---

## AIに聞いてみよう

### 質問例

```
【質問】
Retrofitで認証が必要なAPIを呼ぶとき、
ヘッダーにトークンを付ける方法を教えて。
Interceptorって何？
```

```
【質問】
APIからのレスポンスが
{ "status": "success", "data": [...] }
みたいにラップされてるとき、
どうやってパースすればいい？
```

```
【質問】
ネットワークエラーのとき、
自動でリトライする機能を実装したい。
おすすめの方法は？
```

---

## チェックリスト

- [ ] Retrofitをセットアップできる
- [ ] APIインターフェースを定義できる
- [ ] GET/POST/PUT/DELETEを使い分けられる
- [ ] JSONをデータクラスにパースできる
- [ ] エラーハンドリングを実装できる
- [ ] Coilで画像を表示できる

---

## まとめ

この章では以下を学びました：

1. **Retrofit** - HTTPクライアントライブラリ
2. **APIインターフェース** - エンドポイントの定義
3. **Kotlinx Serialization** - JSONパース
4. **エラーハンドリング** - Result型、sealed class
5. **Coil** - 画像の非同期読み込み

次の章ではローカルデータの保存を学びます。
