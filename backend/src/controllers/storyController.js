const Story = require('../models/Story');
const User = require('../models/User');

// Create Story
exports.createStory = async (req, res) => {
  try {
    const { mediaUrl, mediaType } = req.body;

    // Story expires after 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const story = await Story.create({
      userId: req.user.id,
      mediaUrl,
      mediaType,
      expiresAt
    });

    res.status(201).json({
      message: '📸 Story created!',
      story
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Stories (from people you follow)
exports.getStories = async (req, res) => {
  try {
    const { Op } = require('sequelize');

    const stories = await Story.findAll({
      where: {
        expiresAt: { [Op.gt]: new Date() }
      },
      include: [{
        model: User,
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ stories });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Story
exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findByPk(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await story.destroy();

    res.json({ message: '✅ Story deleted!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};