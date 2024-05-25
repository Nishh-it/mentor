const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    host: String,
    roomId: String,
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
