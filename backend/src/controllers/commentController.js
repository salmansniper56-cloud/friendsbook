const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');

// Add Comment
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    const comment = await Comment.create({
      userId: req.user.id,
      postId,
      text
    });

    // Increment comments count
    await Post.increment('commentsCount', { where: { id: postId } });

    res.status(201).json({
      message: '💬 Comment added!',
      comment
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Comments for a Post
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.findAll({
      where: { postId },
      include: [{
        model: User,
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ comments });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.destroy();

    await Post.decrement('commentsCount', { where: { id: comment.postId } });

    res.json({ message: '✅ Comment deleted!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};