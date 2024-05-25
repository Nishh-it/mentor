const express = require('express');
const { sendMessage, upvoteMessage } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/send-message', authMiddleware, sendMessage);
router.post('/upvote-message', authMiddleware, upvoteMessage);

module.exports = router;

