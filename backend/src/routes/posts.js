const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createPost,
  getFeed,
  getPost,
  deletePost
} = require('../controllers/postController');

router.get('/feed', auth, getFeed);
router.post('/', auth, createPost);
router.get('/:id', auth, getPost);
router.delete('/:id', auth, deletePost);

module.exports = router;