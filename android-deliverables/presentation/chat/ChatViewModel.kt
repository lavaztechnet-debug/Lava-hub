package com.example.neoai.presentation.chat

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.neoai.data.network.Message
import com.example.neoai.domain.repository.ChatRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ChatViewModel @Inject constructor(
    private val chatRepository: ChatRepository
) : ViewModel() {

    private val _messages = MutableStateFlow<List<Message>>(emptyList())
    val messages: StateFlow<List<Message>> = _messages.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    // Note: In production, securely inject this via BuildConfig, DataStore, or a remote config.
    private val apiKey = "YOUR_API_KEY_HERE"
    private val aiModel = "gpt-3.5-turbo" // or "gemini-pro" depending on endpoint

    fun sendMessage(content: String) {
        if (content.isBlank()) return

        val userMessage = Message(role = "user", content = content)
        val updatedMessages = _messages.value + userMessage
        _messages.value = updatedMessages

        viewModelScope.launch {
            _isLoading.value = true
            try {
                // To maintain context, we send the entire message history
                val responseText = chatRepository.sendMessage(
                    apiKey = apiKey,
                    model = aiModel,
                    messages = updatedMessages
                )
                val assistantMessage = Message(role = "assistant", content = responseText)
                _messages.value = _messages.value + assistantMessage
            } catch (e: Exception) {
                val errorMessage = Message(role = "system", content = "Error: ${e.message}")
                _messages.value = _messages.value + errorMessage
            } finally {
                _isLoading.value = false
            }
        }
    }
}
