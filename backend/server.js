const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);

io.on('connection', (socket) => {
    socket.on('joinRoom', ({ roomId }) => {
        socket.join(roomId);
    });

    socket.on('sendMessage', async ({ roomId, content, anonymous }) => {
        const message = new Message({ roomId, content, anonymous });
        await message.save();

        const room = await Room.findById(roomId);
        if (room) {
            room.messages.push(message._id);
            await room.save();
        }

        io.to(roomId).emit('message', message);
    });

    socket.on('upvoteMessage', async ({ messageId }) => {
        const message = await Message.findById(messageId);
        if (message) {
            message.upvotes += 1;
            await message.save();
            io.to(message.roomId).emit('messageUpvoted', message);
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

