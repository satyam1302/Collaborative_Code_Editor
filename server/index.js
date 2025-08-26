// const express = require('express');
// const app = express();
// const http = require('http');
// const { Server } = require("socket.io");

// const PORT = process.env.PORT || 5001;

// const server = http.createServer(app);
// const io = new Server(server);
// const userSocketMap = {};

// const getAllConnectedClients = (roomId) => {
//     return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
//         return {
//             socketId,
//             username: userSocketMap[socketId].username, // Access `username` here
//         };
//     });
// };


// io.on("connection", (socket) => {
//     socket.on("join", ({ roomId, username }) => {
//         userSocketMap[socket.id] = { username, roomId };
//         socket.join(roomId);
    
//         const clients = getAllConnectedClients(roomId);
//         clients.forEach(({ socketId }) => {
//             io.to(socketId).emit("joined", {
//                 clients,
//                 username,
//                 socketId: socket.id,
//             });
//         });
//     });
    
//     socket.on('code-change', ({ roomId, code }) => {
//         socket.in(roomId).emit("code-change", { code });
//     });

//     socket.on('sync-code', ({ socketId, code }) => {
//         io.to(socketId).emit("code-change", { code });
//     });

//     socket.on("newMessage", ({ username, message }) => {
//         const roomId = userSocketMap[socket.id].roomId;
//         io.to(roomId).emit("newMessage", { username, message });
//     });

//     socket.on("disconnect", () => {
//         const { username, roomId } = userSocketMap[socket.id] || {};
//         if (roomId) {
//             socket.to(roomId).emit("userLeft", {
//                 socketId: socket.id,
//                 username,
//             });
//         }
//         delete userSocketMap[socket.id];
//     });
// });

// server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));





// const express = require('express');
// const mongoose = require('mongoose');
// const http = require('http');
// const { Server } = require("socket.io");
// const cors = require('cors');
// const { Schema } = mongoose;

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// const PORT = process.env.PORT || 5001;

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/code_editor', {
//     // useNewUrlParser: true,
//     // useUnifiedTopology: true
// });

// // Create a schema for saving code
// const codeSchema = new Schema({
//     roomId: { type: String, required: true },
//     code: { type: String, required: true },
// }, { timestamps: true });

// const CodeModel = mongoose.model('Code', codeSchema);

// app.use(cors());
// app.use(express.json());

// // Endpoint to save code to MongoDB
// app.post('/save-code', async (req, res) => {
//     const { roomId, code } = req.body;

//     if (!roomId || !code) {
//         return res.status(400).json({ message: "Room ID and code are required" });
//     }

//     try {
//         const newCode = new CodeModel({ roomId, code });
//         await newCode.save();
//         res.status(200).json({ message: "Code saved successfully!" });
//     } catch (error) {
//         console.error("Error saving code:", error);
//         res.status(500).json({ message: "Failed to save code" });
//     }
// });

// // Set up socket.io for real-time collaboration
// const userSocketMap = {};

// const getAllConnectedClients = (roomId) => {
//     return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
//         return {
//             socketId,
//             username: userSocketMap[socketId].username,
//         };
//     });
// };

// io.on("connection", (socket) => {
//     socket.on("join", ({ roomId, username }) => {
//         userSocketMap[socket.id] = { username, roomId };
//         socket.join(roomId);
    
//         const clients = getAllConnectedClients(roomId);
//         clients.forEach(({ socketId }) => {
//             io.to(socketId).emit("joined", {
//                 clients,
//                 username,
//                 socketId: socket.id,
//             });
//         });
//     });
    
//     socket.on('code-change', ({ roomId, code }) => {
//         socket.in(roomId).emit("code-change", { code });
//     });

//     socket.on('sync-code', ({ socketId, code }) => {
//         io.to(socketId).emit("code-change", { code });
//     });

//     socket.on("newMessage", ({ username, message }) => {
//         const roomId = userSocketMap[socket.id].roomId;
//         io.to(roomId).emit("newMessage", { username, message });
//     });

