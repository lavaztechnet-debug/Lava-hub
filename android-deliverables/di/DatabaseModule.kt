package com.example.neoai.di

import android.content.Context
import androidx.room.Room
import com.example.neoai.data.AppDatabase
import com.example.neoai.data.NoteDao
import com.example.neoai.data.PromptDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideAppDatabase(@ApplicationContext context: Context): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            "neo_app_database"
        ).build()
    }

    @Provides
    fun provideNoteDao(database: AppDatabase): NoteDao {
        return database.noteDao()
    }

    @Provides
    fun providePromptDao(database: AppDatabase): PromptDao {
        return database.promptDao()
    }
}
