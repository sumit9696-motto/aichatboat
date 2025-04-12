const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, clearChatHistory } = require('../controllers/chatController');
const auth = require('../middleware/auth');

// All chat routes are protected
router.use(auth);

// Send message to AI and get response
router.post('/send', sendMessage);

// Get chat history
router.get('/history', getChatHistory);

// Clear chat history
router.delete('/clear', clearChatHistory);

module.exports = router;