//     socket.on("disconnect", () => {
//         const { username, roomId } = userSocketMap[socket.id] || {};
//         if (roomId) {
//             socket.to(roomId).emit("userLeft", {
//                 socketId: socket.id,
//                 username,
//             });
//         }
//         delete userSocketMap[socket.id];
//     });
// });

// server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));


// const express = require('express');
// const mongoose = require('mongoose');
// const http = require('http');
// const { Server } = require("socket.io");
// const cors = require('cors');
// const { Schema } = mongoose;

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// const PORT = process.env.PORT || 5001;

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/code_editor', {
//     // useNewUrlParser: true,
//     // useUnifiedTopology: true
// })
//     .then(() => {
//         console.log('MongoDB connected'); // This will log when the connection is successful
//     })
//     .catch((error) => {
//         console.error('MongoDB connection error:', error); // This will log any errors during the connection
//     });

// // Create a schema for saving code
// const codeSchema = new Schema({
//     roomId: { type: String, required: true },
//     code: { type: String, required: true },
// }, { timestamps: true });

// const CodeModel = mongoose.model('Code', codeSchema);

// app.use(cors());
// app.use(express.json());

// // Endpoint to save code to MongoDB
// app.post('/save-code', async (req, res) => {
//     const { roomId, code } = req.body;

//     if (!roomId || !code) {
//         return res.status(400).json({ message: "Room ID and code are required" });
//     }

//     try {
//         const newCode = new CodeModel({ roomId, code });
//         await newCode.save();
//         res.status(200).json({ message: "Code saved successfully!" });
//     } catch (error) {
//         console.error("Error saving code:", error);
//         res.status(500).json({ message: "Failed to save code" });
//     }
// });

// // Endpoint to get the saved code from MongoDB based on roomId
// app.get('/get-code/:roomId', async (req, res) => {
//     const { roomId } = req.params;

//     try {
//         // Find the code for the given roomId
//         const codeData = await CodeModel.findOne({ roomId });

//         if (codeData) {
//             console.log('Code fetched successfully!'); // Print success message to the console
//             res.status(200).json({
//                 success: true,
//                 message: 'Code fetched successfully!',
//                 code: codeData.code,
//             });
//         } else {
//             console.log('No code found for this room'); // Print message if no code is found
//             res.status(404).json({
//                 success: false,
//                 message: 'No code found for this room.',
//             });
//         }
//     } catch (error) {
//         console.error('Error fetching code:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching code',
//         });
//     }
// });

// // Set up socket.io for real-time collaboration
// const userSocketMap = {};

// const getAllConnectedClients = (roomId) => {
//     return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
//         return {
//             socketId,
//             username: userSocketMap[socketId].username,
//         };
//     });
// };

// io.on("connection", (socket) => {
//     socket.on("join", ({ roomId, username }) => {
//         userSocketMap[socket.id] = { username, roomId };
//         socket.join(roomId);
    
//         const clients = getAllConnectedClients(roomId);
//         clients.forEach(({ socketId }) => {
//             io.to(socketId).emit("joined", {
//                 clients,
//                 username,
//                 socketId: socket.id,
//             });
//         });

//         // Fetch the saved code from the database when the user joins the room
//         CodeModel.findOne({ roomId })
//             .then(codeData => {
//                 if (codeData) {
//                     io.to(socket.id).emit("code-change", { code: codeData.code });
//                 }
//             })
//             .catch(error => {
//                 console.error('Error fetching code on join:', error);
//             });
//     });
    
//     socket.on('code-change', ({ roomId, code }) => {
//         socket.in(roomId).emit("code-change", { code });
//     });

//     socket.on('sync-code', ({ socketId, code }) => {
//         io.to(socketId).emit("code-change", { code });
//     });

//     socket.on("newMessage", ({ username, message }) => {
//         const roomId = userSocketMap[socket.id].roomId;
//         io.to(roomId).emit("newMessage", { username, message });
//     });

