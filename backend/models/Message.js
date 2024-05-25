const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    roomId: String,
    content: String,
    upvotes: { type: Number, default: 0 },
    anonymous: { type: Boolean, default: true }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
