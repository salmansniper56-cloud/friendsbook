const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createStory,
  getStories,
  deleteStory
} = require('../controllers/storyController');

router.post('/', auth, createStory);
router.get('/', auth, getStories);
router.delete('/:id', auth, deleteStory);

module.exports = router;