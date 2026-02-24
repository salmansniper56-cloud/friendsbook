const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  sendMessage,
  getConversation,
  getConversations
} = require('../controllers/messageController');

router.post('/', auth, sendMessage);
router.get('/', auth, getConversations);
router.get('/:userId', auth, getConversation);

module.exports = router;