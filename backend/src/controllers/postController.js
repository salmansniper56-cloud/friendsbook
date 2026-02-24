const Post = require('../models/Post');
const User = require('../models/User');

// Create Post
exports.createPost = async (req, res) => {
  try {
    const { caption, mediaUrl, mediaType, location } = req.body;

    const post = await Post.create({
      userId: req.user.id,
      caption,
      mediaUrl,
      mediaType,
      location
    });

    res.status(201).json({
      message: '🎉 Post created successfully!',
      post
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Posts (Feed)
exports.getFeed = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{
        model: User,
        attributes: ['id', 'username', 'avatar', 'fullName']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ posts });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Single Post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['id', 'username', 'avatar', 'fullName']
      }]
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ post });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.destroy();

    res.json({ message: '✅ Post deleted successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};