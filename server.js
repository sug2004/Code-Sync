import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import ACTIONS from './src/Action.js';
import dotenv from "dotenv";
import path from "path";
dotenv.config();

const app = express();
const server = http.createServer(app);

// Enable CORS globally
app.use(cors());

const userSocketMap = {};
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5123",
    methods: ["GET", "POST"],
  },
});

// Helper function to get all connected clients in a room
function getAllConnectedClients(roomId) {
  const room = io.sockets.adapter.rooms.get(roomId);
  if (!room) return [];

  return Array.from(room).map((socketId) => ({
    socketId,
    username: userSocketMap[socketId] || "Anonymous",
  }));
}

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Handle JOIN action
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    if (!roomId || !username) {
      console.error("Invalid JOIN request - missing roomId or username");
      return;
    }

    // Check if the username is already in the room
    const existingClient = getAllConnectedClients(roomId).find(
      (client) => client.username === username
    );

    if (existingClient) {
      // Disconnect the existing socket associated with the username
      const existingSocket = Array.from(io.sockets.sockets).find(
        ([id]) => id === existingClient.socketId
      );
      if (existingSocket) {
        existingSocket[1].disconnect(); // Disconnect the old socket
        console.log(`Disconnected duplicate socket for username: ${username}`);
      }
    }

    // Map the new socket to the username and join the room
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);
    console.log("Clients after join:", clients);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  // Handle code changes
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // Handle disconnection
  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});


const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "/", "dist", "index.html"));
  });
}


const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
