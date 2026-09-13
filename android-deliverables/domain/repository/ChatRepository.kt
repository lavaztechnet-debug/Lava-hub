package com.example.neoai.domain.repository

import com.example.neoai.data.network.AiApiService
import com.example.neoai.data.network.ChatRequest
import com.example.neoai.data.network.Message
import javax.inject.Inject

class ChatRepository @Inject constructor(
    private val apiService: AiApiService
) {
    suspend fun sendMessage(apiKey: String, model: String, messages: List<Message>): String {
        val request = ChatRequest(model = model, messages = messages)
        // Using "Bearer " prefix for OpenAI. Gemini might use query params, but we stick to the standard Auth header as defined in RetrofitService.kt
        val response = apiService.generateChatResponse("Bearer $apiKey", request)
        return response.choices.firstOrNull()?.message?.content ?: "No response received."
    }
}
