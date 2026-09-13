package com.example.neoai.data.network

import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST

// Models for OpenAI / Gemini REST API format
data class ChatRequest(
    val model: String,
    val messages: List<Message>
)

data class Message(
    val role: String,
    val content: String
)

data class ChatResponse(
    val id: String,
    val choices: List<Choice>
)

data class Choice(
    val index: Int,
    val message: Message,
    val finish_reason: String
)

// Retrofit Interface
interface AiApiService {

    @POST("v1/chat/completions")
    suspend fun generateChatResponse(
        @Header("Authorization") apiKey: String,
        @Body request: ChatRequest
    ): ChatResponse

}
