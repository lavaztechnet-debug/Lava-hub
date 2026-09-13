package com.example.neoai.presentation.chat

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.example.neoai.data.network.Message
import com.example.neoai.ui.theme.NeoBackground
import com.example.neoai.ui.theme.neumorphic
import com.example.neoai.ui.theme.neumorphicClickable

@Composable
fun ChatScreen(
    viewModel: ChatViewModel = hiltViewModel()
) {
    val messages by viewModel.messages.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    var inputText by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(NeoBackground)
            .padding(16.dp)
    ) {
        Text(
            text = "AI Chat Bot",
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.align(Alignment.CenterHorizontally),
            color = Color(0xFF4A5568)
        )
        Spacer(modifier = Modifier.height(16.dp))
        
        // Chat Messages List (Concave Neumorphic Container)
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .neumorphic(isPressed = true, cornerRadius = 16.dp)
                .padding(16.dp)
        ) {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(16.dp),
                contentPadding = PaddingValues(bottom = 8.dp)
            ) {
                items(messages) { msg ->
                    MessageBubble(message = msg)
                }
                if (isLoading) {
                    item {
                        Text(
                            text = "AI is typing...",
                            color = Color(0xFFA3B1C6),
                            fontSize = 12.sp,
                            modifier = Modifier.padding(start = 8.dp)
                        )
                    }
                }
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Input Area
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            BasicTextField(
                value = inputText,
                onValueChange = { inputText = it },
                modifier = Modifier
                    .weight(1f)
                    .height(56.dp)
                    .neumorphic(isPressed = true, cornerRadius = 28.dp)
                    .padding(horizontal = 20.dp, vertical = 16.dp),
                textStyle = TextStyle(fontSize = 16.sp, color = Color(0xFF4A5568)),
                decorationBox = { innerTextField ->
                    if (inputText.isEmpty()) {
                        Text("Type a message...", color = Color(0xFFA3B1C6))
                    }
                    innerTextField()
                }
            )
            
            Box(
                modifier = Modifier
                    .size(56.dp)
                    .neumorphicClickable(
                        cornerRadius = 28.dp,
                        onClick = {
                            viewModel.sendMessage(inputText)
                            inputText = ""
                        }
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Send,
                    contentDescription = "Send Message",
                    tint = Color(0xFF4A5568)
                )
            }
        }
    }
}

@Composable
fun MessageBubble(message: Message) {
    val isUser = message.role == "user"
    val isSystem = message.role == "system"
    
    val alignment = if (isUser) Alignment.CenterEnd else Alignment.CenterStart
    val textColor = if (isSystem) Color.Red else Color(0xFF4A5568)
    
    // Asymmetric corners for chat bubble look while remaining Neumorphic
    val shape = if (isUser) {
        RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp, bottomStart = 16.dp, bottomEnd = 4.dp)
    } else {
        RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp, bottomStart = 4.dp, bottomEnd = 16.dp)
    }

    Box(
        modifier = Modifier.fillMaxWidth(),
        contentAlignment = alignment
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth(0.85f)
                .neumorphic(cornerRadius = 16.dp)
                // In Compose we can't easily clip a custom modifier's drop shadow dynamically without overhead, 
                // so we rely on the 16.dp corner radius for the physical shadow, 
                // but we can apply padding logically.
                .padding(16.dp)
        ) {
            Text(
                text = message.content,
                color = textColor,
                fontSize = 15.sp,
                lineHeight = 22.sp
            )
        }
    }
}
