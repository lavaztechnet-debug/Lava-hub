package com.example.neoai.presentation.notes

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.example.neoai.data.NoteEntity
import com.example.neoai.ui.theme.NeoBackground
import com.example.neoai.ui.theme.neumorphic
import com.example.neoai.ui.theme.neumorphicClickable

@Composable
fun NotesScreen(
    viewModel: NotesViewModel = hiltViewModel()
) {
    val currentNote by viewModel.currentNote.collectAsState()
    val notes by viewModel.notes.collectAsState()

    if (currentNote != null) {
        NoteEditor(viewModel, currentNote!!)
    } else {
        NoteList(viewModel, notes)
    }
}

@Composable
fun NoteList(viewModel: NotesViewModel, notes: List<NoteEntity>) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(NeoBackground)
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                "My Notes", 
                style = MaterialTheme.typography.headlineSmall, 
                fontWeight = FontWeight.Bold, 
                color = Color(0xFF4A5568)
            )
            Box(
                modifier = Modifier
                    .neumorphicClickable(onClick = { viewModel.createNewNote() }, cornerRadius = 8.dp)
                    .padding(horizontal = 12.dp, vertical = 8.dp)
            ) {
                Text("New", fontSize = 14.sp, color = Color(0xFF4A5568))
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(notes) { note ->
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .neumorphic(cornerRadius = 16.dp)
                        .clickable { viewModel.selectNote(note) }
                        .padding(16.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = note.title.ifEmpty { "Untitled Note" },
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF4A5568),
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                                modifier = Modifier.weight(1f)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            // Category Badge
                            Box(
                                modifier = Modifier
                                    .neumorphic(isPressed = true, cornerRadius = 4.dp)
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = note.category.uppercase(),
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF3B82F6) // Blue-500
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = note.content.ifEmpty { "No content..." },
                            color = Color(0xFFA3B1C6),
                            fontSize = 14.sp,
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }
            }
            if (notes.isEmpty()) {
                item {
                    Text(
                        "No notes yet. Create one!", 
                        color = Color(0xFFA3B1C6), 
                        modifier = Modifier.padding(top = 32.dp).fillMaxWidth(),
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                    )
                }
            }
        }
    }
}

@Composable
fun NoteEditor(viewModel: NotesViewModel, note: NoteEntity) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(NeoBackground)
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .neumorphicClickable(onClick = { viewModel.clearSelection() }, cornerRadius = 8.dp)
                    .padding(horizontal = 12.dp, vertical = 8.dp)
            ) {
                Text("Back", fontSize = 14.sp, color = Color(0xFF4A5568))
            }
            Box(
                modifier = Modifier
                    .neumorphicClickable(onClick = { viewModel.saveNote() }, cornerRadius = 8.dp)
                    .padding(horizontal = 12.dp, vertical = 8.dp)
            ) {
                Text("Save", fontSize = 14.sp, color = Color(0xFF4A5568))
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .neumorphic(isPressed = true, cornerRadius = 16.dp)
                .padding(16.dp)
        ) {
            Column(modifier = Modifier.fillMaxSize()) {
                BasicTextField(
                    value = note.title,
                    onValueChange = { viewModel.updateTitle(it) },
                    textStyle = TextStyle(fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color(0xFF4A5568)),
                    modifier = Modifier.fillMaxWidth(),
                    decorationBox = { innerTextField ->
                        if (note.title.isEmpty()) Text("Note Title", color = Color(0xFFA3B1C6))
                        innerTextField()
                    }
                )
                
                Spacer(modifier = Modifier.height(12.dp))
                
                // Category Selector
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    listOf("Work", "Personal", "Ideas", "None").forEach { cat ->
                        val isSelected = note.category == cat
                        Box(
                            modifier = Modifier
                                .neumorphicClickable(
                                    onClick = { viewModel.updateCategory(cat) }, 
                                    cornerRadius = 6.dp
                                )
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = cat, 
                                fontSize = 12.sp, 
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                color = if (isSelected) Color(0xFF3B82F6) else Color(0xFFA3B1C6)
                            )
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                BasicTextField(
                    value = note.content,
                    onValueChange = { viewModel.updateContent(it) },
                    textStyle = TextStyle(fontSize = 16.sp, color = Color(0xFF4A5568)),
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    decorationBox = { innerTextField ->
                        if (note.content.isEmpty()) Text("Start typing your rich-text note here...", color = Color(0xFFA3B1C6))
                        innerTextField()
                    }
                )
            }
        }
    }
}
