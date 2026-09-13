package com.example.neoai.domain.repository

import com.example.neoai.data.NoteDao
import com.example.neoai.data.NoteEntity
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class NoteRepository @Inject constructor(
    private val noteDao: NoteDao
) {
    fun getAllNotes(): Flow<List<NoteEntity>> = noteDao.getAllNotes()

    suspend fun saveNote(note: NoteEntity) {
        noteDao.insertNote(note)
    }

    suspend fun deleteNote(note: NoteEntity) {
        noteDao.deleteNote(note)
    }
}
