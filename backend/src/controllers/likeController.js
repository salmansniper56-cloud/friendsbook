const Like = require('../models/Like');
const Post = require('../models/Post');

// Like a Post
exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if already liked
    const existingLike = await Like.findOne({
      where: { userId: req.user.id, postId }
    });

    if (existingLike) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    // Create like
    await Like.create({ userId: req.user.id, postId });

    // Increment likes count
    await Post.increment('likesCount', { where: { id: postId } });

    res.json({ message: '❤️ Post liked!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Unlike a Post
exports.unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const like = await Like.findOne({
      where: { userId: req.user.id, postId }
    });

    if (!like) {
      return res.status(400).json({ message: 'Post not liked yet' });
    }

    await like.destroy();

    // Decrement likes count
    await Post.decrement('likesCount', { where: { id: postId } });

    res.json({ message: '💔 Post unliked!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};