//     socket.on("disconnect", () => {
//         const { username, roomId } = userSocketMap[socket.id] || {};
//         if (roomId) {
//             socket.to(roomId).emit("userLeft", {
//                 socketId: socket.id,
//                 username,
//             });
//         }
//         delete userSocketMap[socket.id];
//     });
// });

// server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));


const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const { Schema } = mongoose;

require('dotenv').config();

const app = express();
const server = http.createServer(app);
// const io = new Server(server);

const io = new Server(server, {
  cors: {
    origin: "https://collaborative-code-editor-tci5.onrender.com", // e.g., https://your-frontend.onrender.com
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5001;

// MongoDB connection
// mongoose.connect('mongodb://localhost:27017/code_editor', {
//     // useNewUrlParser: true,
//     // useUnifiedTopology: true
// })
//     .then(() => {
//         console.log('MongoDB connected');
//     })
//     .catch((error) => {
//         console.error('MongoDB connection error:', error);
//     });


mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });


// Create a schema for saving code
const codeSchema = new Schema({
    roomId: { type: String, required: true },
    code: { type: String, required: true },
}, { timestamps: true });

const CodeModel = mongoose.model('Code', codeSchema);

app.use(cors());
app.use(express.json());

// Endpoint to save or update code to MongoDB
app.post('/save-code', async (req, res) => {
    const { roomId, code } = req.body;

    if (!roomId || !code) {
        return res.status(400).json({ message: "Room ID and code are required" });
    }

    try {
        // Update the existing code if roomId exists, or insert a new document
        const updatedCode = await CodeModel.findOneAndUpdate(
            { roomId },                // Filter to find the document
            { code },                  // Update data
            { upsert: true, new: true } // Create if not exists, return updated document
        );

        res.status(200).json({
            success: true,
            message: "Code saved/updated successfully!",
            data: updatedCode,
        });
    } catch (error) {
        console.error("Error saving/updating code:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save/update code",
        });
    }
});

// Endpoint to get the saved code from MongoDB based on roomId
app.get('/get-code/:roomId', async (req, res) => {
    const { roomId } = req.params;

    try {
        const codeData = await CodeModel.findOne({ roomId });

        if (codeData) {
            res.status(200).json({
                success: true,
                message: 'Code fetched successfully!',
                code: codeData.code,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No code found for this room.',
            });
        }
    } catch (error) {
        console.error('Error fetching code:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching code',
        });
    }
});

// Set up socket.io for real-time collaboration
const userSocketMap = {};

const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId]?.username,
        };
    });
};

io.on("connection", (socket) => {
    socket.on("join", ({ roomId, username }) => {
        userSocketMap[socket.id] = { username, roomId };
        socket.join(roomId);
    
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit("joined", {
                clients,
                username,
                socketId: socket.id,
            });
        });

        // Fetch the saved code from the database when the user joins the room
        CodeModel.findOne({ roomId })
            .then(codeData => {
                if (codeData) {
                    io.to(socket.id).emit("code-change", { code: codeData.code });
                }
            })
            .catch(error => {
                console.error('Error fetching code on join:', error);
            });
    });
    
    socket.on('code-change', async ({ roomId, code }) => {
        socket.in(roomId).emit("code-change", { code });

        // Save the code to the database
        try {
            // await fetch(`http://localhost:${PORT}/save-code`, {
            await fetch(`https://collaborative-code-editor-tci5.onrender.com/save-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roomId, code }),
            });
        } catch (error) {
            console.error('Error saving code to database:', error);
        }
    });

    socket.on('sync-code', ({ socketId, code }) => {
        io.to(socketId).emit("code-change", { code });
    });

    socket.on("newMessage", ({ username, message }) => {
        const roomId = userSocketMap[socket.id]?.roomId;
        io.to(roomId).emit("newMessage", { username, message });
    });

    socket.on("disconnect", () => {
        const { username, roomId } = userSocketMap[socket.id] || {};
        if (roomId) {
            socket.to(roomId).emit("userLeft", {
                socketId: socket.id,
                username,
            });
        }
        delete userSocketMap[socket.id];
    });
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

