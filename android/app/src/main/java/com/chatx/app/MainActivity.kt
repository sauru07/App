package com.chatx.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private val Orange = Color(0xFFFF6A2A)
private val Red = Color(0xFFE53935)
private val Background = Color(0xFFFFF8F6)

data class ChatPreview(val name: String, val message: String, val time: String, val unread: Int = 0)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { ChatXApp() }
    }
}

@Composable
fun ChatXApp() {
    MaterialTheme(
        colorScheme = lightColorScheme(
            primary = Orange,
            secondary = Red,
            background = Background,
            surface = Color.White
        )
    ) {
        Surface(Modifier.fillMaxSize(), color = Background) {
            HomeScreen()
        }
    }
}

@Composable
fun HomeScreen() {
    var selected by remember { mutableStateOf(0) }
    val chats = listOf(
        ChatPreview("Rahul", "Hey! How are you?", "10:32", 2),
        ChatPreview("Development Team", "See you tomorrow", "09:48"),
        ChatPreview("Priya", "Sent a photo", "Yesterday"),
        ChatPreview("Family", "Dinner at 8?", "Yesterday", 4)
    )

    Column(Modifier.fillMaxSize()) {
        Box(
            Modifier.fillMaxWidth().background(
                Brush.horizontalGradient(listOf(Orange, Red))
            ).padding(horizontal = 20.dp, vertical = 22.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text("ChatX", color = Color.White, fontSize = 28.sp, fontWeight = FontWeight.Bold)
                    Text("Private. Fast. Connected.", color = Color.White.copy(alpha=.9f), fontSize = 13.sp)
                }
                Text("⌕", color = Color.White, fontSize = 30.sp)
            }
        }

        Row(Modifier.padding(16.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            listOf("All", "Unread", "Groups").forEach { label ->
                FilterChip(selected = selected == listOf("All","Unread","Groups").indexOf(label),
                    onClick = { selected = listOf("All","Unread","Groups").indexOf(label) },
                    label = { Text(label) })
            }
        }

        LazyColumn(
            Modifier.weight(1f),
            contentPadding = PaddingValues(bottom = 90.dp)
        ) {
            items(chats) { chat ->
                ChatRow(chat)
            }
        }

        NavigationBar(containerColor = Color.White) {
            NavigationBarItem(selected = true, onClick = {}, icon = { Text("💬") }, label = { Text("Chats") })
            NavigationBarItem(selected = false, onClick = {}, icon = { Text("📞") }, label = { Text("Calls") })
            NavigationBarItem(selected = false, onClick = {}, icon = { Text("◉") }, label = { Text("Status") })
            NavigationBarItem(selected = false, onClick = {}, icon = { Text("👤") }, label = { Text("Profile") })
        }
    }
}

@Composable
fun ChatRow(chat: ChatPreview) {
    Row(
        Modifier.fillMaxWidth().clickable { }.padding(horizontal = 18.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(Modifier.size(54.dp).clip(CircleShape).background(Brush.linearGradient(listOf(Orange, Red))),
            contentAlignment = Alignment.Center) {
            Text(chat.name.take(1), color = Color.White, fontWeight = FontWeight.Bold, fontSize = 20.sp)
        }
        Spacer(Modifier.width(14.dp))
        Column(Modifier.weight(1f)) {
            Text(chat.name, fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
            Text(chat.message, color = Color.Gray, fontSize = 14.sp, maxLines = 1)
        }
        Column(horizontalAlignment = Alignment.End) {
            Text(chat.time, color = Color.Gray, fontSize = 12.sp)
            if (chat.unread > 0) {
                Spacer(Modifier.height(4.dp))
                Box(Modifier.size(22.dp).clip(CircleShape).background(Orange), contentAlignment = Alignment.Center) {
                    Text(chat.unread.toString(), color = Color.White, fontSize = 11.sp)
                }
            }
        }
    }
}
