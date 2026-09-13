package com.example.neoai.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.*
import com.example.neoai.presentation.chat.ChatScreen
import com.example.neoai.presentation.notes.NotesScreen
import com.example.neoai.ui.theme.NeoBackground
import com.example.neoai.ui.theme.neumorphic

@Composable
fun MainScreen() {
    val navController = rememberNavController()
    
    Scaffold(
        bottomBar = { NeoBottomNavigation(navController) },
        containerColor = NeoBackground
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = "chat",
            modifier = Modifier.padding(paddingValues).fillMaxSize()
        ) {
            composable("chat") { ChatScreen() }
            composable("prompts") { PromptsScreen() }
            composable("notes") { NotesScreen() }
        }
    }
}

@Composable
fun PromptsScreen() {
    Column(
        modifier = Modifier.fillMaxSize().background(NeoBackground).padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Premium Prompts", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(16.dp))
        
        // Search
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
                .neumorphic(isPressed = true, cornerRadius = 25.dp)
                .padding(horizontal = 16.dp),
            contentAlignment = Alignment.CenterStart
        ) {
            Text("Search prompts...")
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Filter and Sort Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Box(modifier = Modifier.neumorphic(isPressed = true, cornerRadius = 16.dp).padding(horizontal = 12.dp, vertical = 6.dp)) {
                    Text("All", color = Color(0xFF3B82F6), fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }
                Box(modifier = Modifier.neumorphic(cornerRadius = 16.dp).padding(horizontal = 12.dp, vertical = 6.dp)) {
                    Text("Coding", fontSize = 12.sp)
                }
            }
            
            // Sort Dropdown Placeholder
            Box(
                modifier = Modifier
                    .neumorphic(cornerRadius = 8.dp)
                    .padding(horizontal = 12.dp, vertical = 6.dp)
            ) {
                Text("Sort: Newest ▼", fontSize = 12.sp, color = Color(0xFF4A5568))
            }
        }

        Spacer(modifier = Modifier.height(16.dp))
        
        // List placeholder
        Box(
            modifier = Modifier.fillMaxWidth().height(100.dp).neumorphic().padding(16.dp)
        ) {
            Column {
                Text("Senior Developer Persona", fontWeight = FontWeight.Bold)
                Text("Coding • 45 uses", fontSize = 10.sp, color = Color(0xFF3B82F6))
                Spacer(modifier = Modifier.height(4.dp))
                Text("Act as a Senior Developer...", fontSize = 14.sp)
            }
        }
    }
}

@Composable
fun NeoBottomNavigation(navController: NavHostController) {
    // Simple neumorphic bottom bar representation
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(80.dp)
            .background(NeoBackground)
            .padding(16.dp),
        horizontalArrangement = Arrangement.SpaceAround,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text("Chat")
        Text("Prompts")
        Text("Notes")
    }
}
