const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const roomRoutes = require('./routes/roomRoutes');
const Message = require('./models/Message');

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use('/api/rooms', roomRoutes);

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', ({ roomId }) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    socket.on('sendMessage', async ({ roomId, message }) => {
        try {
            const newMessage = new Message({ roomId, content: message });
            await newMessage.save();
            io.to(roomId).emit('message', newMessage);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

    socket.on('upvoteMessage', async ({ messageId }) => {
        try {
            const message = await Message.findById(messageId);
            if (message) {
                message.upvotes += 1;
                await message.save();
                io.to(message.roomId).emit('messageUpvoted', message);
            }
        } catch (error) {
            console.error('Error upvoting message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
