const Room = require('../models/Room');
const { generateUniqueId } = require('../utils/generateUniqueId');

const createRoom = async (req, res) => {
    const { host } = req.body;
    const room = new Room({ host, roomId: generateUniqueId() });
    try {
        const result = await room.save();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Room creation failed', error });
    }
};

const joinRoom = async (req, res) => {
    const { roomId } = req.body;
    try {
        const room = await Room.findOne({ roomId }).populate('messages');
        if (room) {
            res.json(room);
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Joining room failed', error });
    }
};

module.exports = { createRoom, joinRoom };
