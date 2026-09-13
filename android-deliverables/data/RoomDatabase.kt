package com.example.neoai.data

import androidx.room.*
import kotlinx.coroutines.flow.Flow

// --- Entities ---

@Entity(tableName = "notes")
data class NoteEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val title: String,
    val content: String, // Rich-text string (HTML or Markdown)
    val category: String = "None",
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "prompts")
data class PromptEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val title: String,
    val promptText: String,
    val category: String,
    val usageCount: Int = 0,
    val timestamp: Long = System.currentTimeMillis()
)

// --- DAOs ---

@Dao
interface NoteDao {
    @Query("SELECT * FROM notes ORDER BY timestamp DESC")
    fun getAllNotes(): Flow<List<NoteEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNote(note: NoteEntity)

    @Delete
    suspend fun deleteNote(note: NoteEntity)
}

@Dao
interface PromptDao {
    @Query("SELECT * FROM prompts")
    fun getAllPrompts(): Flow<List<PromptEntity>>

    @Query("SELECT * FROM prompts WHERE title LIKE '%' || :query || '%' OR category LIKE '%' || :query || '%'")
    fun searchPrompts(query: String): Flow<List<PromptEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPrompt(prompt: PromptEntity)
}

// --- Database ---

@Database(
    entities = [NoteEntity::class, PromptEntity::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun noteDao(): NoteDao
    abstract fun promptDao(): PromptDao
}
