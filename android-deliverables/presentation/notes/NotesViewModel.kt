package com.example.neoai.presentation.notes

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.neoai.data.NoteEntity
import com.example.neoai.domain.repository.NoteRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class NotesViewModel @Inject constructor(
    private val noteRepository: NoteRepository
) : ViewModel() {

    val notes: StateFlow<List<NoteEntity>> = noteRepository.getAllNotes()
        .stateIn(viewModelScope, SharingStarted.Lazily, emptyList())

    private val _currentNote = MutableStateFlow<NoteEntity?>(null)
    val currentNote: StateFlow<NoteEntity?> = _currentNote.asStateFlow()

    fun selectNote(note: NoteEntity) {
        _currentNote.value = note
    }

    fun clearSelection() {
        _currentNote.value = null
    }

    fun updateTitle(title: String) {
        _currentNote.value = _currentNote.value?.copy(title = title)
    }

    fun updateContent(content: String) {
        _currentNote.value = _currentNote.value?.copy(content = content)
    }

    fun updateCategory(category: String) {
        _currentNote.value = _currentNote.value?.copy(category = category)
    }

    fun saveNote() {
        val noteToSave = _currentNote.value ?: return
        viewModelScope.launch {
            noteRepository.saveNote(noteToSave)
            _currentNote.value = null // Close editor after save
        }
    }

    fun createNewNote() {
        _currentNote.value = NoteEntity(title = "New Note", content = "", category = "Ideas")
    }
}
