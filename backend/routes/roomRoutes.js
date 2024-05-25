const express = require('express');
const { createRoom, joinRoom } = require('../controllers/roomController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create-room', authMiddleware, createRoom);
router.post('/join-room', authMiddleware, joinRoom);

module.exports = router;
