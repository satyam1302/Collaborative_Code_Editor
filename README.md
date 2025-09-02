# Collaborative Code Editor

A real-time collaborative code editor with **chat support**, **code execution**, and **room-based collaboration**.  
Multiple users can join a room, write code together, run it in different languages, chat, and save their code.  

---

## 🚀 Features

- Real-time collaborative code editing (via WebSockets).
- Multiple programming languages supported (Python, C, C++, Java, JavaScript).
- Code execution with input/output support.
- Collapsible terminal panel (like VS Code).
- Room-based collaboration: join with a unique Room ID.
- Chatbox with message notifications (unread badge).
- Save code feature with backend storage.
- Responsive UI with adjustable editor/output panels.

---

## 🛠️ Tech Stack

- **Frontend:** React, Bootstrap  
- **Backend:** Node.js, Express, Socket.IO  
- **Code Execution:** External API integration (JDoodle / Piston / Judge0)  
- **Deployment:** Render (free tier)  

---

## 🌐 Deployed Link

🔗 [Try the Live App Here](https://collaborative-code-editor-tci5.onrender.com)  

⚠️ **Note:**  
Since the backend is deployed on a **free hosting platform (Render free tier)**, the server goes to sleep when idle.  
- On the **first attempt to join a room**, you may see: Socket Connection Failed
- Wait **15–20 seconds** (to let the server wake up) and then join the room again.  
- After the server is active, collaboration works smoothly.  

---

## 📦 Installation & Setup

### Clone the repository
```bash
git clone https://github.com/your-username/collaborative-code-editor.git
cd collaborative-code-editor


