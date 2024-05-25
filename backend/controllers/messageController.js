const Message = require('../models/Message');
const Room = require('../models/Room');

const sendMessage = async (req, res) => {
    const { roomId, content, anonymous } = req.body;
    try {
        const message = new Message({ roomId, content, anonymous });
        await message.save();

        const room = await Room.findById(roomId);
        if (room) {
            room.messages.push(message._id);
            await room.save();
        }

        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ message: 'Message sending failed', error });
    }
};

const upvoteMessage = async (req, res) => {
    const { messageId } = req.body;
    try {
        const message = await Message.findById(messageId);
        if (message) {
            message.upvotes += 1;
            await message.save();
            res.json(message);
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Upvoting message failed', error });
    }
};

module.exports = { sendMessage, upvoteMessage };
